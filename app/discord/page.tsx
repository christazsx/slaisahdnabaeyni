"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Shield, Zap } from "lucide-react"

export default function DiscordPage() {
  const handleJoinDiscord = () => {
    window.open("https://discord.com/invite/DKRzMkHTkq", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-red-500">Discord</span> Community
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Join our community and connect with other script developers</p>
        </div>

        <div className="text-center mb-8">
          <Button size="lg" className="nexus-button px-8 py-4 text-lg font-semibold" onClick={handleJoinDiscord}>
            <MessageSquare className="mr-2 h-5 w-5" />
            Join Discord Server
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="mr-2 h-5 w-5 text-red-500" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Connect with thousands of script developers and users</p>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="mr-2 h-5 w-5 text-red-500" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Get help and support from our community moderators</p>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Zap className="mr-2 h-5 w-5 text-red-500" />
                Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Stay updated with the latest features and announcements</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
