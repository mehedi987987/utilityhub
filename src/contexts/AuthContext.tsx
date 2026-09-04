"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  tokens: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => Promise<void>
  useToken: () => boolean
  addTokens: (amount: number) => void
  showAd: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved user
    const saved = localStorage.getItem('utilityhub_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const saveUser = (u: User | null) => {
    setUser(u)
    if (u) {
      localStorage.setItem('utilityhub_user', JSON.stringify(u))
    } else {
      localStorage.removeItem('utilityhub_user')
    }
  }

  const login = async (email: string, password: string) => {
    // Simulate login - in production, use Firebase Auth
    const savedUsers = JSON.parse(localStorage.getItem('utilityhub_users') || '[]')
    const found = savedUsers.find((u: any) => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const { password: _, ...userData } = found
    saveUser(userData)
  }

  const signup = async (email: string, password: string, name: string) => {
    const savedUsers = JSON.parse(localStorage.getItem('utilityhub_users') || '[]')
    if (savedUsers.find((u: any) => u.email === email)) {
      throw new Error('Email already registered')
    }
    const newUser: User & { password: string } = {
      uid: 'user_' + Date.now(),
      email,
      displayName: name,
      photoURL: '',
      tokens: 100, // 100 free tokens on signup
      password,
    }
    savedUsers.push(newUser)
    localStorage.setItem('utilityhub_users', JSON.stringify(savedUsers))
    const { password: _, ...userData } = newUser
    saveUser(userData)
  }

  const googleLogin = async () => {
    // Simulate Google login
    const newUser: User = {
      uid: 'google_' + Date.now(),
      email: 'user@gmail.com',
      displayName: 'Google User',
      photoURL: '',
      tokens: 100,
    }
    saveUser(newUser)
  }

  const logout = async () => {
    saveUser(null)
  }

  const useToken = (): boolean => {
    if (!user || user.tokens < 10) return false
    const updated = { ...user, tokens: user.tokens - 10 }
    saveUser(updated)
    return true
  }

  const addTokens = (amount: number) => {
    if (!user) return
    const updated = { ...user, tokens: user.tokens + amount }
    saveUser(updated)
  }

  const showAd = async () => {
    // Simulate watching an ad (3 seconds)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        addTokens(50)
        resolve()
      }, 3000)
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, googleLogin, logout, useToken, addTokens, showAd }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
