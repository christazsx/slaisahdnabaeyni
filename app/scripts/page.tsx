"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScriptDetailModal } from "@/components/script-detail-modal"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/contexts/auth-context"
import { Search, Upload, User, Eye, Download, ThumbsUp, ThumbsDown, Lock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

export default function ScriptsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [scripts, setScripts] = useState<Script[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Load approved scripts from localStorage
    const storedScripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")

    // Ensure all scripts have the required properties with default values
    const scriptsWithDefaults = storedScripts.map((script: any) => ({
      id: script.id,
      name: script.name,
      description: script.description || "",
      code: script.code,
      category: script.category,
      thumbnail: script.thumbnail,
      links: script.links || [],
      author: script.author,
      authorId: script.authorId,
      authorAvatar: script.authorAvatar,
      authorRank: script.authorRank || null,
      createdAt: script.createdAt,
      views: script.views || 0,
      downloads: script.downloads || 0,
      likes: script.likes || 0,
      dislikes: script.dislikes || 0,
      likedBy: script.likedBy || [],
      dislikedBy: script.dislikedBy || [],
      rating: script.rating || 0,
      ratingCount: script.ratingCount || 0,
      ratings: script.ratings || [],
      comments: script.comments || [],
      reports: script.reports || [],
    }))

    setScripts(scriptsWithDefaults)
  }, [])

  const handleScriptClick = (script: Script) => {
    setSelectedScript(script)
    setIsModalOpen(true)
  }

  const handleScriptUpdate = (updatedScript: Script) => {
    setScripts((prevScripts) => prevScripts.map((script) => (script.id === updatedScript.id ? updatedScript : script)))
    setSelectedScript(updatedScript)
  }

  const filteredScripts = scripts.filter((script) => {
    const matchesSearch =
      script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || script.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedScripts = [...filteredScripts].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "most-viewed":
        return b.views - a.views
      case "most-downloaded":
        return b.downloads - a.downloads
      case "most-liked":
        return b.likes - a.likes
      case "highest-rated":
        return b.rating - a.rating
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

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

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-red-500">Script</span> Library
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Discover and download community scripts</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {user && (
            <Link href={`/profile/${user.id}`}>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
              >
                <User className="mr-2 h-4 w-4" />
                My Scripts
              </Button>
            </Link>
          )}

          {user ? (
            <Link href="/upload-script">
              <Button className="nexus-button">
                <Upload className="mr-2 h-4 w-4" />
                Upload Script
              </Button>
            </Link>
          ) : (
            <div className="relative">
              <Button className="nexus-button" disabled>
                <Lock className="mr-2 h-4 w-4" />
                Upload Script (Login Required)
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 nexus-input"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="nexus-input">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="key-system">Key System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="nexus-input">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
              <SelectItem value="most-downloaded">Most Downloaded</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
              <SelectItem value="highest-rated">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-gray-400 text-sm flex items-center">
            Showing {sortedScripts.length} of {scripts.length} scripts
          </div>
        </div>

        {/* Scripts Grid */}
        {sortedScripts.length === 0 ? (
          <Card className="nexus-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Scripts Found</h3>
              <p className="text-gray-400 mb-6">
                {scripts.length === 0
                  ? "Be the first to upload a script to the community!"
                  : "Try adjusting your search or filter criteria."}
              </p>
              {user && scripts.length === 0 && (
                <Link href="/upload-script">
                  <Button className="nexus-button">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload First Script
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedScripts.map((script) => (
              <Card
                key={script.id}
                className="nexus-card hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => handleScriptClick(script)}
              >
                <div className="relative">
                  <Image
                    src={script.thumbnail || "/placeholder.svg?height=200&width=350"}
                    alt={script.name}
                    width={350}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
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

                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-red-500 text-white text-xs">{script.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <UserBadge username={script.author} rank={script.authorRank} />
                  </div>

                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{script.name}</h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{script.description}</p>
                  <p className="text-xs text-gray-500">{new Date(script.createdAt).toLocaleDateString()}</p>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center justify-between w-full text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{script.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{script.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{script.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="h-3 w-3" />
                        <span>{script.dislikes}</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Script Detail Modal */}
        <ScriptDetailModal
          script={selectedScript}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onScriptUpdate={handleScriptUpdate}
        />
      </main>
    </div>
  )
}
