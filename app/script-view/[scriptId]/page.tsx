"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  Download,
  User,
  Calendar,
  Code,
  Star,
  MessageCircle,
  Flag,
  ExternalLink,
  Send,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

export default function ScriptViewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const scriptId = params.scriptId as string

  const [script, setScript] = useState<Script | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hasViewed, setHasViewed] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [reportReason, setReportReason] = useState("")
  const [showReportForm, setShowReportForm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // Spam protection
  const [lastCommentTime, setLastCommentTime] = useState(0)
  const [lastReportTime, setLastReportTime] = useState(0)
  const COMMENT_COOLDOWN = 30000 // 30 seconds
  const REPORT_COOLDOWN = 300000 // 5 minutes

  useEffect(() => {
    // Load script
    const scripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
    const foundScript = scripts.find((s: Script) => s.id === scriptId)

    if (foundScript) {
      // Ensure all properties exist
      const scriptWithDefaults = {
        ...foundScript,
        rating: foundScript.rating || 0,
        ratingCount: foundScript.ratingCount || 0,
        ratings: foundScript.ratings || [],
        comments: foundScript.comments || [],
        reports: foundScript.reports || [],
        likes: foundScript.likes || 0,
        dislikes: foundScript.dislikes || 0,
        likedBy: foundScript.likedBy || [],
        dislikedBy: foundScript.dislikedBy || [],
        description: foundScript.description || "",
        links: foundScript.links || [],
      }
      setScript(scriptWithDefaults)
    }
    setLoading(false)
  }, [scriptId])

  useEffect(() => {
    if (script && user) {
      setIsLiked(script.likedBy?.includes(user.id) || false)
      setIsDisliked(script.dislikedBy?.includes(user.id) || false)
      const existingRating = script.ratings?.find((r) => r.userId === user.id)
      setUserRating(existingRating?.rating || 0)
    }
  }, [script, user])

  useEffect(() => {
    if (script && !hasViewed) {
      // Increment view count
      const updatedScript = {
        ...script,
        views: script.views + 1,
      }

      // Update in localStorage
      const scripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
      const updatedScripts = scripts.map((s: Script) => (s.id === script.id ? updatedScript : s))
      localStorage.setItem("nexus_scripts", JSON.stringify(updatedScripts))

      setScript(updatedScript)
      setHasViewed(true)
    }
  }, [script, hasViewed])

  const handleLike = () => {
    if (!user || !script) {
      toast({
        title: "Login required",
        description: "Please login to like scripts.",
        variant: "destructive",
      })
      return
    }

    const likedBy = script.likedBy || []
    const dislikedBy = script.dislikedBy || []
    const newIsLiked = !isLiked

    const newLikedBy = newIsLiked ? [...likedBy, user.id] : likedBy.filter((id) => id !== user.id)
    const newDislikedBy = dislikedBy.filter((id) => id !== user.id)

    const updatedScript = {
      ...script,
      likes: newIsLiked ? script.likes + 1 : script.likes - 1,
      dislikes: isDisliked ? script.dislikes - 1 : script.dislikes,
      likedBy: newLikedBy,
      dislikedBy: newDislikedBy,
    }

    updateScript(updatedScript)
    setIsLiked(newIsLiked)
    setIsDisliked(false)

    toast({
      title: newIsLiked ? "Script liked!" : "Like removed",
      description: newIsLiked ? "Added to your liked scripts." : "Removed from your liked scripts.",
    })
  }

  const handleDislike = () => {
    if (!user || !script) {
      toast({
        title: "Login required",
        description: "Please login to dislike scripts.",
        variant: "destructive",
      })
      return
    }

    const likedBy = script.likedBy || []
    const dislikedBy = script.dislikedBy || []
    const newIsDisliked = !isDisliked

    const newDislikedBy = newIsDisliked ? [...dislikedBy, user.id] : dislikedBy.filter((id) => id !== user.id)
    const newLikedBy = likedBy.filter((id) => id !== user.id)

    const updatedScript = {
      ...script,
      likes: isLiked ? script.likes - 1 : script.likes,
      dislikes: newIsDisliked ? script.dislikes + 1 : script.dislikes - 1,
      likedBy: newLikedBy,
      dislikedBy: newDislikedBy,
    }

    updateScript(updatedScript)
    setIsDisliked(newIsDisliked)
    setIsLiked(false)

    toast({
      title: newIsDisliked ? "Script disliked" : "Dislike removed",
      description: newIsDisliked ? "Feedback recorded." : "Dislike removed.",
    })
  }

  const handleRating = (rating: number) => {
    if (!user || !script) {
      toast({
        title: "Login required",
        description: "Please login to rate scripts.",
        variant: "destructive",
      })
      return
    }

    const ratings = script.ratings || []
    const existingRatingIndex = ratings.findIndex((r) => r.userId === user.id)

    let newRatings
    if (existingRatingIndex >= 0) {
      newRatings = [...ratings]
      newRatings[existingRatingIndex] = { userId: user.id, rating }
    } else {
      newRatings = [...ratings, { userId: user.id, rating }]
    }

    const totalRating = newRatings.reduce((sum, r) => sum + r.rating, 0)
    const avgRating = totalRating / newRatings.length

    const updatedScript = {
      ...script,
      rating: avgRating,
      ratingCount: newRatings.length,
      ratings: newRatings,
    }

    updateScript(updatedScript)
    setUserRating(rating)

    toast({
      title: "Rating submitted!",
      description: `You rated this script ${rating} stars.`,
    })
  }

  const handleComment = () => {
    if (!user || !script || !newComment.trim()) {
      toast({
        title: "Login required",
        description: "Please login to comment on scripts.",
        variant: "destructive",
      })
      return
    }

    // Spam protection for comments
    const now = Date.now()
    if (now - lastCommentTime < COMMENT_COOLDOWN) {
      const remainingTime = Math.ceil((COMMENT_COOLDOWN - (now - lastCommentTime)) / 1000)
      toast({
        title: "Slow down!",
        description: `Please wait ${remainingTime} seconds before commenting again.`,
        variant: "destructive",
      })
      return
    }

    const comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar || user.username.charAt(0).toUpperCase(),
      userRank: user.rank,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedScript = {
      ...script,
      comments: [comment, ...(script.comments || [])],
    }

    updateScript(updatedScript)
    setNewComment("")
    setLastCommentTime(now)

    toast({
      title: "Comment added!",
      description: "Your comment has been posted.",
    })
  }

  const handleReport = () => {
    if (!user || !script || !reportReason.trim()) {
      toast({
        title: "Login required",
        description: "Please login to report scripts.",
        variant: "destructive",
      })
      return
    }

    // Spam protection for reports
    const now = Date.now()
    if (now - lastReportTime < REPORT_COOLDOWN) {
      const remainingTime = Math.ceil((REPORT_COOLDOWN - (now - lastReportTime)) / 60000)
      toast({
        title: "Report cooldown",
        description: `Please wait ${remainingTime} minutes before reporting again.`,
        variant: "destructive",
      })
      return
    }

    const report = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      scriptId: script.id,
      scriptName: script.name,
      reason: reportReason.trim(),
      createdAt: new Date().toISOString(),
    }

    const reports = JSON.parse(localStorage.getItem("nexus_reports") || "[]")
    reports.unshift(report)
    localStorage.setItem("nexus_reports", JSON.stringify(reports))

    setReportReason("")
    setShowReportForm(false)
    setLastReportTime(now)

    toast({
      title: "Report submitted",
      description: "Thank you for your report. Our moderators will review it.",
    })
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

    updateScript(updatedScript)

    toast({
      title: "Script saved!",
      description: "Script has been added to your Script Manager.",
    })
  }

  const handleCopyCode = async () => {
    if (!script) return

    try {
      await navigator.clipboard.writeText(script.code)
      setCopied(true)
      toast({
        title: "Code copied!",
        description: "Script code has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      })
    }
  }

  const updateScript = (updatedScript: Script) => {
    const scripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
    const updatedScripts = scripts.map((s: Script) => (s.id === script?.id ? updatedScript : s))
    localStorage.setItem("nexus_scripts", JSON.stringify(updatedScripts))
    setScript(updatedScript)
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

  if (loading) {
    return (
      <div className="min-h-screen nexus-gradient">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white">Loading script...</div>
        </main>
      </div>
    )
  }

  if (!script) {
    return (
      <div className="min-h-screen nexus-gradient">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="nexus-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-4">Script Not Found</h2>
              <p className="text-gray-400 mb-6">The script you're looking for doesn't exist.</p>
              <Link href="/scripts">
                <Button className="nexus-button">Back to Scripts</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Script Header */}
            <Card className="nexus-card">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Script Image */}
                  <div className="relative">
                    <Image
                      src={script.thumbnail || "/placeholder.svg?height=400&width=600"}
                      alt={script.name}
                      width={600}
                      height={400}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    <Badge
                      className={`absolute top-4 right-4 ${getCategoryColor(script.category)} text-white text-lg px-3 py-1`}
                    >
                      {getCategoryLabel(script.category)}
                    </Badge>
                  </div>

                  {/* Script Info */}
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-4">{script.name}</h1>
                      <p className="text-gray-300 text-lg leading-relaxed">{script.description}</p>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-red-500 text-white text-lg">{script.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/profile/${script.authorId}`}
                          className="text-white font-semibold hover:text-red-400 transition-colors text-lg"
                        >
                          <UserBadge username={script.author} rank={script.authorRank} />
                        </Link>
                        <p className="text-gray-400">Script Author</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-400 mb-2">
                          <Eye className="h-5 w-5" />
                          <span className="text-2xl font-bold text-white">{script.views}</span>
                        </div>
                        <p className="text-gray-500">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-400 mb-2">
                          <Download className="h-5 w-5" />
                          <span className="text-2xl font-bold text-white">{script.downloads}</span>
                        </div>
                        <p className="text-gray-500">Downloads</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= (userRating || script.rating || 0)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-400"
                            }`}
                            onClick={() => handleRating(star)}
                          />
                        ))}
                      </div>
                      <p className="text-gray-400">
                        {(script.rating || 0).toFixed(1)} ({script.ratingCount || 0} ratings)
                      </p>
                    </div>

                    {/* Upload Date */}
                    <div className="flex items-center justify-center space-x-2 text-gray-400">
                      <Calendar className="h-5 w-5" />
                      <span>Uploaded {new Date(script.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links Section */}
            {script.links && script.links.length > 0 && (
              <Card className="nexus-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <ExternalLink className="mr-2 h-5 w-5 text-red-500" />
                    Related Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {script.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-gray-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm truncate">{link}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card className="nexus-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleLike}
                    variant={isLiked ? "default" : "outline"}
                    size="lg"
                    className={
                      isLiked
                        ? "nexus-button"
                        : "border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                    }
                  >
                    <ThumbsUp className={`mr-2 h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                    Like ({script.likes})
                  </Button>

                  <Button
                    onClick={handleDislike}
                    variant={isDisliked ? "destructive" : "outline"}
                    size="lg"
                    className={
                      isDisliked
                        ? "bg-red-600 hover:bg-red-700"
                        : "border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                    }
                  >
                    <ThumbsDown className={`mr-2 h-5 w-5 ${isDisliked ? "fill-current" : ""}`} />
                    Dislike ({script.dislikes})
                  </Button>

                  <Button onClick={handleSaveScript} size="lg" className="nexus-button">
                    <Download className="mr-2 h-5 w-5" />
                    Save Script
                  </Button>

                  <Button
                    onClick={() => setShowReportForm(!showReportForm)}
                    variant="outline"
                    size="lg"
                    className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                  >
                    <Flag className="mr-2 h-5 w-5" />
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Form */}
            {showReportForm && (
              <Card className="nexus-card">
                <CardContent className="p-6 space-y-4">
                  <h4 className="text-xl font-semibold text-white">Report Script</h4>
                  <Textarea
                    placeholder="Please describe why you're reporting this script..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="nexus-input min-h-[120px]"
                  />
                  <div className="flex space-x-4">
                    <Button onClick={handleReport} className="nexus-button">
                      Submit Report
                    </Button>
                    <Button
                      onClick={() => setShowReportForm(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Script Code */}
            <Card className="nexus-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Code className="mr-2 h-5 w-5 text-red-500" />
                    Script Code
                  </h3>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                  >
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </Button>
                </div>
                <div className="relative">
                  <Textarea
                    value={script.code}
                    readOnly
                    className="nexus-input font-mono text-sm min-h-[500px] resize-none leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Comments */}
          <div className="xl:col-span-1">
            <Card className="nexus-card sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MessageCircle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-white">Comments ({script.comments?.length || 0})</h3>
                </div>

                {/* Add Comment */}
                {user && (
                  <div className="space-y-3 mb-6">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="nexus-input min-h-[100px]"
                    />
                    <Button onClick={handleComment} className="nexus-button w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </Button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {script.comments && script.comments.length > 0 ? (
                    script.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-red-500 text-white text-xs">
                              {comment.userAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <UserBadge username={comment.username} rank={comment.userRank} />
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {/* View Profile Button */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <Link href={`/profile/${script.authorId}`}>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      View {script.author}'s Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
