"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { User, Camera, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [twitter, setTwitter] = useState("")
  const [github, setGithub] = useState("")
  const [discord, setDiscord] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Load user data
    const users = JSON.parse(localStorage.getItem("nexus_users") || "[]")
    const foundUser = users.find((u: any) => u.id === user.id)

    if (foundUser) {
      setUsername(foundUser.username || "")
      setBio(foundUser.bio || "")
      setLocation(foundUser.location || "")
      setWebsite(foundUser.website || "")
      setTwitter(foundUser.twitter || "")
      setGithub(foundUser.github || "")
      setDiscord(foundUser.discord || "")
      setAvatar(foundUser.avatar || "")
    }
  }, [user, router])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatar(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      // Update user data
      const users = JSON.parse(localStorage.getItem("nexus_users") || "[]")
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            username,
            bio,
            location,
            website,
            twitter,
            github,
            discord,
            avatar: avatar || username.charAt(0).toUpperCase(),
          }
        }
        return u
      })

      localStorage.setItem("nexus_users", JSON.stringify(updatedUsers))

      // Update current user session
      const updatedUser = {
        ...user,
        username,
        avatar: avatar || username.charAt(0).toUpperCase(),
      }
      localStorage.setItem("nexus_user", JSON.stringify(updatedUser))

      // Update scripts with new author info
      const scripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
      const updatedScripts = scripts.map((script: any) => {
        if (script.authorId === user.id) {
          return {
            ...script,
            author: username,
            authorAvatar: avatar || username.charAt(0).toUpperCase(),
          }
        }
        return script
      })
      localStorage.setItem("nexus_scripts", JSON.stringify(updatedScripts))

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      })

      // Refresh the page to update the navbar
      window.location.reload()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-red-500">Profile</span> Settings
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Customize your profile and social links</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/profile/${user.id}`}>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture */}
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Camera className="mr-2 h-5 w-5 text-red-500" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-red-500 text-white text-2xl">
                    {avatar || username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Change Picture
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">Max 5MB - JPG, PNG, GIF</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="mr-2 h-5 w-5 text-red-500" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-red-400 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="nexus-input mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-red-400 font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="nexus-input mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-red-400 font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Where are you from?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="nexus-input mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="text-white">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website" className="text-red-400 font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="nexus-input mt-1"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-red-400 font-medium">
                  Twitter Username
                </Label>
                <Input
                  id="twitter"
                  placeholder="yourusername"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="nexus-input mt-1"
                />
              </div>

              <div>
                <Label htmlFor="github" className="text-red-400 font-medium">
                  GitHub Username
                </Label>
                <Input
                  id="github"
                  placeholder="yourusername"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="nexus-input mt-1"
                />
              </div>

              <div>
                <Label htmlFor="discord" className="text-red-400 font-medium">
                  Discord Tag
                </Label>
                <Input
                  id="discord"
                  placeholder="username#1234"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  className="nexus-input mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              className="nexus-button px-12 py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              <Save className="mr-2 h-5 w-5" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
