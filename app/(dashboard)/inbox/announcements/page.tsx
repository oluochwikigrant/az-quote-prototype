// app/(dashboard)/list/announcements/page.tsx

import React from "react";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { announcement as AnnouncementModel } from "@/prisma/generated/prisma-client";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
import AnnouncementView, {
  AnnouncementData,
} from "@/components/AnnouncementView";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";

interface AnnouncementListPageProps {
  // Next.js 15+: searchParams is a Promise
  searchParams: Promise<{
    page?: string;
    search?: string;
    announcement?: string; // index for detail modal
  }>;
}

export default async function AnnouncementsPage({
  searchParams,
}: AnnouncementListPageProps) {
  // 1. Auth & role (adjust if needed)
  // const { userId, sessionClaims } = auth();
  const role = "admin";

  // 2. Await and destructure searchParams
  const { page = "1", search: searchTerm, announcement } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;

  // 3. Build Prisma filter: search in title or description if provided
  const where: any = {};
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // 4. Fetch data: paginated, ordered by date descending (newest first)
  const [announcements, total] = await prisma.$transaction([
    prisma.announcement.findMany({
      where,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
      orderBy: { date: "desc" },
    }),
    prisma.announcement.count({ where }),
  ]);

  // 5. Modal selection by index in current page results
  const idx = parseInt(announcement ?? "-1", 10);
  const selected =
    idx >= 0 && idx < announcements.length ? announcements[idx] : null;
  const announcementData: AnnouncementData | null = selected
    ? {
        title: selected.title,
        description: selected.description,
        date: selected.date,
        id: selected.id,
      }
    : null;

  // Helper to build detail-link href preserving page & search
  const buildDetailHref = (idxRow: number) => {
    const params = new URLSearchParams();
    params.set("announcement", String(idxRow));
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
        <TitleBar title="Announcements" />

        {/* Table */}
        <Table
          columns={[
            { header: "Title", accessor: "title" },
            { header: "Date", accessor: "date" },
            {
              header: "Description",
              accessor: "description",
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
          data={announcements as AnnouncementModel[]}
          renderRow={(item, idxRow) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              {/* Title with link to open detail modal */}
              <td className={styles.cell}>
                <Link
                  href={buildDetailHref(idxRow)}
                  scroll={false}
                  className={styles.link}
                >
                  {item.title}
                </Link>
              </td>

              {/* Date formatted */}
              <td className={styles.cell}>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }).format(item.date)}
              </td>

              {/* Description truncated on mobile? hideOnMobile wraps it */}
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.description.length > 60
                  ? item.description.slice(0, 60) + "…"
                  : item.description}
              </td>

              {role === "admin" && (
                <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                  <div className={styles.actions}>
                    {/* Update action: ensure your FormContainer handles announcement */}
                    <FormContainer
                      table="announcement"
                      type="update"
                      data={item}
                    />
                    {/* Delete action */}
                    <FormContainer
                      table="announcement"
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

      {/* Detail Modal */}
      {announcementData && (
        <AnnouncementView isOpen={true} data={announcementData} />
      )}
    </main>
  );
}
