"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.scss";

type User = {
  user_id: string;
  email: string;
  fisrtName: string;
  lastName: string;
  phone?: string;
  signature?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});

  // Fetch profile on mount
  useEffect(() => {
    fetch("/api/profile_api")
      .then(async (res) => {
        if (res.ok) return res.json();
        if (res.status === 401) throw new Error("Please log in.");
        if (res.status === 404) throw new Error("Profile not found.");
        throw new Error("Unexpected error");
      })
      .then((u: User) => {
        setUser(u);
        setForm({
          fisrtName: u.fisrtName,
          lastName: u.lastName,
          phone: u.phone,
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleChange =
    (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const save = async () => {
    try {
      const res = await fetch("/api/profile_api", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      const updated: User = await res.json();
      setUser(updated);
      setEditMode(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error)
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
      </div>
    );
  if (!user) return <p>Loading profile…</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <Image
            src={user.signature || "/noAvatar.png"}
            alt={`${user.fisrtName} ${user.lastName}`}
            width={120}
            height={120}
            className={styles.img}
          />
        </div>
        <div className={styles.details}>
          {editMode ? (
            <>
              {["fisrtName", "lastName", "phone"].map((field) => (
                <div key={field} className={styles.field}>
                  <label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    value={(form as any)[field] || ""}
                    onChange={handleChange(field as keyof User)}
                  />
                </div>
              ))}
              <div className={styles.buttons}>
                <button onClick={save} className={styles.saveBtn}>
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setForm({
                      fisrtName: user.fisrtName,
                      lastName: user.lastName,
                      phone: user.phone,
                    });
                  }}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>
                {user.fisrtName} {user.lastName}
              </h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "-"}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className={styles.editBtn}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
