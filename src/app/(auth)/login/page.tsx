// components
import BounceWrapper from "@/components/shared/bounce"
import LoginForm from "@/components/auth/login/form"

// utils
import Link from "next/link"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <BounceWrapper>
      <main className="flex h-screen items-center justify-center p-5">
        <div className="flex h-full max-h-[25rem] w-full max-w-[30rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="flex-col items-center justify-center w-full space-y-10 overflow-y-auto p-10 ">
            <h1 className="text-center text-2xl font-bold">
              <span className="text-primary">Login</span>
            </h1>
            <div className="space-y-5">
              <LoginForm />

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-muted" />
                <span>OR</span>
                <div className="h-px flex-1 bg-muted" />
              </div>

              <Link
                href="/register"
                className="block text-center hover:underline"
                prefetch={false}
              >
                Don&apos;t have an account? Register here
              </Link>
            </div>
          </div>
        </div>
      </main>
    </BounceWrapper>
  )
}
