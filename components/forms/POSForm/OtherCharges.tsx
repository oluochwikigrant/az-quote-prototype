"use client";

import React from "react";
import { Controller } from "react-hook-form";
import InputField from "@/components/forms/form_elements/input";
import SelectField from "@/components/forms/form_elements/select";
import { OtherChargesProps } from "./POSFormDataTypes";
import { FaDollarSign } from "react-icons/fa";

const OtherCharges: React.FC<OtherChargesProps> = ({
  register,
  control,
  errors,
}) => {
  return (
    <fieldset>
      <legend>Other Charges</legend>
      <div className="inline_form_elements_container">
        {/* ── 1) LABOR ──────────────────────────────────────────────────────────────── */}
        <InputField
          label="Labor (KSh.)"
          name="labor"
          icon={<FaDollarSign />}
          type="number"
          placeholder="Labor (KSh.)"
          register={register}
          error={errors?.labor}
          inputProps={{
            id: "labor",
            min: 0,
          }}
        />

        {/* ── 2) SHIPPING ───────────────────────────────────────────────────────────── */}
        <InputField
          label="Shipping & Handling (KSh.)"
          name="shipping"
          icon={<FaDollarSign />}
          type="number"
          placeholder="Shipping & Handling (KSh.)"
          register={register}
          error={errors?.shipping}
          inputProps={{
            id: "shipping",
            min: 0,
          }}
        />
      </div>

      {/* ── 3) TAX RATE ───────────────────────────────────────────────────────────── */}
      <Controller
        name="taxType"
        control={control}
        render={({ field }) => (
          <>
            <SelectField
              name="taxType"
              label="Tax Rate"
              options={[
                { value: "", label: "Tax Rate" },
                { value: "exclusive", label: "V.A.T (16%)" },
                { value: "inclusive", label: "Inclusive — (16%)" },
                { value: "nill", label: "Nill" },
              ]}
              error={errors?.taxType}
              selectProps={{
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  field.onChange(e.target.value),
                required: true,
                name: "taxType",
                value: field.value,
              }}
            />
          </>
        )}
      />
    </fieldset>
  );
};

export default OtherCharges;
