'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LogOut,
  Users,
  TrendingUp,
  Lock,
  Trash2,
  Edit2,
  Bitcoin,
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  full_name: string
  balance: number
  is_frozen: boolean
  created_at: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    frozenAccounts: 0,
  })

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('admin_token')

        if (!token) {
          router.push('/admin/login')
          return
        }

        // Fetch users
        const response = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          router.push('/admin/login')
          return
        }

        const data = await response.json()
        setUsers(data)

        // Calculate stats
        setStats({
          totalUsers: data.length,
          totalBalance: data.reduce(
            (sum: number, u: User) => sum + u.balance,
            0
          ),
          frozenAccounts: data.filter((u: User) => u.is_frozen).length,
        })
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [router])

  const handleLogout = async () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="text-4xl">🏦</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏦</span>
            <div>
              <h1 className="font-bold text-lg text-card-foreground">
                Pioneer1 Admin
              </h1>
              <p className="text-xs text-muted-foreground">Management Portal</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: Users,
              label: 'Total Members',
              value: stats.totalUsers,
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: TrendingUp,
              label: 'Total Balance',
              value: `$${stats.totalBalance.toFixed(2)}`,
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: Lock,
              label: 'Frozen Accounts',
              value: stats.frozenAccounts,
              color: 'from-red-500 to-orange-500',
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}
              >
                <Icon size={32} className="mb-3" />
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg shadow overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
              <Users size={24} />
              Member Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-background/50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-card-foreground">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 font-semibold text-card-foreground">
                      ${user.balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_frozen
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-green-500/20 text-green-500'
                        }`}
                      >
                        {user.is_frozen ? 'Frozen' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-2 hover:bg-background rounded transition text-accent"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-destructive/10 rounded transition text-destructive"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No members yet
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
