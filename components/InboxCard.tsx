// components/InboxCard.tsx
import prisma from "@/lib/prisma";
import { MdOutlineMoreHoriz } from "react-icons/md";
import styles from "./InboxCard.module.scss";

const InboxCard = async ({
  type,
}: {
  type:
    | "callrequest"
    | "review"
    | "subscription"
    | "enquiry"
    | "quotation_request";
}) => {
  const modelMap: Record<typeof type, any> = {
    quotation_request: prisma.quotation_request,
    callrequest: prisma.callrequest,
    review: prisma.review,
    subscription: prisma.subscribers,
    enquiry: prisma.enquiry,
  };

  const data = await modelMap[type].count();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.year}>2024/25</span>
        <MdOutlineMoreHoriz className={styles.moreIcon} />
      </div>
      <div className={styles.count}>{data}</div>
      <div className={styles.label}>{type}</div>
    </div>
  );
};

export default InboxCard;
