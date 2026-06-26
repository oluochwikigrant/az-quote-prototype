import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import DeleteButton from "@/components/ui/DeleteButton";
import styles from "./page.module.scss";

export default async function QuotationRequestsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/inbox?type=quotation-requests&page=${pageNum}`, { cache: "no-store" });
  const { data, pagination } = await res.json();

  return (
    <div>
      <PageHeader title="Quotation Requests" subtitle="Client quotation submissions" />

      <Table
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email", hideMobile: true },
          { key: "phone", header: "Phone", hideMobile: true },
          { key: "subject", header: "Subject" },
          { key: "createdAt", header: "Date", render: (row: any) => (
            new Date(row.createdAt).toLocaleDateString("en-KE")
          ), hideMobile: true },
          { key: "actions", header: "", render: (row: any) => (
            <DeleteButton id={row.id} type="inbox" inboxType="quotation-requests" />
          )},
        ]}
        data={data}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
}
