import { Router } from "express";

import * as pageController from "@/controllers/pages.controller";
import { verifyToken } from "@/middlewares/firebase.middleware";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";

const pagesRouter = Router();

// PRIVATE

pagesRouter.post(
  "/",
  handleLocalizedMessages,
  verifyToken,
  pageController.createUserPage,
);
pagesRouter.put(
  "/",
  handleLocalizedMessages,
  verifyToken,
  pageController.updateUserPage,
);
pagesRouter.get(
  "/all/user/:userId",
  handleLocalizedMessages,
  verifyToken,
  pageController.getAllUserPagesByUserId,
);
pagesRouter.delete(
  "/id/:pageId",
  handleLocalizedMessages,
  verifyToken,
  pageController.deleteUserPage,
);

// PUBLIC

pagesRouter.get(
  "/id/:pageId",
  handleLocalizedMessages,
  pageController.getPageById,
);
pagesRouter.get(
  "/url/:url",
  handleLocalizedMessages,
  pageController.getPageByUrl,
);
pagesRouter.get(
  "/url/renderer/:url",
  handleLocalizedMessages,
  pageController.getRendererPageByUrl,
);
pagesRouter.post(
  "/component-clicks",
  handleLocalizedMessages,
  pageController.incrementComponentClicks,
);

export { pagesRouter };
