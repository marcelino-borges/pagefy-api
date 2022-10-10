import { getStorage, Storage } from "firebase-admin/storage";
import { Request, Response } from "express";
import AppResult from "./../errors/app-error";
import {
  AppErrorsMessages,
  AppSuccessMessages,
  STORAGE_BUCKETS,
} from "../constants";
import moment from "moment";
import { getUserById } from "../services/user.service";
import log from "../utils/logs";
import { IImageDetails } from "../models/files.models";
import { getImageThumbnail } from "../utils";

export const uploadFileToStorage = async (req: Request, res: Response) => {
  const image: any = req.file;
  const { userId, userFolderName } = req.body;

  const userFound = await getUserById(userId);

  if (!userFound) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.USER_NOT_FOUND, null, 400));
  }

  if (!STORAGE_BUCKETS.socialbioProject) {
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
    ).file.firebaseUrl = `${STORAGE_BUCKETS.baseUrl}/${STORAGE_BUCKETS.socialbioProject}/${fileName}`;

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

  if (!STORAGE_BUCKETS.socialbioProject) {
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

  const fileName = url.replace(
    `${STORAGE_BUCKETS.baseUrl}/${STORAGE_BUCKETS.socialbioProject}/`,
    ""
  );

  let thumbFileName = getImageThumbnail(url, 200);
  thumbFileName = thumbFileName.replace(
    `${STORAGE_BUCKETS.baseUrl}/${STORAGE_BUCKETS.socialbioProject}/`,
    ""
  );

  return storage
    .file(fileName)
    .delete()
    .then(() =>
      storage
        .file(thumbFileName)
        .delete()
        .then(() => {
          return res
            .status(200)
            .json(
              new AppResult(
                AppSuccessMessages.FILE_DELETE_SUCCESS,
                AppSuccessMessages.THUMBNAIL_DELETED
              )
            );
        })
        .catch(() => {
          return res
            .status(200)
            .json(
              new AppResult(
                AppSuccessMessages.FILE_DELETE_SUCCESS,
                AppErrorsMessages.THUMBNAIL_NOT_DELETED
              )
            );
        })
    )
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
  if (!STORAGE_BUCKETS.socialbioProject) return false;

  const storage = getStorage().bucket();

  const fileName = url.replace(
    `${STORAGE_BUCKETS.baseUrl}/${STORAGE_BUCKETS.socialbioProject}/`,
    ""
  );

  return storage
    .file(fileName)
    .delete()
    .then(() => true)
    .catch(() => false);
};

export const deleteAllUserFiles = async (userId: string): Promise<number> => {
  if (!STORAGE_BUCKETS.socialbioProject) return 0;
  const userBucketName = `users/${userId}`;

  const userStorage = getStorage().bucket(userBucketName);
  const [files] = await userStorage.getFiles();

  const filesCount = files.length;

  return userStorage
    .delete()
    .then(() => filesCount)
    .catch(() => 0);
};

export const getAllImagesOnBucket = async (
  bucket: string
): Promise<IImageDetails[] | null> => {
  if (!STORAGE_BUCKETS.socialbioProject) return null;

  const [files] = await getStorage().bucket().getFiles({
    prefix: bucket,
    delimiter: "/",
  });

  const urlArray: IImageDetails[] = [];

  files.forEach((file: any) => {
    if (
      file &&
      file.name &&
      (file.name as string).length > 0 &&
      file.name.length > bucket.length // Preventing an case that GCloud returned an empty file
    ) {
      let originalUrl = "";
      let thumbnailUrl = "";

      if (!(file.name as string).includes("_200x200")) {
        originalUrl = `${STORAGE_BUCKETS.baseUrl}/${STORAGE_BUCKETS.socialbioProject}/${file.name}`;
        thumbnailUrl = getImageThumbnail(originalUrl, 200);
      }

      if (originalUrl && thumbnailUrl) {
        urlArray.push({
          original: originalUrl,
          thumbnail: thumbnailUrl,
          isSystemOwned: originalUrl.includes("system/"),
        });
      }
    }
  });

  if (urlArray && urlArray.length > 0) return urlArray;

  return null;
};

export const getAllUserImages = async (
  userId: string
): Promise<IImageDetails[] | null> => {
  const userBucket = `users/${userId}/${STORAGE_BUCKETS.userUploadedImages}/`;

  return await getAllImagesOnBucket(userBucket);
};

export const getAllButtonsTemplates = async (): Promise<
  IImageDetails[] | null
> => {
  const buttonsTemplatesBucket = `${STORAGE_BUCKETS.buttonsTemplates}/`;

  return await getAllImagesOnBucket(buttonsTemplatesBucket);
};

export const getAllBackgroundsTemplates = async (): Promise<
  IImageDetails[] | null
> => {
  const bgTemplatesBucket = `${STORAGE_BUCKETS.backgroundsTemplates}/`;

  return await getAllImagesOnBucket(bgTemplatesBucket);
};

export const getAllUserProfileTemplates = async (): Promise<
  IImageDetails[] | null
> => {
  const userProfileTemplatesBucket = `${STORAGE_BUCKETS.userProfileTemplates}/`;

  return await getAllImagesOnBucket(userProfileTemplatesBucket);
};

export const getAllPagesImgsTemplates = async (): Promise<
  IImageDetails[] | null
> => {
  const pagesImgsTemplatesBucket = `${STORAGE_BUCKETS.pagesImgsTemplates}/`;

  return await getAllImagesOnBucket(pagesImgsTemplatesBucket);
};
