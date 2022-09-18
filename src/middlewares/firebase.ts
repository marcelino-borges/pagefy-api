import { Request, Response } from "express";
import { AppErrorsMessages } from "../constants";
import AppResult from "../errors/app-error";
import { getAuth, DecodedIdToken } from "firebase-admin/auth";
import { log } from "../utils";
import { getUserByAuthId } from "../services/user.service";

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
      log("[verifyToken] EXCEPTION: " + JSON.stringify(error));
      return res
        .status(401)
        .json(
          new AppResult(AppErrorsMessages.NOT_AUTHORIZED, error.message, 401)
        );
    });
};
