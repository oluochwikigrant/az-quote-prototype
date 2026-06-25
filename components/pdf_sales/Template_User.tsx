// components/pdf_templates/User.tsx
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { TellerInfo } from "./documentDataType";

const styles = StyleSheet.create({
  tellerInfo: {
    width: 150,
    height: 90,
    position: "absolute",
    bottom: -42,
    right: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    rowGap: 15,
    zIndex: 10,
  },

  signatureImage: {
    width: "auto",
    height: "auto",
    maxHeight: 40,
    maxWidth: 110,
  },

  info: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 3,
    color: "white",
  },

  name: {
    width: "100%",
    borderBottom: "1 solid black",
    paddingBottom: 3,
    textAlign: "center",
  },

  title: { fontSize: 8.5, fontStyle: "italic" },
});

export const Teller: React.FC<{ ServedBy: TellerInfo }> = ({ ServedBy }) => {
  return (
    <View style={styles.tellerInfo}>
      <Image src={ServedBy.Signature} style={styles.signatureImage} />
      <View style={styles.info}>
        <Text style={styles.name}>{ServedBy.TellerName}</Text>
        <Text style={styles.title}>{ServedBy.Position}</Text>
      </View>
    </View>
  );
};
