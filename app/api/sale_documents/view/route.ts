import { NextRequest, NextResponse } from "next/server";
import { getSaleDocumentById, payableAccounts } from "@/lib/dummyData";
import { PayableAccount } from "@/lib/dummyData";
import {
  QuoteData,
  ItemRecord,
  AccountDetail,
} from "@/components/pdf_sales/documentDataType";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const idParam = url.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json(
      { success: false, error: 'Missing "id" query parameter' },
      { status: 400 }
    );
  }

  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid "id" parameter' },
      { status: 400 }
    );
  }

  try {
    const doc = await getSaleDocumentById(id);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    const relatedItems = doc.items || [];
    const payableAccount = doc.payment_account_id
      ? payableAccounts.find(a => a.id === doc.payment_account_id)
      : null;

    const accountFieldMap: Array<[keyof PayableAccount, string]> = [
      ["payment_method_fkey", "Payment Method"],
      ["bank_name", "Bank Name"],
      ["account_name", "Account Name"],
      ["account_number", "Account Number"],
      ["business_number", "Business Number"],
      ["buyGoods_number", "Buy Goods Number"],
    ];

    const accountDetails: AccountDetail[] = doc.payment_account_enabled
      ? accountFieldMap.reduce<AccountDetail[]>((arr, [key, label]) => {
          const val = payableAccount?.[key];
          if (val) arr.push({ label, value: String(val) });
          return arr;
        }, [])
      : [];

    const quoteItems: ItemRecord[] = relatedItems.map((item, idx) => ({
      code: Number(item.item_id),
      description: item.item_description.toString(),
      quantity: Number(item.item_quantity),
      unitPrice: Number(item.item_unit_price),
      itemSubTotal: Number(item.item_quantity) * Number(item.item_unit_price),
    }));

    const subtotal = quoteItems.reduce(
      (sum, item) => sum + item.itemSubTotal,
      0
    );
    const labor = doc.labor ?? 0;
    const shipping = doc.shipping ?? 0;
    const taxRate = Number(doc.tax_rate ?? 0);

    const vatBase = subtotal + labor + shipping;
    const tax = parseFloat((vatBase * taxRate).toFixed(2));
    const grandTotal = parseFloat((vatBase + tax).toFixed(2));

    const docNameMap: Record<string, string> = {
      quotation: "Quotation",
      invoice: "Invoice",
      receipt: "Receipt",
      delivery_note: "Delivery Note",
    };

    const Quote: QuoteData = {
      documentType: doc.document_type,
      documentName: docNameMap[doc.document_type] || doc.document_type,
      id: doc.id,
      quotation_number: doc.document_number,
      qr_code: doc.qr_code,
      description: doc.description,
      client_name: doc.client_name,
      client_address: doc.client_address,
      client_contact: doc.client_contact,
      labor: labor,
      shipping: shipping,
      tax_type: doc.tax_type,
      tax_rate: Number(taxRate),
      terms_conditions: doc.terms_conditions,
      payment_account_enabled: doc.payment_account_enabled,
      payment_account_id: doc.payment_account_id,
      accountDetails: accountDetails,
      quoteItems: quoteItems,
      served_by_name: doc.served_by_name,
      served_by_position: doc.served_by_position,
      served_by_signature: doc.served_by_signature,
      created_at: doc.created_at.toISOString(),
      updated_at: doc.updated_at?.toISOString(),
      subtotal: subtotal,
      tax: tax,
      grandTotal: grandTotal,
    };

    return NextResponse.json({
      success: true,
      Quote,
    });
  } catch (err) {
    console.error("Error fetching document id=", idParam, err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
