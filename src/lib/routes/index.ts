// imagekit controllers
import { imagekitAuthController } from "@/lib/controllers/imagekit/auth"

// account controllers
import { registerController } from "@/lib/controllers/auth/register"
import { loginController } from "@/lib/controllers/auth/login"

// types
import type { NextRequest, NextResponse } from "next/server"

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

interface Route {
  path: string
  handler: (request: NextRequest) => Promise<NextResponse>
}

export const routes: Record<HttpMethod, Route[]> = {
  GET: [
    { path: "/api/v1/auth/imagekit", handler: imagekitAuthController },
    // Add more GET routes here
  ],
  POST: [
    { path: "/api/v1/auth/login-account", handler: loginController },
    { path: "/api/v1/auth/register-account", handler: registerController },
    // Add more POST routes here
  ],
  PATCH: [
    // { path: '/api/v1/auth/update-account', handler: updateAccountControl },
    // Add more PATCH routes here
  ],
  DELETE: [
    // { path: '/api/v1/auth/delete-account', handler: deleteAccountControl },
    // Add more DELETE routes here
  ],
}
