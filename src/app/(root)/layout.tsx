// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import SessionProvider from "@/components/providers/session"

// utils
import { validateRequest } from "@/lib/config/auth"
import { redirect } from "next/navigation"

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // init validate request
  const session = await validateRequest()

  if (!session.user)
    // redirect if login
    redirect("/login")

  return (
    <SessionProvider value={session}>
      <HydrationBoundaryWrapper>{children}</HydrationBoundaryWrapper>
    </SessionProvider>
  )
}
