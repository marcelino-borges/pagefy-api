import { Router } from "express";

import * as testimonialsController from "@/controllers/testimonials.controller";
import { verifyToken } from "@/middlewares/firebase.middleware";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";

const testimonialsRouter = Router();

// Public routes
testimonialsRouter.get(
  "/",
  handleLocalizedMessages,
  testimonialsController.queryTestimonials,
);

// Private routes
testimonialsRouter.get(
  "/last/user/:userId",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.getUserLastTestimonial,
);
testimonialsRouter.get(
  "/all/user/:userId",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.getUserTestimonials,
);
testimonialsRouter.post(
  "/",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.createTestimonial,
);
testimonialsRouter.put(
  "/",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.updateUserTestimonial,
);
testimonialsRouter.delete(
  "/:testimonialId",
  handleLocalizedMessages,
  verifyToken,
  testimonialsController.deleteUserTestimonial,
);

export { testimonialsRouter };
