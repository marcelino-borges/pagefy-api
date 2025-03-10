export interface UserSubscription {
  subscriptionId: string;
  stripeProductId: string;
  isActive: boolean;
  interval: string;
  currency: string;
  onlineReceiptUrl: string;
  price: number;
  captureDate: Date;
  planName: string;
  planImageUrl: string;
  invoiceOnlineUrl: string | null;
  invoiceDownloadPdf: string | null;
  willCancelAt: Date | null;
  canceledAt: Date | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}
