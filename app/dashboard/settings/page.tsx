'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Eye, EyeOff, Lock } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string
  account_number?: string
  routing_number?: string
  created_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

        const userData = await response.json()
        setUser(userData)
        setFullName(userData.full_name)
        setPhoneNumber(userData.phone_number || '')
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ full_name: fullName, phone_number: phoneNumber }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update profile')
        return
      }

      setSuccess('Profile updated successfully')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to change password')
        return
      }

      setSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
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
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your Pioneer1 account
            </p>
          </div>

          {/* Account Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-lg p-6 shadow"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-6">
              Account Information
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="text-lg font-medium text-card-foreground">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Account Created
                </p>
                <p className="text-lg font-medium text-card-foreground">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-destructive/10 border border-destructive/50 text-destructive text-sm p-3 rounded"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded"
                >
                  {success}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </form>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg p-6 shadow"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <Lock size={24} />
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  At least 8 characters required
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </motion.button>
            </form>
          </motion.div>

          {/* Security Tips */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6"
          >
            <h3 className="font-semibold text-card-foreground mb-4">
              🔒 Security Tips
            </h3>
            <ul className="space-y-2 text-sm text-card-foreground">
              <li>✓ Use a strong, unique password</li>
              <li>✓ Never share your password with anyone</li>
              <li>✓ Change your password regularly</li>
              <li>✓ Verify sender addresses in emails</li>
              <li>✓ Keep your login credentials confidential</li>
            </ul>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
