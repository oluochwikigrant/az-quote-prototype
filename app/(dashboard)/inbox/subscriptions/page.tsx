// app/(dashboard)/inbox/subscriptions/page.tsx

import React from "react";
import { subscribers as subscribersData, Subscriber } from "@/lib/dummyData";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
import SubscriptionView, {
  SubscriptionData,
} from "@/components/SubscriptionView";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";

interface SubscriptionListPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    subscription?: string;
  }>;
}

export default async function SubscriptionsPage({
  searchParams,
}: SubscriptionListPageProps) {
  const role = "admin";

  const { page = "1", search: searchTerm, subscription } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;

  // Filter subscribers
  let filtered = [...subscribersData];
  if (searchTerm) {
    filtered = filtered.filter(s =>
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort by email ascending
  filtered.sort((a, b) => a.email.localeCompare(b.email));

  // Paginate
  const total = filtered.length;
  const subsList = filtered.slice(
    ITEM_PER_PAGE * (pageNum - 1),
    ITEM_PER_PAGE * pageNum
  );

  // Modal selection
  const idx = parseInt(subscription ?? "-1", 10);
  const selected = idx >= 0 && idx < subsList.length ? subsList[idx] : null;
  const subscriptionData: SubscriptionData | null = selected
    ? {
        email: selected.email,
      }
    : null;

  const buildDetailHref = (idxRow: number) => {
    const params = new URLSearchParams();
    params.set("subscription", String(idxRow));
    params.set("page", String(pageNum));
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    return `?${params.toString()}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <TitleBar title="Subscriptions" />

        <Table
          columns={[
            { header: "Email", accessor: "email" },
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
          data={subsList}
          renderRow={(item, idxRow) => (
            <tr
              key={item.email}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              <td className={styles.cell}>
                <Link
                  href={buildDetailHref(idxRow)}
                  scroll={false}
                  className={styles.link}
                >
                  {item.email}
                </Link>
              </td>
              {role === "admin" && (
                <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                  <div className={styles.actions}>
                    <FormContainer table="subscribers" type="delete" id={item.email} />
                  </div>
                </td>
              )}
            </tr>
          )}
        />

        <Pagination page={pageNum} count={total} />
      </div>

      {subscriptionData && <SubscriptionView isOpen={true} data={subscriptionData} />}
    </main>
  );
}
