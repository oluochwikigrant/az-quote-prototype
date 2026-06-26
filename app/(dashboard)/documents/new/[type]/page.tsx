import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import DocumentForm from "@/components/forms/DocumentForm";
import { DocumentType } from "@/types";

const validTypes: DocumentType[] = ["quotation", "invoice", "receipt", "delivery_note"];

const labels: Record<DocumentType, string> = {
  quotation: "Quotation",
  invoice: "Invoice",
  receipt: "Receipt",
  delivery_note: "Delivery Note",
};

interface Props {
  params: Promise<{ type: string }>;
}

export default async function NewDocumentPage({ params }: Props) {
  const { type } = await params;

  if (!validTypes.includes(type as DocumentType)) {
    notFound();
  }

  const docType = type as DocumentType;

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/company`, { cache: "no-store" });
  const { services, payableAccounts } = await res.json();

  return (
    <div>
      <PageHeader title={`New ${labels[docType]}`} />
      <DocumentForm
        docType={docType}
        docName={labels[docType]}
        services={services}
        payableAccounts={payableAccounts}
      />
    </div>
  );
}
