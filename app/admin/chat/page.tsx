'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react'

interface ChatMessage {
  id: string
  session_id: string
  sender: 'user' | 'admin' | 'bot'
  message: string
  created_at: string
  is_resolved?: boolean
}

interface ChatSession {
  id: string
  user_id: string
  user_email: string
  status: 'active' | 'pending' | 'resolved'
  created_at: string
  updated_at: string
  message_count: number
}

export default function AdminChatPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        if (!token) {
          router.push('/admin/login')
          return
        }

        // Verify admin status
        const response = await fetch('/api/admin/chat-sessions', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          router.push('/admin/login')
          return
        }

        const sessionsData = await response.json()
        setSessions(sessionsData)
        setIsAdmin(true)

        // Select first session if available
        if (sessionsData.length > 0) {
          setSelectedSession(sessionsData[0])
          await fetchMessages(sessionsData[0].id, token)
        }
      } catch (error) {
        console.error('Admin verification error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    verifyAdmin()
  }, [router])

  const fetchMessages = async (sessionId: string, token?: string) => {
    try {
      const authToken = token || localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/chat-messages?session_id=${sessionId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (response.ok) {
        const messagesData = await response.json()
        setMessages(messagesData)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSessionSelect = async (session: ChatSession) => {
    setSelectedSession(session)
    setMessageInput('')
    await fetchMessages(session.id)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!messageInput.trim() || !selectedSession) {
      setError('Please select a session and enter a message')
      return
    }

    setSending(true)

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: selectedSession.id,
          message: messageInput,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to send message')
        return
      }

      setMessageInput('')
      await fetchMessages(selectedSession.id)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleResolveSession = async () => {
    if (!selectedSession) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/chat-sessions/${selectedSession.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'resolved' }),
      })

      if (response.ok) {
        setSessions(
          sessions.map((s) =>
            s.id === selectedSession.id ? { ...s, status: 'resolved' } : s
          )
        )
        setSelectedSession({ ...selectedSession, status: 'resolved' })
      }
    } catch (error) {
      console.error('Failed to resolve session:', error)
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
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageCircle size={32} />
            Live Chat Console
          </h1>
          <p className="text-muted-foreground">
            Manage customer support conversations
          </p>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-96">
          {/* Sessions List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:col-span-1 bg-card rounded-lg shadow overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-border bg-accent/5">
              <h2 className="font-semibold text-card-foreground">
                Chat Sessions ({sessions.length})
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No chat sessions yet
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  {sessions.map((session) => (
                    <motion.button
                      key={session.id}
                      onClick={() => handleSessionSelect(session)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedSession?.id === session.id
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/10 text-card-foreground'
                      }`}
                    >
                      <p className="text-xs font-medium truncate">
                        {session.user_email}
                      </p>
                      <p className="text-xs text-opacity-75 mt-1">
                        {session.message_count} messages
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {session.status === 'resolved' ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <Clock size={14} className="text-yellow-500" />
                        )}
                        <span className="text-xs capitalize opacity-75">
                          {session.status}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Messages */}
          {selectedSession ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-card rounded-lg shadow overflow-hidden flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-accent/5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {selectedSession.user_email}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Session started{' '}
                    {new Date(selectedSession.created_at).toLocaleDateString()}
                  </p>
                </div>
                {selectedSession.status !== 'resolved' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResolveSession}
                    className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Mark Resolved
                  </motion.button>
                )}
              </div>

              {/* Messages Display */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      No messages yet
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          msg.sender === 'admin' || msg.sender === 'bot'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender === 'admin' || msg.sender === 'bot'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-muted text-card-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Message Input */}
              {selectedSession.status !== 'resolved' && (
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-border space-y-3"
                >
                  {error && (
                    <motion.p className="text-xs text-destructive">
                      {error}
                    </motion.p>
                  )}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 px-4 py-2 text-sm rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
                      placeholder="Type a message..."
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={sending || !messageInput.trim()}
                      className="px-4 py-2 text-sm bg-accent text-accent-foreground rounded font-semibold hover:bg-accent/90 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send size={16} />
                      Send
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-card rounded-lg shadow p-8 flex items-center justify-center text-center"
            >
              <div>
                <MessageCircle size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Select a session to start managing chats
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6"
        >
          <h3 className="font-semibold text-card-foreground mb-4">
            Chat Management Tips
          </h3>
          <ul className="space-y-2 text-sm text-card-foreground">
            <li>✓ Click a session to view conversation history</li>
            <li>✓ Reply to users in real-time through the chat interface</li>
            <li>✓ Mark sessions as resolved when issues are addressed</li>
            <li>✓ All chat messages are stored for compliance and training</li>
            <li>✓ Users can also access chat through the floating widget</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
