// export default AdminPage;
import styles from "./page.module.scss";
import Announcements from "@/components/Announcement";
import InboxCard from "@/components/InboxCard";

const AdminPage = async () => {
  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.leftContent}>
        <div className={styles.userCards}>
          <h2>Inbox</h2>
          <InboxCard type="callrequest" />
          <InboxCard type="quotation_request" />
          <InboxCard type="enquiry" />
          <InboxCard type="review" />
          <InboxCard type="subscription" />
        </div>

        <div className={styles.userCards}>
          <h2>Documents</h2>
          <InboxCard type="quotation" />
          <InboxCard type="invoice" />
          <InboxCard type="receipt" />
          <InboxCard type="delivery_note" />
        </div>
      </div>

      {/* RIGHT */}
      <Announcements />
    </div>
  );
};

export default AdminPage;
