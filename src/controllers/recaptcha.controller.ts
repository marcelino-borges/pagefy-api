import { Request, Response } from "express";

import { AppSuccessMessages } from "@/constants";
import AppResult from "@/errors/app-error";
import { IRecaptchaResult } from "@/models/recaptcha.models";
import * as recaptchaService from "@/services/recaptcha.service";
import { CustomRequest } from "@/types/express-request";

export const verifyRecaptcha = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['ReCAPTCHA']
    #swagger.summary = 'Verifies if a given reCAPCTCHA token is validated by Google'
    #swagger.description  = 'Verifies if a given reCAPCTCHA token is validated by Google'
    #swagger.parameters['token'] = {
      in: 'body',
      description: 'Token returned from the client recaptcha',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'When a token is validated'
    }
    #swagger.responses[401] = {
      description: 'When a token is not validated'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  const token: string = req.body.token;

  if (!token) {
    return res
      .status(401)
      .json(new AppResult(req.messages.NO_RECAPTCHA_PROVIDED, null, 401));
  }

  try {
    const result: IRecaptchaResult =
      await recaptchaService.verifyRecaptcha(token);

    if (!result || !result.success) {
      return res
        .status(401)
        .json(
          new AppResult(
            req.messages.RECAPTCHA_NOT_VALIDATED,
            result["error-codes"],
            401,
          ),
        );
    }

    return res
      .status(200)
      .json({ message: AppSuccessMessages.RECAPTCHA_VALIDATED });
  } catch (e: any) {
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};
