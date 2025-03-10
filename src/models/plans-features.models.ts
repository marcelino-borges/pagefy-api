export interface PlanFeatures {
  _id: string;
  stripeProductId: string;
  description: string;
  maxPages: number;
  animations: boolean;
  specialSupport: boolean;
  componentActivationSchedule: boolean;
  analytics: boolean;
  customJs: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
