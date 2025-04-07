import { Router } from "express";
import initializeMulter, { memoryStorage } from "multer";

import * as filesController from "@/controllers/files.controller";
import { verifyToken } from "@/middlewares/firebase.middleware";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";

const multer = initializeMulter({
  storage: memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

const filesRouter = Router();

filesRouter.post(
  "/",
  handleLocalizedMessages,
  verifyToken,
  multer.single("image"),
  filesController.uploadImage,
);
filesRouter.delete(
  "/",
  handleLocalizedMessages,
  verifyToken,
  filesController.deleteImage,
);
filesRouter.get(
  "/user/:userId",
  handleLocalizedMessages,
  verifyToken,
  filesController.getAllUserImages,
);
filesRouter.get(
  "/templates/buttons",
  handleLocalizedMessages,
  verifyToken,
  filesController.getAllButtonsTemplates,
);
filesRouter.get(
  "/templates/backgrounds",
  handleLocalizedMessages,
  verifyToken,
  filesController.getAllBackgroundsTemplates,
);
filesRouter.get(
  "/templates/user-profile",
  handleLocalizedMessages,
  verifyToken,
  filesController.getAllUserProfileTemplates,
);
filesRouter.get(
  "/templates/pages-imgs",
  handleLocalizedMessages,
  verifyToken,
  filesController.getAllPagesImgsTemplates,
);

export { filesRouter };
