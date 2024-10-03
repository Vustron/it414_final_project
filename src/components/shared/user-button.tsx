"use client"

// components
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/shared/user-avatar"
import { LogOutIcon } from "lucide-react"

// hooks
import { useSession } from "@/components/providers/session"
import { useQueryClient } from "@tanstack/react-query"

// actions
import { logout } from "@/lib/actions/auth/logout"

// utils
import { clientErrorHandler, cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface UserButtonProps {
  className?: string
}

const UserButton = ({ className }: UserButtonProps) => {
  const { user } = useSession()
  const queryClient = useQueryClient()

  // logout handler
  const handleLogout = async () => {
    queryClient.clear()
    await toast.promise(logout(), {
      loading: <span className="animate-pulse">Logging out...</span>,
      success: "Logout successful",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  return (
    <DropdownMenu>
      {/* trigger */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn("flex-none rounded-full", className)}
        >
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      {/* content */}
      <DropdownMenuContent>
        {/* current session */}
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        {/* logout */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
