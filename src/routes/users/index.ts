import { Router } from "express";

import * as userController from "@/controllers/user.controller";
import { verifyApiKey } from "@/middlewares/api-key.middleware";
import { verifyToken } from "@/middlewares/firebase.middleware";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";

const usersRouter = Router();

usersRouter.get(
  "/",
  handleLocalizedMessages,
  verifyToken,
  userController.getUser,
);
usersRouter.post("/", handleLocalizedMessages, userController.createUser);
usersRouter.put(
  "/",
  handleLocalizedMessages,
  verifyToken,
  userController.updateUser,
);
usersRouter.delete(
  "/",
  handleLocalizedMessages,
  verifyToken,
  userController.deleteUser,
);
usersRouter.get(
  "/:userId/can-create-page",
  handleLocalizedMessages,
  verifyToken,
  userController.canUserCreatePage,
);
usersRouter.get(
  "/exists",
  handleLocalizedMessages,
  userController.doesUserExist,
);
usersRouter.patch(
  "/onboardings",
  handleLocalizedMessages,
  verifyApiKey,
  userController.updateOnboardingEvent,
);

export { usersRouter };
