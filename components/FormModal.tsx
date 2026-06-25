// FormModal.tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "react-toastify";
import { deleteStudent } from "@/lib/actions";
import { FormContainerProps } from "./FormContainer";
import styles from "./FormModal.module.scss";

type Table = FormContainerProps["table"];
type DeleteAction = (
  currentState: any,
  data: FormData
) => Promise<{ success: boolean; error: boolean }>;

const deleteActionMap: Record<Table, DeleteAction> = {
  quotation_request: async () => {
    throw new Error("Not implemented.");
  },
  announcement: async () => {
    throw new Error("Not implemented.");
  },
  callrequest: function (
    currentState: any,
    data: FormData
  ): Promise<{ success: boolean; error: boolean }> {
    throw new Error("Function not implemented.");
  },
  review: function (
    currentState: any,
    data: FormData
  ): Promise<{ success: boolean; error: boolean }> {
    throw new Error("Function not implemented.");
  },
  subscribers: function (
    currentState: any,
    data: FormData
  ): Promise<{ success: boolean; error: boolean }> {
    throw new Error("Function not implemented.");
  },
};

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [K in Table]?: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  quotation_request: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // figure out button size & color classes
  const sizeClass = type === "create" ? styles.sizeCreate : styles.sizeDefault;
  const colorClass =
    type === "create"
      ? styles.bgCreate
      : type === "update"
      ? styles.bgUpdate
      : styles.bgDelete;

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    if (type === "delete" && id) {
      return (
        <form action={formAction} className={styles.form}>
          <input type="hidden" name="id" value={id} />
          <span className={styles.textCenter}>
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button type="submit" className={styles.deleteButton}>
            Delete
          </button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      return (
        forms[table]?.(setOpen, type, data, relatedData) ?? (
          <p>
            Form not found for <b>{table}</b>.
          </p>
        )
      );
    }

    return <p>Form not found!</p>;
  };

  return (
    <>
      <div
        className={[
          styles.actionButton,
          styles.sizeCreate,
          styles.bgCreate,
        ].join(" ")}
        onClick={() => setOpen(true)}
        aria-label={`${type} ${table}`}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </div>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <Form />
            <div
              className={styles.closeIcon}
              onClick={() => setOpen(false)}
              role="button"
              aria-label="Close modal"
            >
              <Image src="/close.png" alt="close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
