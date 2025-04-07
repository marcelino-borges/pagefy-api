import { Router } from "express";

import * as emailController from "@/controllers/email.controller";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";
import { verifyRecaptcha } from "@/middlewares/recaptcha.middleware";

const contactRouter = Router();

contactRouter.post(
  "/",
  handleLocalizedMessages,
  verifyRecaptcha,
  emailController.sendUserContact,
);

export { contactRouter };
