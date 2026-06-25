// components/pdf_templates/AccountDetails.tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  terms_conditions: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    rowGap: 5,
  },

  header: {
    width: "100%",
    textAlign: "center",
    fontFamily: "Arial",
    fontWeight: "bold",
    fontStyle: "italic",
    color: "rgb(180, 0, 0)",
  },

  content: {
    width: "100%",
    fontStyle: "italic",
    fontSize: 8,
    textAlign: "justify",
  },
});

// components/pdf_templates/TermsConditions.tsx
export const TermsConditions: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.terms_conditions}>
    <Text style={styles.header}>Terms & Conditions</Text>
    <Text style={styles.content}>{text}</Text>
  </View>
);
