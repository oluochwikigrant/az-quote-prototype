"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import styles from "./page.module.scss";
import InputField from "@/components/forms/form_elements/input";
import SelectField from "@/components/forms/form_elements/select";
import GenerateRandomPassword from "@/components/generateRandomPassword";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  role: string;
  password: string;
}

interface ClerkError {
  code: string;
  message: string;
  longMessage: string;
  meta?: {
    paramName?: string;
  };
}

export default function CreateUserForm() {
  const clerkParamToField: Record<string, keyof FormState> = {
    email_address: "email",
    first_name: "firstName",
    last_name: "lastName",
    username: "username",
    password: "password",
  };

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormState>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      role: "",
      password: GenerateRandomPassword(),
    },
  });

  const onSubmit: SubmitHandler<FormState> = async (data) => {
    try {
      const res = await fetch("/api/create_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        const clerkErrors: ClerkError[] = body.errors || [];

        clerkErrors.forEach((err) => {
          // Try to map Clerk’s paramName to your form field
          const mappedField = err.meta?.paramName
            ? clerkParamToField[err.meta.paramName]
            : undefined;

          const fieldName =
            mappedField ??
            (err.code === "email_already_exists" ? "email" : undefined);

          if (fieldName) {
            setError(fieldName, {
              type: err.code,
              message: err.longMessage || err.message,
            });
          } else {
            // Fallback to a form‐level error on firstName
            setError("firstName", {
              type: "server",
              message: err.longMessage || err.message,
            });
          }
        });

        return; // skip success flow
      }

      // Success: revalidate cache and navigate
      router.refresh();
      router.push("/user/all-users");
    } catch (e: any) {
      // Network or unexpected error
      setError("firstName", {
        type: "network",
        message: "Unexpected error – please try again.",
      } as FieldError);
      console.error("CreateUserForm error:", e);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Create New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <InputField
          label="First Name"
          type="text"
          name="firstName"
          placeholder="First Name"
          register={register}
          error={errors.firstName}
          required
        />
        <InputField
          label="Last Name"
          type="text"
          name="lastName"
          placeholder="Last Name"
          register={register}
          error={errors.lastName}
          required
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
          required
        />
        <InputField
          label="Username"
          type="text"
          name="username"
          placeholder="Username"
          register={register}
          error={errors.username}
        />
        <SelectField
          name="role"
          // label="Position"
          options={[
            { value: "admin", label: "Director" },
            { value: "admin", label: "C.E.O" },
            { value: "user", label: "HR" },
            { value: "sales", label: "Sales & Marketing" },
            { value: "sales", label: "Accountant" },
          ]}
          placeholder="Position"
          register={register}
        />

        <SelectField
          name="role"
          // label="System Role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
            { value: "sales", label: "Sales" },
          ]}
          placeholder="System Role"
          register={register}
        />

        <InputField
          label="Passport Photo (150 x 150)px"
          type="file"
          name="image"
          register={register}
          // error={errors.password}
          required={false}
        />

        <InputField
          label="Signature; (75 x 150)px, Transparent Background"
          type="file"
          name="image"
          placeholder="Password"
          register={register}
          // error={errors.password}
          required={false}
        />

        <InputField
          label="Password (System Generated)"
          type="password"
          name="password"
          placeholder="Password"
          register={register}
          error={errors.password}
          disabled={true}
          required
        />
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
