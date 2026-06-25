import React from "react";
import styles from "./page.module.scss";
import POSForm from "@/components/forms/POSForm/POSForm";

const QuotationPage: React.FC = () => {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1>New Invoice</h1>
      </div>
      <POSForm docName="Receipt" docType="invoice" />
    </main>
  );
};

export default QuotationPage;
