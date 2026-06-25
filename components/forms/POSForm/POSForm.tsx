//components\forms\POSForm\POSForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
  Resolver,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./POSForm.module.scss";
import ClientDetails from "./ClientDetails";
import ItemList from "./ItemList";
import OtherCharges from "./OtherCharges";
import AccountPayable from "./AccountPayable";
import TermsAndConditions from "./TermsAndConditions";
import SelectField from "../form_elements/select";
import PdfViewer from "@/components/pdf_sales/Viewer";
import DocumentPreviewModal from "@/components/DocumentPreviewModal/DocumentPreviewModal";
import { Fading_Ring_Animation } from "@/components/loading_animation/Loading_animation";
import { FullFormData, fullFormSchema } from "./POSFormDataTypes";
import InputField from "../form_elements/input";
import { QuoteData } from "@/components/pdf_sales/documentDataType";
import { toast } from "react-toastify";

interface POSFormProps {
  docName: string;
  docType: string;
}

const POSForm: React.FC<POSFormProps> = ({ docName, docType }) => {
  // ─── 1) Dropdown options ─────────────────────────────────────────────────────────
  const [serviceOptions, setServiceOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "Loading services…" }]);
  const [accountOptions, setAccountOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "Loading accounts…" }]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [svcRes, accRes] = await Promise.all([
          fetch("/api/services_offered"),
          fetch("/api/payable_accounts"),
        ]);
        if (!svcRes.ok || !accRes.ok) throw new Error("Failed to load options");

        const [svcData, accData] = await Promise.all([
          svcRes.json(),
          accRes.json(),
        ]);
        setServiceOptions([{ value: "", label: "Select Service" }, ...svcData]);
        setAccountOptions([{ value: "", label: "Select Account" }, ...accData]);
      } catch (err) {
        console.error(err);
        setServiceOptions([{ value: "", label: "Error loading" }]);
        setAccountOptions([{ value: "", label: "Error loading" }]);
      }
    }
    loadOptions();
  }, []);

  // ─── 2) React Hook Form setup ───────────────────────────────────────────────────
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FullFormData>({
    resolver: zodResolver(fullFormSchema) as Resolver<FullFormData, any>,
    defaultValues: {
      service: "",
      serviceDescription: "",
      client: { name: "", address: "", contact: "" },
      items: [{ description: "", quantity: "", unitPrice: "" }],
      labor: 0,
      shipping: 0,
      taxType: undefined,
      paymentAccountEnabled: false,
      payableAccountID: "",
      useCustomTerms: false,
      customConditions: "",
    },
    // defaultValues: {
    //   service: "3",
    //   serviceDescription:
    //     "Quotation for supply of computers and computer accessories.",
    //   client: {
    //     name: "James Muchiri",
    //     address: "2345 - 32311",
    //     contact: "james@gmail.com",
    //   },
    //   items: [
    //     {
    //       description: "Laptop - Dell XPS 13",
    //       quantity: "2",
    //       unitPrice: "120000",
    //     },
    //     {
    //       description: "Wireless Mouse - Logitech M185",
    //       quantity: "5",
    //       unitPrice: "1500",
    //     },
    //     {
    //       description: "Mechanical Keyboard - Keychron K2",
    //       quantity: "3",
    //       unitPrice: "8500",
    //     },
    //     {
    //       description: '27" Monitor - Samsung',
    //       quantity: "2",
    //       unitPrice: "25000",
    //     },
    //     {
    //       description: "Laptop Stand - Adjustable Aluminum",
    //       quantity: "4",
    //       unitPrice: "3000",
    //     },
    //     {
    //       description: "External Hard Drive - 1TB",
    //       quantity: "3",
    //       unitPrice: "7000",
    //     },
    //     {
    //       description: "USB-C Docking Station",
    //       quantity: "2",
    //       unitPrice: "9000",
    //     },
    //     {
    //       description: "Printer - HP LaserJet",
    //       quantity: "1",
    //       unitPrice: "18000",
    //     },
    //     {
    //       description: "Office Chair - Ergonomic",
    //       quantity: "4",
    //       unitPrice: "15000",
    //     },
    //     {
    //       description: "Webcam - Logitech C920",
    //       quantity: "3",
    //       unitPrice: "8500",
    //     },
    //   ],
    //   labor: 2500,
    //   shipping: 15000,
    //   taxType: undefined,
    //   paymentAccountEnabled: false,
    //   payableAccountID: "1",
    //   useCustomTerms: false,
    //   customConditions: "",
    // },
  });

  const paymentAccountEnabled = useWatch({
    control,
    name: "paymentAccountEnabled",
  });

  useEffect(() => {
    if (!paymentAccountEnabled) {
      setValue("payableAccountID", "");
    }
  }, [paymentAccountEnabled, setValue]);

  // UseFieldArray for dynamic “items” array
  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  // ─── 3) Preview & PDF state ──────────────────────────────────────────────────────
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<QuoteData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // ─── 4) onSubmit: RHF gives you a typed “data” directly ───────────────────────────
  const onSubmit: SubmitHandler<FullFormData> = async (data) => {
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const res = await fetch("/api/document_preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          documentType: docType,
          documentName: docName,
        }),
      });
      const json: QuoteData = await res.json();
      if (!res.ok) {
        throw new Error("Preview failed");
      }

      setPreviewData(json);
      setShowPreviewModal(true);
    } catch (err: any) {
      setPreviewError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  // ─── 5) generate PDF step ─────────────────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);
  const handleGeneratePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      try {
        const resGenerate = await fetch("/api/document_generator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(previewData),
        });
        if (!resGenerate.ok) {
          console.error("Generate error");
          return;
        }
        const blob = await resGenerate.blob();
        const url = URL.createObjectURL(blob);

        // FIRE SUCCESS TOAST
        toast.success(
          `🎉 ${previewData?.documentName} for ${previewData?.client_name} generated successfully!`,
          {
            position: "top-right",
            autoClose: 10000,
          }
        );
        reset();
        setPdfUrl(url);
        setShowPDFModal(true);
      } catch (err) {
        console.error("Error generating PDF:", err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className={styles.main}>
      {isSubmitting && (
        <div className={styles.loading_animation_container}>
          <Fading_Ring_Animation />
        </div>
      )}

      {/* ── 6) RHF form start ──────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*  1) Service Select */}
        <fieldset>
          <legend>Service Type</legend>

          {/* We use Controller here so that SelectField can receive “value” & “onChange” from RHF */}
          <Controller
            name="service"
            control={control}
            render={({ field }) => (
              <SelectField
                options={serviceOptions}
                name="service"
                error={errors?.service}
                selectProps={{
                  onChange: (e) => field.onChange(e.target.value),
                  name: "service",
                  required: true,
                  value: field.value,
                }}
              />
            )}
          />

          <InputField
            label={`${docName} Description`}
            name="serviceDescription"
            type="textarea"
            rows={2}
            register={register}
            error={errors?.serviceDescription}
            maxLength={70}
            // minLength={5}
            inputProps={{
              required: true,
              id: "serviceDescription",
              placeholder: `Enter ${docName} description here…`,
            }}
          />
        </fieldset>

        {/*  2) Client Details */}
        <ClientDetails
          register={register}
          control={control}
          errors={errors.client}
        />

        {/* TAXATION  */}
        <fieldset>
          <legend>Taxation</legend>
          <div className="inline_form_elements_container">
            {/* Tax Style*/}
            <Controller
              name="taxType"
              control={control}
              render={({ field }) => (
                <>
                  <SelectField
                    name="taxType"
                    label="Tax Style"
                    options={[
                      { value: "all", label: "General" },
                      { value: "single", label: "Product / Service" },
                      { value: "single", label: "Inclusive" },
                      { value: "single", label: "Tax Free" },
                    ]}
                    error={errors?.taxType}
                    selectProps={{
                      // onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                      //   field.onChange(e.target.value),
                      required: false,
                      name: "taxType",
                      // value: field.value,
                    }}
                  />
                </>
              )}
            />

            {/* Tax Rate*/}
            <Controller
              name="taxType"
              control={control}
              render={({ field }) => (
                <>
                  <SelectField
                    name="taxType"
                    label="Tax Rate"
                    options={[
                      { value: "", label: "Rate" },
                      { value: "0.16", label: "16%" },
                      { value: "0", label: "0%" },
                    ]}
                    error={errors?.taxType}
                    selectProps={{
                      // onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                      //   field.onChange(e.target.value),
                      required: false,
                      name: "taxType",
                      // value: field.value,
                    }}
                  />
                </>
              )}
            />
          </div>
        </fieldset>

        {/*  3) Item List */}
        <ItemList
          register={register}
          control={control}
          fields={items}
          append={append}
          remove={remove}
          errors={errors.items}
        />

        {/*  4) Other Charges */}
        <OtherCharges register={register} control={control} errors={errors} />

        {/* AccountPayable now takes RHF props */}
        <AccountPayable
          register={register}
          control={control}
          errors={errors}
          accountOptions={accountOptions}
        />

        {/* 6) Terms & Conditions */}
        <TermsAndConditions
          register={register}
          control={control}
          errors={errors}
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          Preview {docName}
        </button>
      </form>

      {/* ── DOCUMENT PREVIEW MODAL ─────────────────────────────── */}
      <DocumentPreviewModal
        isOpen={showPreviewModal}
        loading={previewLoading}
        error={previewError}
        quote={previewData}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewData(null);
          setPreviewError(null);
        }}
        onGenerate={handleGeneratePDF}
      />

      {showPDFModal && pdfUrl && (
        <PdfViewer
          pdfUrl={pdfUrl}
          onClose={() => {
            setShowPDFModal(false);
            setPreviewData(null);
            URL.revokeObjectURL(pdfUrl);
          }}
        />
      )}
    </main>
  );
};

export default POSForm;
