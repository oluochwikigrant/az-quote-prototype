// app/(dashboard)/inbox/quotation-requests/page.tsx
import React from "react";
import { quotationRequests as quotationRequestsData } from "@/lib/dummyData";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
import TitleBar from "@/components/TitleBar";
import Link from "next/link";

interface QuotationListPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    quote?: string;
  }>;
}

export default async function NewQuotations({
  searchParams,
}: QuotationListPageProps) {
  const role = "admin";

  const { page = "1", search: subjectFilter } = await searchParams;
  const pageNum = parseInt(page, 10);

  // Filter quotation requests
  let filtered = [...quotationRequestsData];
  if (subjectFilter) {
    filtered = filtered.filter(q =>
      q.subject.toLowerCase().includes(subjectFilter.toLowerCase())
    );
  }

  // Sort by createdAt descending
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Paginate
  const total = filtered.length;
  const quotation_requests = filtered.slice(
    ITEM_PER_PAGE * (pageNum - 1),
    ITEM_PER_PAGE * pageNum
  );

  const buildDetailHref = (idx: number) => {
    const params = new URLSearchParams();
    params.set("quote", String(idx));
    params.set("page", String(pageNum));
    if (subjectFilter) {
      params.set("search", subjectFilter);
    }
    return `?${params.toString()}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <TitleBar title="Quotation Requests" />

        <Table
          columns={[
            { header: "Client Name", accessor: "name" },
            { header: "Subject", accessor: "subject" },
            { header: "Date", accessor: "createdAt" },
            {
              header: "Message",
              accessor: "message",
              hideOnMobile: styles.hideOnMobile,
            },
            ...(role === "admin"
              ? [
                  {
                    header: "Actions",
                    accessor: "actions",
                    hideOnMobile: styles.hideOnMobile,
                  },
                ]
              : []),
          ]}
          data={quotation_requests}
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
                  {item.name}
                </Link>
              </td>
              <td className={styles.cell}>{item.subject}</td>
              <td className={styles.cell}>
                {new Intl.DateTimeFormat("en-US").format(item.createdAt)}
              </td>
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.message}
              </td>
              {role === "admin" && (
                <td className={styles.hideOnMobile}>
                  <div className={styles.actions}>
                    <FormContainer table="quotation_request" type="update" data={item} />
                    <FormContainer table="quotation_request" type="delete" id={item.id} />
                  </div>
                </td>
              )}
            </tr>
          )}
        />

        <Pagination page={pageNum} count={total} />
      </div>
    </main>
  );
}
