import { getStorage } from "firebase-admin/storage";
import { Request, Response } from "express";
import AppResult from "./../errors/app-error";
import { AppErrorsMessages, AppSuccessMessages } from "../constants";
import moment from "moment";
import { getUserById } from "../services/user.service";
import log from "../utils/logs";

export const uploadFileToStorage = async (req: Request, res: Response) => {
  const image: any = req.file;
  const { userId, userFolderName } = req.body;

  const userFound = await getUserById(userId);

  if (!userFound) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.USER_NOT_FOUND, null, 400));
  }

  const bucket = process.env.FIREBASE_STORAGE_BUCKET_URL;

  if (!bucket) {
    return res
      .status(500)
      .json(
        new AppResult(
          AppErrorsMessages.INTERNAL_ERROR,
          "No bucket env var found",
          500
        )
      );
  }

  const storage = getStorage().bucket();
  const fileExtension = image.originalname.split(".")[1];
  const timeStamp = moment().format("YYYYMMDDHHmmssSSS");

  const fileName = `users/${userId}/${userFolderName}/${userId}_${timeStamp}.${fileExtension}`;

  const fileToSave = storage.file(fileName);
  const stream = fileToSave.createWriteStream({
    metadata: {
      contentType: image.mimetype,
    },
  });

  stream.on("error", (e: any) => {
    log.error("Error uploading file:", e);
    return res
      .status(400)
      .json(
        new AppResult(
          AppErrorsMessages.FILE_UPLOAD_GENERAL_ERROR,
          e.message,
          400
        )
      );
  });

  stream.on("finish", async () => {
    log.success("File upload successful.");
    (
      req as any
    ).file.firebaseUrl = `https://storage.googleapis.com/${bucket}/${fileName}`;

    await fileToSave.makePublic();
    return res.status(200).json(image.firebaseUrl);
  });

  stream.end(image.buffer);
};

export const deleteFileFromStorage = async (req: Request, res: Response) => {
  const { url, userId } = req.body;

  const userFound = await getUserById(userId);

  if (!userFound) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.USER_NOT_FOUND, null, 400));
  }

  const bucket = process.env.FIREBASE_STORAGE_BUCKET_URL;

  if (!bucket) {
    return res
      .status(500)
      .json(
        new AppResult(
          AppErrorsMessages.INTERNAL_ERROR,
          "No bucket env var found",
          500
        )
      );
  }

  const storage = getStorage().bucket();

  const fileName = url.replace(`https://storage.googleapis.com/${bucket}/`, "");

  return storage
    .file(fileName)
    .delete()
    .then(() => res.status(200).json(AppSuccessMessages.FILE_DELETE_SUCCESS))
    .catch((e: any) =>
      res
        .status(400)
        .json(
          new AppResult(
            AppErrorsMessages.FILE_DELETE_GENERAL_ERROR,
            e.message,
            400
          )
        )
    );
};

// TODO: Check if can be used into `deleteFileFromStorage()`
export const deleteFile = async (url: string) => {
  const bucket = process.env.FIREBASE_STORAGE_BUCKET_URL;

  if (!bucket) return false;

  const storage = getStorage().bucket();

  const fileName = url.replace(`https://storage.googleapis.com/${bucket}/`, "");

  return storage
    .file(fileName)
    .delete()
    .then(() => true)
    .catch(() => false);
};
