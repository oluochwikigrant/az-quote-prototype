//components\pdf_sales\Preview.js
import React from "react";
import styles from "./Preview.module.scss";
import { Fading_Ring_Animation } from "../loading_animation/Loading_animation";

const DocumentPreviewModal = ({
  previewData,
  onGeneratePDF,
  setCreatePreview,
  documentLoadingAnimation,
  isGenerating,
}) => {
  return (
    <div className={styles.document_preview}>
      {documentLoadingAnimation && (
        <div className={styles.loading_animation_container}>
          <Fading_Ring_Animation />
        </div>
      )}
      <div className={styles.document_preview_content}>
        <h2>PREVIEW {previewData.documentName}</h2>
        {/* ----------------------------------------------------------------CLIENT DETAILS SECTION---------- */}
        <div className={styles.section}>
          <h4 className={styles.section_h4}>CLIENT</h4>
          <div className={styles.sigle_attribute}>
            <label>Name :</label>
            <div className={styles.value}>{previewData.client.name}</div>
          </div>
          <div className={styles.sigle_attribute}>
            <label>Address :</label>
            <div className={styles.value}>{previewData.client.address}</div>
          </div>
          <div className={styles.sigle_attribute}>
            <label>Contact :</label>
            <div className={styles.value}>{previewData.client.contact}</div>
          </div>
        </div>

        {/* ----------------------------------------------------------------ITEMS SECTION---------- */}
        <div className={styles.section}>
          <h4 className={styles.section_h4}>ITEMS</h4>
          <div className={styles.itemsContainer}>
            <div className={styles.item_headers}>
              <h5 className={styles.item_description}>Description</h5>
              <h5 className={styles.item_quantity}>Qty</h5>
              <h5 className={styles.item_unitPrice}>Price</h5>
              <h5 className={styles.item_subTotal}>Price</h5>
            </div>
            {previewData.items.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.item_description}>
                  {item.description}
                </div>
                <div className={styles.item_quantity}>{item.quantity}</div>
                <div className={styles.item_unitPrice}>{item.unitPrice}</div>
                <div className={styles.item_subTotal}>{item.itemSubTotal}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------------------------ACCOUNTING SECTION---------- */}
        <div className={styles.section}>
          <h4 className={styles.section_h4}>ACCOUNTING</h4>
          <div className={styles.sigle_attribute}>
            <label>Labour :</label>
            <div className={styles.value}>{previewData.labor}</div>
          </div>
          <div className={styles.sigle_attribute}>
            <label>Shipping :</label>
            <div className={styles.value}>{previewData.shipping}</div>
          </div>
          <div className={styles.sigle_attribute}>
            <label>Sub-Total :</label>
            <div className={styles.value}>{previewData.subTotal}</div>
          </div>
          <div className={styles.sigle_attribute}>
            <label>Taxation :</label>
            <div className={styles.value}>
              {previewData.taxRate} - {previewData.taxType}
            </div>
          </div>
          <div className={styles.sigle_attribute}>
            <label>Tax :</label>
            <div className={styles.value}>{previewData.tax}</div>
          </div>
          <div className={styles.sigle_attribute}>
            <label>Grand Total :</label>
            <div className={styles.value}>{previewData.netGrandTotal}</div>
          </div>
        </div>

        {/* ----------------------------------------------------------------PAYMENT SECTION---------- */}
        <div className={styles.section}>
          <h4 className={styles.section_h4}>PAYMENT</h4>
          {previewData.paymentAccountEnabled ? (
            previewData.accountDetails.map((account, index) => (
              <div key={index} className={styles.sigle_attribute}>
                <label>{account.label}</label>
                <div className={styles.value}>{account.value}</div>
              </div>
            ))
          ) : (
            <div className={styles.sigle_attribute}>
              <label>Payment Account:</label>
              <div className={styles.value}>No Account Selected</div>
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------TERMS & CONDITIONS SECTION---------- */}
        <div className={styles.section}>
          <h4 className={styles.section_h4}>TERMS & CONDITIONS</h4>
          <div className={styles.sigle_attribute}>
            <div className={styles.value}>{previewData.termsConditions}</div>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button
            type="button"
            onClick={onGeneratePDF}
            disabled={isGenerating}
            className={styles.confirmButton}
          >
            {isGenerating
              ? `Generating ${previewData.documentName}…`
              : `Generate ${previewData.documentName}`}
          </button>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              setCreatePreview(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
