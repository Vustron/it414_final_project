// components
import RegisterForm from "@/components/auth/register/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import BounceWrapper from "@/components/shared/bounce"

// utils
import Link from "next/link"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Register",
}

export default function RegisterPage() {
  return (
    <BounceWrapper>
      <main className="flex min-h-screen items-center justify-center p-5">
        <div className="flex w-full max-w-[30rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="flex w-full flex-col">
            <ScrollArea className="h-[calc(100vh-40px)] max-h-[600px] w-full">
              <div className="flex flex-col space-y-6 p-8">
                <h1 className="text-center text-2xl font-bold">
                  <span className="text-primary">Register</span>
                </h1>

                <div className="space-y-6">
                  <RegisterForm />

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-muted" />
                    <span>OR</span>
                    <div className="h-px flex-1 bg-muted" />
                  </div>

                  <Link
                    href="/login"
                    className="block text-center hover:underline"
                    prefetch={false}
                  >
                    Already have an account? Login here
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </BounceWrapper>
  )
}
