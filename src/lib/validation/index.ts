// utils
import { z } from "zod"

// required string method
const requiredString = z.string().trim().min(1, "Required")

// loginSchema
export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
})

/* loginSchema Type */
export type LoginValues = z.infer<typeof loginSchema>

// registerSchema
export const registerSchema = z
  .object({
    username: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, - and _ are allowed",
    ),
    email: requiredString.email("Invalid email address"),
    password: requiredString
      .min(12, "Must be at least 12 characters")
      .max(50, "Must be at most 50 characters"),
    cpassword: requiredString
      .min(12, "Must be at least 12 characters")
      .max(50, "Must be at most 50 characters"),
    avatarUrl: requiredString.optional(),
    userType: z.enum(["ADMIN", "USER"]),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"],
  })

/* RegisterValues Type */
export type RegisterValues = z.infer<typeof registerSchema>
