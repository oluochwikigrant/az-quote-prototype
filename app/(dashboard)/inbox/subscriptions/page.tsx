import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import styles from "./page.module.scss";

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/inbox?type=subscriptions&page=${pageNum}`, { cache: "no-store" });
  const { data, pagination } = await res.json();

  const handleDelete = async (email: string) => {
    "use server";
    await fetch(`${origin}/api/inbox?type=subscriptions&email=${encodeURIComponent(email)}`, { method: "DELETE" });
  };

  return (
    <div>
      <PageHeader title="Subscribers" subtitle="Newsletter subscribers" />

      <Table
        columns={[
          { key: "email", header: "Email Address" },
          { key: "actions", header: "", render: (row: any) => (
            <ConfirmDelete
              title="Remove Subscriber"
              message={`Remove ${row.email} from subscribers?`}
              onConfirm={() => handleDelete(row.email)}
              trigger={<button className={styles.deleteBtn}>Remove</button>}
            />
          )},
        ]}
        data={data}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
}
