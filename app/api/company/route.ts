import { NextResponse } from "next/server";
import { company, services, payableAccounts } from "@/lib/data/store";

export async function GET() {
  return NextResponse.json({ company, services, payableAccounts });
}
