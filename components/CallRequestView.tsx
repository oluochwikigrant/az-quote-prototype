"use client";

import React, { FC, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./CallRequestView.module.scss";

export interface CallRequestData {
  clientName: string;
  phone: string;
  subject: string;
  timeRequested: Date;
  // Add more fields here if your model expands
}

interface CallRequestViewProps {
  isOpen: boolean;
  data: CallRequestData;
}

const CallRequestView: FC<CallRequestViewProps> = ({ isOpen, data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalRef = useRef<HTMLDivElement>(null);

  // Remove `detail` from the URL to close
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("detail");
    // Preserve other params like page/search if present
    const newQuery = params.toString();
    const newPath = `${window.location.pathname}${
      newQuery ? `?${newQuery}` : ""
    }`;
    router.push(newPath, { scroll: false });
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, searchParams]);

  // Click-outside detection
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, searchParams]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Format timeRequested for display
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data.timeRequested));

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal} ref={modalRef} tabIndex={-1}>
        <button
          className={styles.closeButton}
          onClick={closeModal}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className={styles.title}>{data.subject}</h2>
        <div className={styles.field}>
          <span className={styles.label}>Client / Company:</span>
          <span className={styles.value}>{data.clientName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Phone:</span>
          <span className={styles.value}>{data.phone}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Subject:</span>
          <span className={styles.value}>{data.subject}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Requested At:</span>
          <span className={styles.value}>{formattedTime}</span>
        </div>
        {/* If you have more fields, add more .field blocks here */}
      </div>
    </div>
  );
};

export default CallRequestView;
