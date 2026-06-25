// /app/(dashboard)/list/call-requests/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { callrequest as CallRequestModel } from "@/prisma/generated/prisma-client";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import styles from "./page.module.scss";
// If you want a detail-view modal, you can create a simple component like CallRequestView:
import CallRequestView, { CallRequestData } from "@/components/CallRequestView";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";

interface CallRequestListPageProps {
  // Mark searchParams as a Promise in Next.js 15+
  searchParams: Promise<{
    page?: string;
    search?: string;
    detail?: string; // index for opening detail modal
  }>;
}

export default async function NewCallRequests({
  searchParams,
}: CallRequestListPageProps) {
  // 1. Auth & role (example)
  // ------------------------------------------------------
  // const { userId, sessionClaims } = auth();
  const role = "admin";

  // 2. Await and destructure searchParams
  const { page = "1", search: subjectFilter, detail } = await searchParams;
  const pageNum = parseInt(page, 10);

  // 3. Build Prisma filter
  const where: any = {};
  if (subjectFilter) {
    // filter by subject (you could also filter by client_name or phone_number if desired)
    where.subject = { contains: subjectFilter, mode: "insensitive" };
  }

  // 4. Fetch data from callrequest table
  const [call_requests, total] = await prisma.$transaction([
    prisma.callrequest.findMany({
      where,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
      orderBy: { time_requested: "desc" },
    }),
    prisma.callrequest.count({ where }),
  ]);

  // 5. Modal selection (if you want to show details in a modal)
  const idx = parseInt(detail ?? "-1", 10);
  const selected =
    idx >= 0 && idx < call_requests.length ? call_requests[idx] : null;
  const callData: CallRequestData | null = selected
    ? {
        clientName: selected.client_name,
        phone: selected.phone_number,
        subject: selected.subject,
        timeRequested: selected.time_requested,
        // If you had additional fields, include here.
      }
    : null;

  // 6. Render
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Title */}
        <TitleBar title="Call Requests" />

        {/* (Optional) Search input could be placed above the table if desired */}

        {/* Table */}
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
          // Prisma returns fields matching model names, e.g. client_name, phone_number, subject, time_requested
          data={call_requests as CallRequestModel[]}
          renderRow={(item, idx) => (
            <tr
              key={item.id}
              className={`${styles.row} ${styles.hoverHighlight}`}
            >
              {/* Client Name with link to open detail modal */}
              <td className={styles.cell}>
                <Link
                  href={`?detail=${idx}&page=${pageNum}${
                    subjectFilter
                      ? `&search=${encodeURIComponent(subjectFilter)}`
                      : ""
                  }`}
                  scroll={false}
                  className={styles.link}
                >
                  {item.client_name}
                </Link>
              </td>

              {/* Phone */}
              <td className={styles.cell}>{item.phone_number}</td>

              {/* Subject */}
              <td className={styles.cell}>{item.subject}</td>

              {/* Requested At */}
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
                    {/* Update: ensure your FormContainer can handle callrequest table */}
                    <FormContainer
                      table="callrequest"
                      type="update"
                      data={item}
                    />
                    {/* Delete */}
                    <FormContainer
                      table="callrequest"
                      type="delete"
                      id={item.id}
                    />
                  </div>
                </td>
              )}
            </tr>
          )}
        />

        {/* Pagination */}
        <Pagination
          page={pageNum}
          count={total}
          // basePath="/dashboard/list/call-requests"
        />
        {/* Note: adjust Pagination to preserve searchParams if needed */}
      </div>

      {/* Detail Modal */}
      {callData && (
        // You need to implement CallRequestView to accept isOpen & data
        <CallRequestView isOpen={true} data={callData} />
      )}
    </main>
  );
}
