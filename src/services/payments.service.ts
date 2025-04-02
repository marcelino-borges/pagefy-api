import { paymentsApi } from "@/config/axios";
import { PlanFeatures } from "@/models/plans-features.models";
import { UserSubAndFeatures } from "@/models/subscription.models";
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

export const getUserActiveSubscription = async (
  userId: string,
  accessToken: string,
  uid: string,
) => {
  try {
    const res = await paymentsApi.get(`/subscription/active/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        authId: uid,
      },
    });

    return res.data as UserSubAndFeatures;
  } catch (error) {
    log.error("Error fetching user subscription: ", error);
    return null;
  }
};
