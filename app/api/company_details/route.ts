import { NextResponse } from "next/server";
import { companyDetails } from "@/lib/dummyData";

export async function GET() {
  return NextResponse.json({
    id: companyDetails.id,
    companyName: companyDetails.company_name,
    kraPin: companyDetails.kra_pin,
    postalAddress: companyDetails.postal_address,
    physicalAddress: companyDetails.physical_address,
    primaryEmail: companyDetails.primary_email,
    secondaryEmail: companyDetails.secondary_email,
    primaryPhone: companyDetails.primary_phone,
    secondaryPhone: companyDetails.secondary_phone,
    logo: companyDetails.logo,
  });
}
