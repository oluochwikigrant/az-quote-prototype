// components/ReviewView.tsx

"use client";

import React, { FC, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ReviewView.module.scss";

export interface ReviewData {
  clientName: string;
  contact: string;
  message: string;
  rating: number | null;
}

interface ReviewViewProps {
  isOpen: boolean;
  data: ReviewData;
}

const ReviewView: FC<ReviewViewProps> = ({ isOpen, data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal by removing `review` param
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("review");
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

  // Format rating display (e.g., show stars or just number)
  // Here, we'll just show number or "N/A"
  const ratingDisplay = data.rating != null ? String(data.rating) : "N/A";

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

        <h2 className={styles.title}>
          Review {data.clientName ? `by ${data.clientName}` : ""}
        </h2>

        <div className={styles.field}>
          <span className={styles.label}>Client Name:</span>
          <span className={styles.value}>{data.clientName || "—"}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Contact:</span>
          <span className={styles.value}>{data.contact || "—"}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Rating:</span>
          <span className={styles.value}>{ratingDisplay}</span>
        </div>

        <div className={`${styles.field} ${styles.messageField}`}>
          <span className={styles.label}>Message:</span>
          <div className={styles.value}>{data.message}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewView;
