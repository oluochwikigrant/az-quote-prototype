import { NextRequest, NextResponse } from "next/server";
import { ITEM_PER_PAGE } from "@/lib/settings";
import {
  getSaleDocuments,
  getSaleDocumentsCount,
  createSaleDocument,
  createSaleDocumentItems,
  getSaleDocumentById,
  deleteSaleDocument,
  updateSaleDocument,
} from "@/lib/dummyData";
import { DocumentType } from "@/lib/dummyData";

const validTypes: DocumentType[] = ["quotation", "invoice", "receipt", "delivery_note"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") ?? "1";
    const searchFilter = searchParams.get("search") ?? "";
    const typeParam = searchParams.get("type") as DocumentType | null;
    const page = Math.max(parseInt(pageParam, 10), 1);

    const docType = typeParam && validTypes.includes(typeParam) ? typeParam : undefined;

    const total = await getSaleDocumentsCount(docType, searchFilter || undefined);
    const items = await getSaleDocuments(docType, {
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
      search: searchFilter || undefined,
    });

    const serializedItems = items.map((item) => ({
      id: Number(item.id),
      document_type: item.document_type,
      document_number: item.document_number,
      description: item.description,
      client_name: item.client_name,
      client_contact: item.client_contact,
      created_at: item.created_at.toISOString(),
    }));

    return NextResponse.json({
      data: serializedItems,
      pagination: {
        page,
        perPage: ITEM_PER_PAGE,
        total,
        totalPages: Math.ceil(total / ITEM_PER_PAGE),
      },
    });
  } catch (error: any) {
    console.error("Error fetching sale documents:", error);
    return NextResponse.json(
      { error: "Failed to load documents." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newDoc = await createSaleDocument({
      document_type: body.document_type,
      document_number: body.document_number,
      qr_code: body.qr_code,
      description: body.description,
      client_name: body.client_name,
      client_address: body.client_address,
      client_contact: body.client_contact,
      labor: body.labor,
      shipping: body.shipping,
      tax_type: body.tax_type,
      tax_rate: body.tax_rate,
      terms_conditions: body.terms_conditions,
      payment_account_enabled: body.payment_account_enabled,
      payment_account_id: body.payment_account_id,
      served_by_name: body.served_by_name,
      served_by_position: body.served_by_position,
      served_by_signature: body.served_by_signature,
      created_at: new Date(),
    });

    // Create items if provided
    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      await createSaleDocumentItems(
        body.items.map((item: any) => ({
          document_id: newDoc.id,
          item_description: item.description || item.item_description,
          item_quantity: Number(item.quantity || item.item_quantity),
          item_unit_price: Number(item.unitPrice || item.item_unit_price),
        }))
      );
    }

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating sale document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create document." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updated = await updateSaleDocument(Number(id), updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating sale document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update document." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await deleteSaleDocument(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting sale document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete document." },
      { status: 500 }
    );
  }
}
