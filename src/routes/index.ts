import { Router } from "express";

import { contactRouter } from "./contact";
import { faqsRouter } from "./faqs";
import { filesRouter } from "./files";
import { pagesRouter } from "./page";
import { recaptchaRouter } from "./recaptcha";
import { systemRouter } from "./system";
import { testimonialsRouter } from "./terstimonials";
import { usersRouter } from "./users";

const router = Router();

router.use("/user", usersRouter);
router.use("/page", pagesRouter);
router.use("/files", filesRouter);
router.use("/contact", contactRouter);
router.use("/recaptcha", recaptchaRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/faqs", faqsRouter);
router.use("/system", systemRouter);

export default router;
