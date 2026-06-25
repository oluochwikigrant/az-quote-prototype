import { NextResponse } from "next/server";
import { payableAccounts } from "@/lib/dummyData";

export async function GET() {
  const options = payableAccounts.map((acc) => ({
    value: acc.id.toString(),
    label: acc.display_name,
  }));

  return NextResponse.json(options);
}
