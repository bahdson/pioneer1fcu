'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [requiresOTP, setRequiresOTP] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Store email for OTP verification
      sessionStorage.setItem('pending_email', email)
      setRequiresOTP(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (requiresOTP) {
    return <OTPVerification email={email} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <Image src="/logo.png" alt="Pioneer1 Logo" width={50} height={50} loading="eager" className="mx-auto mb-3 sm:mb-4 rounded-md w-auto h-auto" />
            <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">Pioneer1</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              Financial Credit Union
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-destructive/10 border border-destructive/50 text-destructive text-xs sm:text-sm p-2 sm:p-3 rounded"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-card-foreground mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-card-foreground mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="sm:size-5" />
                  ) : (
                    <Eye size={18} className="sm:size-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 sm:py-3 rounded transition disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-accent hover:underline font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          🔒 Your data is encrypted and secure
        </motion.p>
      </motion.div>
    </div>
  )
}

function OTPVerification({ email }: { email: string }) {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'OTP verification failed')
        return
      }

      // Store session and redirect
      sessionStorage.removeItem('pending_email')
      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔐</div>
            <h1 className="text-xl sm:text-2xl font-bold text-card-foreground">
              Verify Your Identity
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3 sm:space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-destructive/10 border border-destructive/50 text-destructive text-xs sm:text-sm p-2 sm:p-3 rounded"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-card-foreground mb-1 sm:mb-2">
                Security Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className="w-full px-3 sm:px-4 py-2 text-center text-xl sm:text-2xl font-bold letter-spacing-wide rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 sm:py-3 rounded transition disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
