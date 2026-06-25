// components/AnnouncementView.tsx

"use client";

import React, { FC, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./AnnouncementView.module.scss";
import FormContainer from "@/components/FormContainer";

export interface AnnouncementData {
  id: number;
  title: string;
  description: string;
  date: Date;
}

interface AnnouncementViewProps {
  isOpen: boolean;
  data: AnnouncementData;
}

const AnnouncementView: FC<AnnouncementViewProps> = ({ isOpen, data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal by removing `announcement` param
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("announcement");
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

  // Prevent background scroll
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

  // Format date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data.date));

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

        <h2 className={styles.title}>{data.title}</h2>

        <div className={styles.field}>
          <span className={styles.label}>Date:</span>
          <span className={styles.value}>{formattedDate}</span>
        </div>

        <div className={`${styles.field} ${styles.descriptionField}`}>
          <span className={styles.label}>Description:</span>
          <div className={styles.value}>{data.description}</div>
        </div>

        {/* Actions: update/delete inside modal if desired */}
        <div className={styles.actions}>
          {/* Update announcement */}
          <FormContainer
            table="announcement"
            type="update"
            data={{
              id: data.id,
              title: data.title,
              description: data.description,
              date: data.date,
            }}
            // onSuccess={closeModal}
          />
          {/* Delete announcement */}
          <FormContainer
            table="announcement"
            type="delete"
            id={data.id}
            // onSuccess={closeModal}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementView;
