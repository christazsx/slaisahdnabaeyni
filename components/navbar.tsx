"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/contexts/auth-context"
import { Menu, Home, Code, Key, MessageSquare, Zap, DollarSign, Settings, LogOut, User, Shield } from "lucide-react"

const menuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Scripts", href: "/scripts", icon: Code },
  { name: "Ranks", href: "/ranks", icon: Key },
  { name: "Discord", href: "/discord", icon: MessageSquare },
  { name: "Executors", href: "/executors", icon: Zap },
  { name: "Earn Robux", href: "/earn-robux", icon: DollarSign },
  { name: "Script Manager", href: "/script-manager", icon: Settings },
]

export function Navbar() {
  const { user, logout, isModerator } = useAuth()

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-red-500">Nexus</span>
              <span className="text-white ml-1">Protocols</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isModerator() && (
                  <Link href="/admin">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                        <AvatarFallback className="bg-red-500 text-white">{user.avatar}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end">
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <User className="mr-2 h-4 w-4" />
                      <UserBadge username={user.username} rank={user.rank} showUsername={false} />
                      <span className="ml-2">{user.username}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Link href="/settings" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="nexus-button">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gray-900 border-gray-700">
                <div className="flex flex-col space-y-4 mt-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  <div className="border-t border-gray-700 pt-4">
                    {!user ? (
                      <div className="space-y-2">
                        <Link href="/auth/login" className="block">
                          <Button
                            variant="outline"
                            className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth/signup" className="block">
                          <Button className="w-full nexus-button">Sign Up</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-red-500 text-white text-xs">{user.avatar}</AvatarFallback>
                          </Avatar>
                          <UserBadge username={user.username} rank={user.rank} />
                        </div>
                        {isModerator() && (
                          <Link href="/admin" className="block">
                            <Button
                              variant="outline"
                              className="w-full border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                          onClick={logout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
