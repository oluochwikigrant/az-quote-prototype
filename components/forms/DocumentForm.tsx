"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DocumentForm.module.scss";

interface Service {
  id: number;
  name: string;
}

interface PayableAccount {
  id: number;
  displayName: string;
  method: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  businessNumber: string | null;
  buyGoodsNumber: string | null;
}

interface DocumentFormProps {
  docType: string;
  docName: string;
  services: Service[];
  payableAccounts: PayableAccount[];
}

interface FormItem {
  description: string;
  quantity: string;
  unitPrice: string;
}

export default function DocumentForm({ docType, docName, services, payableAccounts }: DocumentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [items, setItems] = useState<FormItem[]>([{ description: "", quantity: "1", unitPrice: "" }]);
  const [labor, setLabor] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [taxType, setTaxType] = useState<"inclusive" | "exclusive" | "nill">("exclusive");
  const [taxRate, setTaxRate] = useState("0.16");
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [paymentAccountId, setPaymentAccountId] = useState("");
  const [terms, setTerms] = useState("");

  const addItem = () => setItems([...items, { description: "", quantity: "1", unitPrice: "" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof FormItem, value: string) => {
    const next = [...items];
    next[idx][field] = value;
    setItems(next);
  };

  const subtotal = items.reduce((sum, it) => {
    const q = parseFloat(it.quantity) || 0;
    const p = parseFloat(it.unitPrice) || 0;
    return sum + q * p;
  }, 0);

  const laborVal = parseFloat(labor) || 0;
  const shippingVal = parseFloat(shipping) || 0;
  const rate = parseFloat(taxRate) || 0;
  const vatBase = subtotal + laborVal + shippingVal;
  const tax = taxType === "exclusive" ? vatBase * rate : 0;
  const grandTotal = taxType === "exclusive" ? vatBase + tax : vatBase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        type: docType,
        description,
        clientName,
        clientAddress: clientAddress || null,
        clientContact,
        labor: laborVal,
        shipping: shippingVal,
        taxType,
        taxRate: rate,
        terms: terms || getDefaultTerms(docType),
        paymentEnabled,
        paymentAccountId: paymentEnabled ? (parseInt(paymentAccountId) || null) : null,
        servedByName: "Wicklife Oluoch",
        servedByPosition: "Managing Director",
        servedBySignature: "",
        items: items
          .filter((it) => it.description.trim())
          .map((it) => ({
            description: it.description,
            quantity: parseFloat(it.quantity) || 0,
            unitPrice: parseFloat(it.unitPrice) || 0,
          })),
      };

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create document");

      router.push(`/documents/${docType}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.section}>
        <h3>Service & Description</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)} required>
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`${docName} description`}
              required
              maxLength={70}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Client Details</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Client Name</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>Contact</label>
            <input type="text" value={clientContact} onChange={(e) => setClientContact(e.target.value)} required />
          </div>
        </div>
        <div className={styles.field}>
          <label>Address</label>
          <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Items</h3>
        {items.map((item, idx) => (
          <div key={idx} className={styles.itemRow}>
            <div className={styles.field} style={{ flex: 2 }}>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
                placeholder="Item description"
                required
              />
            </div>
            <div className={styles.field} style={{ flex: 0.5 }}>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                min="1"
                required
              />
            </div>
            <div className={styles.field} style={{ flex: 0.8 }}>
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                placeholder="Unit price"
                min="0"
                required
              />
            </div>
            <div className={styles.itemTotal}>
              KES {((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toLocaleString()}
            </div>
            {items.length > 1 && (
              <button type="button" className={styles.removeBtn} onClick={() => removeItem(idx)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className={styles.addBtn} onClick={addItem}>
          + Add Item
        </button>
      </section>

      <section className={styles.section}>
        <h3>Charges & Tax</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Labor (KES)</label>
            <input type="number" value={labor} onChange={(e) => setLabor(e.target.value)} min="0" />
          </div>
          <div className={styles.field}>
            <label>Shipping (KES)</label>
            <input type="number" value={shipping} onChange={(e) => setShipping(e.target.value)} min="0" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Tax Type</label>
            <select value={taxType} onChange={(e) => setTaxType(e.target.value as any)}>
              <option value="exclusive">Exclusive (VAT added)</option>
              <option value="inclusive">Inclusive (VAT included)</option>
              <option value="nill">Tax Free</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Tax Rate</label>
            <select value={taxRate} onChange={(e) => setTaxRate(e.target.value)}>
              <option value="0.16">16% VAT</option>
              <option value="0">0%</option>
            </select>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Payment Account</h3>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={paymentEnabled}
            onChange={(e) => {
              setPaymentEnabled(e.target.checked);
              if (!e.target.checked) setPaymentAccountId("");
            }}
          />
          Include payment account details
        </label>
        {paymentEnabled && (
          <div className={styles.field}>
            <label>Payment Account</label>
            <select value={paymentAccountId} onChange={(e) => setPaymentAccountId(e.target.value)} required={paymentEnabled}>
              <option value="">Select account</option>
              {payableAccounts.map((a) => (
                <option key={a.id} value={a.id}>{a.displayName} ({a.method})</option>
              ))}
            </select>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h3>Terms & Conditions</h3>
        <div className={styles.field}>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Enter terms and conditions..."
            rows={3}
            defaultValue={getDefaultTerms(docType)}
          />
        </div>
      </section>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>KES {subtotal.toLocaleString()}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Labor</span>
          <span>KES {laborVal.toLocaleString()}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping</span>
          <span>KES {shippingVal.toLocaleString()}</span>
        </div>
        {taxType === "exclusive" && (
          <div className={styles.summaryRow}>
            <span>Tax ({(rate * 100).toFixed(0)}%)</span>
            <span>KES {tax.toLocaleString()}</span>
          </div>
        )}
        <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
          <span>Grand Total</span>
          <span>KES {grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Creating..." : `Create ${docName}`}
        </button>
      </div>
    </form>
  );
}

function getDefaultTerms(type: string): string {
  const map: Record<string, string> = {
    quotation: "Payment within 30 days. Quotation valid for 90 days from date of issue.",
    invoice: "Payment due within 14 days of invoice date.",
    receipt: "Paid in full. Goods/services received.",
    delivery_note: "Goods delivered as per order. Please verify contents upon receipt.",
  };
  return map[type] || "";
}
