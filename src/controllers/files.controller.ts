import { Request } from "express";
import { Response } from "express";

import { ALLOWED_FILE_TYPES, AppErrorsMessages } from "../constants";
import AppResult from "../errors/app-error";
import { IImageDetails } from "../models/files.models";
import * as filesService from "../services/files.service";

export const uploadImage = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Files']
    #swagger.summary = 'Uploads an image.'
    #swagger.description  = 'Uploads an image to the storage. The original name is not considered and a new url/name/path is created with following rule: https://storage.googleapis.com/users/ + ${userId}/${pageId ? "pages" : `${userFolderName || "general"}}/ + ${pageId ? pageId + "/" : ""} + ${fileName}'
    #swagger.parameters['file'] = {
      in: 'formData',
      description: 'Image file to be uploaded (JPEG, PNG, GIF and WEBG)',
      required: true,
      type: 'file'
    }
    #swagger.parameters['userId'] = {
      in: 'formData',
      description: 'ID of the user sending the file',
      required: true,
      type: 'string'
    }
    #swagger.parameters['userFolderName'] = {
      in: 'formData',
      description: 'Name of the folder inside user\'s folder in storage (default is \'general\', when no pageId is provided)',
      required: false,
      type: 'string'
    }
    #swagger.parameters['pageId'] = {
      in: 'formData',
      description: 'ID of the page, if the image belongs to any page (if any, user gains a new folder, in his directory, with the ID of the page as name, and the image will go inside it - and userFolderName is not considered.)',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      type: 'string',
      description: 'URL of the image stored'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    const file: any = req.file;

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.FILE_TYPE, null, 400));
    }

    if (!file) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.FILE_REQUIRED, null, 400));
    }
    return filesService.uploadFileToStorage(req, res);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Files']
    #swagger.summary = 'Deletes an image.'
    #swagger.description  = 'Deletes an image to the storage.'
    #swagger.parameters['url'] = {
      in: 'body',
      description: 'Image file to be deleted',
      required: true,
      type: 'string'
    }
    #swagger.parameters['userId'] = {
      in: 'body',
      description: 'ID of the user trying to delete the file',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      type: 'string',
      description: 'URL of the image stored'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    return filesService.deleteFileFromStorage(req, res);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getAllUserImages = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Files']
    #swagger.summary = 'Gets all user images.'
    #swagger.description  = 'Gets all user images.'
    #swagger.parameters['userId'] = {
      in: 'params',
      description: 'ID of the user trying to get his/her files',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      type: 'string',
      description: 'URL of the image stored'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    const userId: string = req.params.userId;

    if (!userId) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.USER_ID_MISSING, undefined, 400));
    }

    const images: IImageDetails[] | null =
      await filesService.getAllUserImages(userId);

    if (images) {
      return res.status(200).json(images);
    }

    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.IMAGES_NOT_FOUND, undefined, 400));
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getAllButtonsTemplates = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Files']
    #swagger.summary = 'Gets all buttons templates.'
    #swagger.description  = 'Gets all buttons templates.'
    #swagger.responses[200] = {
      type: 'string',
      description: 'URL of the image stored'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    const images: IImageDetails[] | null =
      await filesService.getAllButtonsTemplates();

    if (images) {
      return res.status(200).json(images);
    }

    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.IMAGES_NOT_FOUND, undefined, 400));
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getAllBackgroundsTemplates = async (
  req: Request,
  res: Response,
) => {
  /* 
    #swagger.tags = ['Files']
    #swagger.summary = 'Gets all background templates.'
    #swagger.description  = 'Gets all background templates.'
    #swagger.responses[200] = {
      type: 'string',
      description: 'URL of the image stored'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    const images: IImageDetails[] | null =
      await filesService.getAllBackgroundsTemplates();

    if (images) {
      return res.status(200).json(images);
    }

    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.IMAGES_NOT_FOUND, undefined, 400));
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getAllUserProfileTemplates = async (
  req: Request,
  res: Response,
) => {
  /* 
    #swagger.tags = ['Files']
    #swagger.summary = 'Gets all user profile templates.'
    #swagger.description  = 'Gets all user profile templates.'
    #swagger.responses[200] = {
      type: 'string',
      description: 'URL of the image stored'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    const images: IImageDetails[] | null =
      await filesService.getAllUserProfileTemplates();

    if (images) {
      return res.status(200).json(images);
    }

    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.IMAGES_NOT_FOUND, undefined, 400));
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getAllPagesImgsTemplates = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Files']
    #swagger.summary = 'Gets all pages images templates.'
    #swagger.description  = 'Gets all pages images templates.'
    #swagger.responses[200] = {
      type: 'string',
      description: 'URL of the image stored'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    const images: IImageDetails[] | null =
      await filesService.getAllPagesImgsTemplates();

    if (images) {
      return res.status(200).json(images);
    }

    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.IMAGES_NOT_FOUND, undefined, 400));
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};
