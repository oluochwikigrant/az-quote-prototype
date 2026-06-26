"use client";

import React from "react";
import Link from "next/link";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className={styles.actionButton}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
