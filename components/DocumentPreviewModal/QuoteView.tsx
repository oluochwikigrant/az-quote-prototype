// File: components/QuoteView.tsx
"use client";

import React, { FC, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuoteData } from "../pdf_sales/documentDataType";
import DocumentPreviewModal from "./DocumentPreviewModal";

interface QuoteViewProps {
  isOpen: boolean;
  quoteID: number;
}

const QuoteView: FC<QuoteViewProps> = ({ isOpen, quoteID }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // quote data + loading/error
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    // remove ?quote= from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("quote");
    const newPath =
      window.location.pathname + (params.toString() ? `?${params}` : "");
    router.push(newPath, { scroll: false });
  };

  // fetch when opened
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);

    fetch(`/api/view_quotation?id=${quoteID}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || res.statusText);
        }
        return json.Quote as QuoteData;
      })
      .then(setQuote)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen, quoteID]);

  // ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // click‑outside closes
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const modal = document.getElementById("quote-modal");
      if (modal && !modal.contains(e.target as Node)) close();
    };
    if (isOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isOpen]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <DocumentPreviewModal
      isOpen={isOpen}
      loading={loading}
      error={error}
      quote={quote}
      onClose={close}
      onGenerate={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
};

export default QuoteView;
