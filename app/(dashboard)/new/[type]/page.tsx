import React from "react";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";
import POSForm from "@/components/forms/POSForm/POSForm";
import { DocumentType } from "@/lib/dummyData";

const validTypes: DocumentType[] = ["quotation", "invoice", "receipt", "delivery_note"];

const typeLabels: Record<DocumentType, string> = {
  quotation: "Quotation",
  invoice: "Invoice",
  receipt: "Receipt",
  delivery_note: "Delivery Note",
};

interface NewDocumentPageProps {
  params: Promise<{ type: string }>;
}

export default async function NewDocumentPage({ params }: NewDocumentPageProps) {
  const { type } = await params;

  if (!validTypes.includes(type as DocumentType)) {
    notFound();
  }

  const docType = type as DocumentType;
  const docName = typeLabels[docType];

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1>New {docName}</h1>
      </div>
      <POSForm docName={docName} docType={docType} />
    </main>
  );
}
