"use client"
"use client"

// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Mail, User, Clock } from "lucide-react"
import UserButton from "@/components/shared/user-button"
import { Badge } from "@/components/ui/badge"

// hooks
import { useSession } from "@/components/providers/session"

interface UserInfoRowProps {
  label: string
  value: string
  icon: React.ReactNode
}

const UserInfoRow = ({ label, value, icon }: UserInfoRowProps) => (
  <div className="flex items-center justify-between space-x-4">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-muted-foreground">{label}</span>
    </div>
    <span className="font-medium">{value}</span>
  </div>
)

const HomeClient = () => {
  const { user } = useSession()

  // Get time since account creation
  const getTimeSinceCreation = () => {
    const creationDate = new Date(user.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - creationDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day`
  }

  return (
    <div className="mt-6 flex size-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <Badge variant="outline" className="mt-1">
                  {user.userType}
                </Badge>
              </div>
            </div>
            <UserButton />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <UserInfoRow
              label="Username"
              value={user.username}
              icon={<User className="h-4 w-4 text-muted-foreground" />}
            />
            <UserInfoRow
              label="Email"
              value={user.email}
              icon={<Mail className="h-4 w-4 text-muted-foreground" />}
            />
            <UserInfoRow
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
            />
            <UserInfoRow
              label="Account Age"
              value={getTimeSinceCreation()}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <h3 className="font-medium">Account Status</h3>
            <div className="mt-2 flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomeClient
