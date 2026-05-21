'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface BalanceCardProps {
  balance: number
  name: string
}

export function BalanceCard({ balance, name }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-primary to-secondary rounded-lg p-4 sm:p-6 md:p-8 text-card-foreground shadow-xl"
    >
      <div className="flex justify-between items-start mb-6 sm:mb-8 md:mb-12">
        <div className="flex-1">
          <p className="text-xs sm:text-sm opacity-90">Account Balance</p>
          <motion.div
            key={showBalance ? 'visible' : 'hidden'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-1 sm:mt-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
              {showBalance ? `$${balance.toFixed(2)}` : '••••••'}
            </h2>
          </motion.div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBalance(!showBalance)}
          className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition flex-shrink-0"
        >
          {showBalance ? <Eye size={18} className="sm:size-6" /> : <EyeOff size={18} className="sm:size-6" />}
        </motion.button>
      </div>

      <div className="flex justify-between items-end">
        <div className="min-w-0">
          <p className="text-xs opacity-75">Account Holder</p>
          <p className="font-semibold text-sm sm:text-base truncate">{name}</p>
        </div>
        <Image src="/logo.png" alt="Pioneer1" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
    </motion.div>
  )
}
