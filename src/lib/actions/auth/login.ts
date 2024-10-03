"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { redirect } from "next/navigation"
import { lucia } from "@/lib/config/auth"
import { cookies } from "next/headers"

// types
import type { LoginValues } from "@/lib/validation"

/* login */
export async function login(credentials: LoginValues) {
  const URL = "auth/login-account"

  const response = await httpRequest<LoginValues, { userId: string }>(
    URL,
    "POST",
    {
      body: credentials,
    },
  )
  const { userId } = response

  if (!userId) {
    throw new Error("User login failed")
  }

  // Create session for the new user
  const session = await lucia.createSession(userId, {})

  // Set session cookie
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect("/")
}
