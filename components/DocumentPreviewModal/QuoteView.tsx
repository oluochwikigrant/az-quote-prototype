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

  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("doc");
    params.delete("quote");
    const newPath =
      window.location.pathname + (params.toString() ? `?${params}` : "");
    router.push(newPath, { scroll: false });
  };

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);

    fetch(`/api/sale_documents/view?id=${quoteID}`)
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const modal = document.getElementById("quote-modal");
      if (modal && !modal.contains(e.target as Node)) close();
    };
    if (isOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isOpen]);

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
