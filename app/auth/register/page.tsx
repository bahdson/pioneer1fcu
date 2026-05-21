'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requiresOTP, setRequiresOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [verifyingOTP, setVerifyingOTP] = useState(false)

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setVerifyingOTP(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, token: otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'OTP verification failed')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setVerifyingOTP(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      // Show OTP verification screen
      setRequiresOTP(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (requiresOTP) {
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
                Verify Your Email
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Enter the 6-digit code sent to {formData.email}
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-3 sm:space-y-4">
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
                disabled={verifyingOTP || otp.length !== 6}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 sm:py-3 rounded transition disabled:opacity-50 text-sm sm:text-base"
              >
                {verifyingOTP ? 'Verifying...' : 'Verify Code'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-accent mx-auto mb-4 sm:mb-6" />
            </motion.div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-2 sm:mb-4">
              Registration Successful!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              Your Pioneer1 Financial Credit Union account is ready to use.
            </p>

            <motion.div
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-accent mb-4 text-xs sm:text-sm"
            >
              Redirecting to login...
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
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
              Create Your Account
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
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-card-foreground mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
              <p className="text-xs text-muted-foreground mt-1">
                At least 8 characters required
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-card-foreground mb-1 sm:mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                >
                  {showConfirmPassword ? (
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-accent hover:underline font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6"
        >
          🔒 Your data is encrypted and secure
        </motion.p>
      </motion.div>
    </div>
  )
}
