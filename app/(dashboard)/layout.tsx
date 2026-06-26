import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
