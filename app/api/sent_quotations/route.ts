import { NextRequest, NextResponse } from "next/server";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getSaleDocuments, getSaleDocumentsCount } from "@/lib/dummyData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") ?? "1";
    const searchFilter = searchParams.get("search") ?? "";
    const page = Math.max(parseInt(pageParam, 10), 1);

    const total = await getSaleDocumentsCount("quotation", searchFilter || undefined);
    const items = await getSaleDocuments("quotation", {
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
      search: searchFilter || undefined,
    });

    const serializedItems = items.map((item) => ({
      id: Number(item.id),
      quotation_number: item.document_number,
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
    console.error("Error fetching sent quotations:", error);
    return NextResponse.json(
      { error: "Failed to load sent quotations." },
      { status: 500 }
    );
  }
}
