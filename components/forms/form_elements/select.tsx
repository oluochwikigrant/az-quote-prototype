"use client";
import React, { forwardRef } from "react";
import {
  FieldError,
  UseFormRegister,
  Control,
  Controller,
} from "react-hook-form";
import classNames from "classnames";
import { FaCaretDown } from "react-icons/fa";
import styles from "./select.module.scss";

// A ref-forwarding wrapper for uncontrolled use-cases
const UncontrolledSelect = forwardRef<HTMLSelectElement, any>(
  ({ as: Component = "select", ...props }, ref) => (
    <Component ref={ref} {...props} />
  )
);

export type SelectFieldProps = {
  label?: string;
  // Option A: simple register for uncontrolled selects
  register?: UseFormRegister<any>;
  // Option B: Controller for controlled selects
  control?: Control<any>;
  name: string;
  id?: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

const SelectField = ({
  label,
  register,
  control,
  name,
  id,
  defaultValue,
  error,
  hidden,
  selectProps,
  options,
  icon = <FaCaretDown />,
  placeholder,
  disabled = false,
  required = false,
}: SelectFieldProps) => {
  return (
    <div
      className={classNames(styles.selectContainer, {
        [styles.hidden]: hidden,
      })}
    >
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={classNames(styles.selectWrapper, {
          [styles.selectWrapperError]: error,
        })}
      >
        {icon && <div className={styles.selectIcon}>{icon}</div>}

        {control ? (
          // Controlled mode via Controller :contentReference[oaicite:0]{index=0}
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ""}
            render={({ field }) => (
              <select
                id={id || name}
                {...field}
                className={styles.select}
                disabled={disabled}
                required={required}
                {...selectProps}
              >
                {placeholder && (
                  <option value="" disabled hidden>
                    {placeholder}
                  </option>
                )}
                {options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
        ) : (
          // Uncontrolled mode via register :contentReference[oaicite:1]{index=1}
          <UncontrolledSelect
            id={id || name}
            {...(register ? register(name) : {})}
            defaultValue={defaultValue}
            className={styles.select}
            disabled={disabled}
            required={required}
            {...selectProps}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </UncontrolledSelect>
        )}
      </div>

      {error?.message && (
        <p className={styles.error}>{error.message.toString()}</p>
      )}
    </div>
  );
};

export default SelectField;
