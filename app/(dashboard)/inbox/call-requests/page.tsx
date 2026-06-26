import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import DeleteButton from "@/components/ui/DeleteButton";
import styles from "./page.module.scss";

export default async function CallRequestsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/inbox?type=call-requests&page=${pageNum}`, { cache: "no-store" });
  const { data, pagination } = await res.json();

  return (
    <div>
      <PageHeader title="Call Requests" subtitle="Client callback requests" />

      <Table
        columns={[
          { key: "clientName", header: "Client" },
          { key: "phone", header: "Phone" },
          { key: "subject", header: "Subject" },
          { key: "timeRequested", header: "Requested", render: (row: any) => (
            new Date(row.timeRequested).toLocaleDateString("en-KE")
          ), hideMobile: true },
          { key: "actions", header: "", render: (row: any) => (
            <DeleteButton id={row.id} type="inbox" inboxType="call-requests" />
          )},
        ]}
        data={data}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
}
