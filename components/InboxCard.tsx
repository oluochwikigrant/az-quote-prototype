// components/InboxCard.tsx
import {
  callRequests,
  reviews,
  subscribers,
  enquiries,
  quotationRequests,
} from "@/lib/dummyData";
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
  const countMap: Record<typeof type, number> = {
    quotation_request: quotationRequests.length,
    callrequest: callRequests.length,
    review: reviews.length,
    subscription: subscribers.length,
    enquiry: enquiries.length,
  };

  const data = countMap[type];

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
