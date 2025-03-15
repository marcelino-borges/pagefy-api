import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import { ERROR_MESSAGES_EN } from "@/constants/messages/en";
import AppResult from "@/errors/app-error";
import { IUser, PlansTypes } from "@/models/user.models";
import { isUserPagesCountOk } from "@/services/pages.service";
import * as userService from "@/services/user.service";
import log from "@/utils/logs";

export const doesUserExist = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Signs the user out'
    #swagger.description  = 'Signs the user out, ending his token'
    #swagger.parameters['id'] = {
      in: 'params',
      description: 'User id',
      required: true,
      type: 'string'
    }
    #swagger.parameters['email'] = {
      in: 'params',
      description: 'User email',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/User" },
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
  const email: string = req.query.email as string;
  const userId: string = req.query.userId as string;

  if (!email && !userId) {
    return res
      .status(400)
      .json(
        new AppResult(ERROR_MESSAGES_EN.USERID_OR_EMAIL_REQUIRED, null, 400),
      );
  }

  try {
    let userFound;

    if (userId && userId.length > 0) {
      userFound = await userService.getUserById(email);
    }

    if (!userFound && email && email.length > 0) {
      userFound = await userService.getUserByEmail(email);
    }

    return res.status(200).json(!!userFound);
  } catch (e: any) {
    log.error("[UserController.doesUserExist] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getUser = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Gets an user by his email'
    #swagger.security = [{
      "bearerAuth": []
    }] 
    #swagger.description  = 'Gets an user from database by his email'
    #swagger.parameters['userId'] = {
      in: 'query',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['email'] = {
      in: 'query',
      description: 'User email',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/User" },
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
  const email: string = req.query.email as string;
  const userId: string = req.query.userId as string;
  const authId: string = req.query.authId as string;
  const userEmail: string = req.userEmail as string;
  const userAuthId: string = req.userAuthId as string;

  const isAuthorized = await isUserAuthorized(userEmail, userAuthId);

  if (!isAuthorized) {
    return res
      .status(401)
      .json(
        new AppResult(
          req.messages.UNAUTHORIZED,
          req.messages.TOKEN_FROM_ANOTHER_USER,
          401,
        ),
      );
  }

  try {
    let userFound;

    if (userId && userId.length > 0) {
      userFound = await userService.getUserById(email);
    } else if (email && email.length > 0) {
      userFound = await userService.getUserByEmail(email);
    } else if (authId && authId.length > 0) {
      userFound = await userService.getUserByAuthId(authId);
    } else {
      res
        .status(400)
        .json(new AppResult(req.messages.MISSING_PROPS, null, 400));
      return;
    }

    if (!userFound) {
      res
        .status(400)
        .json(new AppResult(req.messages.USER_NOT_FOUND, null, 400));
      return;
    }

    res.status(200).json(userFound);
  } catch (e: any) {
    log.error("[UserController.getUser] EXCEPTION: ", e);
    res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const canUserCreatePage = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Gets whether the user can create a page'
    #swagger.security = [{
      "bearerAuth": []
    }] 
    #swagger.description  = 'Gets whether the user can create a page'
    #swagger.parameters['userId'] = {
      in: 'query',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'true/false'
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
  const userId: string = req.params.userId as string;
  const userIdToken: string = req.userId as string;

  const isAuthorized = userId === userIdToken;

  if (!isAuthorized) {
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

  console.log("--- req.userPlan:", req.userPlan);

  try {
    const pagesCountOk = await isUserPagesCountOk(userId, req.userPlan);

    res.status(HttpStatusCode.Ok).json(pagesCountOk);
  } catch (e: any) {
    log.error("[UserController.canUserCreatePage] EXCEPTION: ", e);

    res
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

export const getUserByEmailForSystem = async (req: Request, res: Response) => {
  const email: string = req.params.email as string;

  try {
    const userFound = await userService.getUserByEmail(email);

    if (!userFound) {
      res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.USER_NOT_FOUND,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
      return;
    }

    res.status(HttpStatusCode.Ok).json(userFound);
  } catch (e: any) {
    log.error("[UserController.getUserByEmailForSystem] EXCEPTION: ", e);
    res
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

export const updateUserPaymentId = async (req: Request, res: Response) => {
  const email: string = req.body.email as string;
  const paymentId: string = req.body.paymentId as string;

  try {
    const userUpdated = await userService.updateUserPaymentId(email, paymentId);

    if (!userUpdated) {
      res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.USER_NOT_FOUND,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
      return;
    }

    res.status(HttpStatusCode.Ok).json(userUpdated);
  } catch (e: any) {
    log.error("[UserController.updateUserPaymentId] EXCEPTION: ", e);
    res
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

export const getUserPlan = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Gets an user's plan
    #swagger.description  = 'Gets an user's plan'
    #swagger.parameters['userId'] = {
      in: 'params',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/User" },
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
  const userId: string = req.params.userId as string;

  if (!userId) {
    return res
      .status(400)
      .json(new AppResult(req.messages.USER_ID_MISSING, null, 400));
  }

  try {
    let userFound;

    if (userId && userId.length > 0) {
      userFound = await userService.getUserById(userId);
    }

    if (!userFound) {
      return res
        .status(400)
        .json(new AppResult(req.messages.USER_NOT_FOUND, null, 400));
    }
    return res.status(200).json(userFound.plan);
  } catch (e: any) {
    log.error("[UserController.getUserPlan] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const createUser = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Creates a new user'
    #swagger.description  = 'Creates a new user to database'
    #swagger.security = [{
      "bearerAuth": []
    }] 
    #swagger.parameters['user'] = {
      in: 'body',
      description: 'User to be created in database',
      required: true,
      schema: { $ref: "#/definitions/User" },
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/User" },
      description: 'New user data'
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
  const user: IUser = req.body;
  const userEmail: string = req.userEmail as string;
  const userAuthId: string = req.userAuthId as string;

  const isAuthorized = await isUserAuthorized(
    userEmail,
    userAuthId,
    user.authId,
  );
  log.error(`[isUserAuthorized] isAuthorized: ${isAuthorized}`);
  if (!isAuthorized) {
    return res
      .status(401)
      .json(new AppResult(req.messages.UNAUTHORIZED, null, 401));
  }

  if (!user) {
    return res
      .status(400)
      .json(new AppResult(req.messages.USER_REQUIRED, null, 400));
  }

  if (
    !user.email ||
    user.email.length < 1 ||
    !user.firstName ||
    user.firstName.length < 1 ||
    !user.lastName ||
    user.lastName.length < 1
  ) {
    return res
      .status(400)
      .json(new AppResult(req.messages.USER_INVALID, null, 400));
  }

  try {
    let defaultPlan = PlansTypes.PLATINUM;

    if (process.env.DEFAULT_USER_PLAN)
      defaultPlan = parseInt(process.env.DEFAULT_USER_PLAN);

    const userPlanOverride: IUser = {
      ...user,
      plan: defaultPlan,
    };
    const userCreated = await userService.createUser(userPlanOverride);

    if (!userCreated) {
      return res
        .status(400)
        .json(new AppResult(req.messages.USER_CREATING, null, 400));
    }

    return res.status(200).json(userCreated);
  } catch (e: any) {
    log.error("[UserController.createUser] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const updateUser = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Updates an existing user'
    #swagger.description  = 'Updates an existing user in database'
    #swagger.security = [{
      "bearerAuth": []
    }] 
    #swagger.parameters['user'] = {
      in: 'body',
      description: 'Updates an existing user in database',
      required: true,
      schema: { $ref: "#/definitions/User" },
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/User" },
      description: 'User updated'
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
  const user: IUser = req.body;
  const userEmail: string = req.userEmail as string;
  const userAuthId: string = req.userAuthId as string;

  const isAuthorized = await isUserAuthorized(
    userEmail,
    userAuthId,
    user.authId,
  );
  if (!isAuthorized) {
    return res
      .status(401)
      .json(new AppResult(req.messages.UNAUTHORIZED, null, 401));
  }

  if (!user) {
    return res
      .status(400)
      .json(new AppResult(req.messages.USER_REQUIRED, null, 400));
  }

  try {
    const userUpdated = await userService.updateUser(user);

    if (!userUpdated) {
      return res
        .status(400)
        .json(new AppResult(req.messages.USER_UPDATING, null, 400));
    }

    return res.status(200).json(userUpdated);
  } catch (e: any) {
    log.error("[UserController.updateUser] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Deletes an existing user'
    #swagger.description  = 'Deletes an existing user in database'
    #swagger.security = [{
      "bearerAuth": []
    }] 
    #swagger.parameters['userId'] = {
      in: 'query',
      description: 'User ID',
      required: true,
      type: 'string',
    }
    #swagger.parameters['authId'] = {
      in: 'query',
      description: 'Firebase Auth UID',
      required: true,
      type: 'string',
    }
    #swagger.responses[204] = {
      description: 'User updated'
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
  const userId: string = req.query.userId as string;
  const authId: string = req.query.authId as string;
  const userEmail: string = req.userEmail as string;
  const userAuthId: string = req.userAuthId as string;

  if (!userId || !authId) {
    return res
      .status(400)
      .json(new AppResult(req.messages.INVALID_REQUEST, null, 400));
  }

  try {
    const isAuthorized = await isUserAuthorized(userEmail, userAuthId, authId);

    if (!isAuthorized) {
      return res
        .status(401)
        .json(new AppResult(req.messages.UNAUTHORIZED, null, 401));
    }

    return await userService.deleteUser(req, res);
  } catch (e: any) {
    log.error("[UserController.deleteUser] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const isUserAuthorized = async (
  userEmail: string | undefined,
  userAuthId: string | undefined,
  authId?: string | undefined,
) => {
  if (
    userEmail &&
    userAuthId &&
    authId &&
    String(authId) !== String(userAuthId)
  ) {
    return false;
  }
  return true;
};
