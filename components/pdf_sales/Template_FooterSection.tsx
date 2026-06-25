// components/pdf_templates/FooterSection.tsx
import React from "react";
import { View, Image } from "@react-pdf/renderer";
import { CalculationsSection } from "./Template_CalculationsSection";
import { AccountDetails } from "./Template_AccountDetails";
import { TermsConditions } from "./Template_TermsConditions";
import { Stamp } from "./Template_Stamp";
import { Teller } from "./Template_User";
import { AccountDetail, TellerInfo } from "./documentDataType";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  //
  footer: {
    position: "relative",
    width: "100%",
    height: 270,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 15,
    fontSize: 10,
  },

  content: {
    position: "relative",
    height: 200,
    width: 510,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 3,
    // backgroundColor: "green",
  },

  terms_account_details_container: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    rowGap: 25,
    // backgroundColor: "yellow",
  },

  stamp: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  footer_image: {
    position: "relative",
    width: "100%",
    height: 70,
    zIndex: 1,
  },
});

interface FooterSectionProps {
  footerImage: string;
  stampImage: string;
  accountDetails?: AccountDetail[];
  paymentAccountEnabled: boolean;
  termsConditions: string;
  subTotal: number;
  labor?: number | null;
  shipping?: number | null;
  tax: number;
  netGrandTotal: number;
  User: TellerInfo;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  footerImage,
  stampImage,
  accountDetails,
  paymentAccountEnabled,
  termsConditions,
  subTotal,
  labor,
  shipping,
  tax,
  netGrandTotal,
  User,
}) => {
  return (
    <View style={styles.footer} wrap={false}>
      <View style={styles.content}>
        <View style={styles.terms_account_details_container}>
          {paymentAccountEnabled && (
            <AccountDetails accounts={accountDetails} />
          )}
          <TermsConditions text={termsConditions} />
        </View>

        {/* Stamp */}
        <Stamp src={stampImage} />

        <CalculationsSection
          subTotal={subTotal}
          labor={labor}
          shipping={shipping}
          tax={tax}
          grandTotal={netGrandTotal}
        />

        {/* Teller Details */}
        <Teller ServedBy={User} />
      </View>

      {/* Footer Image */}
      <Image src={footerImage} style={styles.footer_image} />
    </View>
  );
};

export default FooterSection;
