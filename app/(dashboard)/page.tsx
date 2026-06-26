import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import { getStats } from "@/lib/data/store";
import styles from "./page.module.scss";

export default async function DashboardPage() {
  const stats = getStats();

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your business" />

      <div className={styles.grid}>
        <StatCard label="Quotations" count={stats.quotations} href="/documents/quotation" variant="dark" />
        <StatCard label="Invoices" count={stats.invoices} href="/documents/invoice" variant="blue" />
        <StatCard label="Receipts" count={stats.receipts} href="/documents/receipt" variant="green" />
        <StatCard label="Delivery Notes" count={stats.deliveryNotes} href="/documents/delivery_note" variant="amber" />
        <StatCard label="Quotation Requests" count={stats.quotationRequests} href="/inbox/quotation-requests" variant="rose" />
        <StatCard label="Call Requests" count={stats.callRequests} href="/inbox/call-requests" variant="dark" />
        <StatCard label="Reviews" count={stats.reviews} href="/inbox/reviews" variant="blue" />
        <StatCard label="Subscribers" count={stats.subscribers} href="/inbox/subscriptions" variant="green" />
      </div>
    </div>
  );
}
