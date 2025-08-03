"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Zap, Download, Shield, Star, ExternalLink } from "lucide-react"

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

// Default executors - in a real app, this would be managed by admins
const defaultExecutors: Executor[] = [
  {
    id: "1",
    name: "Nexus Executor",
    description: "Our flagship executor with advanced features and security",
    rating: 4.9,
    downloads: "50K+",
    status: "Recommended",
    features: ["Anti-detection", "Fast execution", "Regular updates"],
    downloadUrl: "https://example.com/nexus-executor",
  },
  {
    id: "2",
    name: "Lightning Executor",
    description: "Lightweight and fast executor for quick script execution",
    rating: 4.7,
    downloads: "30K+",
    status: "Popular",
    features: ["Lightweight", "Fast startup", "Stable"],
    downloadUrl: "https://example.com/lightning-executor",
  },
  {
    id: "3",
    name: "Secure Executor",
    description: "Maximum security and protection for your scripts",
    rating: 4.8,
    downloads: "25K+",
    status: "Secure",
    features: ["Maximum security", "Encrypted", "Safe execution"],
    downloadUrl: "https://example.com/secure-executor",
  },
]

export default function ExecutorsPage() {
  const { toast } = useToast()
  const [executors, setExecutors] = useState<Executor[]>([])

  useEffect(() => {
    // Load executors from localStorage, or use defaults
    const storedExecutors = localStorage.getItem("nexus_executors")
    if (storedExecutors) {
      setExecutors(JSON.parse(storedExecutors))
    } else {
      setExecutors(defaultExecutors)
      localStorage.setItem("nexus_executors", JSON.stringify(defaultExecutors))
    }
  }, [])

  const handleDownload = (executor: Executor) => {
    // Open download URL in new tab
    window.open(executor.downloadUrl, "_blank", "noopener,noreferrer")

    toast({
      title: "Redirecting to download",
      description: `Opening download page for ${executor.name}`,
    })
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-red-500">Script</span> Executors
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Download trusted executors for running your scripts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executors.map((executor) => (
            <Card key={executor.id} className="nexus-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white">
                    <Zap className="mr-2 h-5 w-5 text-red-500" />
                    {executor.name}
                  </CardTitle>
                  <Badge className="bg-red-500 text-white">{executor.status}</Badge>
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

                <Button className="w-full nexus-button" onClick={() => handleDownload(executor)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
