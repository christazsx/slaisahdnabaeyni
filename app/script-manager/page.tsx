"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScriptDetailModal } from "@/components/script-detail-modal"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Download, Trash2, Eye, Heart, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

export default function ScriptManagerPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [savedScripts, setSavedScripts] = useState<Script[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(`nexus_saved_${user.id}`) || "[]")

      // Ensure all saved scripts have default values
      const savedWithDefaults = saved.map((script: any) => ({
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

      setSavedScripts(savedWithDefaults)
    }
  }, [user])

  const handleScriptClick = (script: Script) => {
    setSelectedScript(script)
    setIsModalOpen(true)
  }

  const handleScriptUpdate = (updatedScript: Script) => {
    setSavedScripts((prevScripts) =>
      prevScripts.map((script) => (script.id === updatedScript.id ? updatedScript : script)),
    )
    setSelectedScript(updatedScript)
  }

  const handleDownload = (script: Script) => {
    // Create a blob with the script code
    const blob = new Blob([script.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${script.name}.lua`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Script downloaded!",
      description: `${script.name} has been downloaded to your device.`,
    })
  }

  const handleRemove = (scriptId: string) => {
    if (!user) return

    const updatedScripts = savedScripts.filter((script) => script.id !== scriptId)
    setSavedScripts(updatedScripts)
    localStorage.setItem(`nexus_saved_${user.id}`, JSON.stringify(updatedScripts))

    toast({
      title: "Script removed",
      description: "Script has been removed from your saved scripts.",
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

  if (!user) {
    return (
      <div className="min-h-screen nexus-gradient">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="nexus-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Lock className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-gray-400 mb-6">You need to be logged in to access your script manager.</p>
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

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-red-500">Script</span> Manager
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Manage your saved scripts</p>
        </div>

        {savedScripts.length === 0 ? (
          <Card className="nexus-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Download className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Saved Scripts</h3>
              <p className="text-gray-400 mb-6">
                You haven't saved any scripts yet. Browse the script library to find and save scripts.
              </p>
              <Link href="/scripts">
                <Button className="nexus-button">Browse Scripts</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-400">You have {savedScripts.length} saved scripts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedScripts.map((script) => (
                <Card key={script.id} className="nexus-card hover:bg-gray-800/50 transition-colors">
                  <div className="relative cursor-pointer" onClick={() => handleScriptClick(script)}>
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

                  <CardContent className="p-4" onClick={() => handleScriptClick(script)}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-red-500 text-white text-xs">{script.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-400">{script.author}</span>
                    </div>

                    <h3 className="font-semibold text-white mb-2 cursor-pointer">{script.name}</h3>
                    <p className="text-xs text-gray-500">{new Date(script.createdAt).toLocaleDateString()}</p>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
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

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(script)
                          }}
                          className="nexus-button px-3 py-1 text-xs"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemove(script.id)
                          }}
                          className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent px-3 py-1 text-xs"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
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
