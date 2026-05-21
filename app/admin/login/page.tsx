'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Admin login failed')
        return
      }

      // Store admin token
      localStorage.setItem('admin_token', data.token)
      router.push('/admin/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-sidebar-foreground hover:text-accent transition">
        <ArrowLeft size={20} />
        <span className="text-sm">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="Pioneer1 Logo" width={60} height={60} loading="eager" className="mx-auto mb-4 rounded-md w-auto h-auto" />
            <h1 className="text-3xl font-bold text-card-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Pioneer1 Financial Credit Union
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-destructive/10 border border-destructive/50 text-destructive text-sm p-3 rounded"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                placeholder="Benwilks16@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Admin Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>⚠️ Authorized Personnel Only</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
