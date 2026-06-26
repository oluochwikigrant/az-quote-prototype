"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import styles from "./ConfirmDelete.module.scss";

interface ConfirmDeleteProps {
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  trigger: React.ReactNode;
}

export default function ConfirmDelete({ title, message, onConfirm, trigger }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)} className={styles.trigger}>
        {trigger}
      </span>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={title} size="sm">
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <button className={styles.cancel} onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </button>
            <button className={styles.confirm} onClick={handleConfirm} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
