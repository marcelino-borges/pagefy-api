import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import { ERROR_MESSAGES_EN } from "@/constants/messages/en";
import AppResult from "@/errors/app-error";
import log from "@/utils/logs";

export const verifyApiKey = async (req: Request, res: Response, next: any) => {
  const systemApiKey = process.env.SYSTEM_API_KEY;

  if (!systemApiKey) {
    log.error("System api key not found on ENV.");
    res
      .status(HttpStatusCode.InternalServerError)
      .json(
        new AppResult(
          ERROR_MESSAGES_EN.INTERNAL_ERROR,
          null,
          HttpStatusCode.InternalServerError,
        ),
      );
    return;
  }

  const apiKey = req.headers["py-api-key"] as string;

  if (!apiKey) {
    res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new AppResult(
          ERROR_MESSAGES_EN.NO_API_KEY_PROVIDED,
          null,
          HttpStatusCode.Unauthorized,
        ),
      );
    return;
  }

  if (apiKey !== systemApiKey) {
    res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new AppResult(
          ERROR_MESSAGES_EN.UNAUTHORIZED,
          null,
          HttpStatusCode.Unauthorized,
        ),
      );
    return;
  }

  next();
};
