import { Request } from "express";
import { Response } from "express";
import AppResult from "../errors/app-error";
import { ALLOWED_FILE_TYPES, AppErrorsMessages } from "../constants";
import {
  deleteFileFromStorage,
  uploadFileToStorage,
} from "../services/files.service";
import { log } from "../utils/utils";

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
    return uploadFileToStorage(req, res);
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
    return deleteFileFromStorage(req, res);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};
