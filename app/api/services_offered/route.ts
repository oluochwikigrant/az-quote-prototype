import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const services = await prisma.services.findMany({
    select: {
      id: true,
      service: true, // Prisma should match the column name
    },
  });

  const serviceOptions = services.map((singleService) => ({
    value: singleService.id.toString(), // ensure it's a string for select
    label: singleService.service.replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return NextResponse.json(serviceOptions);
}
