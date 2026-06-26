import PageHeader from "@/components/ui/PageHeader";
import styles from "./page.module.scss";

export default function NewUserPage() {
  return (
    <div>
      <PageHeader title="New User" subtitle="Create a new system user" />
      <div className={styles.formContainer}>
        <p className={styles.placeholder}>User creation form would go here.</p>
      </div>
    </div>
  );
}
