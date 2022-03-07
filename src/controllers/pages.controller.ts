import { AppErrorsMessages } from "../constants";
import { IUserPage } from "../models/pages.models";
import { Request } from "express";
import { Response } from "express";
import AppResult from "../errors/app-error";
import * as pagesService from "../services/pages.service";
import * as userService from "../services/user.service";
import { IUser } from "../models/user.models";
import { doesPageUrlExist } from "../services/pages.service";

export const getPageById = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Gets a page by its ID'
    #swagger.description  = 'Gets a page by its ID from database'
    #swagger.parameters['pageId'] = {
      in: 'params',
      description: 'Gets a page by its ID from database',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Page" },
      description: 'User data'
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
  const pageId: string = req.params.pageId;

  if (!pageId) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PAGE_ID_MISSING, null, 400));
  }

  try {
    const pageFound = await pagesService.getPageById(pageId);

    if (!pageFound) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.PAGE_NOT_FOUND, null, 400));
    }

    return res.status(200).json(pageFound);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getPageByUrl = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Gets a page by its URL'
    #swagger.description  = 'Gets a page by its URL from database'
    #swagger.parameters['url'] = {
      in: 'params',
      description: 'Gets a page by its URL from database',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Page" },
      description: 'User data'
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
  const url: string = req.params.url;

  if (!url) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.URL_MISSING_IN_PARAMS, null, 400));
  }

  try {
    const pageFound = await pagesService.getPageByUrl(url);

    if (!pageFound) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.PAGE_NOT_FOUND, null, 400));
    }

    return res.status(200).json(pageFound);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getAllUserPagesByUserId = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Gets all user pages by user ID'
    #swagger.description  = 'Gets all pages from database by user ID'
    #swagger.parameters['userId'] = {
      in: 'params',
      description: 'Gets all pages from database by user ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Page" },
      description: 'User data'
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
  const userId: string = req.params.userId;

  if ((req as any).tokenEmail) {
    const isTokenValid = await validateTokenByUserId(
      userId,
      (req as any).tokenEmail
    );

    if (isTokenValid) {
      return res.status(isTokenValid.statusCode).json(isTokenValid);
    }
  }

  if (!userId) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.USER_ID_MISSING, null, 400));
  }

  try {
    const pageFound = await pagesService.getAllUserPagesByUserId(userId);

    if (!pageFound) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.USER_HAS_NO_PAGES, null, 400));
    }

    return res.status(200).json(pageFound);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const createUserPage = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Creates an user page'
    #swagger.description  = 'Creates an user page in database'
    #swagger.parameters['page'] = {
      in: 'body',
      description: 'Creates an user page in database',
      required: true,
      schema: { $ref: "#/definitions/Page" },
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Page" },
      description: 'User data'
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
  const page: IUserPage = req.body;

  if ((req as any).tokenEmail) {
    const isTokenValid = await validateTokenByUserId(
      page.userId,
      (req as any).tokenEmail
    );

    if (isTokenValid) {
      return res.status(isTokenValid.statusCode).json(isTokenValid);
    }
  }

  if (!page) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PAGE_REQUIRED, null, 400));
  }

  if (
    !page.name ||
    page.name.length < 1 ||
    !page.url ||
    page.url.length < 1 ||
    page.isPublic === undefined ||
    page.views === undefined
  ) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PAGE_INVALID, null, 400));
  }

  if (page.url[0] === "/") {
    page.url = page.url.substring(1, page.url.length);
  }

  const urlExist = await doesPageUrlExist(page.url);

  if (urlExist) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PAGE_URL_ALREADY_EXIST, null, 400));
  }

  try {
    const pageCreated = await pagesService.createUserPage(page, page.userId);

    if (!pageCreated) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.PAGE_CREATING, null, 400));
    }

    return res.status(200).json(pageCreated);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const updateUserPage = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Updates an user page'
    #swagger.description  = 'Updates an user page in database'
    #swagger.parameters['page'] = {
      in: 'body',
      description: 'Updates an user page in database',
      required: true,
      schema: { $ref: "#/definitions/Page" },
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Page" },
      description: 'User data'
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
  const page: IUserPage = req.body;

  if ((req as any).tokenEmail) {
    const isTokenValid = await validateTokenByUserId(
      page.userId,
      (req as any).tokenEmail
    );

    if (isTokenValid) {
      return res.status(isTokenValid.statusCode).json(isTokenValid);
    }
  }

  if (!page) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PAGE_REQUIRED, null, 400));
  }

  if (
    !page.name ||
    page.name.length < 1 ||
    !page.url ||
    page.url.length < 1 ||
    page.isPublic === undefined ||
    page.views === undefined
  ) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PAGE_INVALID, null, 400));
  }

  try {
    const pageUpdated = await pagesService.updateUserPage(page);

    if (!pageUpdated) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.PAGE_UPDATING, null, 400));
    }

    return res.status(200).json(pageUpdated);
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

const validateTokenByUserId = async (userId: string, tokenEmail: string) => {
  const existingUser: IUser | null = await userService.getUserById(userId);

  if (!existingUser) {
    return new AppResult(
      AppErrorsMessages.USER_ASSOCIATED_TO_PAGE_NOT_FOUND,
      null,
      400
    );
  }

  if (existingUser.email !== tokenEmail)
    return new AppResult(
      AppErrorsMessages.NOT_AUTHORIZED,
      AppErrorsMessages.TOKEN_FROM_ANOTHER_USER,
      401
    );

  return null;
};
