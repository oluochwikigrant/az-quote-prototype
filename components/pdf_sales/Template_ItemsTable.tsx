// components/pdf_templates/ItemsTable.tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { ItemRecord } from "./documentDataType";

import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  main: {
    width: "100%",
    paddingTop: 15,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 12,
  },

  header: {
    position: "relative",
    width: 510,
    height: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    color: "white",
    backgroundColor: "#0A3F5D",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  header_label: {
    textAlign: "center",
    borderRight: "1 solid white",
  },

  code: {
    width: 40,
  },

  description: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 8,
  },

  qty: {
    width: 45,
  },

  price: {
    width: 75,
  },

  total: {
    width: 90,
    borderRight: "none",
  },

  items_container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },

  item: {
    width: 510,
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderBottom: "1px solid rgb(185, 185, 185)",
    paddingBottom: 7,
    paddingTop: 7,
  },

  item_value: {
    textAlign: "center",
    padding: "0 5",
    fontSize: 11,
  },
});

export default styles;

interface Props {
  items: ItemRecord[];
}

export const ItemsTable: React.FC<Props> = ({ items }) => (
  <View style={styles.main}>
    <View style={styles.header}>
      <Text style={[styles.header_label, styles.code]}>No.</Text>
      <Text style={[styles.header_label, styles.description]}>Description</Text>
      <Text style={[styles.header_label, styles.qty]}>Qty</Text>
      <Text style={[styles.header_label, styles.price]}>Price</Text>
      <Text style={[styles.header_label, styles.total]}>Total</Text>
    </View>
    {items.map((Item, i) => (
      <View key={i} style={styles.item} wrap={false}>
        <Text style={[styles.item_value, styles.code]}>{Item.code}</Text>
        <Text
          style={[styles.item_value, styles.description, { textAlign: "left" }]}
        >
          {Item.description}
        </Text>
        <Text style={[styles.item_value, styles.qty]}>{Item.quantity}</Text>
        <Text style={[styles.item_value, styles.price]}>{Item.unitPrice}</Text>
        <Text style={[styles.item_value, styles.total, { textAlign: "right" }]}>
          {Item.itemSubTotal}
        </Text>
      </View>
    ))}
  </View>
);
