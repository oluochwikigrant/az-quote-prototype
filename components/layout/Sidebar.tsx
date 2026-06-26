"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  FilePlus,
  Send,
  Inbox,
  Phone,
  MessageSquare,
  Bell,
  Newspaper,
} from "lucide-react";
import styles from "./Sidebar.module.scss";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
  {
    label: "Documents",
    href: "#",
    icon: <FileText size={18} />,
    children: [
      { label: "New Quotation", href: "/documents/new/quotation", icon: <FilePlus size={16} /> },
      { label: "New Invoice", href: "/documents/new/invoice", icon: <FilePlus size={16} /> },
      { label: "New Receipt", href: "/documents/new/receipt", icon: <FilePlus size={16} /> },
      { label: "New Delivery Note", href: "/documents/new/delivery_note", icon: <FilePlus size={16} /> },
      { label: "Sent Quotations", href: "/documents/quotation", icon: <Send size={16} /> },
      { label: "Sent Invoices", href: "/documents/invoice", icon: <Send size={16} /> },
      { label: "Sent Receipts", href: "/documents/receipt", icon: <Send size={16} /> },
      { label: "Sent Delivery Notes", href: "/documents/delivery_note", icon: <Send size={16} /> },
    ],
  },
  {
    label: "Inbox",
    href: "#",
    icon: <Mail size={18} />,
    children: [
      { label: "Quotation Requests", href: "/inbox/quotation-requests", icon: <Inbox size={16} /> },
      { label: "Call Requests", href: "/inbox/call-requests", icon: <Phone size={16} /> },
      { label: "Reviews", href: "/inbox/reviews", icon: <MessageSquare size={16} /> },
      { label: "Subscriptions", href: "/inbox/subscriptions", icon: <Bell size={16} /> },
      { label: "Announcements", href: "/inbox/announcements", icon: <Newspaper size={16} /> },
    ],
  },
  { label: "Users", href: "/users", icon: <Users size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const isExpanded = expanded[item.label];

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            className={`${styles.navItem} ${active ? styles.active : ""} ${depth > 0 ? styles.child : ""}`}
            onClick={() => toggleGroup(item.label)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.chevron}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          </button>
          {isExpanded && (
            <div className={styles.children}>
              {item.children.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={`${styles.navItem} ${active ? styles.active : ""} ${depth > 0 ? styles.child : ""}`}
        onClick={() => setMobileOpen(false)}
      >
        <span className={styles.icon}>{item.icon}</span>
        <span className={styles.label}>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <Image src="/logo.png" alt="Aztechnos" width={32} height={32} />
          <span className={styles.brandName}>Aztechnos</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.user}>
            <div className={styles.avatar}>WO</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Wicklife Oluoch</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
