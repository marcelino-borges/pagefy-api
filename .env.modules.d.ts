declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string;
    PORT?: string;
    SERVER_TIMEOUT?: string;
    MONGO_CONNECTION_STRING?: string;
    FIREBASE_PRIVATE_KEY?: string;
    FIREBASE_PRIVATE_KEY_ID?: string;
    FIREBASE_CLIENT_EMAIL?: string;
    FIREBASE_CLIENT_ID?: string;
    FIREBASE_PROJECT_ID?: string;
    FIREBASE_SERVICE_ACCOUNT_URL?: string;
    FIREBASE_STORAGE_BUCKET_URL?: string;
    NOREPLY_EMAIL?: string;
    NOREPLY_EMAIL_PASSWORD?: string;
    SYSTEM_RECIPIENT_EMAIL?: string;
    RECAPTCHA_SECRET_KEY?: string;
    DEFAULT_USER_PLAN?: PlansTypes;
  }
}
