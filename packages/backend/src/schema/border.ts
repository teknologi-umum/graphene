import { z } from "zod";
import { DEFAULT_BORDER_COLOR } from "shared";

export const borderSchema = z
  .object({
    colour: z
      .string({
        invalid_type_error: "border.colour should be a string"
      })
      .refine((colour) => new RegExp("#[0-9a-f]{6}", "i").test(colour), {
        message: "border.colour must be in a valid HEX format"
      })
      .default(DEFAULT_BORDER_COLOR),
    thickness: z
      .number()
      .min(0, {
        message: "border.thickness can't be lower than 0"
      })
      .default(0),
    radius: z
      .number()
      .min(0, {
        message: "border.radius can't be lower than 0"
      })
      .default(0)
  })
  .default({});
