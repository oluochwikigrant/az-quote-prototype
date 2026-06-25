import Menu from "@/components/menu/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.dashboard}>
      {/* LEFT */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logo.png" alt="logo" width={35} height={35} />
          Aztechnos
        </Link>
        <Menu />
      </aside>

      {/* RIGHT */}
      <div className={styles.content}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}
