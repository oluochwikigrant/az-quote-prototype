// File: app/(dashboard)/sent/[type]/page.tsx

import React from "react";
import { headers } from "next/headers";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TitleBar from "@/components/TitleBar";
import FormContainer from "@/components/FormContainer";
import Link from "next/link";
import styles from "./page.module.scss";
import QuoteView from "@/components/DocumentPreviewModal/QuoteView";
import { DocumentType } from "@/lib/dummyData";

const validTypes: DocumentType[] = ["quotation", "invoice", "receipt", "delivery_note"];

const typeLabels: Record<DocumentType, string> = {
  quotation: "Quotations",
  invoice: "Invoices",
  receipt: "Receipts",
  delivery_note: "Delivery Notes",
};

interface DocumentItem {
  id: number;
  document_type: string;
  document_number: string;
  description: string;
  client_name: string;
  client_contact: string;
  created_at: string;
}

interface ApiResponse {
  data: DocumentItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

interface SentDocumentsPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string; search?: string; doc?: string }>;
}

export default async function SentDocuments({
  params,
  searchParams,
}: SentDocumentsPageProps) {
  const { type } = await params;
  const { page = "1", search: filter = "", doc } = await searchParams;

  // Validate document type
  if (!validTypes.includes(type as DocumentType)) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Invalid document type</h1>
          <p>Valid types: quotation, invoice, receipt, delivery_note</p>
        </div>
      </main>
    );
  }

  const docType = type as DocumentType;
  const pageNum = Math.max(parseInt(page, 10), 1);

  // Rebuild origin from Host header
  const headersList = await headers();
  const host = headersList.get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  // Fetch from unified API
  const paramsApi = new URLSearchParams({
    type: docType,
    page: String(pageNum),
    search: filter,
  });
  const res = await fetch(`${origin}/api/sale_documents?${paramsApi}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API error:", await res.text());
    throw new Error("Failed to fetch documents");
  }

  const { data: documentsList, pagination } = (await res.json()) as ApiResponse;

  // Modal selection
  const idx = parseInt(doc ?? "-1", 10);
  const selected =
    idx >= 0 && idx < documentsList.length ? documentsList[idx] : null;
  const docId = selected ? selected.id : null;

  const buildDetailHref = (rowIdx: number) => {
    const p = new URLSearchParams();
    p.set("doc", String(rowIdx));
    p.set("page", String(pageNum));
    if (filter) p.set("search", filter);
    return `?${p.toString()}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <TitleBar title={`Sent ${typeLabels[docType]}`} />

        <Table
          columns={[
            { header: "Doc No.", accessor: "document_number" },
            { header: "Client", accessor: "client_name" },
            { header: "Contact", accessor: "client_contact" },
            { header: "Date", accessor: "created_at" },
            {
              header: "Description",
              accessor: "description",
              hideOnMobile: styles.hideOnMobile,
            },
            {
              header: "Actions",
              accessor: "actions",
              hideOnMobile: styles.hideOnMobile,
            },
          ]}
          data={documentsList}
          renderRow={(item, idx) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              <td className={styles.cell}>
                <Link
                  href={buildDetailHref(idx)}
                  scroll={false}
                  className={styles.link}
                >
                  {item.document_number}
                </Link>
              </td>
              <td className={styles.cell}>{item.client_name}</td>
              <td className={styles.cell}>{item.client_contact}</td>
              <td className={styles.cell}>
                {new Date(item.created_at).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.description}
              </td>
              <td className={styles.hideOnMobile}>
                <div className={styles.actions}>
                  <FormContainer
                    table="quotations"
                    type="update"
                    data={item}
                  />
                  <FormContainer
                    table="quotations"
                    type="delete"
                    id={item.id}
                  />
                </div>
              </td>
            </tr>
          )}
        />

        <Pagination page={pagination.page} count={pagination.total} />
      </div>

      {docId && <QuoteView isOpen={true} quoteID={docId} />}
    </main>
  );
}
