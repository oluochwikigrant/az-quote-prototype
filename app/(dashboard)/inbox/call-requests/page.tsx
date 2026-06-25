// app/(dashboard)/inbox/call-requests/page.tsx
import React from "react";
import { callRequests as callRequestsData, CallRequest } from "@/lib/dummyData";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
import CallRequestView, { CallRequestData } from "@/components/CallRequestView";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";

interface CallRequestListPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    detail?: string;
  }>;
}

export default async function NewCallRequests({
  searchParams,
}: CallRequestListPageProps) {
  const role = "admin";

  const { page = "1", search: subjectFilter, detail } = await searchParams;
  const pageNum = parseInt(page, 10);

  // Filter call requests
  let filtered = [...callRequestsData];
  if (subjectFilter) {
    filtered = filtered.filter(c =>
      c.subject.toLowerCase().includes(subjectFilter.toLowerCase())
    );
  }

  // Sort by time_requested descending
  filtered.sort((a, b) => new Date(b.time_requested).getTime() - new Date(a.time_requested).getTime());

  // Paginate
  const total = filtered.length;
  const call_requests = filtered.slice(
    ITEM_PER_PAGE * (pageNum - 1),
    ITEM_PER_PAGE * pageNum
  );

  // Modal selection
  const idx = parseInt(detail ?? "-1", 10);
  const selected = idx >= 0 && idx < call_requests.length ? call_requests[idx] : null;
  const callData: CallRequestData | null = selected
    ? {
        clientName: selected.client_name,
        phone: selected.phone_number,
        subject: selected.subject,
        timeRequested: selected.time_requested,
      }
    : null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <TitleBar title="Call Requests" />

        <Table
          columns={[
            { header: "Client Name", accessor: "client_name" },
            { header: "Phone Number", accessor: "phone_number" },
            { header: "Subject", accessor: "subject" },
            { header: "Requested At", accessor: "time_requested" },
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
          data={call_requests}
          renderRow={(item, idx) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              <td className={styles.cell}>
                <Link
                  href={`?detail=${idx}&page=${pageNum}${
                    subjectFilter ? `&search=${encodeURIComponent(subjectFilter)}` : ""
                  }`}
                  scroll={false}
                  className={styles.link}
                >
                  {item.client_name}
                </Link>
              </td>
              <td className={styles.cell}>{item.phone_number}</td>
              <td className={styles.cell}>{item.subject}</td>
              <td className={styles.cell}>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(item.time_requested)}
              </td>
              {role === "admin" && (
                <td className={`${styles.cell} ${styles.hideOnMobile}`}>
                  <div className={styles.actions}>
                    <FormContainer table="callrequest" type="update" data={item} />
                    <FormContainer table="callrequest" type="delete" id={item.id} />
                  </div>
                </td>
              )}
            </tr>
          )}
        />

        <Pagination page={pageNum} count={total} />
      </div>

      {callData && <CallRequestView isOpen={true} data={callData} />}
    </main>
  );
}
