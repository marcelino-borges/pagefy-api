import { Request, Response } from "express";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

import { AppErrorsMessages } from "../constants";
import AppResult from "../errors/app-error";
import { getUserByAuthId } from "../services/user.service";
import log from "../utils/logs";

export const verifyToken = async (req: Request, res: Response, next: any) => {
  const bearer = req.headers["authorization"] as string;

  if (!bearer) {
    return res
      .status(401)
      .json(new AppResult(AppErrorsMessages.NO_TOKEN_PROVIDED, null, 401));
  }

  const token = bearer.replace("Bearer ", "");

  getAuth()
    .verifyIdToken(token)
    .then(async (decodedToken: DecodedIdToken) => {
      const { uid, email } = decodedToken;
      (req as any).tokenEmail = email;
      (req as any).tokenUid = uid;

      next();
    })
    .catch((error) => {
      log.error("[verifyToken] EXCEPTION: " + JSON.stringify(error));
      return res
        .status(401)
        .json(
          new AppResult(AppErrorsMessages.NOT_AUTHORIZED, error.message, 401),
        );
    });
};
