import React from "react";
import { useQRCode } from "next-qrcode";

function QRCodeGenerator() {
  const { Image } = useQRCode();

  return (
    <Image
      text={"https://www.aztechnos.com/"}
      options={{
        type: "image/png",
        quality: 0.3,
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
        width: 500,
        color: {
          dark: "#000000",
          light: "red",
        },
      }}
      alt="QR"
    />
  );
}

export default QRCodeGenerator;
