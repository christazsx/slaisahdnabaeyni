"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Upload, AlertCircle, UploadIcon, ImageIcon, LinkIcon, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function UploadScriptPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [scriptName, setScriptName] = useState("")
  const [scriptDescription, setScriptDescription] = useState("")
  const [scriptCode, setScriptCode] = useState("")
  const [category, setCategory] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [scriptLinks, setScriptLinks] = useState<string[]>([""])
  const [isLoading, setIsLoading] = useState(false)

  // Spam protection
  const [lastUploadTime, setLastUploadTime] = useState(0)
  const UPLOAD_COOLDOWN = 300000 // 5 minutes

  const isVerified = user?.rank === "verified" || user?.rank === "pro"

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen nexus-gradient">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="nexus-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-gray-400 mb-6">You need to be logged in to upload scripts.</p>
              <div className="space-y-2">
                <Link href="/auth/login" className="block">
                  <Button className="w-full nexus-button">Login</Button>
                </Link>
                <Link href="/auth/signup" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addLinkField = () => {
    setScriptLinks([...scriptLinks, ""])
  }

  const removeLinkField = (index: number) => {
    setScriptLinks(scriptLinks.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, value: string) => {
    const newLinks = [...scriptLinks]
    newLinks[index] = value
    setScriptLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!scriptName || !scriptDescription || !scriptCode || !category || !thumbnail) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Spam protection for uploads
    const now = Date.now()
    const storedLastUpload = localStorage.getItem(`last_upload_${user.id}`)
    const lastUpload = storedLastUpload ? Number.parseInt(storedLastUpload) : 0

    if (now - lastUpload < UPLOAD_COOLDOWN) {
      const remainingTime = Math.ceil((UPLOAD_COOLDOWN - (now - lastUpload)) / 60000)
      toast({
        title: "Upload cooldown",
        description: `Please wait ${remainingTime} minutes before uploading another script.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Filter out empty links
      const validLinks = scriptLinks.filter((link) => link.trim() !== "")

      // Create script object
      const newScript = {
        id: Date.now().toString(),
        name: scriptName,
        description: scriptDescription,
        code: scriptCode,
        category,
        thumbnail: thumbnailPreview,
        links: isVerified ? validLinks : [],
        author: user.username,
        authorId: user.id,
        authorAvatar: user.avatar,
        authorRank: user.rank,
        createdAt: new Date().toISOString(),
        views: 0,
        downloads: 0,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        rating: 0,
        ratingCount: 0,
        ratings: [],
        comments: [],
        reports: [],
        approved: user.rank === "verified" || user.rank === "pro", // Auto-approve for verified/pro users
        approvedBy: null,
        approvedAt: null,
      }

      // Save to pending scripts (need approval)
      const existingScripts = JSON.parse(localStorage.getItem("nexus_pending_scripts") || "[]")
      existingScripts.unshift(newScript)
      localStorage.setItem("nexus_pending_scripts", JSON.stringify(existingScripts))

      // Update last upload time
      localStorage.setItem(`last_upload_${user.id}`, now.toString())

      toast({
        title: "Script submitted!",
        description: "Your script has been submitted for review. It will be available once approved by a moderator.",
      })

      router.push("/scripts")
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your script. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-red-500">Upload Your</span> Script
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Share your creations with the NEXUS community</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/scripts">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scripts
            </Button>
          </Link>
        </div>

        {/* Approval Notice */}
        <Card className="nexus-card mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Clock className="h-5 w-5" />
              <p className="text-sm">
                <strong>Note:</strong>{" "}
                {user.rank === "verified" || user.rank === "pro"
                  ? "Your scripts will be published immediately due to your verified status!"
                  : "All scripts require approval from moderators before being published."}{" "}
                Upload cooldown: 5 minutes between uploads.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Script Information */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                    Script Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-red-400 font-medium text-lg">
                      Script Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter a descriptive name for your script"
                      value={scriptName}
                      onChange={(e) => setScriptName(e.target.value)}
                      className="nexus-input mt-2 text-lg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-red-400 font-medium text-lg">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your script does, how to use it, and any special features..."
                      value={scriptDescription}
                      onChange={(e) => setScriptDescription(e.target.value)}
                      className="nexus-input mt-2 min-h-[150px] text-base leading-relaxed"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-red-400 font-medium text-lg">
                      Category *
                    </Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="nexus-input mt-2 text-lg">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="key-system">Key System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Links Section (Verified Users Only) */}
              {isVerified && (
                <Card className="nexus-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <LinkIcon className="mr-2 h-5 w-5 text-red-500" />
                      Script Links
                      <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded">VERIFIED ONLY</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400">Add relevant links for your script (documentation, tutorials, etc.)</p>
                    {scriptLinks.map((link, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="https://example.com"
                          value={link}
                          onChange={(e) => updateLink(index, e.target.value)}
                          className="nexus-input flex-1"
                        />
                        {scriptLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeLinkField(index)}
                            className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLinkField}
                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                    >
                      Add Link
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Script Code */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                    Script Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="code" className="text-red-400 font-medium text-lg">
                      Script Code *
                    </Label>
                    <Textarea
                      id="code"
                      placeholder="Paste your script code here..."
                      value={scriptCode}
                      onChange={(e) => setScriptCode(e.target.value)}
                      className="nexus-input mt-2 min-h-[400px] font-mono text-sm leading-relaxed"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="nexus-button px-12 py-4 text-xl font-semibold"
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-6 w-6" />
                  {isLoading ? "Submitting..." : "Submit for Review"}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar - Thumbnail */}
          <div className="xl:col-span-1">
            <Card className="nexus-card sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <ImageIcon className="mr-2 h-5 w-5 text-red-500" />
                  Script Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-red-400 font-medium">Thumbnail Image *</Label>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload an image that represents your script. Recommended: at least 600x400 pixels for high quality.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />

                  {thumbnailPreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full">
                        <Image
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          width={400}
                          height={300}
                          className="w-full h-auto rounded-lg border border-gray-600"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                      >
                        Change Thumbnail
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
                      <p className="text-gray-300 font-medium mb-2">Click to upload thumbnail</p>
                      <p className="text-sm text-gray-500">
                        Max 10MB - JPG, PNG, GIF
                        <br />
                        Recommended: 600x400px
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
