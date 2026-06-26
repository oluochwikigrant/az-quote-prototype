import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import styles from "./page.module.scss";

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/inbox?type=reviews&page=${pageNum}`, { cache: "no-store" });
  const { data, pagination } = await res.json();

  const handleDelete = async (id: number) => {
    "use server";
    await fetch(`${origin}/api/inbox?type=reviews&id=${id}`, { method: "DELETE" });
  };

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Customer feedback and ratings" />

      <Table
        columns={[
          { key: "clientName", header: "Client", render: (row: any) => row.clientName ?? "Anonymous" },
          { key: "rating", header: "Rating", render: (row: any) => (
            <span className={styles.stars}>{"★".repeat(row.rating ?? 0)}{"☆".repeat(5 - (row.rating ?? 0))}</span>
          ) },
          { key: "message", header: "Message", render: (row: any) => (
            <span className={styles.message}>{row.message}</span>
          ) },
          { key: "actions", header: "", render: (row: any) => (
            <ConfirmDelete
              title="Delete Review"
              message="Delete this review?"
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
