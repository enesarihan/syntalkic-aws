import { z } from "zod";

export const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

export const updateProfileSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    newPassword: z
      .string()
      .min(8, "Password should be at least 8 character")
      .optional(),
    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 character")
      .optional(),
    profileImage: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.newPassword !== undefined &&
        data.confirmPassword !== undefined &&
        data.newPassword !== data.confirmPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Password do not match",
      path: ["confirmPassword"],
    }
  );
