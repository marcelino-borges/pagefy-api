import { Request, Response } from "express";
import { AppErrorsMessages } from "../constants";
import AppResult from "../errors/app-error";
import { IKeycloakUserInfo } from "../models/keycloak.models";
import { isTokenValid } from "../services/keycloak.service";

export const verifyToken = async (req: Request, res: Response, next: any) => {
  const bearer = req.headers["authorization"] as string;
  if (!bearer) {
    return res
      .status(401)
      .json(new AppResult(AppErrorsMessages.NO_TOKEN_PROVIDED, null, 401));
  }

  const token = bearer.replace("Bearer ", "");

  const userInfo: AppResult | IKeycloakUserInfo = await isTokenValid(token);

  if (userInfo instanceof AppResult) {
    return res.status(userInfo.statusCode).json(userInfo);
  }

  const tokenEmail: string = userInfo.email;

  (req as any).tokenEmail = tokenEmail;

  next();
};
