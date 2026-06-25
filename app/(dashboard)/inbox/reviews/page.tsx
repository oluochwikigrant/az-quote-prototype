// app/(dashboard)/list/reviews/page.tsx

import React from "react";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { review as ReviewModel } from "@/prisma/generated/prisma-client";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
import ReviewView, { ReviewData } from "@/components/ReviewView";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";

interface ReviewListPageProps {
  // Next.js 15+: searchParams is a Promise
  searchParams: Promise<{
    page?: string;
    search?: string;
    review?: string; // index for detail modal
  }>;
}

export default async function ReviewsPage({
  searchParams,
}: ReviewListPageProps) {
  // 1. Auth & role (adjust as needed)
  // const { userId, sessionClaims } = auth();
  const role = "admin";

  // 2. Await and destructure searchParams
  const { page = "1", search: searchTerm, review } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;

  // 3. Build Prisma filter
  const where: any = {};
  if (searchTerm) {
    // search in clientName, contact, or message
    where.OR = [
      { clientName: { contains: searchTerm, mode: "insensitive" } },
      { contact: { contains: searchTerm, mode: "insensitive" } },
      { message: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // 4. Fetch data
  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
      orderBy: { id: "desc" },
    }),
    prisma.review.count({ where }),
  ]);

  // 5. Modal selection
  const idx = parseInt(review ?? "-1", 10);
  const selected = idx >= 0 && idx < reviews.length ? reviews[idx] : null;
  const reviewData: ReviewData | null = selected
    ? {
        clientName: selected.clientName ?? "",
        contact: selected.contact ?? "",
        message: selected.message,
        rating: selected.rating ?? null,
      }
    : null;

  // Helper to build link preserving page & search
  const buildDetailHref = (idx: number) => {
    const params = new URLSearchParams();
    params.set("review", String(idx));
    params.set("page", String(pageNum));
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    return `?${params.toString()}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Title */}
        <TitleBar title="Reviews" />

        {/* (Optional) Add a search input above the table if desired.
            E.g. a small form that submits to this same page with ?search=... */}

        {/* Table */}
        <Table
          columns={[
            { header: "Client Name", accessor: "clientName" },
            {
              header: "Contact",
              accessor: "contact",
              hideOnMobile: styles.hideOnMobile,
            },
            { header: "Rating", accessor: "rating" },
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
          data={reviews as ReviewModel[]}
          renderRow={(item, idxRow) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              {/* Client Name with link to open detail modal */}
              <td className={styles.cell}>
                <Link
                  href={buildDetailHref(idxRow)}
                  scroll={false}
                  className={styles.link}
                >
                  {item.clientName || "—"}
                </Link>
              </td>

              {/* Contact */}
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.contact || "—"}
              </td>

              {/* Rating */}
              <td className={styles.cell}>
                {item.rating != null ? item.rating : "N/A"}
              </td>

              {/* Message (truncated for table?) */}
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.message.length > 50
                  ? item.message.slice(0, 50) + "…"
                  : item.message}
              </td>

              {role === "admin" && (
                <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                  <div className={styles.actions}>
                    <FormContainer table="review" type="update" data={item} />
                    <FormContainer table="review" type="delete" id={item.id} />
                  </div>
                </td>
              )}
            </tr>
          )}
        />

        {/* Pagination */}
        {/* 
          Ensure your Pagination component preserves search param if needed.
          If Pagination accepts basePath or a callback, adjust accordingly.
          Here we pass page and count; if Pagination internally builds links,
          you may need to modify it to include `search` in query string.
        */}
        <Pagination page={pageNum} count={total} />
      </div>

      {/* Detail Modal */}
      {reviewData && <ReviewView isOpen={true} data={reviewData} />}
    </main>
  );
}
