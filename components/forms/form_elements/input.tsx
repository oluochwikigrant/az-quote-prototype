//--components\forms\form_elements\input.tsx

"use client";
import React, { forwardRef } from "react";
import {
  FieldError,
  UseFormRegister,
  Control,
  Controller,
} from "react-hook-form";
import classNames from "classnames";
import {
  FaEnvelope,
  FaFileAlt,
  FaImage,
  FaLock,
  FaSearch,
  FaPhone,
  FaFont,
  FaClock,
  FaLink,
  FaHashtag,
  FaRegCalendarAlt,
  FaPencilAlt,
} from "react-icons/fa";
import { BiPalette } from "react-icons/bi";
import styles from "./input.module.scss";

export type InputFieldProps = {
  label?: string;
  type?: string;
  rows?: number;
  // Option A: simple register for uncontrolled inputs
  register?: UseFormRegister<any>;
  // Option B: Controller for controlled inputs
  control?: Control<any>;
  name: string;
  id?: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement
  >;
  icon?: React.ReactNode;
  datalistOptions?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
};

// Wrap to forward ref for register()
const UncontrolledInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  any
>(({ as: Component = "input", ...props }, ref) => (
  <Component ref={ref} {...props} />
));

const InputField = ({
  label,
  type = "text",
  register,
  control,
  name,
  id,
  defaultValue,
  error,
  hidden,
  inputProps,
  icon,
  rows = 5,
  datalistOptions,
  placeholder,
  required = false,
  disabled = false,
  maxLength = 1000,
  minLength = 0,
}: InputFieldProps) => {
  const datalistId = datalistOptions ? `${name}-datalist` : undefined;

  const getDefaultIcon = (inputType: string) => {
    switch (inputType) {
      case "color":
        return <BiPalette />;
      case "date":
      case "datetime-local":
      case "month":
      case "week":
        return <FaRegCalendarAlt />;
      case "email":
        return <FaEnvelope />;
      case "file":
        return <FaFileAlt />;
      case "image":
        return <FaImage />;
      case "number":
        return <FaHashtag />;
      case "password":
        return <FaLock />;
      case "search":
        return <FaSearch />;
      case "tel":
        return <FaPhone />;
      case "text":
        return <FaFont />;
      case "time":
        return <FaClock />;
      case "url":
        return <FaLink />;
      case "textarea":
        return <FaPencilAlt />;
      default:
        return null;
    }
  };
  const displayIcon = icon || getDefaultIcon(type);

  return (
    <div className={classNames(styles.container, { [styles.hidden]: hidden })}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={classNames(styles.inputWrapper, {
          [styles.inputWrapperError]: error,
        })}
      >
        {displayIcon && <div className={styles.icon}>{displayIcon}</div>}

        {control ? (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ""}
            render={({ field }) =>
              type === "textarea" ? (
                <textarea
                  id={id}
                  {...field}
                  className={styles.input}
                  rows={rows}
                  placeholder={placeholder}
                  required={required}
                  disabled={disabled}
                  maxLength={maxLength}
                  minLength={minLength}
                  {...inputProps}
                />
              ) : (
                <input
                  id={id}
                  type={type}
                  {...field}
                  list={datalistId}
                  className={styles.input}
                  placeholder={placeholder}
                  required={required}
                  disabled={disabled}
                  maxLength={maxLength}
                  minLength={minLength}
                  {...inputProps}
                />
              )
            }
          />
        ) : (
          // Fallback to register() for simple use-cases
          <>
            {type === "textarea" ? (
              <UncontrolledInput
                as="textarea"
                id={id}
                {...(register ? register(name) : {})}
                defaultValue={defaultValue}
                className={styles.input}
                rows={rows}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                minLength={minLength}
                {...inputProps}
              />
            ) : (
              <UncontrolledInput
                as="input"
                id={id}
                type={type}
                {...(register ? register(name) : {})}
                defaultValue={defaultValue}
                list={datalistId}
                className={styles.input}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                minLength={minLength}
                {...inputProps}
              />
            )}
          </>
        )}
      </div>

      {error?.message && (
        <p className={styles.error}>{error.message.toString()}</p>
      )}

      {datalistOptions && type !== "textarea" && (
        <datalist id={datalistId}>
          {datalistOptions.map((opt, idx) => (
            <option key={idx} value={opt} />
          ))}
        </datalist>
      )}
    </div>
  );
};

export default InputField;
