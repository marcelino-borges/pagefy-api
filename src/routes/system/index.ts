import { Router } from "express";

import * as userController from "@/controllers/user.controller";
import { verifyApiKey } from "@/middlewares/api-key.middleware";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";

const systemRouter = Router();

systemRouter.get(
  "/user/:email",
  handleLocalizedMessages,
  verifyApiKey,
  userController.getUserByEmailForSystem,
);
systemRouter.patch(
  "/user/payment-id",
  handleLocalizedMessages,
  verifyApiKey,
  userController.updateUserPaymentIdForSystem,
);

export { systemRouter };
