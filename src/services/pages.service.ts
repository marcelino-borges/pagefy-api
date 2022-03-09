import PagesDB from "../models/pages.models";
import { IUserPage } from "./../models/pages.models";

export const getPageById = async (pageId: string) => {
  const found: IUserPage = await PagesDB.findOne({ _id: pageId }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const getPageByUrl = async (url: string) => {
  const found: IUserPage = await PagesDB.findOne({ url }).lean();

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
  const created: IUserPage = await PagesDB.findOneAndUpdate(
    { _id: page._id },
    page,
    { new: true }
  ).lean();

  if (!created) {
    return null;
  }

  return created;
};

export const deleteUserPage = async (pageId: string) => {
  return PagesDB.findOneAndDelete({
    _id: pageId,
  })
    .then(() => {
      return true;
    })
    .catch((err: any) => {
      return false;
    });
};
