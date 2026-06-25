// Dummy data to replace database

// ============================================================
// TYPES
// ============================================================

export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: Date;
}

export interface CallRequest {
  id: number;
  client_name: string;
  phone_number: string;
  subject: string;
  time_requested: Date;
}

export interface Enquiry {
  id: number;
  clientName: string | null;
  contact: string;
  subject: string;
  message: string | null;
  timeRequested: Date;
}

export interface PayableAccount {
  id: number;
  display_name: string;
  payment_method_fkey: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  business_number: string | null;
  buyGoods_number: string | null;
}

export interface PaymentMethod {
  id: number;
  method: string;
}

export interface QuotationRequest {
  id: number;
  name: string;
  email: string;
  tel: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export interface Review {
  id: number;
  clientName: string | null;
  contact: string | null;
  message: string;
  rating: number | null;
}

export interface Service {
  id: number;
  service: string;
  created_at: Date;
  updated_at: Date;
}

export interface Student {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string | null;
  phone: string | null;
  address: string;
  img: string | null;
  bloodType: string;
  sex: "MALE" | "FEMALE";
  createdAt: Date;
  birthday: Date;
}

export interface Subscriber {
  email: string;
}

export interface TermsCondition {
  id: number;
  service: number;
  sale_document_type: number;
  terms: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  user_id: string;
  system_role: number;
  position: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  signature: string | null;
  passport: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSale {
  reference_id: string;
  role: number;
  sale_document_type: number;
  service: number;
  created_at: Date;
  is_active: number;
  replied_by: string | null;
  replied_at: Date | null;
}

export interface Role {
  role_id: number;
  role: string;
}

export interface Client {
  client_id: number;
  name: string;
  address: string | null;
  contact: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface CompanyDetail {
  id: number;
  company_name: string;
  kra_pin: string | null;
  logo: string | null;
  postal_address: string | null;
  physical_address: string;
  primary_email: string;
  secondary_email: string | null;
  primary_phone: string;
  secondary_phone: string | null;
}

export interface Quotation {
  id: number;
  quotation_number: string;
  qr_code: string;
  description: string;
  client_name: string;
  client_address: string | null;
  client_contact: string;
  labor: number | null;
  shipping: number | null;
  tax_type: "inclusive" | "exclusive" | "nill";
  tax_rate: number;
  terms_conditions: string;
  payment_account_enabled: boolean;
  payment_account_id: number | null;
  served_by_name: string;
  served_by_position: string;
  served_by_signature: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface QuotationItem {
  item_id: number;
  quotation_reference: number | null;
  item_description: string;
  item_quantity: number;
  item_unit_price: number;
}

export interface SaleDocumentType {
  id: number;
  document_type: string;
}

export interface SaleDocumentSharedAsset {
  id: number;
  asset_type: string;
  image: string;
}

// ============================================================
// DUMMY DATA STORES
// ============================================================

const now = new Date();

// Announcements
export let announcements: Announcement[] = [
  {
    id: 1,
    title: "New Term Begins",
    description: "Welcome back! The new academic term starts next week.",
    date: now,
  },
  {
    id: 2,
    title: "Holiday Notice",
    description: "School will be closed next Monday for a public holiday.",
    date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
  },
];

// Call Requests
export let callRequests: CallRequest[] = [
  {
    id: 1,
    client_name: "John Doe",
    phone_number: "+254712345678",
    subject: "Product Inquiry",
    time_requested: now,
  },
  {
    id: 2,
    client_name: "Jane Smith",
    phone_number: "+254723456789",
    subject: "Service Support",
    time_requested: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Enquiries
export let enquiries: Enquiry[] = [
  {
    id: 1,
    clientName: "Mike Johnson",
    contact: "mike@example.com",
    subject: "General Question",
    message: "I would like to know more about your services.",
    timeRequested: now,
  },
];

// Payment Methods
export let paymentMethods: PaymentMethod[] = [
  { id: 1, method: "M-Pesa" },
  { id: 2, method: "Bank Transfer" },
  { id: 3, method: "Cash" },
];

// Payable Accounts
export let payableAccounts: PayableAccount[] = [
  {
    id: 1,
    display_name: "M-Pesa Paybill",
    payment_method_fkey: "M-Pesa",
    bank_name: null,
    account_name: "Aztechnos Ltd",
    account_number: null,
    business_number: "123456",
    buyGoods_number: null,
  },
  {
    id: 2,
    display_name: "Bank Account",
    payment_method_fkey: "Bank Transfer",
    bank_name: "Equity Bank",
    account_name: "Aztechnos Ltd",
    account_number: "1234567890",
    business_number: null,
    buyGoods_number: null,
  },
];

// Quotation Requests
export let quotationRequests: QuotationRequest[] = [
  {
    id: 1,
    name: "Alice Cooper",
    email: "alice@example.com",
    tel: "0712345678",
    subject: "Website Development",
    message: "I need a quotation for a website development project.",
    createdAt: now,
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@example.com",
    tel: "0723456789",
    subject: "App Development",
    message: "Looking for mobile app development services.",
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Reviews
export let reviews: Review[] = [
  {
    id: 1,
    clientName: "Customer A",
    contact: "customerA@email.com",
    message: "Excellent service! Very professional team.",
    rating: 5,
  },
  {
    id: 2,
    clientName: "Customer B",
    contact: "customerB@email.com",
    message: "Good work, would recommend.",
    rating: 4,
  },
];

// Services
export let services: Service[] = [
  {
    id: 1,
    service: "Web Development",
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    service: "Mobile App Development",
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    service: "IT Consulting",
    created_at: now,
    updated_at: now,
  },
];

// Students
export let students: Student[] = [
  {
    id: "stu1",
    username: "student1",
    name: "StudentName1",
    surname: "StudentSurname1",
    email: "student1@school.com",
    phone: "01234567891",
    address: "123 Street 1",
    img: null,
    bloodType: "O+",
    sex: "MALE",
    createdAt: now,
    birthday: new Date(now.getFullYear() - 15, 0, 1),
  },
  {
    id: "stu2",
    username: "student2",
    name: "StudentName2",
    surname: "StudentSurname2",
    email: "student2@school.com",
    phone: "01234567892",
    address: "123 Street 2",
    img: null,
    bloodType: "A+",
    sex: "FEMALE",
    createdAt: now,
    birthday: new Date(now.getFullYear() - 16, 0, 2),
  },
];

// Subscribers
export let subscribers: Subscriber[] = [
  { email: "subscriber1@example.com" },
  { email: "subscriber2@example.com" },
  { email: "subscriber3@example.com" },
];

// Users
export let users: User[] = [
  {
    user_id: "user_2p9RFWQ4UHgUpcBmk0VvyCX2Djg",
    system_role: 1,
    position: "Administrator",
    email: "admin@aztechnos.com",
    firstName: "Wicklife",
    lastName: "Oluoch",
    phone: "+254712345678",
    signature: null,
    passport: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    user_id: "user_2p9RFWQ4UHgUpcBmk0VvyCX2Djh",
    system_role: 2,
    position: "Sales Manager",
    email: "sales@aztechnos.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+254723456789",
    signature: null,
    passport: null,
    createdAt: now,
    updatedAt: now,
  },
];

// Roles
export let roles: Role[] = [
  { role_id: 1, role: "admin" },
  { role_id: 2, role: "user" },
  { role_id: 3, role: "sales" },
];

// Notification Sales
export let notificationSales: NotificationSale[] = [
  {
    reference_id: "QT-1234567890",
    role: 1,
    sale_document_type: 1,
    service: 1,
    created_at: now,
    is_active: 1,
    replied_by: null,
    replied_at: null,
  },
];

// Company Details
export let companyDetails: CompanyDetail = {
  id: 1,
  company_name: "Aztechnos",
  kra_pin: "P051234567X",
  logo: null,
  postal_address: "P.O. Box 12345",
  physical_address: "Nairobi, Kenya",
  primary_email: "info@aztechnos.com",
  secondary_email: "support@aztechnos.com",
  primary_phone: "712345678",
  secondary_phone: "723456789",
};

// Quotations
export let quotations: Quotation[] = [
  {
    id: 1,
    quotation_number: "QT-ABC123DEF456",
    qr_code: "QT-ABC123DEF456",
    description: "Website Development Services",
    client_name: "Client Company Ltd",
    client_address: "Nairobi, Kenya",
    client_contact: "client@example.com",
    labor: 5000,
    shipping: 2000,
    tax_type: "exclusive",
    tax_rate: 0.16,
    terms_conditions: "Payment within 30 days. Valid for 90 days.",
    payment_account_enabled: true,
    payment_account_id: 1,
    served_by_name: "Wicklife Oluoch",
    served_by_position: "Administrator",
    served_by_signature: "",
    created_at: now,
    updated_at: null,
  },
];

// Quotation Items
export let quotationItems: QuotationItem[] = [
  {
    item_id: 1,
    quotation_reference: 1,
    item_description: "Website Design",
    item_quantity: 1,
    item_unit_price: 50000,
  },
  {
    item_id: 2,
    quotation_reference: 1,
    item_description: "Website Development",
    item_quantity: 1,
    item_unit_price: 100000,
  },
  {
    item_id: 3,
    quotation_reference: 1,
    item_description: "Hosting (1 Year)",
    item_quantity: 1,
    item_unit_price: 15000,
  },
];

// Sale Document Types
export let saleDocumentTypes: SaleDocumentType[] = [
  { id: 1, document_type: "quotation" },
  { id: 2, document_type: "invoice" },
  { id: 3, document_type: "receipt" },
  { id: 4, document_type: "delivery_note" },
];

// Sale Document Shared Assets (base64 placeholder)
export let saleDocumentSharedAssets: SaleDocumentSharedAsset[] = [
  { id: 1, asset_type: "header_image", image: "" },
  { id: 2, asset_type: "footer_image", image: "" },
  { id: 3, asset_type: "official_stamp", image: "" },
];

// Terms Conditions
export let termsConditions: TermsCondition[] = [
  {
    id: 1,
    service: 1,
    sale_document_type: 1,
    terms: "Payment within 30 days. Quotation valid for 90 days from date of issue.",
    created_at: now,
    updated_at: now,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// ID Generators
let nextAnnouncementId = announcements.length + 1;
let nextCallRequestId = callRequests.length + 1;
let nextQuotationRequestId = quotationRequests.length + 1;
let nextReviewId = reviews.length + 1;
let nextQuotationId = quotations.length + 1;
let nextQuotationItemId = quotationItems.length + 1;

export const generateId = () => Math.random().toString(36).substring(2, 15);

// Announcement helpers
export const getAnnouncements = async ({ take, skip, where, orderBy }: { take?: number; skip?: number; where?: any; orderBy?: any } = {}) => {
  let result = [...announcements];
  // Apply where filter (simplified)
  return result.slice(skip, skip && take ? skip + take : undefined);
};

export const getAnnouncementsCount = async ({ where }: { where?: any } = {}) => {
  return announcements.length;
};

export const createAnnouncement = async (data: Partial<Announcement>) => {
  const newAnnouncement: Announcement = {
    id: nextAnnouncementId++,
    title: data.title || "",
    description: data.description || "",
    date: data.date || new Date(),
  };
  announcements.push(newAnnouncement);
  return newAnnouncement;
};

export const updateAnnouncement = async (id: number, data: Partial<Announcement>) => {
  const index = announcements.findIndex(a => a.id === id);
  if (index === -1) throw new Error("Announcement not found");
  announcements[index] = { ...announcements[index], ...data };
  return announcements[index];
};

export const deleteAnnouncement = async (id: number) => {
  const index = announcements.findIndex(a => a.id === id);
  if (index !== -1) announcements.splice(index, 1);
};

// CallRequest helpers
export const getCallRequests = async ({ take, skip, where, orderBy }: { take?: number; skip?: number; where?: any; orderBy?: any } = {}) => {
  let result = [...callRequests];
  return result.slice(skip, skip && take ? skip + take : undefined);
};

export const getCallRequestsCount = async ({ where }: { where?: any } = {}) => {
  return callRequests.length;
};

export const createCallRequest = async (data: Partial<CallRequest>) => {
  const newCallRequest: CallRequest = {
    id: nextCallRequestId++,
    client_name: data.client_name || "",
    phone_number: data.phone_number || "",
    subject: data.subject || "",
    time_requested: data.time_requested || new Date(),
  };
  callRequests.push(newCallRequest);
  return newCallRequest;
};

export const deleteCallRequest = async (id: number) => {
  const index = callRequests.findIndex(c => c.id === id);
  if (index !== -1) callRequests.splice(index, 1);
};

// QuotationRequest helpers
export const getQuotationRequests = async ({ take, skip, where, orderBy }: { take?: number; skip?: number; where?: any; orderBy?: any } = {}) => {
  let result = [...quotationRequests];
  return result.slice(skip, skip && take ? skip + take : undefined);
};

export const getQuotationRequestsCount = async ({ where }: { where?: any } = {}) => {
  return quotationRequests.length;
};

export const createQuotationRequest = async (data: Partial<QuotationRequest>) => {
  const newQuotationRequest: QuotationRequest = {
    id: nextQuotationRequestId++,
    name: data.name || "",
    email: data.email || "",
    tel: data.tel || "",
    subject: data.subject || "",
    message: data.message || "",
    createdAt: data.createdAt || new Date(),
  };
  quotationRequests.push(newQuotationRequest);
  return newQuotationRequest;
};

export const deleteQuotationRequest = async (id: number) => {
  const index = quotationRequests.findIndex(q => q.id === id);
  if (index !== -1) quotationRequests.splice(index, 1);
};

// Review helpers
export const getReviews = async ({ take, skip, where, orderBy }: { take?: number; skip?: number; where?: any; orderBy?: any } = {}) => {
  let result = [...reviews];
  return result.slice(skip, skip && take ? skip + take : undefined);
};

export const getReviewsCount = async ({ where }: { where?: any } = {}) => {
  return reviews.length;
};

export const createReview = async (data: Partial<Review>) => {
  const newReview: Review = {
    id: nextReviewId++,
    clientName: data.clientName || null,
    contact: data.contact || null,
    message: data.message || "",
    rating: data.rating || null,
  };
  reviews.push(newReview);
  return newReview;
};

export const deleteReview = async (id: number) => {
  const index = reviews.findIndex(r => r.id === id);
  if (index !== -1) reviews.splice(index, 1);
};

// Subscriber helpers
export const getSubscribers = async ({ take, skip, where, orderBy }: { take?: number; skip?: number; where?: any; orderBy?: any } = {}) => {
  let result = [...subscribers];
  return result.slice(skip, skip && take ? skip + take : undefined);
};

export const getSubscribersCount = async ({ where }: { where?: any } = {}) => {
  return subscribers.length;
};

export const deleteSubscriber = async (email: string) => {
  const index = subscribers.findIndex(s => s.email === email);
  if (index !== -1) subscribers.splice(index, 1);
};

// Quotation helpers
export const getQuotations = async ({ take, skip, where, orderBy, select }: { take?: number; skip?: number; where?: any; orderBy?: any; select?: any } = {}) => {
  let result = quotations.map(q => ({
    ...q,
    quotation_items: quotationItems.filter(i => i.quotation_reference === q.id),
    payable_account: q.payment_account_id ? payableAccounts.find(a => a.id === q.payment_account_id) : null,
  }));
  return result.slice(skip, skip && take ? skip + take : undefined);
};

export const getQuotationsCount = async ({ where }: { where?: any } = {}) => {
  return quotations.length;
};

export const getQuotationById = async (id: number) => {
  const quotation = quotations.find(q => q.id === id);
  if (!quotation) return null;
  return {
    ...quotation,
    quotation_items: quotationItems.filter(i => i.quotation_reference === id),
    payable_account: quotation.payment_account_id ? payableAccounts.find(a => a.id === quotation.payment_account_id) : null,
  };
};

export const createQuotation = async (data: Partial<Quotation>) => {
  const newQuotation: Quotation = {
    id: nextQuotationId++,
    quotation_number: data.quotation_number || `QT-${generateId()}`,
    qr_code: data.qr_code || `QT-${generateId()}`,
    description: data.description || "",
    client_name: data.client_name || "",
    client_address: data.client_address || null,
    client_contact: data.client_contact || "",
    labor: data.labor || 0,
    shipping: data.shipping || 0,
    tax_type: data.tax_type || "exclusive",
    tax_rate: data.tax_rate || 0.16,
    terms_conditions: data.terms_conditions || "",
    payment_account_enabled: data.payment_account_enabled || false,
    payment_account_id: data.payment_account_id || null,
    served_by_name: data.served_by_name || "",
    served_by_position: data.served_by_position || "",
    served_by_signature: data.served_by_signature || "",
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || null,
  };
  quotations.push(newQuotation);
  return newQuotation;
};

export const createQuotationItems = async (items: Partial<QuotationItem>[]) => {
  const newItems = items.map(item => ({
    item_id: nextQuotationItemId++,
    quotation_reference: item.quotation_reference || null,
    item_description: item.item_description || "",
    item_quantity: item.item_quantity || 0,
    item_unit_price: item.item_unit_price || 0,
  }));
  quotationItems.push(...newItems);
  return { count: newItems.length };
};

// User helpers
export const getUserById = async (userId: string) => {
  return users.find(u => u.user_id === userId) || null;
};

// Service helpers
export const getServices = async () => {
  return services;
};

// Payable Account helpers
export const getPayableAccounts = async () => {
  return payableAccounts;
};

// Company Details helpers
export const getCompanyDetails = async () => {
  return companyDetails;
};

// Notification helpers
export const getNotificationSalesCount = async ({ where }: { where?: any } = {}) => {
  return notificationSales.filter(n => n.is_active === 1).length;
};

// Sale Document Shared Assets
export const getSaleDocumentSharedAssets = async (assetTypes: string[]) => {
  return saleDocumentSharedAssets.filter(a => assetTypes.includes(a.asset_type));
};

// Terms Conditions
export const getTermsConditions = async (serviceId: number, saleDocTypeId: number) => {
  return termsConditions.find(t => t.service === serviceId && t.sale_document_type === saleDocTypeId) || null;
};

// Transaction helper (mock)
export const $transaction = async <T>(operations: Promise<T>[]): Promise<T[]> => {
  return Promise.all(operations);
};


export { services }

export { payableAccounts }

export { announcements }

export { callRequests, reviews, subscribers, enquiries, quotationRequests }

export { notificationSales }

export { quotations, quotationItems }

export { companyDetails }

export { saleDocumentTypes, termsConditions }

export { users }

export { students }

export { saleDocumentSharedAssets }