import { IUserComponent, pagesModel } from "@/models/pages.models";
import { IUserPage } from "@/models/pages.models";
import { PlanFeatures } from "@/models/plans-features.models";

import { deleteFile } from "./files.service";

export const getPageById = async (pageId: string) => {
  const found: IUserPage = await pagesModel.findOne({ _id: pageId }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const getPageByUrl = async (
  url: string,
  shouldIncrementViews: boolean,
) => {
  const found: IUserPage = await pagesModel
    .findOneAndUpdate(
      { url },
      {
        $inc: {
          views: shouldIncrementViews ? 1 : 0,
        },
      },
    )
    .lean();

  if (!found) {
    return null;
  }

  return found;
};

export const getAllUserPagesByUserId = async (userId: string) => {
  const found: IUserPage[] = await pagesModel.find({ userId: userId }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const doesPageUrlExist = async (url: string) => {
  const urlFound: any = await pagesModel.findOne({ url });

  return !!urlFound;
};

export const createUserPage = async (page: IUserPage, userId: string) => {
  const created: IUserPage = (
    await pagesModel.create({ ...page, userId })
  ).toObject();

  if (!created) {
    return null;
  }

  return created;
};

export const updateUserPage = async (page: IUserPage) => {
  const updated: IUserPage = await pagesModel
    .findOneAndUpdate({ _id: page._id }, page, { new: true })
    .lean();

  if (!updated) {
    return null;
  }

  return updated;
};

export const deleteUserPage = async (pageId: string) => {
  const pageFound = await pagesModel.findOne({ _id: pageId }).lean();

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

    return pagesModel
      .findOneAndDelete({
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
  const deletedCount = (await pagesModel.deleteMany({ userId })).deletedCount;

  return deletedCount || 0;
};

export const getUserPagesCount = async (userId: string) => {
  const count = await pagesModel
    .find({
      userId,
    })
    .count();

  return count;
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
