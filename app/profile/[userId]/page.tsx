"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScriptDetailModal } from "@/components/script-detail-modal"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, MapPin, LinkIcon, Eye, Download, Heart, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UserProfile {
  id: string
  username: string
  email: string
  avatar: string
  bio?: string
  location?: string
  website?: string
  twitter?: string
  github?: string
  discord?: string
  joinedAt: string
}

interface Script {
  id: string
  name: string
  code: string
  category: string
  thumbnail: string
  author: string
  authorId: string
  authorAvatar: string
  createdAt: string
  views: number
  downloads: number
  likes: number
  likedBy?: string[]
}

export default function ProfilePage() {
  const params = useParams()
  const { user } = useAuth()
  const userId = params.userId as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userScripts, setUserScripts] = useState<Script[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const isOwnProfile = user?.id === userId

  useEffect(() => {
    // Load user profile
    const users = JSON.parse(localStorage.getItem("nexus_users") || "[]")
    const foundUser = users.find((u: any) => u.id === userId)

    if (foundUser) {
      const userProfile: UserProfile = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        avatar: foundUser.avatar,
        bio: foundUser.bio || "",
        location: foundUser.location || "",
        website: foundUser.website || "",
        twitter: foundUser.twitter || "",
        github: foundUser.github || "",
        discord: foundUser.discord || "",
        joinedAt: foundUser.joinedAt || new Date().toISOString(),
      }
      setProfile(userProfile)
    }

    // Load user's scripts with default values
    const allScripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
    const userScripts = allScripts
      .filter((script: any) => script.authorId === userId)
      .map((script: any) => ({
        ...script,
        rating: script.rating || 0,
        ratingCount: script.ratingCount || 0,
        ratings: script.ratings || [],
        comments: script.comments || [],
        reports: script.reports || [],
        likes: script.likes || 0,
        dislikes: script.dislikes || 0,
        likedBy: script.likedBy || [],
        dislikedBy: script.dislikedBy || [],
        description: script.description || "",
        links: script.links || [],
      }))

    setUserScripts(userScripts)
    setLoading(false)
  }, [userId])

  const handleScriptClick = (script: Script) => {
    setSelectedScript(script)
    setIsModalOpen(true)
  }

  const handleScriptUpdate = (updatedScript: Script) => {
    setUserScripts((prevScripts) =>
      prevScripts.map((script) => (script.id === updatedScript.id ? updatedScript : script)),
    )
    setSelectedScript(updatedScript)
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
          <div className="text-center">
            <div className="text-white">Loading profile...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen nexus-gradient">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="nexus-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-4">User Not Found</h2>
              <p className="text-gray-400 mb-6">The user profile you're looking for doesn't exist.</p>
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
        {/* Profile Header */}
        <Card className="nexus-card mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-red-500 text-white text-2xl">{profile.avatar}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                  {isOwnProfile && (
                    <Link href="/settings">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>

                {profile.bio && <p className="text-gray-300 mb-4">{profile.bio}</p>}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                  </div>

                  {profile.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 mt-4">
                  {profile.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                  {profile.discord && <span className="text-gray-400">Discord: {profile.discord}</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scripts Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {isOwnProfile ? "Your Scripts" : `${profile.username}'s Scripts`} ({userScripts.length})
          </h2>
        </div>

        {userScripts.length === 0 ? (
          <Card className="nexus-card">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Scripts Yet</h3>
              <p className="text-gray-400 mb-6">
                {isOwnProfile
                  ? "Upload your first script to get started!"
                  : "This user hasn't uploaded any scripts yet."}
              </p>
              {isOwnProfile && (
                <Link href="/upload-script">
                  <Button className="nexus-button">Upload Your First Script</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userScripts.map((script) => (
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
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2">{script.name}</h3>
                  <p className="text-xs text-gray-500">{new Date(script.createdAt).toLocaleDateString()}</p>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center justify-between w-full text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{script.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{script.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{script.likes}</span>
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
