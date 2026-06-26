import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { DocumentType } from "@/types";
import styles from "./page.module.scss";

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

  return (
    <div>
      <PageHeader title={`New ${labels[docType]}`} />
      <div className={styles.formContainer}>
        <p className={styles.placeholder}>
          Document creation form for {labels[docType]}. 
          This would contain the full POS form with service selection, client details, 
          item list, charges, payment account, and terms & conditions.
        </p>
      </div>
    </div>
  );
}
