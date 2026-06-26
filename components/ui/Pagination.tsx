"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const buildHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className={styles.container}>
      <Link
        href={buildHref(Math.max(1, page - 1))}
        className={`${styles.button} ${page <= 1 ? styles.disabled : ""}`}
        aria-disabled={page <= 1}
      >
        Prev
      </Link>

      {start > 1 && (
        <>
          <Link href={buildHref(1)} className={styles.button}>
            1
          </Link>
          {start > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`${styles.button} ${p === page ? styles.active : ""}`}
        >
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
          <Link href={buildHref(totalPages)} className={styles.button}>
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        className={`${styles.button} ${page >= totalPages ? styles.disabled : ""}`}
        aria-disabled={page >= totalPages}
      >
        Next
      </Link>
    </div>
  );
}
