import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { DocumentType } from "@/types";
import styles from "./page.module.scss";

const validTypes: DocumentType[] = ["quotation", "invoice", "receipt", "delivery_note"];

const labels: Record<DocumentType, string> = {
  quotation: "Quotation",
  invoice: "Invoice",
  receipt: "Receipt",
  delivery_note: "Delivery Note",
};

interface Props {
  params: Promise<{ type: string; id: string }>;
}

export default async function DocumentDetailPage({ params }: Props) {
  const { type, id } = await params;

  if (!validTypes.includes(type as DocumentType)) {
    notFound();
  }

  const docType = type as DocumentType;

  const host = (await headers()).get("host")!;
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/documents/view?id=${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const { data } = await res.json();

  const subtotal = data.items.reduce((sum: number, it: any) => sum + it.quantity * it.unitPrice, 0);
  const labor = data.labor || 0;
  const shipping = data.shipping || 0;
  const vatBase = subtotal + labor + shipping;
  const tax = data.taxType === "exclusive" ? vatBase * data.taxRate : 0;
  const grandTotal = data.taxType === "exclusive" ? vatBase + tax : vatBase;

  return (
    <div>
      <PageHeader title={`${labels[docType]} ${data.number}`} />

      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h2>{data.description}</h2>
            <Badge variant={data.type === "quotation" ? "info" : data.type === "invoice" ? "success" : data.type === "receipt" ? "warning" : "default"}>
              {data.type}
            </Badge>
          </div>
          <span className={styles.date}>
            {new Date(data.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        <div className={styles.section}>
          <h4>Client</h4>
          <p><strong>{data.clientName}</strong></p>
          {data.clientAddress && <p>{data.clientAddress}</p>}
          <p>{data.clientContact}</p>
        </div>

        <div className={styles.section}>
          <h4>Items</h4>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((it: any) => (
                <tr key={it.id}>
                  <td>{it.description}</td>
                  <td>{it.quantity}</td>
                  <td>KES {it.unitPrice.toLocaleString()}</td>
                  <td>KES {(it.quantity * it.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          {labor > 0 && (
            <div className={styles.summaryRow}>
              <span>Labor</span>
              <span>KES {labor.toLocaleString()}</span>
            </div>
          )}
          {shipping > 0 && (
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>KES {shipping.toLocaleString()}</span>
            </div>
          )}
          {data.taxType === "exclusive" && (
            <div className={styles.summaryRow}>
              <span>Tax ({(data.taxRate * 100).toFixed(0)}%)</span>
              <span>KES {tax.toLocaleString()}</span>
            </div>
          )}
          <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
            <span>Grand Total</span>
            <span>KES {grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {data.paymentEnabled && data.account && (
          <div className={styles.section}>
            <h4>Payment Details</h4>
            <div className={styles.paymentGrid}>
              <div><span>Method:</span> {data.account.method}</div>
              <div><span>Bank:</span> {data.account.bankName || "N/A"}</div>
              <div><span>Account Name:</span> {data.account.accountName || "N/A"}</div>
              <div><span>Account Number:</span> {data.account.accountNumber || "N/A"}</div>
              {data.account.businessNumber && <div><span>Business No:</span> {data.account.businessNumber}</div>}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h4>Terms & Conditions</h4>
          <p className={styles.terms}>{data.terms}</p>
        </div>

        <div className={styles.footer}>
          <p>Served by: <strong>{data.servedByName}</strong> — {data.servedByPosition}</p>
        </div>
      </div>
    </div>
  );
}
