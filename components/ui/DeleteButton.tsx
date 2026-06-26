"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import styles from "./DeleteButton.module.scss";

interface DeleteButtonProps {
  id: string | number;
  type: "documents" | "inbox" | "users";
  inboxType?: string;
  email?: string;
  label?: string;
}

export default function DeleteButton({ id, type, inboxType, email, label = "Delete" }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      let url = "";
      if (type === "documents") {
        url = `/api/documents?id=${id}`;
      } else if (type === "users") {
        url = `/api/users?id=${id}`;
      } else if (type === "inbox" && inboxType) {
        const params = new URLSearchParams({ type: inboxType });
        if (email) params.set("email", email);
        else params.set("id", String(id));
        url = `/api/inbox?${params.toString()}`;
      }

      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch {
      alert("Error deleting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={styles.trigger} onClick={() => setOpen(true)}>
        {label}
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Delete" size="sm">
        <div className={styles.body}>
          <p className={styles.message}>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className={styles.actions}>
            <button className={styles.cancel} onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </button>
            <button className={styles.confirm} onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
