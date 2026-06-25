// app/(dashboard)/list/subscriptions/page.tsx

import React from "react";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { subscribers as SubscriberModel } from "@/prisma/generated/prisma-client";
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
  // Next.js 15+: searchParams is a Promise
  searchParams: Promise<{
    page?: string;
    search?: string;
    subscription?: string; // index for detail modal
  }>;
}

export default async function SubscriptionsPage({
  searchParams,
}: SubscriptionListPageProps) {
  // 1. Auth & role (adjust as needed)
  // const { userId, sessionClaims } = auth();
  const role = "admin";

  // 2. Await and destructure searchParams
  const { page = "1", search: searchTerm, subscription } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;

  // 3. Build Prisma filter
  const where: any = {};
  if (searchTerm) {
    where.email = { contains: searchTerm, mode: "insensitive" };
  }

  // 4. Fetch data
  const [subsList, total] = await prisma.$transaction([
    prisma.subscribers.findMany({
      where,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
      orderBy: { email: "asc" }, // or any ordering; lexicographical by email
    }),
    prisma.subscribers.count({ where }),
  ]);

  // 5. Modal selection
  const idx = parseInt(subscription ?? "-1", 10);
  const selected = idx >= 0 && idx < subsList.length ? subsList[idx] : null;
  const subscriptionData: SubscriptionData | null = selected
    ? {
        email: selected.email,
      }
    : null;

  // Helper to build link preserving page & search
  const buildDetailHref = (idx: number) => {
    const params = new URLSearchParams();
    params.set("subscription", String(idx));
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
        <TitleBar title="Subscriptions" />

        {/* Table */}
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
          data={subsList as SubscriberModel[]}
          renderRow={(item, idxRow) => (
            <tr
              key={item.email}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              {/* Email with link to open detail modal */}
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
                    {/* Only delete; updating primary-key email is not typical */}
                    <FormContainer
                      table="subscribers"
                      type="delete"
                      id={item.email}
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

      {/* Detail Modal */}
      {subscriptionData && (
        <SubscriptionView isOpen={true} data={subscriptionData} />
      )}
    </main>
  );
}
