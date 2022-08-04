import { z } from "zod";
import { THEMES, type Theme } from "shared";

export const themeSchema = z
  .string({
    required_error: "theme can't be empty",
    invalid_type_error: "theme should be a string"
  })
  .trim()
  .transform((theme) => theme.toLowerCase())
  .refine((theme) => THEMES.includes(theme as Theme), {
    message: "Invalid theme. Please refer to the documentation for the list of the supported theme"
  })
  .default("github-dark");
