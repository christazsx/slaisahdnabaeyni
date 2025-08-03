"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Crown } from "lucide-react"

interface UserBadgeProps {
  username: string
  rank?: "verified" | "pro" | null
  showUsername?: boolean
}

export function UserBadge({ username, rank, showUsername = true }: UserBadgeProps) {
  if (!rank) {
    return showUsername ? <span className="text-gray-300">{username}</span> : null
  }

  const getBadgeContent = () => {
    switch (rank) {
      case "verified":
        return {
          icon: <Check className="h-3 w-3" />,
          className: "bg-blue-500 text-white",
          tooltip: "VERIFIED",
        }
      case "pro":
        return {
          icon: <Crown className="h-3 w-3" />,
          className: "bg-yellow-500 text-white",
          tooltip: "PRO",
        }
      default:
        return null
    }
  }

  const badgeContent = getBadgeContent()

  return (
    <div className="flex items-center space-x-2">
      {showUsername && <span className="text-gray-300">{username}</span>}
      {badgeContent && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={`${badgeContent.className} px-1 py-0.5`}>{badgeContent.icon}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{badgeContent.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
