import * as express from "express";
import * as userController from "../controllers/user.controller";
import * as pageController from "../controllers/pages.controller";
import * as filesController from "../controllers/files.controller";
import * as emailController from "../controllers/email.controller";
import * as recaptchaController from "../controllers/recaptcha.controller";
import { verifyToken } from "../middlewares/firebase.middleware";
import initializeMulter, { memoryStorage } from "multer";
import { verifyRecaptcha } from "../middlewares/recaptcha.middleware";
import { resourceLimits } from "worker_threads";

const router = express.Router();

const multer = initializeMulter({
  storage: memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

/*
 * USER
 */

// Public routes
router.get("/user/exists", userController.doesUserExist);

// Private routes
router.get("/user", verifyToken, userController.getUser);
router.post("/user", verifyToken, userController.createUser);
router.put("/user", verifyToken, userController.updateUser);
router.delete("/user", verifyToken, userController.deleteUser);

/*
 * PAGES
 */

// Public routes
router.get("/page/id/:pageId", pageController.getPageById);
router.get("/page/url/:url", pageController.getPageByUrl);
router.get("/page/url/renderer/:url", pageController.getRendererPageByUrl);

// Private routes
router.get(
  "/page/all/user/:userId",
  verifyToken,
  pageController.getAllUserPagesByUserId
);
router.post("/page", verifyToken, pageController.createUserPage);
router.post("/page/component-clicks", pageController.incrementComponentClicks);
router.put("/page", verifyToken, pageController.updateUserPage);
router.delete("/page/id/:pageId", verifyToken, pageController.deleteUserPage);

/*
 * IMAGES
 */

router.post(
  "/files",
  multer.single("image") /*, verifyToken*/,
  filesController.uploadImage
);
router.delete("/files" /*, verifyToken*/, filesController.deleteImage);
router.get(
  "/files/user/:userId" /*, verifyToken*/,
  filesController.getAllUserImages
);
router.get(
  "/files/templates/buttons" /*, verifyToken*/,
  filesController.getAllButtonsTemplates
);
router.get(
  "/files/templates/backgrounds" /*, verifyToken*/,
  filesController.getAllBackgroundsTemplates
);
router.get(
  "/files/templates/user-profile" /*, verifyToken*/,
  filesController.getAllUserProfileTemplates
);
router.get(
  "/files/templates/pages-imgs" /*, verifyToken*/,
  filesController.getAllPagesImgsTemplates
);

/*
 * SEND EMAIL
 */

// Public routes
router.post("/contact", verifyRecaptcha, emailController.sendUserContact);

/*
 * VERIFY RECAPTCHA
 */

// Public routes
router.post("/verify-recaptcha", recaptchaController.verifyRecaptcha);

export default router;
