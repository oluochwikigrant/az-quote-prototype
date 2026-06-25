import React from "react";
import styles from "./Table.module.scss";

type Column = {
  header: string;
  accessor: string;
  hideOnMobile?: string;
};

interface TableProps {
  columns: Column[];
  renderRow: (item: any, idx: number) => React.ReactNode;
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, renderRow, data }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          {columns.map((col) => (
            <th key={col.accessor} className={col.hideOnMobile}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item, idx) => renderRow(item, idx))}</tbody>
    </table>
  );
};

export default Table;
