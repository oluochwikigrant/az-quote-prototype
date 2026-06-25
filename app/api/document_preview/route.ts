import { NextRequest, NextResponse } from "next/server";
import { payableAccounts, saleDocumentTypes, termsConditions } from "@/lib/dummyData";
import { PayableAccount } from "@/lib/dummyData";
import { randomStringGenerator } from "@/utils/randomStringGenerator";
import {
  AccountDetail,
  ItemRecord,
  QuoteData,
} from "@/components/pdf_sales/documentDataType";

export async function POST(request: NextRequest) {
  try {
    const previewData = await request.json();

    // 4. Generate documentNumber, QRCodeNumber & formatted date
    const normalized = previewData.documentName
      .replace(/\s+/g, "_")
      .toLowerCase();
    const shortcuts: Record<string, string> = {
      invoice: "IN-",
      quotation: "QT-",
      receipt: "RC-",
      delivery_note: "DN-",
    };

    const prefix = shortcuts[normalized] || "EM-";
    const randomID = randomStringGenerator(prefix, 12);

    // Create Items Data
    const ItemsData: ItemRecord[] = previewData.items.map(
      (item: {
        description: { toString: () => string };
        quantity: number;
        unitPrice: number;
      }) => ({
        description: item.description.toString(),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        itemSubTotal: Number(item.quantity) * Number(item.unitPrice),
      })
    );

    // load payable account if enabled
    let accountDetails: AccountDetail[] = [];

    if (previewData.paymentAccountEnabled) {
      const account = payableAccounts.find(a => a.id === Number(previewData.payableAccountID));

      if (!account) {
        return new Response(JSON.stringify({ error: "Account not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // map of PayableAccount fields → labels
      const accountFieldMap: Array<[keyof PayableAccount, string]> = [
        ["payment_method_fkey", "Payment Method"],
        ["bank_name", "Bank Name"],
        ["account_name", "Account Name"],
        ["account_number", "Account Number"],
        ["business_number", "Business Number"],
        ["buyGoods_number", "Buy Goods Number"],
      ];

      // build [ { label, value } ] from the account record
      accountDetails = accountFieldMap.reduce<AccountDetail[]>(
        (arr, [field, label]) => {
          const rawValue = account[field];
          if (rawValue != null && rawValue !== "") {
            arr.push({ label, value: String(rawValue) });
          }
          return arr;
        },
        []
      );
    }

    // Terms Conditions. Determine; use default or custom terms

    if (previewData.useCustomTerms) {
      // previewData.customConditions must not be empty
      if (!previewData.customConditions?.trim()) {
        return NextResponse.json(
          { error: "Custom terms is empty." },
          { status: 400 }
        );
      }
      previewData.termsConditions = previewData.customConditions;
    } else {
      // Look up the sale_document_type row to get its numeric ID
      const saleTypeRecord = saleDocumentTypes.find(s => s.document_type === previewData.documentType);

      if (!saleTypeRecord) {
        return NextResponse.json(
          { error: `Unknown documentType="${previewData.documentType}"` },
          { status: 400 }
        );
      }

      const serviceId = Number(previewData.service);
      const saleDocTypeId = Number(saleTypeRecord.id);

      // Validate that they really are integers and > 0
      if (
        Number.isNaN(serviceId) ||
        Number.isNaN(saleDocTypeId) ||
        !Number.isInteger(serviceId) ||
        !Number.isInteger(saleDocTypeId)
      ) {
        return NextResponse.json(
          { error: "`service` and `documentType` must be valid numeric IDs." },
          { status: 400 }
        );
      }

      const termsRecord = termsConditions.find(
        t => t.service === serviceId && t.sale_document_type === saleDocTypeId
      );

      if (!termsRecord) {
        // Use default terms if not found
        previewData.termsConditions = "Payment within 30 days. Valid for 90 days from date of issue.";
      } else {
        previewData.termsConditions = termsRecord.terms;
      }
    }

    // Calculate subtotal from previewData.items
    const subtotal = ItemsData.reduce(
      (sum: number, item: { itemSubTotal: number }) => sum + item.itemSubTotal,
      0
    );

    // Determine tax rate
    let taxRate = 0;
    if (previewData.taxType === "exclusive") {
      taxRate = 0.16;
    }

    const labor = previewData.labor ?? 0;
    const shipping = previewData.shipping ?? 0;

    // Calculate VAT
    const vatBase = subtotal + labor + shipping;
    const tax = parseFloat((vatBase * taxRate).toFixed(2));

    // Calculate grand total
    const grandTotal = parseFloat((vatBase + tax).toFixed(2));

    const quotePreviewData: QuoteData = {
      documentType: previewData.documentType,
      documentName: previewData.documentName,
      id: 0,
      quotation_number: randomID,
      qr_code: randomID,
      description: previewData.serviceDescription,

      client_name: previewData.client.name,
      client_address: previewData.client.address,
      client_contact: previewData.client.contact,

      terms_conditions: previewData.termsConditions,
      payment_account_enabled: previewData.paymentAccountEnabled,
      payment_account_id: previewData.payableAccountID,
      accountDetails: accountDetails,
      quoteItems: ItemsData,

      subtotal: subtotal,
      labor: labor,
      shipping: shipping,
      tax_type: previewData.taxType,
      tax_rate: taxRate,
      tax: tax,
      grandTotal: grandTotal,

      served_by_name: "",
      served_by_position: "",
      served_by_signature: "",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(quotePreviewData, { status: 200 });
  } catch (error) {
    console.error("Error in Document Preview handler:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
