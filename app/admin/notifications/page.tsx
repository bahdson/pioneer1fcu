'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send, Users, User } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  full_name: string
}

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [sendToAll, setSendToAll] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'info' | 'alert' | 'transaction'>('info')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        if (!token) {
          router.push('/admin/login')
          return
        }

        // Verify admin status
        const response = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          router.push('/admin/login')
          return
        }

        const usersData = await response.json()
        setUsers(usersData)
        setIsAdmin(true)
      } catch (error) {
        console.error('Admin verification error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    verifyAdmin()
  }, [router])

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title || !message) {
      setError('Title and message are required')
      return
    }

    if (!sendToAll && selectedUsers.length === 0) {
      setError('Please select at least one user or choose "Send to All"')
      return
    }

    setSending(true)

    try {
      const token = localStorage.getItem('admin_token')
      const targetUserIds = sendToAll ? users.map((u) => u.id) : selectedUsers

      const response = await fetch('/api/admin/send-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_ids: targetUserIds,
          title,
          message,
          notification_type: notificationType,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to send notifications')
        return
      }

      setSuccess(
        `Notification sent to ${targetUserIds.length} user${targetUserIds.length === 1 ? '' : 's'}`
      )
      setTitle('')
      setMessage('')
      setSelectedUsers([])
      setSendToAll(false)
      setNotificationType('info')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setSending(false)
    }
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

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Send Notifications
          </h1>
          <p className="text-muted-foreground">
            Broadcast notifications to users
          </p>
        </div>

        {/* Notification Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-lg p-6 md:p-8 shadow"
        >
          <form onSubmit={handleSendNotification} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Notification Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                placeholder="e.g., System Maintenance"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition resize-vertical"
                placeholder="Enter your message here..."
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {message.length} characters
              </p>
            </div>

            {/* Notification Type */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Notification Type
              </label>
              <div className="flex gap-4">
                {(['info', 'alert', 'transaction'] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={notificationType === type}
                      onChange={(e) =>
                        setNotificationType(e.target.value as typeof type)
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-card-foreground capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Send To */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendToAll"
                  checked={sendToAll}
                  onChange={(e) => setSendToAll(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="sendToAll" className="text-sm font-medium text-card-foreground cursor-pointer flex items-center gap-2">
                  <Users size={16} />
                  Send to all {users.length} users
                </label>
              </div>

              {!sendToAll && (
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-3">
                    Select Users
                  </label>
                  <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-4 space-y-2">
                    {users.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No users found
                      </p>
                    ) : (
                      users.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 p-3 hover:bg-accent/5 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            className="w-4 h-4"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">
                              {user.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          <User size={16} className="text-muted-foreground flex-shrink-0" />
                        </label>
                      ))
                    )}
                  </div>
                  {selectedUsers.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedUsers.length} user{selectedUsers.length === 1 ? '' : 's'} selected
                    </p>
                  )}
                </div>
              )}
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
              disabled={sending}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {sending ? 'Sending...' : 'Send Notification'}
            </motion.button>
          </form>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6"
        >
          <h3 className="font-semibold text-card-foreground mb-4">
            About Notifications
          </h3>
          <ul className="space-y-2 text-sm text-card-foreground">
            <li>✓ Notifications appear in the user&apos;s notification bell in real-time</li>
            <li>✓ Users can dismiss or delete individual notifications</li>
            <li>✓ Transaction notifications are tracked separately for user records</li>
            <li>✓ Alert notifications have higher priority display</li>
            <li>✓ All notifications are logged in the database for compliance</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
