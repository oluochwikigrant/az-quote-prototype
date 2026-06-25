// components/pdf_templates/Template.tsx
import React from "react";
import { Document, Page } from "@react-pdf/renderer";
import { QuoteData } from "./documentDataType";

import { HeaderSection } from "./Template_HeaderSection";
import { ItemsTable } from "./Template_ItemsTable";
import { FooterSection } from "./Template_FooterSection";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: "10 0" },

  title: { fontSize: 8.5, fontStyle: "italic" },
});

interface DocumentTemplateProps {
  documentData: QuoteData;
  shared_assets: {
    header: string;
    footer: string;
    stamp: string;
    barcode: string;
  };
}

export default function DocumentTemplate({
  documentData,
  shared_assets,
}: DocumentTemplateProps) {
  return (
    <Document
      title={`${documentData.documentName}-${documentData.quotation_number}-${documentData.client_name}`}
      author={`System Generated ${documentData.documentName} `}
    >
      <Page size="A4" style={styles.page}>
        <HeaderSection
          documentName={documentData.documentName}
          documentNumber={documentData.quotation_number!}
          serviceDescription={documentData.description}
          date={documentData.created_at!}
          client={{
            name: documentData.client_name,
            contact: documentData.client_contact,
            address: documentData.client_address,
          }}
          headerImage={shared_assets.header}
          barcodeImage={shared_assets.barcode}
        />

        <ItemsTable items={documentData.quoteItems} />

        <FooterSection
          footerImage={shared_assets.footer}
          stampImage={shared_assets.stamp}
          accountDetails={documentData.accountDetails}
          paymentAccountEnabled={documentData.payment_account_enabled}
          termsConditions={documentData.terms_conditions}
          subTotal={documentData.subtotal}
          labor={documentData.labor}
          shipping={documentData.shipping}
          tax={documentData.tax}
          netGrandTotal={documentData.grandTotal}
          User={{
            TellerName: documentData.served_by_name,
            Signature: documentData.served_by_position,
            Position: documentData.served_by_signature,
          }}
        />
      </Page>
    </Document>
  );
}
