import { NextResponse } from "next/server";
import { notificationSales } from "@/lib/dummyData";

export async function GET() {
  try {
    const count = notificationSales.filter(n => n.is_active === 1).length;
    return NextResponse.json({ notifications: count });
  } catch (error: any) {
    console.error("Error in GET /api/notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
