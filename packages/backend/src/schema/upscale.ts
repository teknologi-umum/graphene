import { z } from "zod";

export const upscaleSchema = z
  .number()
  .min(1, { message: "upscale value can't be lower than 1" })
  .max(5, { message: "upscale value can't be greater than 5" })
  .default(1);
