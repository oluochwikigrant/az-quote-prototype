import React from "react";

interface PdfViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: 8,
          width: "90vw",
          height: "90vh",
          overflow: "hidden",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <iframe
          src={pdfUrl}
          title="Generated PDF"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </div>
  );
};

export default PdfViewer;
