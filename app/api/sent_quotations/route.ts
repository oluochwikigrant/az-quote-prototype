// File: app/api/sent_quotations/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") ?? "1";
    const searchFilter = searchParams.get("search") ?? "";
    const page = Math.max(parseInt(pageParam, 10), 1);

    const where: any = {};
    if (searchFilter) {
      where.client_name = { contains: searchFilter, mode: "insensitive" };
    }

    const [items, total] = await prisma.$transaction([
      prisma.quotations.findMany({
        where,
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (page - 1),
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          quotation_number: true,
          client_name: true,
          client_contact: true,
          created_at: true,
          description: true,
        },
      }),
      prisma.quotations.count({ where }),
    ]);

    // Serialize Prisma types and BigInts
    const serializedItems = items.map((item) => {
      const base = {
        id: Number(item.id),
        quotation_number: item.quotation_number,
        description: item.description,
        client_name: item.client_name,
        client_contact: item.client_contact,
        created_at: item.created_at.toISOString(),
      };

      return { ...base };
    });

    return NextResponse.json({
      data: serializedItems,
      pagination: {
        page,
        perPage: ITEM_PER_PAGE,
        total: Number(total),
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
