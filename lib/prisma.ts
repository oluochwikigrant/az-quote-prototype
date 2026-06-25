// Re-export dummy data helpers for compatibility
import * as dummyData from "./dummyData";

export default {
  announcement: {
    findMany: dummyData.getAnnouncements,
    count: dummyData.getAnnouncementsCount,
    create: dummyData.createAnnouncement,
    update: dummyData.updateAnnouncement,
    delete: dummyData.deleteAnnouncement,
  },
  callrequest: {
    findMany: dummyData.getCallRequests,
    count: dummyData.getCallRequestsCount,
    create: dummyData.createCallRequest,
    delete: dummyData.deleteCallRequest,
  },
  quotation_request: {
    findMany: dummyData.getQuotationRequests,
    count: dummyData.getQuotationRequestsCount,
    create: dummyData.createQuotationRequest,
    delete: dummyData.deleteQuotationRequest,
  },
  review: {
    findMany: dummyData.getReviews,
    count: dummyData.getReviewsCount,
    create: dummyData.createReview,
    delete: dummyData.deleteReview,
  },
  subscribers: {
    findMany: dummyData.getSubscribers,
    count: dummyData.getSubscribersCount,
    delete: dummyData.deleteSubscriber,
  },
  quotations: {
    findMany: dummyData.getQuotations,
    findUnique: dummyData.getQuotationById,
    count: dummyData.getQuotationsCount,
    create: dummyData.createQuotation,
  },
  quotation_items: {
    createMany: dummyData.createQuotationItems,
  },
  user: {
    findUnique: dummyData.getUserById,
  },
  services: {
    findMany: dummyData.getServices,
  },
  payable_account: {
    findMany: dummyData.getPayableAccounts,
    findUnique: (args: { where: { id: number } }) =>
      Promise.resolve(dummyData.payableAccounts.find(a => a.id === args.where.id) || null),
  },
  company_details: {
    findFirst: dummyData.getCompanyDetails,
  },
  notification_sales: {
    count: dummyData.getNotificationSalesCount,
  },
  sale_document_shared_assets: {
    findMany: (args: { where: { asset_type: { in: string[] } }; select: { asset_type: boolean; image: boolean } }) =>
      dummyData.getSaleDocumentSharedAssets(args.where.asset_type.in),
  },
  terms_conditions: {
    findUnique: (args: { where: { service_sale_document_type: { service: number; sale_document_type: number } }; select: { terms: boolean } }) =>
      Promise.resolve(dummyData.getTermsConditions(
        args.where.service_sale_document_type.service,
        args.where.service_sale_document_type.sale_document_type
      )),
  },
  sale_document_type: {
    findUnique: (args: { where: { document_type: string }; select: { id: boolean } }) =>
      Promise.resolve(dummyData.saleDocumentTypes.find(s => s.document_type === args.where.document_type) || null),
  },
  $transaction: dummyData.$transaction,
};

// Export types
export * from "./dummyData";
