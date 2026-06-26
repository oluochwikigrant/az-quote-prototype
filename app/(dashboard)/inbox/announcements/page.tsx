import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import styles from "./page.module.scss";

export default async function AnnouncementsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/inbox?type=announcements&page=${pageNum}`, { cache: "no-store" });
  const { data, pagination } = await res.json();

  const handleDelete = async (id: number) => {
    "use server";
    await fetch(`${origin}/api/inbox?type=announcements&id=${id}`, { method: "DELETE" });
  };

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Company announcements and notices" />

      <Table
        columns={[
          { key: "title", header: "Title", render: (row: any) => <strong>{row.title}</strong> },
          { key: "description", header: "Description", render: (row: any) => (
            <span className={styles.desc}>{row.description}</span>
          ) },
          { key: "date", header: "Date", render: (row: any) => (
            new Date(row.date).toLocaleDateString("en-KE")
          ), hideMobile: true },
          { key: "actions", header: "", render: (row: any) => (
            <ConfirmDelete
              title="Delete Announcement"
              message={`Delete "${row.title}"?`}
              onConfirm={() => handleDelete(row.id)}
              trigger={<button className={styles.deleteBtn}>Delete</button>}
            />
          )},
        ]}
        data={data}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
}
