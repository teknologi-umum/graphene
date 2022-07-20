export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV;
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";
export const LOGTAIL_TOKEN = process.env.LOGTAIL_TOKEN ?? "";
export const SENTRY_DSN = process.env.SENTRY_DSN ?? "";
