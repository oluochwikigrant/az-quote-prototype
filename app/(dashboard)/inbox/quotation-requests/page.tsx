// /app/(dashboard)/list/quotation_requests/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { quotation_request as QuotationModel } from "@/prisma/generated/prisma-client";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
import DocumentPreviewModal, {
  QuoteData,
} from "@/components/DocumentPreviewModal/DocumentPreviewModal";
import TitleBar from "@/components/TitleBar";
import Link from "next/link";

type QuotationWithMeta = QuotationModel;

interface QuotationListPageProps {
  // Mark searchParams as a Promise in Next.js 15+
  searchParams: Promise<{
    page?: string;
    search?: string;
    quote?: string;
  }>;
}

export default async function NewQuotations({
  searchParams,
}: QuotationListPageProps) {
  // 1. Auth & role
  // ------------------------------------------------------ const { userId, sessionClaims } = auth();
  const role = "admin";

  // 2. Await and destructure searchParams
  const { page = "1", search: subjectFilter, quote } = await searchParams; // <— await here :contentReference[oaicite:4]{index=4}

  const pageNum = parseInt(page, 10);

  // 3. Build Prisma filter
  const where: any = {};
  if (subjectFilter) {
    where.subject = { contains: subjectFilter, mode: "insensitive" };
  }

  // 4. Fetch data
  const [quotation_requests, total] = await prisma.$transaction([
    prisma.quotation_request.findMany({
      where,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.quotation_request.count({ where }),
  ]);

  // 5. Modal selection
  const idx = parseInt(quote ?? "-1", 10);
  const selected =
    idx >= 0 && idx < quotation_requests.length
      ? quotation_requests[idx]
      : null;
  const quoteData: QuoteData | null = selected
    ? {
        clientCompanyName: selected.name,
        phone: selected.tel,
        email: selected.email,
        subject: selected.subject,
        description: selected.message,
      }
    : null;

  // 6. Render
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Title */}

        <TitleBar title="Quotations" />

        {/* Table */}
        <Table
          columns={[
            { header: "Client Name", accessor: "name" },
            { header: "Subject", accessor: "subject" },
            {
              header: "Date",
              accessor: "createdAt",
            },
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
          data={quotation_requests as QuotationWithMeta[]}
          renderRow={(item, idx) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              {/* <td className={styles.cell}>{item.name}</td> */}
              <td className={styles.cell}>
                <Link
                  href={`?quote=${idx}`}
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
                    <FormContainer
                      table="quotation_request"
                      type="update"
                      data={item}
                    />
                    <FormContainer
                      table="quotation_request"
                      type="delete"
                      id={item.id}
                    />
                  </div>
                </td>
              )}
            </tr>
          )}
        />

        {/* Pagination */}
        <Pagination page={pageNum} count={total} />
      </div>

      {/* Quote Modal */}
      {quoteData && (
        <DocumentPreviewModal isOpen={true} quoteData={quoteData} />
      )}
    </main>
  );
}
