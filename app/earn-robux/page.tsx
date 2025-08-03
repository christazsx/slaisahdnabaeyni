"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { DollarSign, Gift, Users, Zap, TrendingUp } from "lucide-react"

const earnMethods = [
  {
    title: "Complete Offers",
    description: "Complete surveys and offers to earn Robux",
    icon: Gift,
    reward: "Up to 1000 R$",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Refer Friends",
    description: "Invite friends and earn Robux for each referral",
    icon: Users,
    reward: "500 R$ per referral",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Daily Tasks",
    description: "Complete daily tasks and challenges",
    icon: Zap,
    reward: "50-200 R$ daily",
    color: "from-green-500 to-emerald-500",
  },
]

export default function EarnRobuxPage() {
  const { user } = useAuth()
  const [userBalance, setUserBalance] = useState(0)

  useEffect(() => {
    if (user) {
      // Load user's Robux balance
      const users = JSON.parse(localStorage.getItem("nexus_users") || "[]")
      const foundUser = users.find((u: any) => u.id === user.id)
      setUserBalance(foundUser?.robuxBalance || 0)
    }
  }, [user])

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in text-glow">
            <span className="text-red-500">Earn</span> Robux
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6 animate-slide-in animate-glow"></div>
          <p className="text-xl text-gray-300 animate-fade-in-up">Complete tasks and earn free Robux</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {earnMethods.map((method, index) => (
            <Card
              key={index}
              className="nexus-card hover:scale-105 transition-all duration-500 animate-fade-in-up cursor-pointer group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-white group-hover:text-red-400 transition-colors duration-300">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color} mr-3 animate-float`}>
                    <method.icon className="h-5 w-5 text-white" />
                  </div>
                  {method.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {method.description}
                </p>
                <div className="text-lg font-semibold text-green-400 animate-pulse">{method.reward}</div>
                <Button className="w-full nexus-button group-hover:scale-105 transition-all duration-300">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Start Earning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="nexus-card max-w-2xl mx-auto animate-fade-in hover:scale-102 transition-all duration-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-white">
              <DollarSign className="mr-2 h-5 w-5 text-red-500 animate-spin-slow" />
              Your Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold text-white mb-4 animate-glow">{userBalance} R$</div>
            <p className="text-gray-400 mb-6">
              {userBalance === 0 ? "Start completing tasks to earn Robux" : "Keep earning to increase your balance!"}
            </p>
            <Button className="nexus-button hover:scale-105 transition-all duration-300">
              <Gift className="mr-2 h-4 w-4" />
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
