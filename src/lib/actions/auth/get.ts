"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
// import type { LoginValues } from "@/lib/validation"

/* get account*/
export async function getAccount(id: string) {
  const URL = "auth/get-account"

  const response = await httpRequest<{ id: string }, void>(URL, "GET", {
    params: {
      id,
    },
  })
  return response
}
