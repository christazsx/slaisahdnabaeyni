"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Eye, ThumbsUp, Download, User, Calendar, ExternalLink, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Script {
  id: string
  name: string
  description: string
  code: string
  category: string
  thumbnail: string
  links?: string[]
  author: string
  authorId: string
  authorAvatar: string
  authorRank?: "verified" | "pro" | null
  createdAt: string
  views: number
  downloads: number
  likes: number
  dislikes: number
  likedBy?: string[]
  dislikedBy?: string[]
  rating: number
  ratingCount: number
  ratings?: { userId: string; rating: number }[]
  comments?: {
    id: string
    userId: string
    username: string
    userAvatar: string
    userRank?: "verified" | "pro" | null
    content: string
    createdAt: string
  }[]
  reports?: { id: string; userId: string; reason: string; createdAt: string }[]
}

interface ScriptDetailModalProps {
  script: Script | null
  isOpen: boolean
  onClose: () => void
  onScriptUpdate: (updatedScript: Script) => void
}

export function ScriptDetailModal({ script, isOpen, onClose, onScriptUpdate }: ScriptDetailModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [hasViewed, setHasViewed] = useState(false)

  useEffect(() => {
    if (script && user) {
      setIsLiked(script.likedBy?.includes(user.id) || false)
      setIsDisliked(script.dislikedBy?.includes(user.id) || false)
    }
  }, [script, user])

  useEffect(() => {
    if (script && isOpen && !hasViewed) {
      // Increment view count
      const updatedScript = {
        ...script,
        views: script.views + 1,
      }

      // Update in localStorage
      const scripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
      const updatedScripts = scripts.map((s: Script) => (s.id === script.id ? updatedScript : s))
      localStorage.setItem("nexus_scripts", JSON.stringify(updatedScripts))

      onScriptUpdate(updatedScript)
      setHasViewed(true)
    }
  }, [script, isOpen, hasViewed, onScriptUpdate])

  const handleViewFullScript = () => {
    if (script) {
      onClose()
      router.push(`/script-view/${script.id}`)
    }
  }

  const handleSaveScript = () => {
    if (!user || !script) {
      toast({
        title: "Login required",
        description: "Please login to save scripts.",
        variant: "destructive",
      })
      return
    }

    const savedScripts = JSON.parse(localStorage.getItem(`nexus_saved_${user.id}`) || "[]")
    const isAlreadySaved = savedScripts.some((s: Script) => s.id === script.id)

    if (isAlreadySaved) {
      toast({
        title: "Already saved",
        description: "This script is already in your saved scripts.",
      })
      return
    }

    savedScripts.push(script)
    localStorage.setItem(`nexus_saved_${user.id}`, JSON.stringify(savedScripts))

    const updatedScript = {
      ...script,
      downloads: script.downloads + 1,
    }

    const scripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
    const updatedScripts = scripts.map((s: Script) => (s.id === script?.id ? updatedScript : s))
    localStorage.setItem("nexus_scripts", JSON.stringify(updatedScripts))
    onScriptUpdate(updatedScript)

    toast({
      title: "Script saved!",
      description: "Script has been added to your Script Manager.",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "free":
        return "bg-green-500"
      case "paid":
        return "bg-yellow-500"
      case "key-system":
        return "bg-blue-500"
      default:
        return "bg-red-500"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "free":
        return "Free"
      case "paid":
        return "Paid"
      case "key-system":
        return "Key System"
      default:
        return category
    }
  }

  if (!script) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{script.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Script Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Image
                src={script.thumbnail || "/placeholder.svg?height=300&width=400"}
                alt={script.name}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Badge className={`absolute top-2 right-2 ${getCategoryColor(script.category)} text-white`}>
                {getCategoryLabel(script.category)}
              </Badge>
              {script.rating > 0 && (
                <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-white text-xs">{script.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-red-500 text-white">{script.authorAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/profile/${script.authorId}`}
                    className="text-white font-semibold hover:text-red-400 transition-colors"
                    onClick={onClose}
                  >
                    <UserBadge username={script.author} rank={script.authorRank} />
                  </Link>
                  <p className="text-sm text-gray-400">Script Author</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400">
                    <Eye className="h-4 w-4" />
                    <span className="text-lg font-semibold text-white">{script.views}</span>
                  </div>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400">
                    <Download className="h-4 w-4" />
                    <span className="text-lg font-semibold text-white">{script.downloads}</span>
                  </div>
                  <p className="text-xs text-gray-500">Downloads</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-lg font-semibold text-white">{script.likes}</span>
                  </div>
                  <p className="text-xs text-gray-500">Likes</p>
                </div>
              </div>

              {/* Upload Date */}
              <div className="flex items-center space-x-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Uploaded {new Date(script.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Description</h3>
            <p className="text-gray-300 line-clamp-3">{script.description}</p>
          </div>

          {/* Links Preview */}
          {script.links && script.links.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Links ({script.links.length})</h3>
              <div className="flex items-center space-x-2 text-blue-400">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">View full script to see all links</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleViewFullScript} className="nexus-button">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Script
            </Button>

            <Button
              onClick={handleSaveScript}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Save Script
            </Button>

            <Link href={`/profile/${script.authorId}`} onClick={onClose}>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
              >
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </Link>
          </div>

          {/* Comments Preview */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Comments ({script.comments?.length || 0})</h3>
            {script.comments && script.comments.length > 0 ? (
              <div className="space-y-2">
                {script.comments.slice(0, 2).map((comment) => (
                  <div key={comment.id} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <UserBadge username={comment.username} rank={comment.userRank} />
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2">{comment.content}</p>
                  </div>
                ))}
                {script.comments.length > 2 && (
                  <p className="text-gray-400 text-sm">
                    +{script.comments.length - 2} more comments. View full script to see all.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No comments yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
