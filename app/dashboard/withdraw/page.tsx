'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Send, CheckCircle2 } from 'lucide-react'

interface User {
  id: string
  balance: number
  is_frozen: boolean
}

export default function WithdrawPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/auth/login')
          return
        }

        const response = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          router.push('/auth/login')
          return
        }

        setUser(await response.json())
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!amount || !address) {
      setError('Please fill in all fields')
      return
    }

    const withdrawAmount = parseFloat(amount)
    if (withdrawAmount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (user && withdrawAmount > user.balance) {
      setError('Insufficient balance')
      return
    }

    if (user?.is_frozen) {
      setError('Your account is frozen and cannot withdraw')
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          address,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Withdrawal request failed')
        return
      }

      setSuccess(true)
      setAmount('')
      setAddress('')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <div className="text-4xl">🏦</div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Withdraw Funds
            </h1>
            <p className="text-muted-foreground">
              Request a withdrawal from your account
            </p>
          </div>

          {/* Current Balance */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-card-foreground shadow-lg"
          >
            <p className="text-sm opacity-90">Available Balance</p>
            <h2 className="text-4xl font-bold mt-2">
              ${user.balance.toFixed(2)}
            </h2>
          </motion.div>

          {/* Withdrawal Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg p-8 shadow-lg"
          >
            {success ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block mb-4"
                >
                  <CheckCircle2 className="w-16 h-16 text-accent" />
                </motion.div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  Withdrawal Request Submitted
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your withdrawal request has been submitted for processing.
                  You will receive an email confirmation shortly.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSuccess(false)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 px-6 rounded-lg transition"
                >
                  Submit Another Request
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-destructive/10 border border-destructive/50 text-destructive text-sm p-4 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-card-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: ${user.balance.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Destination Address/Account
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                    placeholder="Enter bank account or wallet address"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting || user.is_frozen}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {submitting ? 'Processing...' : 'Request Withdrawal'}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6"
          >
            <h3 className="font-semibold text-card-foreground mb-4">
              📋 Withdrawal Information
            </h3>
            <ul className="space-y-2 text-sm text-card-foreground">
              <li>• Withdrawal requests are processed within 1-2 business days</li>
              <li>• A confirmation email will be sent to your registered email</li>
              <li>• Minimum withdrawal amount: $10</li>
              <li>• Maximum withdrawal per day: $5,000</li>
              <li>
                • Processing fees may apply depending on the destination
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
