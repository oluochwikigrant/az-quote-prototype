// components\pdf_sales\documentDataType.ts

/**
 * A single line item in the document (invoice, quotation_request, etc.)
 */
export interface ItemRecord {
  code?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  itemSubTotal: number;
}

/**
 * A single account detail entry (e.g. Bank name, account number)
 */
export interface AccountDetail {
  label: string;
  value?: string;
}

/**
 * Basic client information
 */
export interface ClientInfo {
  name: string;
  address?: string | null;
  contact: string;
}

export interface TellerInfo {
  TellerName: string;
  Signature: string;
  Position: string;
}

/**
 * The full shape of data consumed by the PDF document template
 */

export interface QuoteData {
  documentType: string;
  documentName: string;
  id: number;
  quotation_number: string;
  qr_code: string;
  description: string;
  client_name: string;
  client_address?: string | null;
  client_contact: string;
  terms_conditions: string;
  payment_account_enabled: boolean;
  payment_account_id?: number | null;
  accountDetails?: AccountDetail[];
  quoteItems: Array<ItemRecord>;
  subtotal: number;
  labor: number | null;
  shipping: number | null;
  tax_type: string;
  tax_rate: number;
  tax: number;
  grandTotal: number;
  served_by_name: string;
  served_by_position: string;
  served_by_signature: string;
  created_at: string;
  updated_at?: string;
}
