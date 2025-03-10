import * as express from "express";
import initializeMulter, { memoryStorage } from "multer";

import * as emailController from "../controllers/email.controller";
import * as faqController from "../controllers/faq.controller";
import * as filesController from "../controllers/files.controller";
import * as pageController from "../controllers/pages.controller";
import * as recaptchaController from "../controllers/recaptcha.controller";
import * as testimonialsController from "../controllers/testimonials.controller";
import * as userController from "../controllers/user.controller";
import { verifyApiKey } from "../middlewares/api-key.middleware";
import { verifyToken } from "../middlewares/firebase.middleware";
import { verifyRecaptcha } from "../middlewares/recaptcha.middleware";

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
router.get("/user/:userId/plan", userController.getUserPlan);

// Private routes
router.get("/user", verifyToken, userController.getUser);
router.post("/user", verifyToken, userController.createUser);
router.put("/user", verifyToken, userController.updateUser);
router.delete("/user", verifyToken, userController.deleteUser);

// System routes
router.get(
  "/system/user/:email",
  verifyApiKey,
  userController.getUserByEmailForSystem,
);
router.patch(
  "/system/user/payment-id",
  verifyApiKey,
  userController.updateUserPaymentId,
);

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
  pageController.getAllUserPagesByUserId,
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
  filesController.uploadImage,
);
router.delete("/files" /*, verifyToken*/, filesController.deleteImage);
router.get(
  "/files/user/:userId" /*, verifyToken*/,
  filesController.getAllUserImages,
);
router.get(
  "/files/templates/buttons" /*, verifyToken*/,
  filesController.getAllButtonsTemplates,
);
router.get(
  "/files/templates/backgrounds" /*, verifyToken*/,
  filesController.getAllBackgroundsTemplates,
);
router.get(
  "/files/templates/user-profile" /*, verifyToken*/,
  filesController.getAllUserProfileTemplates,
);
router.get(
  "/files/templates/pages-imgs" /*, verifyToken*/,
  filesController.getAllPagesImgsTemplates,
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

/*
 * TESTIMONIALS
 */

// Public routes
router.get("/testimonials", testimonialsController.queryTestimonials);

// Private routes
router.get(
  "/testimonials/last/user/:userId",
  verifyToken,
  testimonialsController.getUserLastTestimonial,
);
router.get(
  "/testimonials/all/user/:userId",
  verifyToken,
  testimonialsController.getUserTestimonials,
);
router.post(
  "/testimonials",
  verifyToken,
  testimonialsController.createTestimonial,
);
router.put(
  "/testimonials",
  verifyToken,
  testimonialsController.updateUserTestimonial,
);
router.delete(
  "/testimonials/:testimonialId",
  verifyToken,
  testimonialsController.deleteUserTestimonial,
);

/*
 * FAQs
 */

// Public routes
router.get("/faqs", faqController.getAllFaqs);
// router.post("/faqs", faqController.createFaq);
// router.patch("/faqs", faqController.updateFaq);
// router.delete("/faqs/:id", faqController.deleteFaq);

export default router;
