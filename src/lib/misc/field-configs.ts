// types
import type { LoginValues, RegisterValues } from "@/lib/validation"
import type { FieldConfig } from "@/lib/types"

// register form fields
export const registerFields: FieldConfig<RegisterValues>[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "john",
  },
  {
    name: "email",
    type: "email",
    label: "Email address",
    placeholder: "john@test.com",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "******",
  },
  {
    name: "cpassword",
    type: "password",
    label: "Confirm Password",
    placeholder: "******",
  },
  {
    name: "userType",
    type: "select",
    label: "User Type",
    placeholder: "Select a user type",
    options: [
      { value: "ADMIN", label: "Admin" },
      { value: "USER", label: "User" },
    ],
  },
]

// login form fields
export const loginFields: FieldConfig<LoginValues>[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "john",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "******",
  },
]
