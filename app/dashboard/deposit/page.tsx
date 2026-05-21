'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Copy, Download } from 'lucide-react'
import QRCode from 'qrcode'

const BITCOIN_WALLET = 'bc1qumcfjj9uk26se5xc3vjzpvffvwehz7rxstgt7r'

export default function DepositPage() {
  const router = useRouter()
  const [qrCode, setQrCode] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Generate QR code
    const generateQR = async () => {
      try {
        const qr = await QRCode.toDataURL(BITCOIN_WALLET)
        setQrCode(qr)
      } catch (error) {
        console.error('QR generation error:', error)
      }
    }

    generateQR()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(BITCOIN_WALLET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = async () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'pioneer1-bitcoin-deposit.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
              Bitcoin Deposit
            </h1>
            <p className="text-muted-foreground">
              Send Bitcoin to your Pioneer1 account
            </p>
          </div>

          {/* QR Code Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg p-8 shadow-lg"
          >
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground mb-4">
                  Scan to Deposit
                </h2>
                {qrCode && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center"
                  >
                    <div className="bg-white p-6 rounded-lg">
                      <img
                        src={qrCode}
                        alt="Bitcoin wallet QR code"
                        className="w-64 h-64"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Or use this wallet address:
                </p>
                <div className="bg-input rounded-lg p-4 flex items-center justify-between">
                  <code className="text-sm text-card-foreground font-mono break-all">
                    {BITCOIN_WALLET}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="ml-4 p-2 hover:bg-background rounded transition"
                  >
                    <Copy size={20} className="text-accent" />
                  </motion.button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-accent"
                  >
                    ✓ Copied to clipboard!
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadQR}
                className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition"
              >
                <Download size={20} />
                Download QR Code
              </motion.button>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg p-6 shadow"
          >
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              How to Deposit
            </h3>
            <ol className="space-y-4">
              {[
                'Open your Bitcoin wallet app',
                'Select "Send Bitcoin" or similar option',
                'Scan the QR code above or paste the wallet address',
                'Enter the amount you wish to deposit',
                'Confirm and send the transaction',
                'Wait for blockchain confirmation (usually 10-30 minutes)',
                'Your deposit will appear in your account',
              ].map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-card-foreground pt-1">{step}</span>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6"
          >
            <div className="flex gap-4">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">
                  Security Information
                </h4>
                <ul className="text-sm text-card-foreground space-y-1">
                  <li>✓ This wallet address is verified and secure</li>
                  <li>✓ All deposits are tracked and credited automatically</li>
                  <li>
                    ✓ Bitcoin transactions are immutable on the blockchain
                  </li>
                  <li>✓ Your private keys are never stored on our servers</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
