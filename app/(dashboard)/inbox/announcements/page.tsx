// app/(dashboard)/inbox/announcements/page.tsx

import React from "react";
import { announcements as announcementsData, Announcement } from "@/lib/dummyData";
import { ITEM_PER_PAGE } from "@/lib/settings";
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
  searchParams: Promise<{
    page?: string;
    search?: string;
    announcement?: string;
  }>;
}

export default async function AnnouncementsPage({
  searchParams,
}: AnnouncementListPageProps) {
  const role = "admin";

  const { page = "1", search: searchTerm, announcement } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;

  // Filter announcements
  let filtered = [...announcementsData];
  if (searchTerm) {
    filtered = filtered.filter(
      a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           a.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Paginate
  const total = filtered.length;
  const announcements = filtered.slice(
    ITEM_PER_PAGE * (pageNum - 1),
    ITEM_PER_PAGE * pageNum
  );

  // Modal selection
  const idx = parseInt(announcement ?? "-1", 10);
  const selected = idx >= 0 && idx < announcements.length ? announcements[idx] : null;
  const announcementData: AnnouncementData | null = selected
    ? {
        title: selected.title,
        description: selected.description,
        date: selected.date,
        id: selected.id,
      }
    : null;

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
        <TitleBar title="Announcements" />

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
          data={announcements}
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
                  {item.title}
                </Link>
              </td>
              <td className={styles.cell}>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }).format(item.date)}
              </td>
              <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                {item.description.length > 60
                  ? item.description.slice(0, 60) + "…"
                  : item.description}
              </td>
              {role === "admin" && (
                <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                  <div className={styles.actions}>
                    <FormContainer table="announcement" type="update" data={item} />
                    <FormContainer table="announcement" type="delete" id={item.id} />
                  </div>
                </td>
              )}
            </tr>
          )}
        />

        <Pagination page={pageNum} count={total} />
      </div>

      {announcementData && <AnnouncementView isOpen={true} data={announcementData} />}
    </main>
  );
}
