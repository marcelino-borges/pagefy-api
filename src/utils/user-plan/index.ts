import { PlanFeatures } from "@/models/plans-features.models";
import { getUserPagesCount } from "@/services/user.service";

export const canUserCreatePage = async (
  userId: string,
  userPlan?: PlanFeatures,
) => {
  try {
    const userPagesCount = await getUserPagesCount(userId);

    if (!userPlan) {
      return userPagesCount === 0;
    }

    return userPagesCount < userPlan.maxPages;
  } catch (error) {
    console.log("Error checking if user can create page: ", error);
    return false;
  }
};
