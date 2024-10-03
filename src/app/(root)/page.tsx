// components
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import BounceWrapper from "@/components/shared/bounce"
import HomeClient from "@/components/home/client"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Home | IT414 Final Project",
  description: "Welcome to the IT414 Final Project dashboard",
}

export default async function RootPage() {
  return (
    <BounceWrapper>
      <main className="relative min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-[35rem]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    IT414{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Final Project
                    </span>
                  </h1>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <HomeClient />
            </CardContent>
          </Card>
        </div>
      </main>
    </BounceWrapper>
  )
}
