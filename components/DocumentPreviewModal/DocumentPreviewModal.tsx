// components\DocumentPreviewModal\DocumentPreviewModal.tsx

"use client";
import React, { FC, useEffect } from "react";
import Image from "next/image";
import useCompanyDetails from "@/hooks/useCompanyDetails";
import { QuoteData } from "../pdf_sales/documentDataType";
import styles from "./DocumentPreviewModal.module.scss";

export interface QuoteItem {
  no: number;
  description: string;
  qty: number;
  price: number;
  amount: number;
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  quote: QuoteData | null;
  onClose: () => void;
  onGenerate: () => void;
}

const DocumentPreviewModal: FC<DocumentPreviewModalProps> = ({
  isOpen,
  loading,
  error,
  quote,
  onClose,
  onGenerate,
}) => {
  // company data
  const { data: company } = useCompanyDetails();

  if (!isOpen) return null;
  if (loading) return <p>Loading...</p>;
  if (error || !quote || !company) return <p>Error loading quotation.</p>;

  const items: QuoteItem[] =
    quote.quoteItems?.map((qi, i) => {
      const qty = qi.quantity;
      const price = Number(qi.unitPrice);
      return {
        no: i + 1,
        description: qi.description,
        qty,
        price,
        amount: parseFloat((qty * price).toFixed(2)),
      };
    }) || [];

  const formatKES = (val: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(val);

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div id="quote-modal" className={styles.modal} tabIndex={-1}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className={styles.quote}>
          {/* Header */}
          <div className={styles.header}>
            <Image src="/logo.png" alt="" height={80} width={80} />
            <div className={styles.companyDetails}>
              <div className={styles.companyName}>{company.companyName}</div>
              <div>{company.physicalAddress}</div>
              <div>
                {company.primaryEmail}
                {company.secondaryEmail ? ` / ${company.secondaryEmail}` : ""}
              </div>
              <div>
                Tel: +254 {company.primaryPhone}
                {company.secondaryPhone ? ` / ${company.secondaryPhone}` : ""}
              </div>
            </div>
          </div>
          {/* Document Details */}
          <div className={styles.documentDetails}>
            <div className={styles.referenceNumber}>
              <span>QUOTATION REF:</span> {quote.quotation_number}
            </div>
            <div className={styles.date}>
              <span>DATE:</span>
              {new Date(quote.created_at).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "short", // <— “Jul” instead of “July”
                year: "numeric",
              })}
            </div>
            <Image src="/barcode.png" alt="" height={50} width={250} />
          </div>
          {/* Client Details */}
          <div className={styles.clientDetails}>
            <div className={styles.header}>To:</div>
            <div className={styles.name}>{quote.client_name}</div>
            <div className={styles.address}>{quote.client_address}</div>
            <div className={styles.contact}>{quote.client_contact}</div>
          </div>
          {/* Description */}
          <div className={styles.description}>
            <div className={styles.header}>Description:</div>
            <p>{quote.description}</p>
          </div>
          {/* Items Table */}
          <table className={styles.items}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Price (Ksh)</th>
                <th>Amount (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.no}>
                  <td>{i.no}</td>
                  <td>{i.description}</td>
                  <td>{i.qty}</td>
                  <td>{i.price.toFixed(2)}</td>
                  <td>{i.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className={styles.footerLabel}>
                  Sub‑total
                </td>
                <td>{quote.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className={styles.footerLabel}>
                  Labor
                </td>
                <td>{quote.labor?.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className={styles.footerLabel}>
                  Shipping / Handling
                </td>
                <td>{quote.shipping?.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className={styles.footerLabel}>
                  VAT ({(quote.tax_rate * 100).toFixed(1)}%)
                </td>
                <td>{quote.tax}</td>
              </tr>
              <tr>
                <td colSpan={4} className={styles.footerLabel}>
                  Grand Total
                </td>
                <td>{formatKES(quote.grandTotal)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Payment Details */}
          {quote.payment_account_enabled && quote.accountDetails && (
            <div className={styles.paymentDetails}>
              <div className={styles.paymentDetailsHeader}>PAYMENT METHOD</div>
              <table className={styles.paymentDetailsTable}>
                <tbody>
                  {quote.accountDetails.map((attr) => (
                    <tr key={attr.label} className={styles.paymentRecord}>
                      <td className={styles.paymentRecordLabel}>
                        {attr.label}
                      </td>
                      <td>: {attr.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className={styles.terms}>
            <h2>Terms & Conditions</h2>
            <p>{quote.terms_conditions}</p>
          </div>

          {/* Served By */}
          <div className={styles.servedBy}>
            <span>Served By:</span> {quote.served_by_name},
            {quote.served_by_position}
          </div>

          {/* Actions */}
          <div className={styles.actionButtons}>
            <button
              className={styles.createPDFbutton}
              onClick={onGenerate}
              disabled={loading}
            >
              Generate
            </button>
            <button
              className={`${styles.createPDFbutton} ${styles.cancelButton}`}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
