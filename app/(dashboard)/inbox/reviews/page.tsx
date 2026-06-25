// app/(dashboard)/inbox/reviews/page.tsx

import React from "react";
import { reviews as reviewsData, Review } from "@/lib/dummyData";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
import ReviewView, { ReviewData } from "@/components/ReviewView";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";

interface ReviewListPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    review?: string;
  }>;
}

export default async function ReviewsPage({
  searchParams,
}: ReviewListPageProps) {
  const role = "admin";

  const { page = "1", search: searchTerm, review } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;

  // Filter reviews
  let filtered = [...reviewsData];
  if (searchTerm) {
    filtered = filtered.filter(
      r =>
        (r.clientName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.contact?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort by id descending
  filtered.sort((a, b) => b.id - a.id);

  // Paginate
  const total = filtered.length;
  const reviews = filtered.slice(
    ITEM_PER_PAGE * (pageNum - 1),
    ITEM_PER_PAGE * pageNum
  );

  // Modal selection
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

  const buildDetailHref = (idxRow: number) => {
    const params = new URLSearchParams();
    params.set("review", String(idxRow));
    params.set("page", String(pageNum));
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    return `?${params.toString()}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <TitleBar title="Reviews" />

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
          data={reviews}
          renderRow={(item, idxRow) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              <td className={styles.cell}>
                <Link
                  href={buildDetailHref(idxRow)}
                  scroll={false}
                  className={styles.link}
                >
                  {item.clientName || "—"}
                </Link>
              </td>
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.contact || "—"}
              </td>
              <td className={styles.cell}>
                {item.rating != null ? item.rating : "N/A"}
              </td>
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

        <Pagination page={pageNum} count={total} />
      </div>

      {reviewData && <ReviewView isOpen={true} data={reviewData} />}
    </main>
  );
}
