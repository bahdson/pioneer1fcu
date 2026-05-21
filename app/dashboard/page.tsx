'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { BalanceCard } from '@/components/balance-card'
import { TrendingUp, Send, Download, Bitcoin } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  full_name: string
  balance: number
  is_frozen: boolean
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get session from localStorage or check auth
        const token = localStorage.getItem('auth_token')

        if (!token) {
          router.push('/auth/login')
          return
        }

        // Fetch user profile
        const profileRes = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!profileRes.ok) {
          router.push('/auth/login')
          return
        }

        const userData = await profileRes.json()
        setUser(userData)

        // Fetch transactions
        const transRes = await fetch('/api/user/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (transRes.ok) {
          const transData = await transRes.json()
          setTransactions(transData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Image src="/logo.png" alt="Loading..." width={60} height={60} className="w-auto h-auto" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const quickActions = [
    {
      icon: Bitcoin,
      label: 'Deposit',
      href: '/dashboard/deposit',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Send,
      label: 'Withdraw',
      href: '/dashboard/withdraw',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      label: 'Transactions',
      href: '#transactions',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 p-3 sm:p-4 md:p-8 pt-16 md:pt-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 sm:space-y-6 md:space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              Welcome back, {user.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              {user.is_frozen
                ? '⚠️ Your account is currently frozen'
                : '✨ Your account is active and secure'}
            </p>
          </div>

          {/* Balance Card */}
          <BalanceCard balance={user.balance} name={user.full_name} />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.label}
                  whileHover={{ translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={action.href}>
                    <div
                      className={`bg-gradient-to-br ${action.color} rounded-lg p-3 sm:p-4 md:p-6 text-white cursor-pointer shadow-lg hover:shadow-xl transition`}
                    >
                      <Icon size={20} className="sm:size-6 md:size-8 mb-2 sm:mb-3" />
                      <h3 className="font-semibold text-xs sm:text-sm md:text-lg">{action.label}</h3>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Recent Transactions */}
          <div id="transactions" className="bg-card rounded-lg p-3 sm:p-4 md:p-6 shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">
                Recent Transactions
              </h2>
              <Link
                href="#"
                className="text-accent hover:underline text-xs sm:text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-xs sm:text-sm text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {transactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-background rounded-lg hover:bg-input transition gap-2"
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        {transaction.type === 'deposit' ? (
                          <Bitcoin className="text-accent" size={16} className="sm:size-5" />
                        ) : (
                          <Send className="text-accent" size={16} className="sm:size-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-card-foreground text-xs sm:text-sm truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-semibold text-xs sm:text-sm ${
                        transaction.type === 'deposit'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
