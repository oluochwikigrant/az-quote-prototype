// components/forms/POSForm/AccountPayable.tsx

"use client";

import React from "react";
import SelectField from "@/components/forms/form_elements/select";
import { AccountPayableProps } from "./POSFormDataTypes";
import styles from "./AccountPayable.module.scss";

import { Controller, useWatch } from "react-hook-form";

const AccountPayable: React.FC<AccountPayableProps> = ({
  register,
  control,
  errors,
  accountOptions,
}) => {
  // Observe paymentAccountEnabled from form state
  const paymentAccountEnabled = useWatch({
    control,
    name: "paymentAccountEnabled",
  });

  return (
    <fieldset>
      <legend>Account Payable</legend>
      <div className={styles.accountWrapper}>
        <label>
          <input type="checkbox" {...register("paymentAccountEnabled")} />
          {paymentAccountEnabled ? (
            <p style={{ color: "red" }}>Disable</p>
          ) : (
            <p style={{ color: "green" }}>Enable</p>
          )}
        </label>
        {errors?.paymentAccountEnabled && (
          <p style={{ color: "red", marginTop: "0.25rem" }}>
            {errors.paymentAccountEnabled.message}
          </p>
        )}

        <Controller
          name="payableAccountID"
          control={control}
          render={({ field }) => (
            <>
              <SelectField
                {...field}
                options={accountOptions}
                selectProps={{
                  name: field.name,
                  value: field.value,
                  onChange: (e) => field.onChange(e.target.value),
                  disabled: !paymentAccountEnabled,
                  required: paymentAccountEnabled,
                }}
              />

              {errors?.payableAccountID && (
                <p style={{ color: "red", marginTop: "0.25rem" }}>
                  {errors.payableAccountID.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </fieldset>
  );
};

export default AccountPayable;
