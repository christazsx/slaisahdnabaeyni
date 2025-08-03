"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Check, Crown, User, MessageCircle, ExternalLink, Zap, Star, Shield } from "lucide-react"

const rankFeatures = {
  basic: [
    "Access to all website features",
    "Comment on scripts",
    "Download and save scripts",
    "Basic profile customization",
    "Community participation",
  ],
  verified: [
    "All Basic Account features",
    "Blue verified checkmark",
    "Upload scripts without approval",
    "Priority support",
    "Enhanced profile visibility",
  ],
  pro: [
    "All Verified Account features",
    "Golden PRO checkmark",
    "Add custom links to profile",
    "Build your brand effectively",
    "Exclusive PRO community access",
    "Advanced analytics",
  ],
}

export default function RanksPage() {
  const { user } = useAuth()

  const currentRank = user?.rank || "basic"

  const handleUpgradeClick = () => {
    window.open("https://discord.com/invite/DKRzMkHTkq", "_blank", "noopener,noreferrer")
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "verified":
        return <Check className="h-5 w-5 text-blue-500" />
      case "pro":
        return <Crown className="h-5 w-5 text-yellow-500" />
      default:
        return <User className="h-5 w-5 text-gray-500" />
    }
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "verified":
        return "from-blue-500 to-blue-600"
      case "pro":
        return "from-yellow-500 to-yellow-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getRankName = (rank: string) => {
    switch (rank) {
      case "verified":
        return "Verified"
      case "pro":
        return "PRO"
      default:
        return "Basic Account"
    }
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in text-glow">
            <span className="text-red-500">Account</span> Ranks
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6 animate-slide-in animate-glow"></div>
          <p className="text-xl text-gray-300 animate-fade-in-up">Choose your rank and unlock exclusive features</p>
        </div>

        {/* Current Rank Display */}
        {user && (
          <Card className="nexus-card max-w-md mx-auto mb-8 animate-fade-in hover:scale-102 transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-white">
                <Shield className="mr-2 h-5 w-5 text-red-500" />
                Your Current Rank
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${getRankColor(currentRank)} animate-float`}>
                  {getRankIcon(currentRank)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{getRankName(currentRank)}</h3>
                  <Badge
                    className={`${getRankColor(currentRank).replace("from-", "bg-").replace(" to-yellow-600", "").replace(" to-blue-600", "").replace(" to-gray-600", "")} text-white animate-pulse`}
                  >
                    ACTIVE
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Account */}
          <Card
            className={`nexus-card hover:scale-105 transition-all duration-500 animate-fade-in-up ${currentRank === "basic" ? "ring-2 ring-gray-500 animate-glow" : ""}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 mr-3 animate-float">
                  <User className="h-5 w-5 text-white" />
                </div>
                Basic Account
              </CardTitle>
              {currentRank === "basic" && (
                <Badge className="bg-gray-500 text-white w-fit animate-pulse">CURRENT RANK</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">Perfect for getting started with NEXUS Protocols</p>

              <div className="space-y-3">
                {rankFeatures.basic.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <div className="text-2xl font-bold text-white mb-2">FREE</div>
                {currentRank !== "basic" ? (
                  <Button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed">
                    <Check className="mr-2 h-4 w-4" />
                    Unlocked
                  </Button>
                ) : (
                  <Button disabled className="w-full bg-gray-500 text-white cursor-default">
                    <Star className="mr-2 h-4 w-4" />
                    Your Current Rank
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verified */}
          <Card
            className={`nexus-card hover:scale-105 transition-all duration-500 animate-fade-in-up ${currentRank === "verified" ? "ring-2 ring-blue-500 animate-glow" : ""}`}
            style={{ animationDelay: "200ms" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 mr-3 animate-float">
                  <Check className="h-5 w-5 text-white" />
                </div>
                Verified
              </CardTitle>
              {currentRank === "verified" && (
                <Badge className="bg-blue-500 text-white w-fit animate-pulse">CURRENT RANK</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">Stand out with verification and enhanced features</p>

              <div className="space-y-3">
                {rankFeatures.verified.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <div className="text-2xl font-bold text-blue-400 mb-2">PREMIUM</div>
                {currentRank === "verified" ? (
                  <Button disabled className="w-full bg-blue-500 text-white cursor-default">
                    <Star className="mr-2 h-4 w-4" />
                    Your Current Rank
                  </Button>
                ) : currentRank === "pro" ? (
                  <Button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed">
                    <Check className="mr-2 h-4 w-4" />
                    Unlocked
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgradeClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Get Verified Rank
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PRO */}
          <Card
            className={`nexus-card hover:scale-105 transition-all duration-500 animate-fade-in-up ${currentRank === "pro" ? "ring-2 ring-yellow-500 animate-glow" : ""}`}
            style={{ animationDelay: "400ms" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 mr-3 animate-float">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                PRO
                <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white animate-pulse">
                  BEST
                </Badge>
              </CardTitle>
              {currentRank === "pro" && (
                <Badge className="bg-yellow-500 text-white w-fit animate-pulse">CURRENT RANK</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">Ultimate features for building your brand</p>

              <div className="space-y-3">
                {rankFeatures.pro.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <div className="text-2xl font-bold text-yellow-400 mb-2">ULTIMATE</div>
                {currentRank === "pro" ? (
                  <Button disabled className="w-full bg-yellow-500 text-white cursor-default">
                    <Star className="mr-2 h-4 w-4" />
                    Your Current Rank
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgradeClick}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Get PRO Rank
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card className="nexus-card mt-12 animate-fade-in hover:scale-102 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-center text-white text-2xl">
              <MessageCircle className="inline mr-2 h-6 w-6 text-red-500" />
              Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-4 text-gray-300">Feature</th>
                    <th className="pb-4 text-center text-gray-400">Basic</th>
                    <th className="pb-4 text-center text-blue-400">Verified</th>
                    <th className="pb-4 text-center text-yellow-400">PRO</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Website Access</td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Comment on Scripts</td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Verification Badge</td>
                    <td className="py-3 text-center">-</td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-blue-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">
                      <Crown className="h-4 w-4 text-yellow-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Upload Without Approval</td>
                    <td className="py-3 text-center">-</td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Custom Profile Links</td>
                    <td className="py-3 text-center">-</td>
                    <td className="py-3 text-center">-</td>
                    <td className="py-3 text-center">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {user && currentRank !== "pro" && (
          <div className="text-center mt-12">
            <Card className="nexus-card max-w-2xl mx-auto animate-fade-in hover:scale-102 transition-all duration-500">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Upgrade?</h3>
                <p className="text-gray-300 mb-6">
                  Join our Discord community to learn more about rank upgrades and exclusive benefits.
                </p>
                <Button
                  onClick={handleUpgradeClick}
                  size="lg"
                  className="nexus-button px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Join Discord Community
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
