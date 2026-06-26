import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import DeleteButton from "@/components/ui/DeleteButton";
import styles from "./page.module.scss";

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/inbox?type=subscriptions&page=${pageNum}`, { cache: "no-store" });
  const { data, pagination } = await res.json();

  return (
    <div>
      <PageHeader title="Subscribers" subtitle="Newsletter subscribers" />

      <Table
        columns={[
          { key: "email", header: "Email Address" },
          { key: "actions", header: "", render: (row: any) => (
            <DeleteButton id={row.email} type="inbox" inboxType="subscriptions" email={row.email} label="Remove" />
          )},
        ]}
        data={data}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
}
