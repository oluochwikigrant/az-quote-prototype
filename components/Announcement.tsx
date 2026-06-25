// Announcement.tsx
import { announcements } from "@/lib/dummyData";
import styles from "./Announcement.module.scss";

const Announcements = async () => {
  const role = "admin";

  const data = announcements.slice(0, 3);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Announcements</div>
        <button className={styles.viewAll}>View All</button>
      </div>
      <div className={styles.announcementWrapper}>
        {data.map((ann, idx) => (
          <div key={ann.id} className={styles.announcement}>
            <div className={styles.announcementHeader}>
              <div className={styles.announcementTitle}>{ann.title}</div>
              <div className={styles.date}>
                {new Intl.DateTimeFormat("en-GB").format(ann.date)}
              </div>
            </div>
            <p className={styles.description}>{ann.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
