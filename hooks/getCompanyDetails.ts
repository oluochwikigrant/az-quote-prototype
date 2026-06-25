// app/components/getCompanyDetails.ts
export type CompanyDetails = {
  id: number;
  companyName: string;
  kraPin: string | null;
  postalAddress: string | null;
  physicalAddress: string;
  primaryEmail: string;
  secondaryEmail: string | null;
  primaryPhone: string;
  secondaryPhone: string | null;
  logo: string | null;
};

/**
 * Fetch & return the company details as a plain JS object.
 */
export default async function getCompanyDetails(): Promise<CompanyDetails> {
  const res = await fetch("/api/company_details");
  if (!res.ok) {
    throw new Error(`Failed to fetch company details: ${res.status}`);
  }
  // TS will infer this matches CompanyDetails
  return res.json();
}
