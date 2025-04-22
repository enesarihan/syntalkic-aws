import { z } from "zod";

export const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

export const updateProfileSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});
