import { Router } from "express";

import * as faqController from "@/controllers/faq.controller";
import { handleLocalizedMessages } from "@/middlewares/lang.middleware";

const faqsRouter = Router();

faqsRouter.get("/", handleLocalizedMessages, faqController.getAllFaqs);
// faqsRouter.post("/faqs", faqController.createFaq);
// faqsRouter.patch("/faqs", faqController.updateFaq);
// faqsRouter.delete("/faqs/:id", faqController.deleteFaq);

export { faqsRouter };
