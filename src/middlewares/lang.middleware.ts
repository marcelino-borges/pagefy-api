import { Request, Response } from "express";

import { ERROR_MESSAGES } from "@/constants/messages";
import { ERROR_MESSAGES_EN } from "@/constants/messages/en";
import { CustomRequest } from "@/types/express-request";

export const handleLocalizedMessages = async (
  req: Request,
  _: Response,
  next: any,
) => {
  const lang = req.headers["lang"] as string;

  if (lang && ERROR_MESSAGES[lang])
    (req as CustomRequest).messages = ERROR_MESSAGES[lang];
  else (req as CustomRequest).messages = ERROR_MESSAGES_EN;

  next();
};
