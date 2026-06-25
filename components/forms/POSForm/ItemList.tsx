// components/forms/POSForm/ItemList.tsx

"use client";

import React from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import InputField from "@/components/forms/form_elements/input";
import styles from "./ItemList.module.scss";
import { ItemListProps } from "./POSFormDataTypes";
import { MdOutlineDescription } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";

const ItemList: React.FC<ItemListProps> = ({
  register,
  control,
  fields,
  append,
  remove,
  errors,
}) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend>Product / Service Details</legend>

      {fields.map((field, index) => (
        <div key={field.id} className={styles.itemContainer}>
          {/* Item Number Bubble */}
          <div className={styles.itemNumber}>{index + 1}</div>

          {/* Description */}
          <InputField
            label="Description"
            name={`items.${index}.description`}
            icon={<MdOutlineDescription />}
            type="text"
            placeholder="Description"
            register={register}
            maxLength={70}
            error={errors?.[index]?.description}
            inputProps={{
              required: true,
              id: `items.${index}.description`,
            }}
          />

          <div className="inline_form_elements_container">
            {/* Quantity */}
            <InputField
              label="Quantity"
              name={`items.${index}.quantity`}
              type="number"
              placeholder="Quantity"
              register={register}
              defaultValue=""
              error={errors?.[index]?.quantity}
              inputProps={{
                required: true,
                id: `items.${index}.quantity`,
                min: 1,
              }}
            />

            {/* Unit Price */}
            <InputField
              label="Unit Price"
              name={`items.${index}.unitPrice`}
              icon={<FaDollarSign />}
              type="number"
              placeholder="Unit Price"
              register={register}
              defaultValue=""
              error={errors?.[index]?.unitPrice}
              inputProps={{
                required: true,
                id: `items.${index}.unitPrice`,
                min: 0,
              }}
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            aria-label={`Remove item ${index + 1}`}
            onClick={() => remove(index)}
            className={styles.removeItemButton}
          >
            <RiCloseLargeFill />
          </button>
        </div>
      ))}

      {/* Add Item Button */}
      <button
        type="button"
        onClick={() => append({ description: "", quantity: "", unitPrice: "" })}
        className={styles.addItemButton}
      >
        Add Item
      </button>
    </fieldset>
  );
};

export default ItemList;
