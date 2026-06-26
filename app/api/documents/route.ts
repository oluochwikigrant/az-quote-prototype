import { NextRequest, NextResponse } from "next/server";
import { getDocuments, createDocument, deleteDocument, updateDocument, createItems } from "@/lib/data/store";
import { DocumentType } from "@/types";

const validTypes: DocumentType[] = ["quotation", "invoice", "receipt", "delivery_note"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as DocumentType | null;
  const search = searchParams.get("search") ?? undefined;
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);

  const docType = type && validTypes.includes(type) ? type : undefined;
  const result = getDocuments(docType, search, page);

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const doc = createDocument(body);
    if (body.items?.length) {
      createItems(doc.id, body.items);
    }
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = updateDocument(Number(id), updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  deleteDocument(Number(id));
  return NextResponse.json({ success: true });
}
