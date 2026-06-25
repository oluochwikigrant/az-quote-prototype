// app/api/document_generator/route.ts

import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import DocumentTemplate from "@/components/pdf_sales/Template";
import GenerateBarcodeBase64 from "@/components/Bar_QR_Generator/BarCode";
import { format } from "date-fns";
import "@/components/pdf_sales/fonts";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse + basic validation
    const documentData = await request.json();

    const documentType = documentData.documentName
      .replace(/\s+/g, "_")
      .toLowerCase();

    if (!documentData?.documentName) {
      return new Response(
        JSON.stringify({ error: "Missing required field: documentName" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Load Teller Info
    const TellerInfo = await prisma.user.findUnique({
      where: { user_id: "user_2p9RFWQ4UHgUpcBmk0VvyCX2Djg" },
      select: {
        firstName: true,
        lastName: true,
        signature: true,
        position: true,
      },
    });
    if (!TellerInfo) {
      return new Response(JSON.stringify({ error: "Teller not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Convert signature buffer → Base64 string
    const signatureBase64 = `data:image/png;base64,${Buffer.from(
      TellerInfo.signature
    ).toString("base64")}`;

    const tellerInfoArray = {
      TellerName: `${TellerInfo.firstName} ${TellerInfo.lastName}`,
      Signature: signatureBase64,
      Position: TellerInfo.position,
    };

    documentData.servedBy = tellerInfoArray;

    const now = new Date();
    documentData.date = format(now, "dd MMM yyyy");

    // 5. Load shared assets (header, footer, stamp)
    const rows = await prisma.sale_document_shared_assets.findMany({
      where: {
        asset_type: { in: ["header_image", "footer_image", "official_stamp"] },
      },
      select: { asset_type: true, image: true },
    });
    if (rows.length !== 3) {
      const found = rows.map((r) => r.asset_type).join(",");
      throw new Error(`Expected 3 assets but found: ${found}`);
    }
    const sharedMap = rows.reduce<Record<string, Buffer>>(
      (map, { asset_type, image }) => {
        map[asset_type] = Buffer.from(image);
        return map;
      },
      {}
    );
    const toPngB64 = (buf: Buffer) =>
      `data:image/png;base64,${buf.toString("base64")}`;
    documentData.shared_assets = {
      header: toPngB64(sharedMap["header_image"]),
      footer: toPngB64(sharedMap["footer_image"]),
      stamp: toPngB64(sharedMap["official_stamp"]),
    };

    // 6. Generate barcode
    const barcodeB64 = await GenerateBarcodeBase64(documentData.qr_code);
    documentData.shared_assets.barcode = barcodeB64;

    // 7. If this is a quotation, persist it in the DB
    if (documentType === "quotation") {
      const quotation = await prisma.quotations.create({
        data: {
          quotation_number: documentData.quotation_number,
          qr_code: documentData.qr_code,
          description: documentData.description,
          client_name: documentData.client_name,
          client_address: documentData.client_address || null,
          client_contact: documentData.client_contact,
          labor: documentData.labor || 0,
          shipping: documentData.shipping || 0,
          tax_type: documentData.tax_type,
          tax_rate: documentData.tax_rate,
          terms_conditions: documentData.terms_conditions,
          payment_account_enabled: documentData.payment_account_enabled,
          payment_account_id: Number(documentData.payment_account_id || 0),
          served_by_name: tellerInfoArray.TellerName,
          served_by_position: tellerInfoArray.Position,
          served_by_signature: Buffer.from(TellerInfo.signature),
        },
      });

      // 7.2 Insert all item‐lines; if it blows up, clean up the parent
      try {
        await prisma.quotation_items.createMany({
          data: documentData.quoteItems.map((item: any) => ({
            // very important: link back to the new quotation
            quotation_reference: quotation.id,
            item_description: item.description,
            item_quantity: parseInt(item.quantity),
            item_unit_price: parseFloat(item.unitPrice),
          })),
          // if you want to guard against duplicates you can set skipDuplicates: true
        });
      } catch (itemError) {
        // rollback: remove the quotation you just created
        await prisma.quotations.delete({
          where: { id: quotation.id },
        });
        // rethrow so your outer `catch` returns 500
        throw itemError;
      }
    }

    // 8. Render the PDF
    const pdfBuffer = await renderToBuffer(
      <DocumentTemplate
        documentData={documentData}
        shared_assets={documentData.shared_assets}
      />
    );

    // 9. Load your generated PDF into pdf-lib
    const mainPdf = await PDFDocument.load(pdfBuffer);

    // 10. Load the “ad” PDF from disk (or fetch it from wherever you store it)
    const adPdfPath = path.resolve(
      process.cwd(),
      "public/documents/ads/ad.pdf"
    );
    const adPdfBytes = fs.readFileSync(adPdfPath);
    const adPdf = await PDFDocument.load(adPdfBytes);

    // 11. Copy all pages from the ad PDF into your main PDF
    const adPageIndices = adPdf.getPageIndices();
    const [...adPages] = await mainPdf.copyPages(adPdf, adPageIndices);
    adPages.forEach((page) => mainPdf.addPage(page));

    // 12. Serialize the merged PDF back into a Uint8Array/Buffer
    const mergedPdfBytes = await mainPdf.save();

    // 13. Return the PDF in the response
    return new NextResponse(mergedPdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${documentData.documentNumber}-${documentData.client_name}.pdf"`,
      },
    });
  } catch (err) {
    console.error("❌ PDF generation or DB error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
