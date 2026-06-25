// File: app/(dashboard)/sent/quotation/page.tsx

import React from "react";
import { headers } from "next/headers";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TitleBar from "@/components/TitleBar";
import FormContainer from "@/components/FormContainer";
import Link from "next/link";
import styles from "./page.module.scss";
import QuoteView from "@/components/DocumentPreviewModal/QuoteView";

interface QuotationItem {
  id: number;
  // quotation_number: string;
  // description: string;
  // client_name: string;
  // client_contact: string;
  // created_at: string;
}

interface ApiResponse {
  data: QuotationItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

interface SentQuotationsPageProps {
  searchParams: Promise<{ page?: string; search?: string; quote?: string }>;
}

export default async function SentQuotations({
  searchParams,
}: SentQuotationsPageProps) {
  // 1. Extract paging/search params
  const { page = "1", search: filter = "", quote } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  // 2. Rebuild origin from Host header
  const headersList = await headers();
  const host = headersList.get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  // 3. Fetch from API
  const params = new URLSearchParams({ page: String(pageNum), search: filter });
  const res = await fetch(`${origin}${"/api/sent_quotations"}?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API error:", await res.text());
    throw new Error("Failed to fetch sent quotations");
  }
  const { data: quotationsList, pagination } =
    (await res.json()) as ApiResponse;

  // 4. Prepare modal data
  const idx = parseInt(quote ?? "-1", 10);
  const selected =
    idx >= 0 && idx < quotationsList.length ? quotationsList[idx] : null;
  const quoteData = selected
    ? {
        id: selected.id,
      }
    : null;

  // 5. Render
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <TitleBar title="Sent Quotations" />

        <Table
          columns={[
            { header: "Quote No.", accessor: "quotation_number" },
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
          data={quotationsList}
          renderRow={(item, idx) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              <td className={styles.cell}>
                <Link
                  href={`?quote=${idx}`}
                  scroll={false}
                  className={styles.link}
                >
                  {item.quotation_number}
                </Link>
              </td>
              <td className={styles.cell}>{item.client_name}</td>
              <td className={styles.cell}>{item.client_contact}</td>
              <td className={styles.cell}>{item.created_at}</td>
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.description}
              </td>
              <td className={styles.hideOnMobile}>
                <div className={styles.actions}>
                  <FormContainer table="quotations" type="update" data={item} />
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

      {quoteData && <QuoteView isOpen={true} quoteID={quoteData.id} />}
    </main>
  );
}
