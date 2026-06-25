"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import styles from "./TableSearch.module.scss";

const TableSearch: React.FC = () => {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FaSearch className={styles.icon} />
      <input type="text" placeholder="Search..." className={styles.input} />
    </form>
  );
};

export default TableSearch;
