import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import { ERROR_MESSAGES_EN } from "@/constants/messages/en";
import AppResult from "@/errors/app-error";
import { IUser, UserOnboardings } from "@/models/user.models";
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
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          ERROR_MESSAGES_EN.USERID_OR_EMAIL_REQUIRED,
          null,
          HttpStatusCode.BadRequest,
        ),
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

    return res.status(HttpStatusCode.Ok).json(!!userFound);
  } catch (e: any) {
    log.error("[UserController.doesUserExist] EXCEPTION: ", e);
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
      .status(HttpStatusCode.Unauthorized)
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
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.MISSING_PROPS,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
      return;
    }

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
    log.error("[UserController.getUser] EXCEPTION: ", e);
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

export const updateUserPaymentIdForSystem = async (
  req: Request,
  res: Response,
) => {
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

export const updateOnboardingEvent = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Updates the onboarding flags on an User'
    #swagger.security = [{
      "bearerAuth": []
    }] 
    #swagger.description  = 'Updates the onboarding flags on an User'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Flags representing each onboarding shown (or not) for the user',
      required: true,
      schema: { $ref: "#/definitions/OnboardingFlags" },
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
  const onboardings = req.body as UserOnboardings;
  const userId = req.userId;
  const messages = req.messages;

  if (!userId) {
    res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new AppResult(messages.UNAUTHORIZED, null, HttpStatusCode.Unauthorized),
      );
    return;
  }

  try {
    const userUpdated = await userService.updateOnboardingEvent(
      onboardings,
      userId,
    );

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
    log.error("[UserController.updateOnboardingEvent] EXCEPTION: ", e);
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

  if (!isAuthorized) {
    res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new AppResult(
          req.messages.UNAUTHORIZED,
          null,
          HttpStatusCode.Unauthorized,
        ),
      );
    return;
  }

  if (!user) {
    res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.USER_REQUIRED,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
    return;
  }

  if (
    !user.email ||
    user.email.length < 1 ||
    !user.firstName ||
    user.firstName.length < 1 ||
    !user.lastName ||
    user.lastName.length < 1
  ) {
    res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.USER_INVALID,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
    return;
  }

  try {
    const userCreated = await userService.createUser(user);

    if (!userCreated) {
      res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.USER_CREATING,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
      return;
    }

    res.status(HttpStatusCode.Ok).json(userCreated);
  } catch (e: any) {
    log.error("[UserController.createUser] EXCEPTION: ", e);
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
    res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new AppResult(
          req.messages.UNAUTHORIZED,
          null,
          HttpStatusCode.Unauthorized,
        ),
      );
    return;
  }

  if (!user) {
    res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.USER_REQUIRED,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
    return;
  }

  try {
    const userUpdated = await userService.updateUser(user);

    if (!userUpdated) {
      res
        .status(HttpStatusCode.BadRequest)
        .json(
          new AppResult(
            req.messages.USER_UPDATING,
            null,
            HttpStatusCode.BadRequest,
          ),
        );
      return;
    }

    res.status(HttpStatusCode.Ok).json(userUpdated);
  } catch (e: any) {
    log.error("[UserController.updateUser] EXCEPTION: ", e);
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
    res
      .status(HttpStatusCode.BadRequest)
      .json(
        new AppResult(
          req.messages.INVALID_REQUEST,
          null,
          HttpStatusCode.BadRequest,
        ),
      );
    return;
  }

  try {
    const isAuthorized = await isUserAuthorized(userEmail, userAuthId, authId);

    if (!isAuthorized) {
      res
        .status(HttpStatusCode.Unauthorized)
        .json(
          new AppResult(
            req.messages.UNAUTHORIZED,
            null,
            HttpStatusCode.Unauthorized,
          ),
        );
      return;
    }

    await userService.deleteUser(req, res);

    res.status(HttpStatusCode.Ok);
  } catch (e: any) {
    log.error("[UserController.deleteUser] EXCEPTION: ", e);
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
