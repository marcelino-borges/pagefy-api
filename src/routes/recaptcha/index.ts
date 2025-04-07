import { Router } from "express";

import * as recaptchaController from "@/controllers/recaptcha.controller";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";

const recaptchaRouter = Router();

recaptchaRouter.post(
  "/verify",
  handleLocalizedMessages,
  recaptchaController.verifyRecaptcha,
);

export { recaptchaRouter };
