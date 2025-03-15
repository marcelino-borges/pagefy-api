import { paymentsApi } from "@/config/axios";
import { PlanFeatures } from "@/models/plans-features.models";
import { UserSubscription } from "@/models/subscription.models";
import { buildPaymentsAuthHeadersApiKey } from "@/utils";
import log from "@/utils/logs";

export const getPlansFeatures = async () => {
  try {
    const res = await paymentsApi.get("/system/plans-features", {
      headers: buildPaymentsAuthHeadersApiKey(),
    });

    return res.data as PlanFeatures[];
  } catch (error) {
    log.error("Error fetching plans features: ", error);
    return [];
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const res = await paymentsApi.get(`/system/subscription/user/${userId}`, {
      headers: buildPaymentsAuthHeadersApiKey(),
    });

    return res.data as UserSubscription;
  } catch (error) {
    log.error("Error fetching user subscription: ", error);
    return null;
  }
};
