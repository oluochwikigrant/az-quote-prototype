import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const accounts = await prisma.payable_account.findMany({
    select: {
      id: true,
      display_name: true, // Prisma should match the column name
    },
  });

  const options = accounts.map((acc) => ({
    value: acc.id.toString(), // ensure it's a string for select
    label: acc.display_name,
  }));

  return NextResponse.json(options);
}
