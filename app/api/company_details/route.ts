import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const details = await prisma.company_details.findFirst();
  if (!details) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const companyDetails = {
    id: details.id,
    companyName: details.company_name,
    kraPin: details.kra_pin,
    postalAddress: details.postal_address,
    physicalAddress: details.physical_address,
    primaryEmail: details.primary_email,
    secondaryEmail: details.secondary_email,
    primaryPhone: details.primary_phone,
    secondaryPhone: details.secondary_phone,
    logo: details.logo ? Buffer.from(details.logo).toString("base64") : null,
  };

  return NextResponse.json(companyDetails);
}
