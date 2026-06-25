// app/api/notifications/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/notifications
 * Returns JSON: { count: number }
 */
export async function GET(request: Request) {
  try {
    // Query Prisma for the count of active notifications for this role.
    const notifications = await prisma.notification_sales.count({
      where: {
        // role: 1,
        is_active: 1,
      },
    });

    // Return JSON
    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error("Error in GET /api/notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
