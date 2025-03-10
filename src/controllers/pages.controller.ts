import { HttpStatusCode } from "axios";
import { Response } from "express";

import { AppSuccessMessages } from "@/constants";
import AppResult from "@/errors/app-error";
import { IUserPage } from "@/models/pages.models";
import * as pagesService from "@/services/pages.service";
import { doesPageUrlExist } from "@/services/pages.service";
import * as userService from "@/services/user.service";
import { CustomRequest } from "@/types/express-request";
import log from "@/utils/logs";
import { canUserCreatePage } from "@/utils/user-plan";

export const getPageById = async (req: CustomRequest, res: Response) => {
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
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.PAGE_ID_MISSING,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const pageFound = await pagesService.getPageById(pageId);

    if (!pageFound) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.PAGE_NOT_FOUND,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
    }

    return res.status(HttpStatusCode.Ok).json(pageFound);
  } catch (e: any) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};

export const getPageByUrl = async (req: CustomRequest, res: Response) => {
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
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.URL_MISSING_IN_PARAMS,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const pageFound = await pagesService.getPageByUrl(url);

    if (!pageFound) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.PAGE_NOT_FOUND,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
    }

    return res.status(HttpStatusCode.Ok).json(pageFound);
  } catch (e: any) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};

export const getRendererPageByUrl = async (
  req: CustomRequest,
  res: Response,
) => {
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
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.URL_MISSING_IN_PARAMS,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const pageFound = await pagesService.getPageByUrl(url);

    if (!pageFound) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.PAGE_NOT_FOUND,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
    }

    pagesService.incrementUserPageViewsByUrl(url);

    return res.status(HttpStatusCode.Ok).json(pageFound);
  } catch (e: any) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};

export const getAllUserPagesByUserId = async (
  req: CustomRequest,
  res: Response,
) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Gets all user pages by user ID'
    #swagger.description  = 'Gets all pages from database by user ID'
    #swagger.security = [{
      "bearerAuth": []
    }] 
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
  const userIdToken: string = req.userId as string;

  const isSameUser = userId === userIdToken;

  if (!isSameUser) {
    return res
      .status(HttpStatusCode.Forbidden)
      .json(
        new AppResult(
          req.messages.FORBIDDEN,
          req.messages.TOKEN_FROM_ANOTHER_USER,
          HttpStatusCode.Forbidden,
        ),
      );
  }

  if (!userId) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.USER_ID_MISSING,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const pageFound = await pagesService.getAllUserPagesByUserId(userId);

    if (!pageFound) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.USER_HAS_NO_PAGES,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
    }

    return res.status(HttpStatusCode.Ok).json(pageFound);
  } catch (e: any) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};

export const createUserPage = async (req: CustomRequest, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Creates an user page'
    #swagger.description  = 'Creates an user page in database'
    #swagger.security = [{
      "bearerAuth": []
    }] 
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
  const userId: string = req.userId as string;

  const isSameUser = userId === page.userId;

  if (!isSameUser) {
    return res
      .status(HttpStatusCode.Forbidden)
      .json(
        new AppResult(
          req.messages.FORBIDDEN,
          req.messages.TOKEN_FROM_ANOTHER_USER,
          HttpStatusCode.Forbidden,
        ),
      );
  }

  const canCreate = await canUserCreatePage(userId, req.userPlan);

  if (!canCreate) {
    return res
      .status(HttpStatusCode.Forbidden)
      .json(
        new AppResult(
          req.messages.FORBIDDEN,
          req.messages.TOKEN_FROM_ANOTHER_USER,
          HttpStatusCode.Forbidden,
        ),
      );
  }

  if (!page) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.PAGE_REQUIRED,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
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
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.PAGE_INVALID,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  if (page.url[0] === "/") {
    page.url = page.url.substring(1, page.url.length);
  }

  const urlExist = await doesPageUrlExist(page.url);

  if (urlExist) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.PAGE_URL_ALREADY_EXIST,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const pageCreated = await pagesService.createUserPage(page, page.userId);

    if (!pageCreated) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.PAGE_CREATING,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
    }

    return res.status(HttpStatusCode.Ok).json(pageCreated);
  } catch (e: any) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};

export const updateUserPage = async (req: CustomRequest, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Updates an user page'
    #swagger.description  = 'Updates an user page in database'
    #swagger.security = [{
      "bearerAuth": []
    }] 
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
  const userId: string = req.userId as string;

  const isSameUser = userId === page.userId;

  if (!isSameUser) {
    return res
      .status(HttpStatusCode.Forbidden)
      .json(
        new AppResult(
          req.messages.FORBIDDEN,
          req.messages.TOKEN_FROM_ANOTHER_USER,
          HttpStatusCode.Forbidden,
        ),
      );
  }

  if (!page) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.PAGE_REQUIRED,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
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
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.PAGE_INVALID,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const pageUpdated = await pagesService.updateUserPage(page);

    if (!pageUpdated) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.PAGE_UPDATING,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
    }

    return res.status(HttpStatusCode.Ok).json(pageUpdated);
  } catch (e: any) {
    log.error("[PageController.updateUserPage] EXCEPTION: ", e);
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};

export const deleteUserPage = async (req: CustomRequest, res: Response) => {
  /* 
    #swagger.tags = ['Page']
    #swagger.summary = 'Deletes an user page'
    #swagger.description  = 'Deletes an user page from database'
    #swagger.security = [{
      "bearerAuth": []
    }] 
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
  const userEmail: string = req.userEmail as string;
  const userAuthId: string = req.userAuthId as string;

  if (userEmail.length < 5 || userAuthId.length < 5) {
    return res
      .status(HttpStatusCode.Forbidden)
      .json(
        new AppResult(
          req.messages.FORBIDDEN,
          req.messages.TOKEN_FROM_ANOTHER_USER,
          HttpStatusCode.Forbidden,
        ),
      );
  }

  if (!pageId) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.PAGE_REQUIRED,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const success = await pagesService.deleteUserPage(pageId);

    if (!success) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.PAGE_DELETING,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
    }

    return res
      .status(HttpStatusCode.Ok)
      .json(
        new AppResult(AppSuccessMessages.PAGE_DELETED, null, HttpStatusCode.Ok),
      );
  } catch (e: any) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};

export const incrementComponentClicks = async (
  req: CustomRequest,
  res: Response,
) => {
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
  const pageId: string = req.body.pageId;
  const componentId: string = req.body.componentId;

  if (!pageId || !componentId) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.MISSING_PROPS,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
  }

  try {
    const incrementSuccess = await pagesService.incrementComponentClicks(
      pageId,
      componentId,
    );

    if (!incrementSuccess) {
      log.success(
        "[Controller incrementComponentClick] " +
          req.messages.PAGE_VIEW_INCREMENT,
      );
    }

    return res.status(HttpStatusCode.Ok).json();
  } catch (e: any) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          req.messages.INTERNAL_ERROR,
          e.message,
          HttpStatusCode.InternalServerError,
        ),
      );
  }
};
