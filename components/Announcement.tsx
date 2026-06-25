// Announcement.tsx
import prisma from "@/lib/prisma";
import styles from "./Announcement.module.scss";

const Announcements = async () => {
  // ------------------------------------------------------ const { userId, sessionClaims } = auth();
  const role = "admin";

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    // where: {
    //   ...(role !== "admin" && {
    //     OR: [{ classId: null }],
    //   }),
    // },
  });

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
