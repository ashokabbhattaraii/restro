'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminProvider, useAdmin } from '@/context/AdminContext'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopBar from '@/components/layout/AdminTopBar'
import { Loader2 } from 'lucide-react'

function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdmin()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)


  useEffect(() => {
    if (!loading && !admin) router.replace('/login')
  }, [admin, loading, router])

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#0a0c0c' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: '#f2ca50' }} />
      </div>
    )
  }

  if (!admin) return null

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
