import PagesDB, { IUserComponent } from "@/models/pages.models";
import { IUserPage } from "@/models/pages.models";
import { PlanFeatures } from "@/models/plans-features.models";

import { deleteFile } from "./files.service";
import { getUserPagesCount } from "./user.service";

export const getPageById = async (pageId: string) => {
  const found: IUserPage = await PagesDB.findOne({ _id: pageId }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const getPageByUrl = async (
  url: string,
  shouldIncrementViews: boolean,
) => {
  const found: IUserPage = await PagesDB.findOneAndUpdate(
    { url },
    {
      $inc: {
        views: shouldIncrementViews ? 1 : 0,
      },
    },
  ).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const getAllUserPagesByUserId = async (userId: string) => {
  const found: IUserPage[] = await PagesDB.find({ userId: userId }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const doesPageUrlExist = async (url: string) => {
  const urlFound: any = await PagesDB.findOne({ url });

  return !!urlFound;
};

export const createUserPage = async (page: IUserPage, userId: string) => {
  const created: IUserPage = (
    await PagesDB.create({ ...page, userId })
  ).toObject();

  if (!created) {
    return null;
  }

  return created;
};

export const updateUserPage = async (page: IUserPage) => {
  const updated: IUserPage = await PagesDB.findOneAndUpdate(
    { _id: page._id },
    page,
    { new: true },
  ).lean();

  if (!updated) {
    return null;
  }

  return updated;
};

export const deleteUserPage = async (pageId: string) => {
  const pageFound = await PagesDB.findOne({ _id: pageId }).lean();

  if (pageFound) {
    if (pageFound.middleComponents && pageFound.middleComponents.length > 0) {
      for (const component of pageFound.middleComponents) {
        if (component.mediaUrl && component.mediaUrl.length > 0) {
          deleteFile(component.mediaUrl);
        }
        if (
          component.style &&
          component.style.backgroundImage &&
          component.style.backgroundImage.length > 0
        ) {
          deleteFile(component.style.backgroundImage);
        }
      }
      pageFound.middleComponents.forEach((component: IUserComponent) => {});
    }

    return PagesDB.findOneAndDelete({
      _id: pageId,
    })
      .then(() => {
        return true;
      })
      .catch((err: any) => {
        return false;
      });
  }
};

export const incrementUserPageViewsByUrl = async (pageUrl: string) => {
  const found = await getPageByUrl(pageUrl, true);

  return !!found;
};

export const incrementComponentClicks = async (
  pageId: string,
  componentId: string,
) => {
  const foundPage = await getPageById(pageId);

  if (!foundPage) {
    return false;
  }

  let hasFoundComponent = false;

  if (foundPage.topComponents && foundPage.topComponents.length > 0) {
    foundPage.topComponents = foundPage.topComponents.map(
      (component: IUserComponent) => {
        if (component._id === componentId) {
          hasFoundComponent = true;
          return {
            ...component,
            clicks: component.clicks + 1,
          };
        }
        return component;
      },
    );
  }

  if (
    !hasFoundComponent &&
    foundPage.middleComponents &&
    foundPage.middleComponents.length > 0
  ) {
    foundPage.middleComponents = foundPage.middleComponents.map(
      (component: IUserComponent) => {
        if (component._id === componentId) {
          hasFoundComponent = true;
          return {
            ...component,
            clicks: component.clicks + 1,
          };
        }
        return component;
      },
    );
  }

  if (
    !hasFoundComponent &&
    foundPage.bottomComponents &&
    foundPage.bottomComponents.length > 0
  ) {
    foundPage.bottomComponents = foundPage.bottomComponents.map(
      (component: IUserComponent) => {
        if (component._id === componentId) {
          return {
            ...component,
            clicks: component.clicks + 1,
          };
        }
        return component;
      },
    );
  }

  const updated = await updateUserPage(foundPage);

  if (!updated) {
    return false;
  }

  return true;
};

export const deleteAllUserPages = async (userId: string): Promise<number> => {
  const deletedCount = (await PagesDB.deleteMany({ userId })).deletedCount;

  return deletedCount || 0;
};

export const isUserPagesCountOk = async (
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
    console.log(`Error checking if user ${userId} can create page: `, error);
    return false;
  }
};
