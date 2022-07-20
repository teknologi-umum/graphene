import { BUNDLED_LANGUAGES, type Lang } from "shiki";

export type Language = Lang | "auto-detect";
export const LANGUAGES = BUNDLED_LANGUAGES.map((l) => l.id as Language).concat(
  "auto-detect"
);
