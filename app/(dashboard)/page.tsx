// export default AdminPage;
import styles from "./page.module.scss";
import Announcements from "@/components/Announcement";
import InboxCard from "@/components/InboxCard";

const AdminPage = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  // const searchParams = await props.searchParams;
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
      </div>

      {/* RIGHT */}
      <Announcements />
    </div>
  );
};

export default AdminPage;
