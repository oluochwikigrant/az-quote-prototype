import { NextRequest, NextResponse } from "next/server";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { quotations, quotationItems, payableAccounts } from "@/lib/dummyData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") ?? "1";
    const searchFilter = searchParams.get("search") ?? "";
    const page = Math.max(parseInt(pageParam, 10), 1);

    let filteredItems = [...quotations];
    if (searchFilter) {
      filteredItems = filteredItems.filter(q =>
        q.client_name.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    const total = filteredItems.length;
    const items = filteredItems
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);

    const serializedItems = items.map((item) => ({
      id: Number(item.id),
      quotation_number: item.quotation_number,
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
        total: total,
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
