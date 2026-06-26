import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { DocumentType } from "@/types";
import styles from "./page.module.scss";

const validTypes: DocumentType[] = ["quotation", "invoice", "receipt", "delivery_note"];

const labels: Record<DocumentType, string> = {
  quotation: "Quotations",
  invoice: "Invoices",
  receipt: "Receipts",
  delivery_note: "Delivery Notes",
};

const newPaths: Record<DocumentType, string> = {
  quotation: "/documents/new/quotation",
  invoice: "/documents/new/invoice",
  receipt: "/documents/new/receipt",
  delivery_note: "/documents/new/delivery_note",
};

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function DocumentsListPage({ params, searchParams }: Props) {
  const { type } = await params;
  const { page = "1", search = "" } = await searchParams;

  if (!validTypes.includes(type as DocumentType)) {
    notFound();
  }

  const docType = type as DocumentType;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const paramsApi = new URLSearchParams({ type: docType, page: String(pageNum) });
  if (search) paramsApi.set("search", search);

  const res = await fetch(`${origin}/api/documents?${paramsApi}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch documents");
  const { data, pagination } = await res.json();

  const handleDelete = async (id: number) => {
    "use server";
    await fetch(`${origin}/api/documents?id=${id}`, { method: "DELETE" });
  };

  return (
    <div>
      <PageHeader
        title={labels[docType]}
        subtitle={`Manage your ${labels[docType].toLowerCase()}`}
        action={{ label: `New ${labels[docType].slice(0, -1)}`, href: newPaths[docType] }}
      />

      <div className={styles.toolbar}>
        <SearchBar placeholder={`Search ${labels[docType].toLowerCase()}...`} />
      </div>

      <Table
        columns={[
          { key: "number", header: "Number", render: (row: any) => (
            <span className={styles.docNumber}>{row.number}</span>
          )},
          { key: "clientName", header: "Client" },
          { key: "clientContact", header: "Contact", hideMobile: true },
          { key: "type", header: "Type", render: (row: any) => (
            <Badge variant={row.type === "quotation" ? "info" : row.type === "invoice" ? "success" : row.type === "receipt" ? "warning" : "default"}>
              {row.type}
            </Badge>
          )},
          { key: "createdAt", header: "Date", render: (row: any) => (
            new Date(row.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
          ), hideMobile: true },
          { key: "actions", header: "Actions", render: (row: any) => (
            <div className={styles.actions}>
              <ConfirmDelete
                title="Delete Document"
                message={`Are you sure you want to delete ${row.number}? This action cannot be undone.`}
                onConfirm={() => handleDelete(row.id)}
                trigger={<button className={styles.deleteBtn}>Delete</button>}
              />
            </div>
          )},
        ]}
        data={data}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
}
