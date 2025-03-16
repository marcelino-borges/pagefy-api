import { Application, Router } from "express";
import initializeMulter, { memoryStorage } from "multer";

import * as emailController from "@/controllers/email.controller";
import * as faqController from "@/controllers/faq.controller";
import * as filesController from "@/controllers/files.controller";
import * as pageController from "@/controllers/pages.controller";
import * as recaptchaController from "@/controllers/recaptcha.controller";
import * as testimonialsController from "@/controllers/testimonials.controller";
import * as userController from "@/controllers/user.controller";
import { verifyApiKey } from "@/middlewares/api-key.middleware";
import { verifyToken } from "@/middlewares/firebase.middleware";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";
import { verifyRecaptcha } from "@/middlewares/recaptcha.middleware";

const router = Router();

const multer = initializeMulter({
  storage: memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

/*
 * USER
 */

// Public routes
router.get(
  "/user/exists",
  handleLocalizedMessages,
  userController.doesUserExist,
);

// Private routes
router.get(
  "/user/:userId/can-create-page",
  handleLocalizedMessages,
  verifyToken,
  userController.canUserCreatePage,
);
router.get(
  "/user",
  handleLocalizedMessages,
  verifyToken,
  userController.getUser,
);
router.post("/user", handleLocalizedMessages, userController.createUser);
router.put(
  "/user",
  handleLocalizedMessages,
  verifyToken,
  userController.updateUser,
);
router.delete(
  "/user",
  handleLocalizedMessages,
  verifyToken,
  userController.deleteUser,
);
router.patch(
  "/user/onboardings",
  handleLocalizedMessages,
  verifyApiKey,
  userController.updateOnboardingEvent,
);

// System routes
router.get(
  "/system/user/:email",
  handleLocalizedMessages,
  verifyApiKey,
  userController.getUserByEmailForSystem,
);
router.patch(
  "/system/user/payment-id",
  handleLocalizedMessages,
  verifyApiKey,
  userController.updateUserPaymentIdForSystem,
);

/*
 * PAGES
 */

// Public routes
router.get(
  "/page/id/:pageId",
  handleLocalizedMessages,
  pageController.getPageById,
);
router.get(
  "/page/url/:url",
  handleLocalizedMessages,
  pageController.getPageByUrl,
);
router.get(
  "/page/url/renderer/:url",
  handleLocalizedMessages,
  pageController.getRendererPageByUrl,
);

router.get(
  "/page/all/user/:userId",
  handleLocalizedMessages,
  verifyToken,
  pageController.getAllUserPagesByUserId,
);
router.post(
  "/page",
  handleLocalizedMessages,
  verifyToken,
  pageController.createUserPage,
);
router.post(
  "/page/component-clicks",
  handleLocalizedMessages,
  pageController.incrementComponentClicks,
);
router.put(
  "/page",
  handleLocalizedMessages,
  verifyToken,
  pageController.updateUserPage,
);
router.delete(
  "/page/id/:pageId",
  handleLocalizedMessages,
  verifyToken,
  pageController.deleteUserPage,
);

/*
 * IMAGES
 */

router.post(
  "/files",
  handleLocalizedMessages,
  multer.single("image") /*, verifyToken*/,
  filesController.uploadImage,
);
router.delete(
  "/files" /*, verifyToken*/,
  handleLocalizedMessages,
  filesController.deleteImage,
);
router.get(
  "/files/user/:userId" /*, verifyToken*/,
  handleLocalizedMessages,
  filesController.getAllUserImages,
);
router.get(
  "/files/templates/buttons" /*, verifyToken*/,
  handleLocalizedMessages,
  filesController.getAllButtonsTemplates,
);
router.get(
  "/files/templates/backgrounds" /*, verifyToken*/,
  handleLocalizedMessages,
  filesController.getAllBackgroundsTemplates,
);
router.get(
  "/files/templates/user-profile" /*, verifyToken*/,
  handleLocalizedMessages,
  filesController.getAllUserProfileTemplates,
);
router.get(
  "/files/templates/pages-imgs" /*, verifyToken*/,
  handleLocalizedMessages,
  filesController.getAllPagesImgsTemplates,
);

/*
 * SEND EMAIL
 */

// Public routes
router.post(
  "/contact",
  handleLocalizedMessages,
  verifyRecaptcha,
  emailController.sendUserContact,
);

/*
 * VERIFY RECAPTCHA
 */

// Public routes
router.post(
  "/verify-recaptcha",
  handleLocalizedMessages,
  recaptchaController.verifyRecaptcha,
);

/*
 * TESTIMONIALS
 */

// Public routes
router.get(
  "/testimonials",
  handleLocalizedMessages,
  testimonialsController.queryTestimonials,
);

// Private routes
router.get(
  "/testimonials/last/user/:userId",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.getUserLastTestimonial,
);
router.get(
  "/testimonials/all/user/:userId",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.getUserTestimonials,
);
router.post(
  "/testimonials",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.createTestimonial,
);
router.put(
  "/testimonials",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.updateUserTestimonial,
);
router.delete(
  "/testimonials/:testimonialId",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.deleteUserTestimonial,
);

/*
 * FAQs
 */

// Public routes
router.get("/faqs", handleLocalizedMessages, faqController.getAllFaqs);
// router.post("/faqs", faqController.createFaq);
// router.patch("/faqs", faqController.updateFaq);
// router.delete("/faqs/:id", faqController.deleteFaq);

export default router;
