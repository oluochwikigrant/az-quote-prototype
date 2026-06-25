// components/forms/POSForm/TermsAndConditions.tsx

"use client";

import React from "react";
import { Controller, useWatch } from "react-hook-form";
import InputField from "@/components/forms/form_elements/input";
import styles from "./TermsAndConditions.module.scss";
import { TermsAndConditionsProps } from "./POSFormDataTypes";

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  register,
  control,
  errors,
}) => {
  // ── Watch the "useCustomTerms" boolean so we know when to render the textarea
  const useCustom = useWatch({
    control,
    name: "useCustomTerms",
    defaultValue: false,
  });

  return (
    <fieldset>
      <legend>Terms &amp; Conditions</legend>

      {/* ── 1) Radio buttons for “useCustomTerms” ────────────────────────────── */}
      <div className={styles.radioGroup}>
        <Controller
          name="useCustomTerms"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <>
              <label>
                <input
                  type="radio"
                  checked={!field.value}
                  onChange={() => field.onChange(false)}
                />
                Default
              </label>
              <label>
                <input
                  type="radio"
                  checked={field.value}
                  onChange={() => field.onChange(true)}
                />
                Custom
              </label>
            </>
          )}
        />
      </div>
      {errors?.useCustomTerms && (
        <p style={{ color: "red", marginTop: "0.25rem" }}>
          {errors.useCustomTerms.message}
        </p>
      )}

      {/* ── 2) Only show "customConditions" textarea when “Custom” is selected ── */}
      {useCustom && (
        <InputField
          label="Custom Terms"
          name="customConditions"
          type="textarea"
          rows={4}
          register={register}
          defaultValue=""
          error={errors?.customConditions}
          inputProps={{
            required: true,
            id: "customConditions",
            placeholder: "Enter custom terms here…",
          }}
        />
      )}
    </fieldset>
  );
};

export default TermsAndConditions;
