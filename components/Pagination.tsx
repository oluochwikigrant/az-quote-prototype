// components\Pagination.tsx

"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";
import styles from "./Pagination.module.scss";

type Props = {
  page: number;
  count: number;
};

const Pagination = ({ page, count }: Props) => {
  const router = useRouter();

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => changePage(page - 1)}
        disabled={!hasPrev}
        className={`
          ${styles.btn}
          ${styles.navBtn}
          ${!hasPrev ? styles.disabled : ""}
        `}
      >
        Prev
      </button>

      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, i) => {
          const pageIndex = i + 1;
          return (
            <button
              key={pageIndex}
              onClick={() => changePage(pageIndex)}
              className={`
                ${styles.pageBtn}
                ${page === pageIndex ? styles.active : ""}
              `}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => changePage(page + 1)}
        disabled={!hasNext}
        className={`
          ${styles.btn}
          ${styles.navBtn}
          ${!hasNext ? styles.disabled : ""}
        `}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
