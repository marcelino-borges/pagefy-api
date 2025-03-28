import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { Types } from "mongoose";

import AppResult from "@/errors/app-error";
import UserDB, { UserOnboardings } from "@/models/user.models";
import { IUser } from "@/models/user.models";

import { deleteAllUserFiles } from "./files.service";
import { deleteAllUserPages } from "./pages.service";

export const getUserByEmail = async (email: string) => {
  const found = await UserDB.findOne({ email }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const getUserById = async (userId: string) => {
  const found = await UserDB.findOne({ _id: userId }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const getUserByAuthId = async (authId: string) => {
  const found = await UserDB.findOne({ authId }).lean();

  if (!found) {
    return null;
  }

  return found;
};

export const createUser = async (user: IUser) => {
  const userCreated = (await UserDB.create(user)).toObject();

  if (!userCreated) {
    return null;
  }

  return userCreated;
};

export const updateUser = async (user: IUser) => {
  let existingUser = await UserDB.findOne({ _id: user._id });

  if (!existingUser) {
    return null;
  }

  const userUpdated = await UserDB.findOneAndUpdate(
    { _id: user._id },
    { ...user, email: existingUser.email },
    {
      new: true,
    },
  );

  if (!userUpdated) {
    return null;
  }

  return userUpdated;
};

export const updateUserPaymentId = async (email: string, paymentId: string) => {
  let userUpdated = await UserDB.findOneAndUpdate(
    { email },
    { paymentId },
    { new: true },
  );

  if (!userUpdated) {
    return null;
  }

  return userUpdated;
};

export const updateOnboardingEvent = async (
  onboardings: UserOnboardings,
  userId: string,
) => {
  let userUpdated = await UserDB.findOneAndUpdate(
    { id: userId },
    { onboardings: onboardings },
    { new: true },
  );

  if (!userUpdated) {
    return null;
  }

  return userUpdated;
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId: string = req.query.userId as string;
  const authId: string = req.query.authId as string;

  if (!userId || !authId) {
    return res
      .status(400)
      .json(new AppResult(req.messages.INVALID_REQUEST, null, 400));
  }

  const firebaseAuth = getAuth();

  return firebaseAuth
    .deleteUser(authId)
    .then(async () => {
      // After successfuly deleting firebase auth user
      const usersDeletedCount = (
        await UserDB.deleteOne({
          _id: userId,
        })
      ).deletedCount; // deleteOne() removes at most one, but the count can be 0, if couln't delete the user

      const pagesDeletedCount = await deleteAllUserPages(userId);

      const filesDeletedCount: number = await deleteAllUserFiles(userId);

      return res.status(204).json({
        usersDeletedCount,
        pagesDeletedCount,
        filesDeletedCount,
      });
    })
    .catch((error: any) => {
      return res
        .status(400)
        .json(
          new AppResult(
            req.messages.USER_NOT_DELETED_FROM_FIREBASE,
            error,
            400,
          ),
        );
    });
};
