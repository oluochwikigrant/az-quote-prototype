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
  logo: string | null; // base64 string
};

export async function fetchCompanyDetails(): Promise<CompanyDetails> {
  const res = await fetch("/api/company_details");
  if (!res.ok) {
    throw new Error("Failed to fetch company details");
  }
  return res.json();
}
