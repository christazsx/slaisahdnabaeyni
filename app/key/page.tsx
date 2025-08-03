import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Key, Shield, Zap } from "lucide-react"

export default function KeyPage() {
  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-red-500">Access</span> Keys
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Manage your access keys and permissions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Key className="mr-2 h-5 w-5 text-red-500" />
                Basic Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Access to basic scripts and features</p>
              <Button className="nexus-button w-full">Get Basic Key</Button>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="mr-2 h-5 w-5 text-red-500" />
                Premium Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Access to premium scripts and exclusive features</p>
              <Button className="nexus-button w-full">Get Premium Key</Button>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Zap className="mr-2 h-5 w-5 text-red-500" />
                VIP Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Unlimited access to all scripts and features</p>
              <Button className="nexus-button w-full">Get VIP Key</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
