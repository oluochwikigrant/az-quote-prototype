// components/pdf_templates/CalculationsSection.tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // ------------------------------------------------FOOTER

  calculations_container: {
    height: "100%",
    width: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 11,
    zIndex: 1,
  },

  calculation_unit: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },

  unit_label: {
    padding: 7,
    paddingRight: 10,
    paddingLeft: 0,
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  unit_value: {
    width: 100,
    textAlign: "right",
    padding: 7,
    paddingLeft: 0,
    paddingRight: 10,
    borderBottom: "1 solid rgb(220,220,220)",
  },
});

interface Props {
  subTotal: number;
  labor?: number | null;
  shipping?: number | null;
  tax: number;
  grandTotal: number;
}

export const CalculationsSection: React.FC<Props> = ({
  subTotal,
  labor,
  shipping,
  tax,
  grandTotal,
}) => (
  <View style={styles.calculations_container}>
    {[
      ["Sub-Total:", subTotal],
      ["Labour:", labor],
      ["Shipping:", shipping],
      ["Tax (V.A.T.):", tax],
      ["GRAND TOTAL:", grandTotal],
    ].map(([label, value]) => (
      <View key={label} style={styles.calculation_unit}>
        <Text style={styles.unit_label}>{label}</Text>
        <Text
          style={[
            styles.unit_value,
            label === "Tax (V.A.T.):" ? { borderBottom: "none" } : {},
            label === "GRAND TOTAL:"
              ? { backgroundColor: "#CFEEFF", borderBottom: "none" }
              : {},
          ]}
        >
          {label === "GRAND TOTAL:" ? `Ksh ${value}` : value}
        </Text>
      </View>
    ))}
  </View>
);
