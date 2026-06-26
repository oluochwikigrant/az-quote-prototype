import type {
  SaleDocument,
  ItemRecord,
  PayableAccount,
  Service,
  Company,
  User,
  Announcement,
  CallRequest,
  QuotationRequest,
  Review,
  Subscriber,
  DocumentType,
} from "@/types";

// ─── ID Generators ──────────────────────────────────────────────────────────
let nextDocId = 4;
let nextItemId = 10;
let nextAnnouncementId = 3;
let nextCallRequestId = 3;
let nextQuotationRequestId = 3;
let nextReviewId = 3;
let nextUserId = 3;

function rand(prefix: string, len = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = prefix;
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

// ─── Data Stores ────────────────────────────────────────────────────────────

export const company: Company = {
  id: 1,
  name: "Aztechnos Ltd",
  kraPin: "P051234567X",
  logo: null,
  postalAddress: "P.O. Box 12345 - 00100 Nairobi",
  physicalAddress: "Nairobi Business Park, Mombasa Road, Nairobi, Kenya",
  primaryEmail: "info@aztechnos.com",
  secondaryEmail: "support@aztechnos.com",
  primaryPhone: "+254 712 345 678",
  secondaryPhone: "+254 723 456 789",
};

export const services: Service[] = [
  { id: 1, name: "Web Development" },
  { id: 2, name: "Mobile App Development" },
  { id: 3, name: "IT Consulting" },
  { id: 4, name: "Cloud Solutions" },
  { id: 5, name: "Cyber Security" },
];

export const payableAccounts: PayableAccount[] = [
  {
    id: 1,
    displayName: "M-Pesa Paybill",
    method: "M-Pesa",
    bankName: null,
    accountName: "Aztechnos Ltd",
    accountNumber: null,
    businessNumber: "247247",
    buyGoodsNumber: null,
  },
  {
    id: 2,
    displayName: "Equity Bank",
    method: "Bank Transfer",
    bankName: "Equity Bank Kenya",
    accountName: "Aztechnos Ltd",
    accountNumber: "1234567890123",
    businessNumber: null,
    buyGoodsNumber: null,
  },
  {
    id: 3,
    displayName: "KCB Bank",
    method: "Bank Transfer",
    bankName: "KCB Bank Kenya",
    accountName: "Aztechnos Ltd",
    accountNumber: "9876543210987",
    businessNumber: null,
    buyGoodsNumber: null,
  },
];

export const users: User[] = [
  {
    id: "usr_1",
    role: "admin",
    position: "Managing Director",
    email: "wicklife@aztechnos.com",
    firstName: "Wicklife",
    lastName: "Oluoch",
    phone: "+254 712 345 678",
    signature: null,
    passport: null,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "usr_2",
    role: "sales",
    position: "Sales Manager",
    email: "john@aztechnos.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+254 723 456 789",
    signature: null,
    passport: null,
    createdAt: "2024-02-20T09:30:00Z",
  },
];

export const documents: SaleDocument[] = [
  {
    id: 1,
    type: "quotation",
    number: "QT-ABC123DEF456",
    qrCode: "QT-ABC123DEF456",
    description: "Website Development & E-commerce Platform",
    clientName: "Nairobi Retail Ltd",
    clientAddress: "Westlands, Nairobi",
    clientContact: "info@nairobiretail.co.ke",
    labor: 15000,
    shipping: 0,
    taxType: "exclusive",
    taxRate: 0.16,
    terms: "Payment within 30 days. Quotation valid for 90 days from date of issue.",
    paymentEnabled: true,
    paymentAccountId: 1,
    servedByName: "Wicklife Oluoch",
    servedByPosition: "Managing Director",
    servedBySignature: "",
    createdAt: "2025-06-20T10:00:00Z",
    updatedAt: null,
  },
  {
    id: 2,
    type: "invoice",
    number: "IN-XYZ789ABC012",
    qrCode: "IN-XYZ789ABC012",
    description: "IT Infrastructure Audit & Consulting",
    clientName: "Tech Solutions Inc",
    clientAddress: "Mombasa Road, Nairobi",
    clientContact: "accounts@techsolutions.co.ke",
    labor: 25000,
    shipping: 5000,
    taxType: "inclusive",
    taxRate: 0.16,
    terms: "Payment due within 14 days of invoice date.",
    paymentEnabled: true,
    paymentAccountId: 2,
    servedByName: "John Doe",
    servedByPosition: "Sales Manager",
    servedBySignature: "",
    createdAt: "2025-06-18T14:30:00Z",
    updatedAt: null,
  },
  {
    id: 3,
    type: "receipt",
    number: "RC-DEF456GHI789",
    qrCode: "RC-DEF456GHI789",
    description: "Annual Web Hosting Renewal",
    clientName: "Nairobi Retail Ltd",
    clientAddress: "Westlands, Nairobi",
    clientContact: "info@nairobiretail.co.ke",
    labor: 0,
    shipping: 0,
    taxType: "nill",
    taxRate: 0,
    terms: "Paid in full. Thank you for your business.",
    paymentEnabled: false,
    paymentAccountId: null,
    servedByName: "Wicklife Oluoch",
    servedByPosition: "Managing Director",
    servedBySignature: "",
    createdAt: "2025-06-15T09:00:00Z",
    updatedAt: null,
  },
];

export const items: ItemRecord[] = [
  { id: 1, documentId: 1, description: "Custom Website Design", quantity: 1, unitPrice: 85000 },
  { id: 2, documentId: 1, description: "E-commerce Integration", quantity: 1, unitPrice: 120000 },
  { id: 3, documentId: 1, description: "Payment Gateway Setup", quantity: 1, unitPrice: 35000 },
  { id: 4, documentId: 1, description: "SSL Certificate (1 Year)", quantity: 1, unitPrice: 8000 },
  { id: 5, documentId: 2, description: "Network Infrastructure Audit", quantity: 1, unitPrice: 75000 },
  { id: 6, documentId: 2, description: "Security Assessment", quantity: 1, unitPrice: 45000 },
  { id: 7, documentId: 2, description: "Consulting (10 hours)", quantity: 10, unitPrice: 8000 },
  { id: 8, documentId: 3, description: "Shared Hosting - Premium Plan", quantity: 1, unitPrice: 18000 },
  { id: 9, documentId: 3, description: "Domain Renewal (.co.ke)", quantity: 1, unitPrice: 3500 },
];

export const announcements: Announcement[] = [
  {
    id: 1,
    title: "New Office Location",
    description: "We have moved to Nairobi Business Park, Mombasa Road. All clients are welcome to visit our new premises.",
    date: "2025-06-01T08:00:00Z",
  },
  {
    id: 2,
    title: "Holiday Schedule - Madaraka Day",
    description: "Our offices will be closed on 1st June 2025 for Madaraka Day. Normal operations resume on 2nd June.",
    date: "2025-05-28T10:00:00Z",
  },
];

export const callRequests: CallRequest[] = [
  {
    id: 1,
    clientName: "Sarah Kimani",
    phone: "+254 701 234 567",
    subject: "Website Redesign Inquiry",
    timeRequested: "2025-06-22T09:15:00Z",
  },
  {
    id: 2,
    clientName: "Peter Ochieng",
    phone: "+254 722 345 678",
    subject: "Mobile App Development",
    timeRequested: "2025-06-21T14:30:00Z",
  },
];

export const quotationRequests: QuotationRequest[] = [
  {
    id: 1,
    name: "Alice Wanjiku",
    email: "alice@greenfarms.co.ke",
    phone: "+254 733 456 789",
    subject: "E-commerce Platform for Farm Products",
    message: "We need a complete e-commerce solution with payment integration and inventory management for our organic farm products.",
    createdAt: "2025-06-22T11:00:00Z",
  },
  {
    id: 2,
    name: "David Mutua",
    email: "david@speedlogistics.com",
    phone: "+254 744 567 890",
    subject: "Fleet Management System",
    message: "Looking for a custom fleet tracking and management system for our 50+ vehicle logistics company.",
    createdAt: "2025-06-20T16:45:00Z",
  },
];

export const reviews: Review[] = [
  {
    id: 1,
    clientName: "Grace Mwangi",
    contact: "grace@mwangiconsulting.com",
    message: "Exceptional service! The team delivered our website ahead of schedule and the quality exceeded our expectations.",
    rating: 5,
  },
  {
    id: 2,
    clientName: "James Otieno",
    contact: "james@otieno.co.ke",
    message: "Professional team, great communication throughout the project. Highly recommended for web development.",
    rating: 4,
  },
];

export const subscribers: Subscriber[] = [
  { email: "subscriber1@gmail.com" },
  { email: "subscriber2@yahoo.com" },
  { email: "newsletter@company.co.ke" },
];

// ─── CRUD Helpers ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

export function paginate<T>(arr: T[], page: number, perPage = ITEMS_PER_PAGE): T[] {
  const start = (page - 1) * perPage;
  return arr.slice(start, start + perPage);
}

export function totalPages(arr: unknown[], perPage = ITEMS_PER_PAGE): number {
  return Math.max(1, Math.ceil(arr.length / perPage));
}

// Documents
export function getDocuments(type?: DocumentType, search?: string, page = 1) {
  let result = [...documents];
  if (type) result = result.filter((d) => d.type === type);
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (d) =>
        d.clientName.toLowerCase().includes(s) ||
        d.number.toLowerCase().includes(s) ||
        d.description.toLowerCase().includes(s)
    );
  }
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = result.length;
  const paged = paginate(result, page);
  return {
    data: paged,
    pagination: { page, perPage: ITEMS_PER_PAGE, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE) },
  };
}

export function getDocumentById(id: number) {
  const doc = documents.find((d) => d.id === id);
  if (!doc) return null;
  const docItems = items.filter((i) => i.documentId === id);
  const account = doc.paymentAccountId ? payableAccounts.find((a) => a.id === doc.paymentAccountId) : null;
  return { ...doc, items: docItems, account };
}

export function createDocument(data: Omit<SaleDocument, "id" | "number" | "qrCode" | "createdAt" | "updatedAt">) {
  const prefixMap: Record<DocumentType, string> = { quotation: "QT-", invoice: "IN-", receipt: "RC-", delivery_note: "DN-" };
  const prefix = prefixMap[data.type];
  const newDoc: SaleDocument = {
    ...data,
    id: nextDocId++,
    number: rand(prefix, 12),
    qrCode: rand(prefix, 12),
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
  documents.push(newDoc);
  return newDoc;
}

export function updateDocument(id: number, updates: Partial<SaleDocument>) {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  documents[idx] = { ...documents[idx], ...updates, updatedAt: new Date().toISOString() };
  return documents[idx];
}

export function deleteDocument(id: number) {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  documents.splice(idx, 1);
  // remove items
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].documentId === id) items.splice(i, 1);
  }
  return true;
}

export function createItems(docId: number, newItems: Omit<ItemRecord, "id" | "documentId">[]) {
  const created = newItems.map((it) => ({ ...it, id: nextItemId++, documentId: docId }));
  items.push(...created);
  return created;
}

// Announcements
export function getAnnouncements(page = 1) {
  const result = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return {
    data: paginate(result, page),
    pagination: { page, perPage: ITEMS_PER_PAGE, total: result.length, totalPages: totalPages(result) },
  };
}

export function createAnnouncement(data: Omit<Announcement, "id">) {
  const newItem: Announcement = { ...data, id: nextAnnouncementId++ };
  announcements.push(newItem);
  return newItem;
}

export function deleteAnnouncement(id: number) {
  const idx = announcements.findIndex((a) => a.id === id);
  if (idx !== -1) announcements.splice(idx, 1);
}

// Call Requests
export function getCallRequests(page = 1) {
  const result = [...callRequests].sort((a, b) => new Date(b.timeRequested).getTime() - new Date(a.timeRequested).getTime());
  return {
    data: paginate(result, page),
    pagination: { page, perPage: ITEMS_PER_PAGE, total: result.length, totalPages: totalPages(result) },
  };
}

export function createCallRequest(data: Omit<CallRequest, "id">) {
  const newItem: CallRequest = { ...data, id: nextCallRequestId++ };
  callRequests.push(newItem);
  return newItem;
}

export function deleteCallRequest(id: number) {
  const idx = callRequests.findIndex((c) => c.id === id);
  if (idx !== -1) callRequests.splice(idx, 1);
}

// Quotation Requests
export function getQuotationRequests(page = 1) {
  const result = [...quotationRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return {
    data: paginate(result, page),
    pagination: { page, perPage: ITEMS_PER_PAGE, total: result.length, totalPages: totalPages(result) },
  };
}

export function createQuotationRequest(data: Omit<QuotationRequest, "id">) {
  const newItem: QuotationRequest = { ...data, id: nextQuotationRequestId++ };
  quotationRequests.push(newItem);
  return newItem;
}

export function deleteQuotationRequest(id: number) {
  const idx = quotationRequests.findIndex((q) => q.id === id);
  if (idx !== -1) quotationRequests.splice(idx, 1);
}

// Reviews
export function getReviews(page = 1) {
  const result = [...reviews];
  return {
    data: paginate(result, page),
    pagination: { page, perPage: ITEMS_PER_PAGE, total: result.length, totalPages: totalPages(result) },
  };
}

export function createReview(data: Omit<Review, "id">) {
  const newItem: Review = { ...data, id: nextReviewId++ };
  reviews.push(newItem);
  return newItem;
}

export function deleteReview(id: number) {
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx !== -1) reviews.splice(idx, 1);
}

// Subscribers
export function getSubscribers(page = 1) {
  const result = [...subscribers];
  return {
    data: paginate(result, page),
    pagination: { page, perPage: ITEMS_PER_PAGE, total: result.length, totalPages: totalPages(result) },
  };
}

export function deleteSubscriber(email: string) {
  const idx = subscribers.findIndex((s) => s.email === email);
  if (idx !== -1) subscribers.splice(idx, 1);
}

// Users
export function getUsers(page = 1) {
  const result = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return {
    data: paginate(result, page),
    pagination: { page, perPage: ITEMS_PER_PAGE, total: result.length, totalPages: totalPages(result) },
  };
}

export function getUserById(id: string) {
  return users.find((u) => u.id === id) || null;
}

export function createUser(data: Omit<User, "id" | "createdAt">) {
  const newUser: User = { ...data, id: `usr_${nextUserId++}`, createdAt: new Date().toISOString() };
  users.push(newUser);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  return users[idx];
}

export function deleteUser(id: string) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) users.splice(idx, 1);
}

// Stats
export function getStats() {
  return {
    quotations: documents.filter((d) => d.type === "quotation").length,
    invoices: documents.filter((d) => d.type === "invoice").length,
    receipts: documents.filter((d) => d.type === "receipt").length,
    deliveryNotes: documents.filter((d) => d.type === "delivery_note").length,
    callRequests: callRequests.length,
    quotationRequests: quotationRequests.length,
    reviews: reviews.length,
    subscribers: subscribers.length,
    announcements: announcements.length,
    users: users.length,
  };
}
