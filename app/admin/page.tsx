"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  FileText,
  Flag,
  Check,
  X,
  Shield,
  Crown,
  UserCheck,
  Clock,
  AlertTriangle,
  DollarSign,
  Plus,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface User {
  id: string
  username: string
  email: string
  avatar: string
  role: "user" | "admin" | "moderator"
  rank?: "verified" | "pro" | null
  joinedAt: string
  robuxBalance?: number
}

interface Script {
  id: string
  name: string
  description: string
  author: string
  authorId: string
  thumbnail: string
  category: string
  createdAt: string
  approved: boolean
}

interface Report {
  id: string
  userId: string
  username: string
  scriptId: string
  scriptName: string
  reason: string
  createdAt: string
}

export default function AdminPage() {
  const { user, isAdmin, isModerator } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [pendingScripts, setPendingScripts] = useState<Script[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [activeTab, setActiveTab] = useState("users")

  // Robux modal states
  const [isRobuxModalOpen, setIsRobuxModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [robuxAmount, setRobuxAmount] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!isModerator()) {
      router.push("/")
      return
    }

    // Load data
    loadUsers()
    loadPendingScripts()
    loadReports()
  }, [user, isModerator, router])

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("nexus_users") || "[]")
    // Ensure robuxBalance exists
    const usersWithRobux = storedUsers.map((u: any) => ({
      ...u,
      robuxBalance: u.robuxBalance || 0,
    }))
    setUsers(usersWithRobux)
  }

  const loadPendingScripts = () => {
    const pending = JSON.parse(localStorage.getItem("nexus_pending_scripts") || "[]")
    setPendingScripts(pending)
  }

  const loadReports = () => {
    const storedReports = JSON.parse(localStorage.getItem("nexus_reports") || "[]")
    setReports(storedReports)
  }

  const updateUserRole = (userId: string, newRole: "user" | "admin" | "moderator") => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    setUsers(updatedUsers)
    localStorage.setItem("nexus_users", JSON.stringify(updatedUsers))

    toast({
      title: "Role updated",
      description: "User role has been successfully updated.",
    })
  }

  const updateUserRank = (userId: string, newRank: "verified" | "pro" | null) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, rank: newRank } : u))
    setUsers(updatedUsers)
    localStorage.setItem("nexus_users", JSON.stringify(updatedUsers))

    // Update current user if it's their own rank
    if (user?.id === userId) {
      const updatedUser = { ...user, rank: newRank }
      localStorage.setItem("nexus_user", JSON.stringify(updatedUser))
    }

    toast({
      title: "Rank updated",
      description: "User rank has been successfully updated.",
    })
  }

  const openRobuxModal = (userData: User) => {
    setSelectedUser(userData)
    setRobuxAmount("")
    setIsRobuxModalOpen(true)
  }

  const handleAddRobux = () => {
    if (!selectedUser || !robuxAmount) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid Robux amount.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseInt(robuxAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number.",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((u) => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          robuxBalance: (u.robuxBalance || 0) + amount,
        }
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("nexus_users", JSON.stringify(updatedUsers))

    // Update user balances storage
    const userBalances = JSON.parse(localStorage.getItem("nexus_user_balances") || "{}")
    userBalances[selectedUser.id] = (userBalances[selectedUser.id] || 0) + amount
    localStorage.setItem("nexus_user_balances", JSON.stringify(userBalances))

    toast({
      title: "Robux added!",
      description: `Added ${amount} R$ to ${selectedUser.username}'s account.`,
    })

    setIsRobuxModalOpen(false)
    setSelectedUser(null)
    setRobuxAmount("")
  }

  const approveScript = (scriptId: string) => {
    const script = pendingScripts.find((s) => s.id === scriptId)
    if (!script) return

    // Move to approved scripts
    const approvedScripts = JSON.parse(localStorage.getItem("nexus_scripts") || "[]")
    const approvedScript = {
      ...script,
      approved: true,
      approvedBy: user?.id,
      approvedAt: new Date().toISOString(),
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
    }

    approvedScripts.unshift(approvedScript)
    localStorage.setItem("nexus_scripts", JSON.stringify(approvedScripts))

    // Remove from pending
    const updatedPending = pendingScripts.filter((s) => s.id !== scriptId)
    setPendingScripts(updatedPending)
    localStorage.setItem("nexus_pending_scripts", JSON.stringify(updatedPending))

    toast({
      title: "Script approved",
      description: "Script has been approved and is now live.",
    })
  }

  const rejectScript = (scriptId: string) => {
    const updatedPending = pendingScripts.filter((s) => s.id !== scriptId)
    setPendingScripts(updatedPending)
    localStorage.setItem("nexus_pending_scripts", JSON.stringify(updatedPending))

    toast({
      title: "Script rejected",
      description: "Script has been rejected and removed.",
    })
  }

  const dismissReport = (reportId: string) => {
    const updatedReports = reports.filter((r) => r.id !== reportId)
    setReports(updatedReports)
    localStorage.setItem("nexus_reports", JSON.stringify(updatedReports))

    toast({
      title: "Report dismissed",
      description: "Report has been dismissed.",
    })
  }

  if (!user || !isModerator()) {
    return null
  }

  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            <span className="text-red-500">Admin</span> Panel
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6 animate-slide-in"></div>
          <p className="text-xl text-gray-300">Manage users, scripts, and platform settings</p>
        </div>

        {/* Admin Actions */}
        {isAdmin() && (
          <div className="mb-8 flex flex-wrap gap-4">
            <Link href="/admin/executors">
              <Button className="nexus-button transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Zap className="mr-2 h-5 w-5" />
                Manage Executors
              </Button>
            </Link>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 animate-fade-in">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-red-500 transition-all duration-300 hover:scale-105"
            >
              <Users className="mr-2 h-4 w-4" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger
              value="scripts"
              className="data-[state=active]:bg-red-500 transition-all duration-300 hover:scale-105"
            >
              <FileText className="mr-2 h-4 w-4" />
              Pending Scripts ({pendingScripts.length})
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-red-500 transition-all duration-300 hover:scale-105"
            >
              <Flag className="mr-2 h-4 w-4" />
              Reports ({reports.length})
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4">
              {users.map((userData, index) => (
                <Card
                  key={userData.id}
                  className="nexus-card hover:bg-gray-800/70 transition-all duration-300 hover:scale-102 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 transition-all duration-300 hover:scale-110">
                          <AvatarFallback className="bg-red-500 text-white">{userData.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <UserBadge username={userData.username} rank={userData.rank} />
                          </div>
                          <p className="text-sm text-gray-400">{userData.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(userData.joinedAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-400">{userData.robuxBalance || 0} R$</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Robux Management */}
                        <Button
                          onClick={() => openRobuxModal(userData)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add R$
                        </Button>

                        {/* Role Selection */}
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Role</label>
                          <Select
                            value={userData.role}
                            onValueChange={(value: "user" | "admin" | "moderator") =>
                              updateUserRole(userData.id, value)
                            }
                          >
                            <SelectTrigger className="nexus-input w-32 transition-all duration-300 hover:scale-105">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              {isAdmin() && <SelectItem value="admin">Admin</SelectItem>}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Rank Selection */}
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Rank</label>
                          <Select
                            value={userData.rank || "none"}
                            onValueChange={(value) =>
                              updateUserRank(userData.id, value === "none" ? null : (value as "verified" | "pro"))
                            }
                          >
                            <SelectTrigger className="nexus-input w-32 transition-all duration-300 hover:scale-105">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="verified">
                                <div className="flex items-center space-x-2">
                                  <UserCheck className="h-4 w-4 text-blue-500" />
                                  <span>Verified</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="pro">
                                <div className="flex items-center space-x-2">
                                  <Crown className="h-4 w-4 text-yellow-500" />
                                  <span>PRO</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Badge
                          className={`${
                            userData.role === "admin"
                              ? "bg-red-500"
                              : userData.role === "moderator"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          } text-white animate-pulse`}
                        >
                          {userData.role.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pending Scripts Tab */}
          <TabsContent value="scripts" className="space-y-4">
            {pendingScripts.length === 0 ? (
              <Card className="nexus-card animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-gray-600 mb-4 animate-spin-slow" />
                  <h3 className="text-xl font-bold text-white mb-2">No Pending Scripts</h3>
                  <p className="text-gray-400">All scripts have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingScripts.map((script, index) => (
                  <Card
                    key={script.id}
                    className="nexus-card hover:bg-gray-800/70 transition-all duration-300 hover:scale-102 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={script.thumbnail || "/placeholder.svg?height=100&width=150"}
                          alt={script.name}
                          width={150}
                          height={100}
                          className="rounded-lg object-cover transition-all duration-300 hover:scale-110"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{script.name}</h3>
                          <p className="text-gray-400 mb-2">{script.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>By {script.author}</span>
                            <span>{new Date(script.createdAt).toLocaleDateString()}</span>
                            <Badge
                              className={`${
                                script.category === "free"
                                  ? "bg-green-500"
                                  : script.category === "paid"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              } text-white animate-pulse`}
                            >
                              {script.category.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => approveScript(script.id)}
                            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => rejectScript(script.id)}
                            variant="destructive"
                            className="transition-all duration-300 hover:scale-105"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            {reports.length === 0 ? (
              <Card className="nexus-card animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Shield className="mx-auto h-12 w-12 text-gray-600 mb-4 animate-bounce" />
                  <h3 className="text-xl font-bold text-white mb-2">No Reports</h3>
                  <p className="text-gray-400">No reports to review at this time.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {reports.map((report, index) => (
                  <Card
                    key={report.id}
                    className="nexus-card hover:bg-gray-800/70 transition-all duration-300 hover:scale-102 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
                            <h3 className="text-lg font-semibold text-white">Report for: {report.scriptName}</h3>
                          </div>
                          <p className="text-gray-400 mb-2">
                            <strong>Reported by:</strong> {report.username}
                          </p>
                          <p className="text-gray-400 mb-2">
                            <strong>Reason:</strong> {report.reason}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => dismissReport(report.id)}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent transition-all duration-300"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Robux Modal */}
        <Dialog open={isRobuxModalOpen} onOpenChange={setIsRobuxModalOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 animate-modal-in">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Add Robux to {selectedUser?.username}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="robuxAmount" className="text-red-400 font-medium">
                  Robux Amount
                </Label>
                <Input
                  id="robuxAmount"
                  type="number"
                  placeholder="Enter amount to add"
                  value={robuxAmount}
                  onChange={(e) => setRobuxAmount(e.target.value)}
                  className="nexus-input mt-1 transition-all duration-300 focus:scale-105"
                />
              </div>

              <div className="flex items-center space-x-2 text-gray-400">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Current balance: {selectedUser?.robuxBalance || 0} R$</span>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddRobux}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Robux
                </Button>
                <Button
                  onClick={() => setIsRobuxModalOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
