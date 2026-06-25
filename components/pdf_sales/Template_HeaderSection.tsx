// components/pdf_templates/HeaderSection.tsx
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { ClientInfo } from "./documentDataType";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // ------------------------------------------------HEADER
  header: {
    position: "relative",
    width: "100%",
    height: 210,
    fontFamily: "Arial",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 11,
  },

  header_image: {
    width: "100%",
    height: 80,
  },

  document_details: {
    position: "absolute",
    left: 350,
    top: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 15,
  },

  document_name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    textTransform: "uppercase",
    paddingBottom: 15,
  },

  barcode: {
    width: 150,
    height: 30,
  },

  document_number: {
    fontSize: 13,
    color: "#005C5C",
    fontWeight: "bold",
  },

  date_label: {
    color: "#005C5C",
    fontWeight: "bold",
  },

  document_date: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    fontFamily: "TimesNewRoman",
  },

  service: {
    width: "100%",
    maxWidth: 250,
    left: 45,
    paddingTop: 18,
    paddingBottom: 15,
  },

  service_header: {
    color: "#005C5C",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  service_description: {
    fontFamily: "TimesNewRoman",
    fontSize: 10,
    paddingLeft: 20,
    // textTransform: "lowercase",
  },

  client_details_container: {
    width: "100%",
    maxWidth: 250,
    left: 45,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 5,
  },

  address_to: {
    color: "#005C5C",
    fontWeight: "bold",
  },

  client_details: {
    fontFamily: "TimesNewRoman",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    paddingLeft: 20,
  },
});

interface HeaderSectionProps {
  documentName: string;
  documentNumber: string;
  serviceDescription: string;
  date: string;
  client: ClientInfo;
  headerImage: string; // base64 data URI
  barcodeImage: string; // base64 data URI
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  documentName,
  documentNumber,
  serviceDescription,
  date,
  client,
  headerImage,
  barcodeImage,
}) => {
  return (
    <View style={styles.header}>
      <Image src={headerImage} style={styles.header_image} />
      <View style={styles.document_details}>
        <Text style={styles.document_name}>{documentName}</Text>
        <Image src={barcodeImage} style={styles.barcode} />
        <Text style={styles.document_number}>{documentNumber}</Text>
        <View style={styles.document_date}>
          <Text style={styles.date_label}>DATE:</Text>
          <Text>{date}</Text>
        </View>
      </View>
      <View style={styles.service}>
        <Text style={styles.service_header}>Description: </Text>
        <Text style={styles.service_description}>{serviceDescription}</Text>
      </View>
      <View style={styles.client_details_container}>
        <Text style={styles.address_to}>{documentName.toUpperCase()} TO:</Text>
        <View style={styles.client_details}>
          <Text>{client.name}</Text>
          {client.address && <Text>{client.address}</Text>}
          <Text>{client.contact}</Text>
        </View>
      </View>
    </View>
  );
};
