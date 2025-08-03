"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Zap, Plus, Edit, Trash2, Download, Shield, Star, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Executor {
  id: string
  name: string
  description: string
  rating: number
  downloads: string
  status: string
  features: string[]
  downloadUrl: string
}

export default function AdminExecutorsPage() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [executors, setExecutors] = useState<Executor[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExecutor, setEditingExecutor] = useState<Executor | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rating, setRating] = useState(0)
  const [downloads, setDownloads] = useState("")
  const [status, setStatus] = useState("")
  const [features, setFeatures] = useState<string[]>([""])
  const [downloadUrl, setDownloadUrl] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!isAdmin()) {
      router.push("/")
      return
    }

    loadExecutors()
  }, [user, isAdmin, router])

  const loadExecutors = () => {
    const storedExecutors = JSON.parse(localStorage.getItem("nexus_executors") || "[]")
    setExecutors(storedExecutors)
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setRating(0)
    setDownloads("")
    setStatus("")
    setFeatures([""])
    setDownloadUrl("")
    setEditingExecutor(null)
  }

  const openModal = (executor?: Executor) => {
    if (executor) {
      setEditingExecutor(executor)
      setName(executor.name)
      setDescription(executor.description)
      setRating(executor.rating)
      setDownloads(executor.downloads)
      setStatus(executor.status)
      setFeatures(executor.features)
      setDownloadUrl(executor.downloadUrl)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const addFeature = () => {
    setFeatures([...features, ""])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description || !downloadUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const validFeatures = features.filter((f) => f.trim() !== "")
      const executorData = {
        id: editingExecutor?.id || Date.now().toString(),
        name,
        description,
        rating: Number(rating),
        downloads,
        status,
        features: validFeatures,
        downloadUrl,
      }

      let updatedExecutors
      if (editingExecutor) {
        updatedExecutors = executors.map((exec) => (exec.id === editingExecutor.id ? executorData : exec))
        toast({
          title: "Executor updated!",
          description: "The executor has been successfully updated.",
        })
      } else {
        updatedExecutors = [executorData, ...executors]
        toast({
          title: "Executor added!",
          description: "The new executor has been added successfully.",
        })
      }

      setExecutors(updatedExecutors)
      localStorage.setItem("nexus_executors", JSON.stringify(updatedExecutors))
      closeModal()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the executor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (executorId: string) => {
    const updatedExecutors = executors.filter((exec) => exec.id !== executorId)
    setExecutors(updatedExecutors)
    localStorage.setItem("nexus_executors", JSON.stringify(updatedExecutors))

    toast({
      title: "Executor deleted",
      description: "The executor has been removed successfully.",
    })
  }

  if (!user || !isAdmin()) {
    return null
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            <span className="text-red-500">Manage</span> Executors
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6 animate-slide-in"></div>
          <p className="text-xl text-gray-300">Add and manage script executors</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Panel
            </Button>
          </Link>
        </div>

        {/* Add Executor Button */}
        <div className="mb-8">
          <Button
            onClick={() => openModal()}
            className="nexus-button transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Executor
          </Button>
        </div>

        {/* Executors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executors.map((executor, index) => (
            <Card
              key={executor.id}
              className="nexus-card hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white">
                    <Zap className="mr-2 h-5 w-5 text-red-500" />
                    {executor.name}
                  </CardTitle>
                  <Badge className="bg-red-500 text-white animate-pulse">{executor.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400">{executor.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-300">{executor.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{executor.downloads}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {executor.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => openModal(executor)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-600 text-blue-400 hover:text-white hover:bg-blue-600 bg-transparent transition-all duration-300"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(executor.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent transition-all duration-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Executor Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 animate-modal-in">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {editingExecutor ? "Edit Executor" : "Add New Executor"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-red-400 font-medium">
                    Executor Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="nexus-input mt-1 transition-all duration-300 focus:scale-105"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-red-400 font-medium">
                    Status
                  </Label>
                  <Input
                    id="status"
                    placeholder="e.g., Recommended, Popular, New"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="nexus-input mt-1 transition-all duration-300 focus:scale-105"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-red-400 font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="nexus-input mt-1 min-h-[100px] transition-all duration-300 focus:scale-105"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating" className="text-red-400 font-medium">
                    Rating (0-5)
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="nexus-input mt-1 transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div>
                  <Label htmlFor="downloads" className="text-red-400 font-medium">
                    Downloads
                  </Label>
                  <Input
                    id="downloads"
                    placeholder="e.g., 50K+, 100K+"
                    value={downloads}
                    onChange={(e) => setDownloads(e.target.value)}
                    className="nexus-input mt-1 transition-all duration-300 focus:scale-105"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="downloadUrl" className="text-red-400 font-medium">
                  Download URL *
                </Label>
                <Input
                  id="downloadUrl"
                  type="url"
                  placeholder="https://example.com/download"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  className="nexus-input mt-1 transition-all duration-300 focus:scale-105"
                  required
                />
              </div>

              <div>
                <Label className="text-red-400 font-medium">Features</Label>
                <div className="space-y-2 mt-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Enter a feature"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="nexus-input flex-1 transition-all duration-300 focus:scale-105"
                      />
                      {features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeFeature(index)}
                          className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFeature}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent transition-all duration-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1 nexus-button transition-all duration-300 hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : editingExecutor ? "Update Executor" : "Add Executor"}
                </Button>
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
