import { paymentsApi } from "@/config/axios";
import { PlanFeatures } from "@/models/plans-features.models";
import { UserSubscription } from "@/models/subscription.models";
import { buildPaymentsAuthHeadersApiKey } from "@/utils";

export const getPlansFeatures = async () => {
  const res = await paymentsApi.get("/system/plans-features", {
    headers: buildPaymentsAuthHeadersApiKey(),
  });

  return res.data as PlanFeatures[];
};

export const getUserSubscription = async (userId: string) => {
  const res = await paymentsApi.get(`/system/subscription/user/${userId}`, {
    headers: buildPaymentsAuthHeadersApiKey(),
  });

  return res.data as UserSubscription;
};
