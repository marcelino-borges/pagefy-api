export enum AppSuccessMessages {
  SIGNOUT = "User successfully signed out.",
  PAGE_DELETED = "Page successfully deleted.",
  FILE_DELETE_SUCCESS = "File deleted successfully.",
  RECAPTCHA_VALIDATED = "ReCAPTCHA validated.",
  THUMBNAIL_DELETED = "Thumbnail deleted.",
}

export const ALLOWED_FILE_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ALLOWED_ORIGINS = [
  "http://pagefy.me",
  "https://pagefy.me",
  "http://pagefy-api.onrender.com",
  "https://pagefy-api.onrender.com",
  "http://pagefy-frontend.onrender.com",
  "https://pagefy-frontend.onrender.com",
];

export const NOREPLY_EMAIL_SENDER = {
  user: process.env.NOREPLY_EMAIL,
  password: process.env.NOREPLY_EMAIL_PASSWORD,
};

export const SYSTEM_RECIPIENT_EMAIL = process.env.SYSTEM_RECIPIENT_EMAIL;

export const API_VERIFY_RECAPTCHA =
  "https://www.google.com/recaptcha/api/siteverify";

export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";

export const STORAGE_BUCKETS = {
  baseUrl: "https://storage.googleapis.com",
  appProject: process.env.FIREBASE_STORAGE_BUCKET_URL || "",
  userUploadedImages: "uploaded-images",
  buttonsTemplates: "system/images/templates/buttons",
  backgroundsTemplates: "system/images/templates/backgrounds",
  userProfileTemplates: "system/images/templates/user-profile",
  pagesImgsTemplates: "system/images/templates/pages-imgs",
};
