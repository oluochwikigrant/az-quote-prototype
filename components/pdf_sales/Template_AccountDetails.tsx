// components/pdf_templates/AccountDetails.tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { AccountDetail } from "./documentDataType";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  account_details: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    gap: 5,
  },

  header: {
    width: "100%",
    borderBottom: "0.5 solid rgb(0, 0, 0)",
    textAlign: "center",
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#005C5C",
    padding: 5,
  },
  account_record: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: "0 7",
    columnGap: 5,
  },
  account_record_label: { width: 100, fontFamily: "Arial", fontWeight: "bold" },
  account_record_value: {},
});

export const AccountDetails: React.FC<{ accounts?: AccountDetail[] }> = ({
  accounts,
}) => (
  <View style={styles.account_details}>
    <Text style={styles.header}>PAYMENT ACCOUNT DETAILS</Text>
    {accounts?.map((a, i) => (
      <View key={i} style={styles.account_record}>
        <Text style={styles.account_record_label}>{a.label}</Text>
        <Text style={styles.account_record_value}>: {a.value}</Text>
      </View>
    ))}
  </View>
);
