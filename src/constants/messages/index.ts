import { ERROR_MESSAGES_EN } from "./en";
import { ERROR_MESSAGES_PT } from "./pt";

export const ERROR_MESSAGES: Record<string, typeof ERROR_MESSAGES_EN> = {
  pt: ERROR_MESSAGES_PT,
  en: ERROR_MESSAGES_EN,
} as const;
