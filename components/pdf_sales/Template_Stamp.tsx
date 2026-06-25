// components/pdf_templates/Stamp.tsx
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  //
  stamp: {
    position: "relative",
    width: 100,
    height: 80,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "center",
    color: "#0000FF",
    transform: "rotate(-35deg)",
    opacity: 0.4,
  },
  date: { position: "absolute", bottom: 20, margin: "auto", fontSize: 7.5 },
});

interface Props {
  src?: string;
}

export const Stamp: React.FC<Props> = ({ src }) => (
  <View style={styles.stamp}>
    <Text style={styles.date}>{format(new Date(), "dd MMM yyyy")}</Text>
    <Image src={src} />
  </View>
);
