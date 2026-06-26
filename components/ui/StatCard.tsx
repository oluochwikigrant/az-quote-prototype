import React from "react";
import Link from "next/link";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  label: string;
  count: number;
  href?: string;
  variant?: "dark" | "blue" | "green" | "amber" | "rose";
}

export default function StatCard({ label, count, href, variant = "dark" }: StatCardProps) {
  const content = (
    <div className={`${styles.card} ${styles[variant]}`}>
      <span className={styles.count}>{count}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {content}
      </Link>
    );
  }

  return content;
}
