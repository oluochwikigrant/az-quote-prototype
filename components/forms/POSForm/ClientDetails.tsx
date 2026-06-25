// components/forms/POSForm/ClientDetails.tsx

"use client";

import React from "react";
import InputField from "@/components/forms/form_elements/input";
import { ClientDetailsProps } from "./POSFormDataTypes";
import { FaUser, FaRegAddressCard, FaPhone } from "react-icons/fa";

const ClientDetails: React.FC<ClientDetailsProps> = ({
  register,
  control,
  errors,
}) => {
  return (
    <fieldset>
      <legend>Client Details</legend>

      {/** 1) NAME **/}
      <InputField
        label="Full Name"
        name="client.name" // RHF field path
        icon={<FaUser />}
        type="text"
        placeholder="Full Name"
        register={register}
        defaultValue="" // initial value (empty)
        error={errors?.name} // inline error for “name”
        inputProps={{
          required: true,
          id: "client.name",
        }}
      />

      {/** 2) ADDRESS (optional) **/}
      <InputField
        label="Address"
        name="client.address"
        icon={<FaRegAddressCard />}
        type="text"
        placeholder="Address (optional)"
        register={register}
        defaultValue=""
        error={errors?.address} // could be undefined if no error
        inputProps={{
          id: "client.address",
        }}
      />

      {/** 3) CONTACT **/}
      <InputField
        label="Contact"
        name="client.contact"
        icon={<FaPhone />}
        type="text"
        placeholder="Phone or Email"
        register={register}
        defaultValue=""
        error={errors?.contact}
        inputProps={{
          required: true,
          id: "client.contact",
        }}
      />
    </fieldset>
  );
};

export default ClientDetails;
