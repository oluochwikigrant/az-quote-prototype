import { NextResponse } from "next/server";
import { services } from "@/lib/dummyData";

export async function GET() {
  const serviceOptions = services.map((singleService) => ({
    value: singleService.id.toString(),
    label: singleService.service.replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return NextResponse.json(serviceOptions);
}
