import { Request } from "express";

import { ERROR_MESSAGES_EN } from "../constants/messages/en";
import { PlanFeatures } from "../models/plans-features.models";

declare global {
  namespace Express {
    interface Request {
      userEmail?: string;
      userAuthId?: string;
      userId?: string;
      userPlan?: PlanFeatures;
      file?: Request["file"] & {
        firebaseUrl?: string;
      };
      messages: typeof ERROR_MESSAGES_EN;
    }
  }
}
