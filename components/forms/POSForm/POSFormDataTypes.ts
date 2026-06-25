// components/forms/POSForm/POSFormDataTypes.ts

import { z } from "zod";
import {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFieldArrayRemove,
  UseFieldArrayAppend,
  FieldError,
} from "react-hook-form";

// ───────────────────────────────────────────────────────────────────────────────
// 1) Zod schemas and inferred TypeScript types
// ───────────────────────────────────────────────────────────────────────────────

// 1.1) Client schema
export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  contact: z.string().min(1, "Contact is required"),
});
export type ClientSchemaType = z.infer<typeof clientSchema>;

// 1.2) Item schema
export const itemSchema = z.object({
  description: z.string().min(1, "Required"),
  quantity: z.string().min(1, "Required"),
  unitPrice: z.string().min(1, "Required"),
});
export type ItemType = z.infer<typeof itemSchema>;

// 1.3) Other charges schema (labor, shipping, taxType)
export const otherChargesSchema = z.object({
  labor: z.coerce
    .number({ invalid_type_error: "Labor must be a number" })
    .min(0, "Labor must be at least 0"),

  shipping: z.coerce
    .number({ invalid_type_error: "Shipping must be a number" })
    .min(0, "Shipping must be at least 0"),

  taxType: z.enum(["exclusive", "inclusive", "nill"], {
    errorMap: () => ({ message: "Tax Type is required" }),
  }),
});

// 1.4) Full form schema, combining all sections
export const fullFormSchema = z
  .object({
    service: z.string().min(1, "Service is required"),

    serviceDescription: z
      .string()
      .min(15, "Minimum description; 15 characters")
      .max(70, "Maximum description; 70 characters"),

    client: clientSchema,

    items: z.array(itemSchema).min(1, "At least one item is required"),

    labor: z.coerce
      .number({ invalid_type_error: "Labor must be a number" })
      .min(0, "Labor must be at least 0"),

    shipping: z.coerce
      .number({ invalid_type_error: "Shipping must be a number" })
      .min(0, "Shipping must be at least 0"),

    taxType: z.enum(["exclusive", "inclusive", "nill"], {
      errorMap: () => ({ message: "Tax Rate is required" }),
    }),

    paymentAccountEnabled: z.boolean().default(false),
    payableAccountID: z.string().optional(),

    useCustomTerms: z.boolean().default(false),
    customConditions: z.string().optional(),
  })
  .refine(
    (data) => {
      // If paymentAccountEnabled is true, payableAccountID must not be empty
      return (
        !data.paymentAccountEnabled ||
        (data.paymentAccountEnabled && data.payableAccountID !== "")
      );
    },
    {
      message: "Payment account is required when enabled",
      path: ["payableAccountID"],
    }
  )
  .refine(
    (data) => {
      // If useCustomTerms is true, customConditions must be non-empty
      return (
        !data.useCustomTerms || (data.useCustomTerms && !!data.customConditions)
      );
    },
    {
      message: "Custom terms cannot be empty when selected",
      path: ["customConditions"],
    }
  );

export type FullFormData = z.infer<typeof fullFormSchema>;

// ───────────────────────────────────────────────────────────────────────────────
// 2) React Hook Form props interfaces for each subcomponent
// ───────────────────────────────────────────────────────────────────────────────

// 2.1) ClientDetailsProps
export interface ClientDetailsProps {
  register: UseFormRegister<FullFormData>;
  control: Control<FullFormData, any, any>;
  errors?: FieldErrors<FullFormData>["client"];
}

// 2.2) ItemListProps (uses useFieldArray)
export interface ItemListProps {
  register: UseFormRegister<FullFormData>;
  control: Control<FullFormData, any, any>;
  fields: { id: string }[]; // from useFieldArray
  append: UseFieldArrayAppend<FullFormData, "items">;
  remove: UseFieldArrayRemove;
  errors?: FieldErrors<FullFormData>["items"];
}

// 2.3) OtherChargesProps
export interface OtherChargesProps {
  register: UseFormRegister<FullFormData>;
  control: Control<FullFormData, any, any>;
  errors?: FieldErrors<FullFormData> & {
    labor?: FieldError;
    shipping?: FieldError;
    taxType?: FieldError;
  };
}

// 2.4) AccountPayableProps
export interface AccountPayableProps {
  register: UseFormRegister<FullFormData>;
  control: Control<FullFormData, any, any>;
  errors?: FieldErrors<FullFormData> & {
    paymentAccountEnabled?: FieldError;
    payableAccount?: FieldError;
  };
  accountOptions: { value: string; label: string }[];
}

// 2.5) TermsAndConditionsProps
export interface TermsAndConditionsProps {
  register: UseFormRegister<FullFormData>;
  control: Control<FullFormData, any, any>;
  errors?: FieldErrors<FullFormData> & {
    useCustomTerms?: FieldError;
    customConditions?: FieldError;
  };
}
