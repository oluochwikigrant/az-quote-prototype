// import JsBarcode from "jsbarcode";

// const generateBarcode = (value) => {
//   const canvas = document.createElement("canvas");
//   JsBarcode(canvas, value, {
//     format: "CODE128",
//     displayValue: false,
//     marginRight: 20,
//     marginLeft: 20,
//   });
//   return canvas.toDataURL("image/png");
// };

// export default generateBarcode;

// components/Bar_QR_Generator/BarCode.ts

import bwipjs from "bwip-js";

export default async function GenerateBarcodeBase64(
  value: string
): Promise<string> {
  try {
    const pngBuffer = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: value, // Text to encode
      scale: 3,
      height: 10,
      includetext: false,
    });

    // Convert to base64 for use in react-pdf <Image src="data:image/png;base64,..." />
    const base64 = pngBuffer.toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error("Barcode generation failed:", err);
    return "";
  }
}
