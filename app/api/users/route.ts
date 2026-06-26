import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/data/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);
  return NextResponse.json(getUsers(page));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = createUser(body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = updateUser(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  deleteUser(id);
  return NextResponse.json({ success: true });
}
