export type DocumentType = "quotation" | "invoice" | "receipt" | "delivery_note";

export interface ItemRecord {
  id: number;
  documentId: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface AccountDetail {
  label: string;
  value: string;
}

export interface SaleDocument {
  id: number;
  type: DocumentType;
  number: string;
  qrCode: string;
  description: string;
  clientName: string;
  clientAddress: string | null;
  clientContact: string;
  labor: number;
  shipping: number;
  taxType: "inclusive" | "exclusive" | "nill";
  taxRate: number;
  terms: string;
  paymentEnabled: boolean;
  paymentAccountId: number | null;
  servedByName: string;
  servedByPosition: string;
  servedBySignature: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface PayableAccount {
  id: number;
  displayName: string;
  method: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  businessNumber: string | null;
  buyGoodsNumber: string | null;
}

export interface Service {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  kraPin: string | null;
  logo: string | null;
  postalAddress: string | null;
  physicalAddress: string;
  primaryEmail: string;
  secondaryEmail: string | null;
  primaryPhone: string;
  secondaryPhone: string | null;
}

export interface User {
  id: string;
  role: "admin" | "user" | "sales";
  position: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  signature: string | null;
  passport: string | null;
  createdAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface CallRequest {
  id: number;
  clientName: string;
  phone: string;
  subject: string;
  timeRequested: string;
}

export interface QuotationRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Review {
  id: number;
  clientName: string | null;
  contact: string | null;
  message: string;
  rating: number | null;
}

export interface Subscriber {
  email: string;
}

export interface DocumentPreviewData {
  documentType: DocumentType;
  documentName: string;
  number: string;
  qrCode: string;
  description: string;
  clientName: string;
  clientAddress: string | null;
  clientContact: string;
  items: ItemRecord[];
  subtotal: number;
  labor: number;
  shipping: number;
  taxType: string;
  taxRate: number;
  tax: number;
  grandTotal: number;
  terms: string;
  paymentEnabled: boolean;
  paymentAccountId: number | null;
  accountDetails: AccountDetail[];
  servedByName: string;
  servedByPosition: string;
  servedBySignature: string;
  createdAt: string;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
