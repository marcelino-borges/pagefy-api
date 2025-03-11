import { IUserPage } from "@/models/pages.models";
import { PlanFeatures } from "@/models/plans-features.models";

export const removeAnimationsIfNotInPlan = (
  page: IUserPage,
  userPlan?: PlanFeatures,
): IUserPage => {
  if (!userPlan || !userPlan.animations)
    return {
      ...page,
      bottomComponents: page.bottomComponents?.map((comp) => ({
        ...comp,
        animation: undefined,
      })),
      middleComponents: page.middleComponents?.map((comp) => ({
        ...comp,
        animation: undefined,
      })),
      topComponents: page.topComponents?.map((comp) => ({
        ...comp,
        animation: undefined,
      })),
    };

  return page;
};

export const removeComponentsLaunchDateIfNotInPlan = (
  page: IUserPage,
  userPlan?: PlanFeatures,
): IUserPage => {
  if (!userPlan || !userPlan.componentActivationSchedule)
    return {
      ...page,
      bottomComponents: page.bottomComponents?.map((comp) => ({
        ...comp,
        launchDate: undefined,
      })),
      middleComponents: page.middleComponents?.map((comp) => ({
        ...comp,
        launchDate: undefined,
      })),
      topComponents: page.topComponents?.map((comp) => ({
        ...comp,
        launchDate: undefined,
      })),
    };

  return page;
};

export const removeCustomJsIfNotInPlan = (
  page: IUserPage,
  userPlan?: PlanFeatures,
): IUserPage => {
  if (!userPlan || !userPlan.customJs)
    return {
      ...page,
      customScripts: {
        header: undefined,
        endBody: undefined,
      },
    };

  return page;
};

export const hasAnalyticsInPlan = (userPlan?: PlanFeatures) =>
  !!userPlan?.analytics;
