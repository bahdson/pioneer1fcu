'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Send,
  Download,
  Bitcoin,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { NotificationBell } from '@/components/notification-bell'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/deposit', icon: Bitcoin, label: 'Bitcoin Deposit' },
  { href: '/dashboard/check-deposit', icon: Download, label: 'Check Deposit' },
  { href: '/dashboard/withdraw', icon: Send, label: 'Withdraw' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Pioneer1 Logo" width={32} height={32} className="rounded" />
          <h1 className="font-bold text-sm text-sidebar-foreground">Pioneer1</h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-sidebar-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden fixed top-12 left-0 right-0 z-30 bg-sidebar border-b border-sidebar-border p-4 space-y-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              handleLogout()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition text-sm"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col"
      >
        {/* Logo and Notification */}
        <div className="p-4 md:p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between gap-2 md:gap-3 mb-4">
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              <Image src="/logo.png" alt="Pioneer1 Logo" width={36} height={36} loading="eager" className="rounded-md w-auto h-auto" />
              <div className="min-w-0">
                <h1 className="font-bold text-sm md:text-base text-sidebar-foreground">Pioneer1</h1>
                <p className="text-xs text-muted-foreground">Credit Union</p>
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <motion.div key={item.href} whileHover={{ x: 4 }}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition text-sm md:text-base ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon size={18} className="md:size-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 md:p-4 border-t border-sidebar-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition text-sm md:text-base"
          >
            <LogOut size={18} className="md:size-5" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}
