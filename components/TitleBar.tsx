import React from "react";
import styles from "./Title.module.scss";
import FormContainer from "@/components/FormContainer";
import TableSearch from "./TableSearch";
import { IoFilterCircleOutline } from "react-icons/io5";

interface titleBarProps {
  title: string;
}

const TitleBar = ({ title }: titleBarProps) => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.toolbar}>
        <TableSearch />
        <div className={styles.iconGroup}>
          <IoFilterCircleOutline
            className={styles.iconBtn}
            aria-label="Filter"
          />
          <FormContainer table="quotation_request" type="create" />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
