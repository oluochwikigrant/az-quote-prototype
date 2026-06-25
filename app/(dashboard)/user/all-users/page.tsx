//app\(dashboard)\user\all-users\page.tsx

import React from "react";
import Link from "next/link";
import { clerkClient } from "@/lib/clerkServerMocks";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import styles from "./page.module.scss";
import TitleBar from "@/components/TitleBar";

interface AllUsersPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AllUsersPage({
  searchParams,
}: AllUsersPageProps) {
  // 1. Auth & Role
  // ------------------------------------------------------ const { userId, sessionClaims } = auth();
  const role = "admin";

  // 2. Parse query params
  const { page = "1", search: emailFilter } = await searchParams;
  const pageNum = Math.max(parseInt(page, 10), 1);
  const limit = ITEM_PER_PAGE;
  const offset = (pageNum - 1) * limit;

  // 3. Instantiate Clerk client & fetch users
  const client = await clerkClient();
  const { data: users, totalCount } = await client.users.getUserList({
    limit,
    offset,
    query: emailFilter,
  });

  // 4. Map to table rows
  const rows = users.map((u) => ({
    id: u.id,
    firstName: u.firstName || "-",
    lastName: u.lastName || "-",
    userName: u.username || "-",
    email: u.emailAddresses[0]?.emailAddress || "-",
    role: (u.publicMetadata as { role?: string })?.role || "undefined",
    createdAt: u.createdAt,
  }));

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Title */}
        <TitleBar title="Announcements" />

        <Table
          columns={[
            { header: "Name", accessor: "firstName" },
            { header: "Username", accessor: "userName" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
            { header: "Joined", accessor: "createdAt" },
            ...(role === "admin"
              ? [{ header: "Actions", accessor: "actions" }]
              : []),
          ]}
          data={rows}
          renderRow={(user) => (
            <tr
              key={user.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              <td className={styles.cell}>
                <Link
                  href={`/user/all-users/${user.id}`}
                  className={styles.link}
                >
                  {user.firstName} {user.lastName}
                </Link>
              </td>
              <td className={styles.cell}>{user.userName}</td>
              <td className={styles.cell}>{user.email}</td>
              <td className={styles.cell}>
                {rows.find((r) => r.id === user.id)?.role}
              </td>
              <td className={styles.cell}>
                {new Intl.DateTimeFormat("en-US").format(
                  new Date(user.createdAt)
                )}
              </td>
              {role === "admin" && (
                <td className={styles.cell}>
                  <button className={styles.iconBtn}>Deactivate</button>
                </td>
              )}
            </tr>
          )}
        />

        <Pagination page={pageNum} count={totalCount} />
      </div>
    </main>
  );
}
