'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Upload, Check, Clock } from 'lucide-react'

interface CheckDeposit {
  id: string
  amount: number
  status: 'pending' | 'verified' | 'failed'
  created_at: string
  front_image_url?: string
  back_image_url?: string
}

export default function CheckDepositPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deposits, setDeposits] = useState<CheckDeposit[]>([])
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [amount, setAmount] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchCheckDeposits = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/auth/login')
          return
        }

        const response = await fetch('/api/user/check-deposits', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          router.push('/auth/login')
          return
        }

        const data = await response.json()
        setDeposits(data)
      } catch (error) {
        console.error('Failed to fetch check deposits:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCheckDeposits()
  }, [router])

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setImage(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!frontImage || !backImage || !amount) {
      setError('Please provide all required fields')
      return
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    setUploading(true)

    try {
      const token = localStorage.getItem('auth_token')

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('frontImage', frontImage)
      formData.append('backImage', backImage)
      formData.append('amount', amount)

      const response = await fetch('/api/user/check-deposits', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit check deposit')
        return
      }

      setSuccess('Check deposit submitted successfully. We will verify it shortly.')
      setFrontImage(null)
      setBackImage(null)
      setAmount('')

      // Refresh deposits list
      const refreshResponse = await fetch('/api/user/check-deposits', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (refreshResponse.ok) {
        const updatedData = await refreshResponse.json()
        setDeposits(updatedData)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <span className="text-red-500">✗</span>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/10 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30'
      default:
        return 'bg-red-500/10 border-red-500/30'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center pt-12 md:pt-0">
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

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mobile Check Deposit
            </h1>
            <p className="text-muted-foreground">
              Deposit checks remotely by capturing photos of the front and back
            </p>
          </div>

          {/* Upload Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-lg p-6 md:p-8 shadow"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Check Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-card-foreground font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 pl-8 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Front Image */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-3">
                  Check Front
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, setFrontImage)}
                    className="hidden"
                    id="frontImage"
                    required
                  />
                  <label
                    htmlFor="frontImage"
                    className="block border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-card-foreground">
                      {frontImage ? frontImage.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Back Image */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-3">
                  Check Back
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, setBackImage)}
                    className="hidden"
                    id="backImage"
                    required
                  />
                  <label
                    htmlFor="backImage"
                    className="block border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-card-foreground">
                      {backImage ? backImage.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-destructive/10 border border-destructive/50 text-destructive text-sm p-4 rounded"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-500/10 border border-green-500/50 text-green-600 text-sm p-4 rounded"
                >
                  {success}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {uploading ? 'Submitting...' : 'Submit Check Deposit'}
              </motion.button>
            </form>
          </motion.div>

          {/* Recent Deposits */}
          {deposits.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-lg p-6 md:p-8 shadow"
            >
              <h2 className="text-xl font-bold text-card-foreground mb-6">
                Recent Deposits
              </h2>

              <div className="space-y-4">
                {deposits.map((deposit) => (
                  <motion.div
                    key={deposit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-lg border ${getStatusColor(
                      deposit.status
                    )} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(deposit.status)}
                      <div>
                        <p className="font-semibold text-card-foreground">
                          ${deposit.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(deposit.created_at).toLocaleDateString()}{' '}
                          at{' '}
                          {new Date(deposit.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        deposit.status === 'verified'
                          ? 'bg-green-500 text-white'
                          : deposit.status === 'pending'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {deposit.status.charAt(0).toUpperCase() +
                        deposit.status.slice(1)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tips */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6"
          >
            <h3 className="font-semibold text-card-foreground mb-4">
              📸 Tips for Better Results
            </h3>
            <ul className="space-y-2 text-sm text-card-foreground">
              <li>✓ Use good lighting and avoid shadows or glare</li>
              <li>✓ Ensure the entire check is visible and in focus</li>
              <li>✓ Keep images level and avoid rotation</li>
              <li>✓ Make sure MICR line (bottom of check) is clear and readable</li>
              <li>✓ Do not deposit the same check multiple times</li>
            </ul>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
