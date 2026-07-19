'use client'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import { AdminProvider, useAdmin } from '@/context/AdminContext'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopBar from '@/components/layout/AdminTopBar'
import { Loader2 } from 'lucide-react'

function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--background)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  if (!admin) { notFound() }

  return (
    <div className="admin-shell">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopBar onMenuToggle={() => setSidebarOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}
