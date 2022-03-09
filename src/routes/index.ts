import * as express from "express";
import * as userController from "../controllers/user.controller";
import * as pageController from "../controllers/pages.controller";
import { verifyToken } from "../middlewares/firebase";

const router = express.Router();

/*
 * USER
 */

// Public routes
router.get("/user/exists", userController.doesUserExist);

// Private routes
router.get("/user", verifyToken, userController.getUser);
router.post("/user", verifyToken, userController.createUser);
router.put("/user", verifyToken, userController.updateUser);

/*
 * PAGES
 */

// Public routes
router.get("/page/id/:pageId", pageController.getPageById);
router.get("/page/url/:url", pageController.getPageByUrl);

// Private routes
router.get(
  "/page/all/user/:userId",
  verifyToken,
  pageController.getAllUserPagesByUserId
);
router.post("/page", verifyToken, pageController.createUserPage);
router.put("/page", verifyToken, pageController.updateUserPage);
router.delete("/page/id/:pageId", verifyToken, pageController.deleteUserPage);

export default router;
