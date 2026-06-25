import { currentUser } from "@/lib/clerkServerMocks";
import Image from "next/image";
import styles from "./Navbar.module.scss";

import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
const Navbar = async () => {
  const user = await currentUser();

  const protocol =
    process.env.NODE_ENV === "production" ? "https://" : "http://";
  const host = process.env.NEXT_PUBLIC_BASE_URL || "localhost:3000";
  let notificationCount;
  try {
    const res = await fetch(`${protocol}${host}/api/notifications`, {
      // No-cache so that on each request you get fresh notifications:
      cache: "no-store",
      // Optionally forward cookies/headers if auth is cookie-based:
      headers: {
        // e.g. forwarding cookies if using cookie auth:
        // cookie: request.headers.get("cookie") || "",
      },
    });

    if (res.ok) {
      const data = await res.json();
      notificationCount =
        typeof data.notifications === "number" ? data.notifications : 0;
    } else {
      console.error(
        "Failed to fetch notification notifications",
        await res.text()
      );
    }
  } catch (err) {
    console.error("Error fetching notification notifications:", err);
  }

  return (
    <div className={styles.navbar}>
      {/* SEARCH BAR */}
      <div className={styles.searchBar}>
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
        />
      </div>
      {/* ICONS AND USER */}
      <div className={styles.iconsUserContainer}>
        <div className={styles.iconContainer}>
          <LuMessageCircleMore />
          <div className={styles.badge}>14</div>
        </div>
        <div className={styles.iconContainer}>
          <IoIosNotifications />
          <div className={styles.badge}>{notificationCount}</div>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>
            {user?.firstName as string} {user?.lastName as string}
          </span>
          <span className={styles.userRole}>
            {user?.publicMetadata?.role as string}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
