"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  username: string
  avatar?: string
  role?: "user" | "admin" | "moderator"
  rank?: "verified" | "pro" | null
  joinedAt?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, username: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAdmin: () => boolean
  isModerator: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("nexus_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check stored users
      const storedUsers = JSON.parse(localStorage.getItem("nexus_users") || "[]")
      const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          avatar: foundUser.avatar,
          role: foundUser.role || "user",
          rank: foundUser.rank || null,
          joinedAt: foundUser.joinedAt,
        }
        setUser(userData)
        localStorage.setItem("nexus_user", JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem("nexus_users") || "[]")
      const existingUser = storedUsers.find((u: any) => u.email === email || u.username === username)

      if (existingUser) {
        return false // User already exists
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        username,
        avatar: username.charAt(0).toUpperCase(),
        role: "user",
        rank: null,
        joinedAt: new Date().toISOString(),
      }

      storedUsers.push(newUser)
      localStorage.setItem("nexus_users", JSON.stringify(storedUsers))

      // Auto login after signup
      const userData = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        avatar: newUser.avatar,
        role: newUser.role,
        rank: newUser.rank,
        joinedAt: newUser.joinedAt,
      }
      setUser(userData)
      localStorage.setItem("nexus_user", JSON.stringify(userData))

      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("nexus_user")
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const isModerator = () => {
    return user?.role === "admin" || user?.role === "moderator"
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin, isModerator }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
