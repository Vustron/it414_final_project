"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { redirect } from "next/navigation"
import { lucia } from "@/lib/config/auth"
import { cookies } from "next/headers"

// types
import type { RegisterValues } from "@/lib/validation"

/* register */
export async function register(credentials: RegisterValues) {
  // set url
  const URL = "auth/register-account"

  // init http post method
  const response = await httpRequest<RegisterValues, { userId: string }>(
    URL,
    "POST",
    {
      body: credentials,
    },
  )

  const { userId } = response

  if (!userId) {
    throw new Error("User registration failed")
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
