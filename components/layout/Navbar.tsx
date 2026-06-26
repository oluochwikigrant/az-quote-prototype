"use client";

import React from "react";
import { Bell, Search } from "lucide-react";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.search}>
        <Search size={16} className={styles.searchIcon} />
        <input type="text" placeholder="Search..." className={styles.searchInput} />
      </div>
      <div className={styles.actions}>
        <button className={styles.iconButton}>
          <Bell size={18} />
          <span className={styles.badge}>3</span>
        </button>
      </div>
    </header>
  );
}
