import { AppErrorsMessages, AppSuccessMessages } from "../constants";
import { IUserPage } from "../models/pages.models";
import { Request } from "express";
import { Response } from "express";
import AppResult from "../errors/app-error";
import * as pagesService from "../services/pages.service";
import * as userService from "../services/user.service";
import { doesPageUrlExist } from "../services/pages.service";
import { log } from "../utils/utils";

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

export const getRendererPageByUrl = async (req: Request, res: Response) => {
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

    const incrementSuccess = await pagesService.incrementUserPageViewsByUrl(
      url
    );

    if (!incrementSuccess) {
      log(
        "[Controller getRendererPageByUrl] " +
          AppErrorsMessages.PAGE_VIEW_INCREMENT
      );
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
  const tokenEmail: string = (req as any).tokenEmail as string;
  const tokenUid: string = (req as any).tokenUid as string;

  const isAuthorized = await isUserAuthorized(tokenEmail, tokenUid, userId);
  if (!isAuthorized) {
    return res
      .status(401)
      .json(
        new AppResult(
          AppErrorsMessages.NOT_AUTHORIZED,
          AppErrorsMessages.TOKEN_FROM_ANOTHER_USER,
          401
        )
      );
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
  const tokenEmail: string = (req as any).tokenEmail as string;
  const tokenUid: string = (req as any).tokenUid as string;

  const isAuthorized = await isUserAuthorized(
    tokenEmail,
    tokenUid,
    page.userId
  );
  if (!isAuthorized) {
    log("No auth");
    return res
      .status(401)
      .json(
        new AppResult(
          AppErrorsMessages.NOT_AUTHORIZED,
          AppErrorsMessages.TOKEN_FROM_ANOTHER_USER,
          401
        )
      );
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
  const tokenEmail: string = (req as any).tokenEmail as string;
  const tokenUid: string = (req as any).tokenUid as string;

  const isAuthorized = await isUserAuthorized(
    tokenEmail,
    tokenUid,
    page.userId
  );
  if (!isAuthorized) {
    return res
      .status(401)
      .json(
        new AppResult(
          AppErrorsMessages.NOT_AUTHORIZED,
          AppErrorsMessages.TOKEN_FROM_ANOTHER_USER,
          401
        )
      );
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

export const deleteUserPage = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Deletes an user page'
    #swagger.description  = 'Deletes an user page from database'
    #swagger.parameters['pageId'] = {
      in: 'params',
      description: 'Deletes an user page from database',
      required: true,
      schema: { $ref: "#/definitions/Page" },
    }
    #swagger.responses[200] = {
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
  const tokenEmail: string = (req as any).tokenEmail as string;
  const tokenUid: string = (req as any).tokenUid as string;

  if (tokenEmail.length < 5 || tokenUid.length < 5) {
    return res
      .status(401)
      .json(
        new AppResult(
          AppErrorsMessages.NOT_AUTHORIZED,
          AppErrorsMessages.TOKEN_FROM_ANOTHER_USER,
          401
        )
      );
  }

  if (!pageId) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PAGE_REQUIRED, null, 400));
  }

  try {
    const success = await pagesService.deleteUserPage(pageId);

    if (!success) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.PAGE_DELETING, null, 400));
    }

    return res
      .status(200)
      .json(new AppResult(AppSuccessMessages.PAGE_DELETED, null, 200));
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const isUserAuthorized = async (
  tokenEmail: string | undefined,
  tokenUid: string | undefined,
  userId: string | undefined
) => {
  if (tokenEmail && tokenUid && userId) {
    const foundUser = await userService.getUserById(userId);
    log(
      "@@@@@@@@@@@@ foundUser: ",
      JSON.stringify(foundUser) +
        "\n\ntokenUid: " +
        tokenUid +
        "\n\npage.userId: " +
        userId
    );
    if (foundUser) {
      if (foundUser.authId === tokenUid) return true;
    }
  }
  return false;
};
