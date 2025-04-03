import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

import AppResult from "@/errors/app-error";
import { getUserActiveSubscription } from "@/services/payments.service";
import { getUserByAuthId } from "@/services/user.service";
import log from "@/utils/logs";

export const verifyToken = async (req: Request, res: Response, next: any) => {
  const bearer = req.headers["authorization"] as string;

  if (!bearer) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new AppResult(
          req.messages.NO_TOKEN_PROVIDED,
          null,
          HttpStatusCode.Unauthorized,
        ),
      );
  }

  const token = bearer.replace("Bearer ", "");

  try {
    const decodedToken: DecodedIdToken = await getAuth().verifyIdToken(token);

    const { uid, email } = decodedToken;

    const userFound = await getUserByAuthId(uid);

    if (!userFound?._id) {
      res
        .status(HttpStatusCode.Unauthorized)
        .json(
          new AppResult(
            req.messages.UNAUTHORIZED,
            req.messages.USER_NOT_FOUND,
            HttpStatusCode.Unauthorized,
          ),
        );
      return;
    }

    const userSubscription = await getUserActiveSubscription(userFound._id);

    req.userEmail = email;
    req.userAuthId = uid;
    req.userId = String(userFound._id);
    req.userPlan = userSubscription?.features;
    req.token = token;

    next();
  } catch (error) {
    log.error("[verifyToken] EXCEPTION: " + JSON.stringify(error));
    return res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new AppResult(
          req.messages.UNAUTHORIZED,
          (error as Error).message,
          HttpStatusCode.Unauthorized,
        ),
      );
  }
};
