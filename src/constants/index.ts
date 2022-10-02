export enum AppErrorsMessages {
  EMAIL_ALREADY_EXISTS = "Email already registered.",
  EMAIL_REQUIRED = "Email requiied.",
  INVALID_CREDENTIALS = "Invalid credentials.",
  INVALID_REFRESH_TOKEN = "Invalid refresh token.",
  NOT_AUTHORIZED = "Not authorized.",
  NO_TOKEN_PROVIDED = "No token provided.",
  NO_RECAPTCHA_PROVIDED = "No reCAPTCHA provided.",
  RECAPTCHA_NOT_VALIDATED = "ReCAPTCHA not validated.",
  INVALID_TOKEN = "Invalid token.",
  FAIL_AUTH_TOKEN = "Invalid token.",
  FAIL_GET_TOKEN = "Failed to get token.",
  ERROR_SIGNUP = "Error signing up.",
  ERROR_SAVE_USER = "Error saving user.",
  ERROR_UPDATE_USER = "Error updating user.",
  ERROR_DELETE_USER = "Error deleting user.",
  USER_ALREADY_EXISTS = "User already registered.",
  USER_NOT_FOUND = "User not found.",
  USER_REQUIRED = "User required.",
  USER_INVALID = "User invalid.",
  USER_CREATING = "Error creating user.",
  USER_UPDATING = "Error updating user.",
  USER_ID_MISSING = "User ID missing.",
  USER_ASSOCIATED_TO_PAGE_NOT_FOUND = "User associated to page doesn't exist.",
  USERID_OR_EMAIL_REQUIRED = "UserID or user email are required.",
  USER_HAS_NO_PAGES = "User has no pages.",
  USER_NOT_DELETED_FROM_MONGO = "User not deleted from mongo.",
  USER_NOT_DELETED_FROM_FIREBASE = "User not deleted from Firebase.",
  PAGE_REQUIRED = "Page required.",
  PAGE_ID_MISSING = "Page ID missing.",
  PAGE_INVALID = "Page invalid.",
  PAGE_CREATING = "Error creating page.",
  PAGE_UPDATING = "Error updating page.",
  PAGE_DELETING = "Error deleting page.",
  PAGE_NOT_FOUND = "Page not found.",
  PAGE_URL_ALREADY_EXIST = "URL already exist.",
  PAGE_VIEW_INCREMENT = "Error to increment page views",
  URL_MISSING_IN_PARAMS = "URL missing in params.",
  MISSING_PROPS = "Props missing.",
  NOT_CREATED = "Not created.",
  NOT_UPDATED = "Not updated.",
  NOT_DELETED = "Not deleted.",
  INTERNAL_ERROR = "Internal error.",
  TOKEN_VERIFIER_MIDDLEWARE = "Error in token verifier middleware.",
  TOKEN_FROM_ANOTHER_USER = "Token doesn't belong to the user.",
  INVALID_REQUEST = "Invalid request.",
  PASSWORDS_NOT_MATCH = "Passwords don't match.",
  PASSWORDS_REQUIRED = "Passwords required.",
  SIGNOUT = "Failed to sign out.",
  IMAGE_UPLOAD_GENERIC_ERROR = "Error sending the file.",
  FILE_TYPE = "File type not allowed.",
  FILE_REQUIRED = "File missing.",
  FILE_UPLOAD_GENERAL_ERROR = "Error uploading file.",
  FILE_DELETE_GENERAL_ERROR = "Error deleting file.",
  FIELDS_REQUIRED_EMAIL_CONTACT = "Invalid input for email contact.",
}

export enum AppSuccessMessages {
  SIGNOUT = "User successfully signed out.",
  PAGE_DELETED = "Page successfully deleted.",
  FILE_DELETE_SUCCESS = "File deleted successfully.",
  RECAPTCHA_VALIDATED = "ReCAPTCHA validated.",
}

export const ALLOWED_FILE_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ALLOWED_ORIGINS = [
  "http://socialbio.me",
  "https://socialbio.me",
  "http://socialbio-api.onrender.com",
  "https://socialbio-api.onrender.com",
  "http://socialbio-frontend.onrender.com",
  "https://socialbio-frontend.onrender.com",
];

export const NOREPLY_EMAIL_SENDER = {
  user: process.env.NOREPLY_EMAIL,
  password: process.env.NOREPLY_EMAIL_PASSWORD,
};

export const SYSTEM_RECIPIENT_EMAIL = process.env.SYSTEM_RECIPIENT_EMAIL;

export const API_VERIFY_RECAPTCHA =
  "https://www.google.com/recaptcha/api/siteverify";

export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";
