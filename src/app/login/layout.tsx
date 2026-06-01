'use client'
import { AdminProvider } from '@/context/AdminContext'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>
}
