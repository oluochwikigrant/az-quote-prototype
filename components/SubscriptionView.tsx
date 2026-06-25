// components/SubscriptionView.tsx

"use client";

import React, { FC, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SubscriptionView.module.scss";

export interface SubscriptionData {
  email: string;
}

interface SubscriptionViewProps {
  isOpen: boolean;
  data: SubscriptionData;
}

const SubscriptionView: FC<SubscriptionViewProps> = ({ isOpen, data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal by removing `subscription` param
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("subscription");
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

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal} ref={modalRef} tabIndex={-1}>
        <button
          className={styles.closeButton}
          onClick={closeModal}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className={styles.title}>Subscription Details</h2>

        <div className={styles.field}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{data.email}</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionView;
