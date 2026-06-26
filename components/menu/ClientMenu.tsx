// app/components/ClientMenu.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsChevronRight } from "react-icons/bs";
import styles from "./ClientMenu.module.scss";

interface Props {
  role: string;
}

const menuItems = [
  {
    title: "ADMIN",
    items: [
      {
        icon: "/home.png",
        label: "Create User",
        href: "/user/create",
        visible: ["admin"],
      },
      {
        icon: "/home.png",
        label: "All Users",
        href: "/user/all-users",
        visible: ["admin"],
      },
    ],
  },

  {
    title: "INBOX",
    items: [
      {
        icon: "/home.png",
        label: "Quotations",
        href: "/inbox/quotation-requests",
        visible: ["admin"],
      },
      {
        icon: "/announcement.png",
        label: "Call Request",
        href: "/inbox/call-requests",
        visible: ["admin"],
      },
      {
        icon: "/exam.png",
        label: "Reviews",
        href: "/inbox/reviews",
        visible: ["admin"],
      },
      {
        icon: "/teacher.png",
        label: "Subscriptions",
        href: "/inbox/subscriptions",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/teacher.png",
        label: "Announcements",
        href: "/inbox/announcements",
        visible: ["admin", "teacher"],
      },
    ],
  },

  {
    title: "SENT",
    items: [
      {
        icon: "/profile.png",
        label: "Quotations",
        href: "/sent/quotation",
        visible: ["admin"],
      },
      {
        icon: "/setting.png",
        label: "Invoices",
        href: "/sent/invoice",
        visible: ["admin"],
      },
      {
        icon: "/setting.png",
        label: "Receipts",
        href: "/sent/receipt",
        visible: ["admin"],
      },
      {
        icon: "/setting.png",
        label: "Delivery Notes",
        href: "/sent/delivery_note",
        visible: ["admin"],
      },
    ],
  },

  {
    title: "NEW",
    items: [
      {
        icon: "/profile.png",
        label: "Quotation",
        href: "/new/quotation",
        visible: ["admin"],
      },
      {
        icon: "/setting.png",
        label: "Invoice",
        href: "/new/invoice",
        visible: ["admin"],
      },
      {
        icon: "/setting.png",
        label: "Receipt",
        href: "/new/receipt",
        visible: ["admin"],
      },
      {
        icon: "/setting.png",
        label: "Delivery Note",
        href: "/new/delivery_note",
        visible: ["admin"],
      },
    ],
  },

  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin"],
      },
    ],
  },
];

const ClientMenu: React.FC<Props> = ({ role }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className={styles.menu}>
      {menuItems.map((group) => {
        const isActive = expanded === group.title;

        return (
          <div key={group.title} className={styles.menuGroup}>
            <div
              className={[
                styles.menuGroupTitle,
                isActive ? styles.menuGroupTitleActive : "",
              ].join(" ")}
              onClick={() => setExpanded(isActive ? null : group.title)}
            >
              {group.title}
              <BsChevronRight
                style={{
                  transform: isActive ? "rotate(90deg)" : "none",
                  transition: "all 0.3s",
                }}
              />
            </div>

            {isActive &&
              group.items.map((item) =>
                item.visible.includes(role) ? (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={styles.menuItem}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                    <div>{item.label}</div>
                  </Link>
                ) : null
              )}
          </div>
        );
      })}
    </div>
  );
};

export default ClientMenu;
