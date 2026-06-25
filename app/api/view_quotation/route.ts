import { NextResponse } from "next/server";
import { quotations, quotationItems, payableAccounts } from "@/lib/dummyData";
import {
  QuoteData,
  ItemRecord,
  AccountDetail,
} from "@/components/pdf_sales/documentDataType";
import { PayableAccount } from "@/lib/dummyData";

export async function GET(request: Request) {
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
    const quotation = quotations.find(q => q.id === id);

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: "Quotation not found" },
        { status: 404 }
      );
    }

    const relatedItems = quotationItems.filter(i => i.quotation_reference === id);
    const payableAccount = quotation.payment_account_id
      ? payableAccounts.find(a => a.id === quotation.payment_account_id)
      : null;

    // Dynamic mapping of account fields
    const accountFieldMap: Array<[keyof PayableAccount, string]> = [
      ["payment_method_fkey", "Payment Method"],
      ["bank_name", "Bank Name"],
      ["account_name", "Account Name"],
      ["account_number", "Account Number"],
      ["business_number", "Business Number"],
      ["buyGoods_number", "Buy Goods Number"],
    ];

    const accountDetails: AccountDetail[] = quotation.payment_account_enabled
      ? accountFieldMap.reduce<AccountDetail[]>((arr, [key, label]) => {
          const val = payableAccount?.[key];
          if (val) arr.push({ label, value: String(val) });
          return arr;
        }, [])
      : [];

    // convert BigInt fields to strings
    const quoteItems: ItemRecord[] = relatedItems.map((item, idx) => ({
      code: Number(item.item_id),
      description: item.item_description.toString(),
      quantity: Number(item.item_quantity),
      unitPrice: Number(item.item_unit_price),
      itemSubTotal: Number(item.item_quantity) * Number(item.item_unit_price),
    }));

    // Calculate subtotal from quote items
    const subtotal = quoteItems.reduce(
      (sum, item) => sum + item.itemSubTotal,
      0
    );
    const labor = quotation.labor ?? 0;
    const shipping = quotation.shipping ?? 0;
    const taxRate = Number(quotation.tax_rate ?? 0);

    // Calculate VAT
    const vatBase = subtotal + labor + shipping;
    const tax = parseFloat((vatBase * taxRate).toFixed(2));

    // Calculate grand total
    const grandTotal = parseFloat((vatBase + tax).toFixed(2));

    // Quote Data
    const Quote: QuoteData = {
      documentType: "quotation",
      documentName: "Quotation",
      id: quotation.id,
      quotation_number: quotation.quotation_number,
      qr_code: quotation.qr_code,
      description: quotation.description,
      client_name: quotation.client_name,
      client_address: quotation.client_address,
      client_contact: quotation.client_contact,
      labor: labor,
      shipping: shipping,
      tax_type: quotation.tax_type,
      tax_rate: Number(taxRate),
      terms_conditions: quotation.terms_conditions,
      payment_account_enabled: quotation.payment_account_enabled,
      payment_account_id: quotation.payment_account_id,
      accountDetails: accountDetails,
      quoteItems: quoteItems,
      served_by_name: quotation.served_by_name,
      served_by_position: quotation.served_by_position,
      served_by_signature: quotation.served_by_signature,
      created_at: quotation.created_at.toISOString(),
      updated_at: quotation.updated_at?.toISOString(),
      subtotal: subtotal,
      tax: tax,
      grandTotal: grandTotal,
    };

    return NextResponse.json({
      success: true,
      Quote,
    });
  } catch (err) {
    console.error("Error fetching quotation id=", idParam, err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
