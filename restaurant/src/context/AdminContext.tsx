'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api, fetcher, poster } from '@/lib/api/client'

interface AdminUser {
  id: string
  email: string
  name: string
}

interface AdminContextType {
  admin: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetcher<{ admin: AdminUser }>('/api/auth/me')
      .then((res) => setAdmin(res.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await poster<{ admin: AdminUser }>('/api/auth/login', { email, password })
    setAdmin(res.admin)
  }

  const logout = async () => {
    await poster('/api/auth/logout', {})
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}
