// app/api/document_generator/route.ts

import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { users, saleDocumentSharedAssets, quotations, quotationItems, createQuotation, createQuotationItems } from "@/lib/dummyData";
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
    const TellerInfo = users.find(u => u.user_id === "user_2p9RFWQ4UHgUpcBmk0VvyCX2Djg");
    if (!TellerInfo) {
      return new Response(JSON.stringify({ error: "Teller not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Convert signature to Base64 string
    const signatureBase64 = TellerInfo.signature
      ? `data:image/png;base64,${TellerInfo.signature}`
      : "";

    const tellerInfoArray = {
      TellerName: `${TellerInfo.firstName} ${TellerInfo.lastName}`,
      Signature: signatureBase64,
      Position: TellerInfo.position,
    };

    documentData.servedBy = tellerInfoArray;

    const now = new Date();
    documentData.date = format(now, "dd MMM yyyy");

    // 5. Load shared assets (header, footer, stamp)
    const assets = saleDocumentSharedAssets.filter(a =>
      ["header_image", "footer_image", "official_stamp"].includes(a.asset_type)
    );

    const toPngB64 = (img: string) => img ? `data:image/png;base64,${img}` : "";

    const headerAsset = assets.find(a => a.asset_type === "header_image");
    const footerAsset = assets.find(a => a.asset_type === "footer_image");
    const stampAsset = assets.find(a => a.asset_type === "official_stamp");

    documentData.shared_assets = {
      header: headerAsset?.image || "",
      footer: footerAsset?.image || "",
      stamp: stampAsset?.image || "",
    };

    // 6. Generate barcode
    const barcodeB64 = await GenerateBarcodeBase64(documentData.qr_code);
    documentData.shared_assets.barcode = barcodeB64;

    // 7. If this is a quotation, persist it in memory
    if (documentType === "quotation") {
      const newQuotation = await createQuotation({
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
        served_by_signature: signatureBase64,
        created_at: new Date(),
      });

      // Insert all item lines
      await createQuotationItems(
        documentData.quoteItems.map((item: any) => ({
          quotation_reference: newQuotation.id,
          item_description: item.description,
          item_quantity: parseInt(item.quantity),
          item_unit_price: parseFloat(item.unitPrice),
        }))
      );
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

    // 10. Load the "ad" PDF from disk
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
    console.error("PDF generation error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
