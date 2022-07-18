import z from "zod";

export const lowerCasedString = z
  .string()
  .trim()
  .transform((language) => language.toLowerCase());
