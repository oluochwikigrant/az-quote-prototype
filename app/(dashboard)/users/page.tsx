import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Badge from "@/components/ui/Badge";
import styles from "./page.module.scss";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/users?page=${pageNum}`, { cache: "no-store" });
  const { data, pagination } = await res.json();

  const handleDelete = async (id: string) => {
    "use server";
    await fetch(`${origin}/api/users?id=${id}`, { method: "DELETE" });
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage system users"
        action={{ label: "New User", href: "/users/new" }}
      />

      <Table
        columns={[
          { key: "name", header: "Name", render: (row: any) => `${row.firstName} ${row.lastName}` },
          { key: "email", header: "Email", hideMobile: true },
          { key: "role", header: "Role", render: (row: any) => (
            <Badge variant={row.role === "admin" ? "danger" : row.role === "sales" ? "info" : "default"}>
              {row.role}
            </Badge>
          )},
          { key: "position", header: "Position", hideMobile: true },
          { key: "phone", header: "Phone", hideMobile: true },
          { key: "actions", header: "", render: (row: any) => (
            <ConfirmDelete
              title="Delete User"
              message={`Delete user ${row.firstName} ${row.lastName}?`}
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
