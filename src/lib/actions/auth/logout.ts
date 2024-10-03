"use server"

// utils
import { lucia, validateRequest } from "@/lib/config/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

/* logout */
export async function logout() {
  // validate request
  const { session } = await validateRequest()

  if (!session) {
    throw new Error("Unauthorized")
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect("/login")
}
