'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

const BOT_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm the Pioneer1 Banking Assistant. How can I help you today?",
  account: "You can manage your account settings and view your balance in the Dashboard. Visit /dashboard to access all your account features.",
  deposit: "We support Bitcoin deposits and mobile check deposits. Visit the Deposit section to get started.",
  withdraw: "To withdraw funds, go to the Withdraw section in your dashboard. Withdrawals are processed within 1-3 business days.",
  hours: "Our support team is available 24/7 for urgent matters. Regular inquiries are handled 9 AM - 5 PM EST.",
  help: "I can help you with account questions, deposit/withdrawal info, or general banking assistance. What would you like to know?",
  default: "Thank you for your question. Our support team will be notified and will respond shortly. Is there anything else I can help you with?",
}

const QUICK_REPLIES = [
  "Account Help",
  "Deposits",
  "Withdrawals",
  "Support Hours",
  "General Help",
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize chat session
    const initializeChat = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) return

        const response = await fetch('/api/user/chat-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setSessionId(data.session_id)
        }
      } catch (error) {
        console.error('Failed to initialize chat session:', error)
      }
    }

    if (isOpen) {
      initializeChat()
    }
  }, [isOpen])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hey')
    ) {
      return BOT_RESPONSES.greeting
    } else if (
      lowerMessage.includes('account') ||
      lowerMessage.includes('profile') ||
      lowerMessage.includes('settings')
    ) {
      return BOT_RESPONSES.account
    } else if (
      lowerMessage.includes('deposit') ||
      lowerMessage.includes('bitcoin') ||
      lowerMessage.includes('check')
    ) {
      return BOT_RESPONSES.deposit
    } else if (
      lowerMessage.includes('withdraw') ||
      lowerMessage.includes('withdrawal')
    ) {
      return BOT_RESPONSES.withdraw
    } else if (
      lowerMessage.includes('hour') ||
      lowerMessage.includes('available') ||
      lowerMessage.includes('support')
    ) {
      return BOT_RESPONSES.hours
    } else if (lowerMessage.includes('help')) {
      return BOT_RESPONSES.help
    } else {
      return BOT_RESPONSES.default
    }
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Save message to database if authenticated
    if (sessionId) {
      try {
        const token = localStorage.getItem('auth_token')
        await fetch('/api/user/chat-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            message: messageText,
          }),
        })
      } catch (error) {
        console.error('Failed to save message:', error)
      }
    }

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: getBotResponse(messageText),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 500)
  }

  const handleQuickReply = (reply: string) => {
    let message = ''
    switch (reply) {
      case 'Account Help':
        message = 'I need help with my account'
        break
      case 'Deposits':
        message = 'Tell me about deposits'
        break
      case 'Withdrawals':
        message = 'How do I withdraw funds?'
        break
      case 'Support Hours':
        message = 'What are your support hours?'
        break
      case 'General Help':
        message = 'Can you help me?'
        break
    }
    handleSendMessage(message)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-96 max-w-sm bg-card rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col max-h-96 sm:max-h-[500px]"
          >
            {/* Header */}
            <div className="bg-accent text-accent-foreground p-4 flex items-center justify-between">
              <h3 className="font-semibold">Pioneer1 Support</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-accent/80 p-1 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <div className="text-3xl mb-2">👋</div>
                  <p>Hi! I&apos;m here to help. What can I do for you?</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.sender === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-card-foreground'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center text-muted-foreground"
                >
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length === 0 && (
              <div className="px-4 py-3 border-t border-border space-y-2">
                <p className="text-xs text-muted-foreground">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <motion.button
                      key={reply}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-3 py-1 bg-accent/10 text-accent hover:bg-accent/20 rounded-full transition"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="border-t border-border p-3 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm rounded bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent transition"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition disabled:opacity-50 flex-shrink-0"
              >
                <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center relative"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  )
}
