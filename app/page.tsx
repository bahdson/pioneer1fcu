'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Bitcoin, Lock, TrendingUp, Users, Zap, Shield, Menu, X } from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'Military-grade encryption protects your data and transactions',
  },
  {
    icon: Bitcoin,
    title: 'Crypto Integration',
    description: 'Seamlessly deposit Bitcoin directly into your account',
  },
  {
    icon: TrendingUp,
    title: 'Financial Growth',
    description: 'Track your balance and transactions in real-time',
  },
  {
    icon: Users,
    title: 'Community Focused',
    description: 'As a credit union, we prioritize member benefits',
  },
  {
    icon: Shield,
    title: 'Account Protection',
    description: 'Your deposits are protected with industry standards',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Lightning-fast transactions and 99.9% uptime',
  },
]

const stats = [
  { number: '50K+', label: 'Active Members' },
  { number: '4.9★', label: 'Customer Rating' },
  { number: '24/7', label: 'Support' },
  { number: '1995', label: 'Founded' },
]

export default function HomePage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1
    setLogoClickCount(newCount)
    
    // Go to admin login on 3 clicks
    if (newCount >= 3) {
      setLogoClickCount(0)
      router.push('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo - Clickable for admin access */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group"
            title="Click 3 times to access admin portal"
          >
            <Image src="/logo.png" alt="Pioneer1 Logo" width={50} height={50} loading="eager" className="rounded-md group-hover:shadow-lg transition w-auto h-auto" />
            <div>
              <h1 className="font-bold text-lg">Pioneer1</h1>
              <p className="text-xs text-muted-foreground">Credit Union</p>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <div className="hidden sm:flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-foreground hover:text-accent transition text-sm md:text-base"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition font-medium text-sm md:text-base"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden border-t border-border bg-card/50"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-foreground hover:text-accent transition rounded-lg hover:bg-accent/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="block px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance leading-tight">
            Secure Banking for the <span className="text-accent">Digital Age</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto text-balance">
            Pioneer1 Financial Credit Union offers modern banking with cryptocurrency integration,
            bank-grade security, and a commitment to our members&apos; financial success.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/register"
                className="inline-block px-6 md:px-8 py-3 md:py-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition text-sm md:text-base"
              >
                Open Account Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#features"
                className="inline-block px-6 md:px-8 py-3 md:py-4 border-2 border-accent text-accent hover:bg-accent/10 rounded-lg font-semibold transition text-sm md:text-base"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-6 md:p-8 border border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl md:text-4xl font-bold text-accent mb-1 md:mb-2">
                  {stat.number}
                </p>
                <p className="text-xs md:text-base text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">Why Choose Pioneer1?</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Experience the future of banking with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-lg p-6 md:p-8 border border-border hover:border-accent transition group"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition">
                    <Icon className="text-accent" size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Your Security is Our Priority</h2>
              <p className="text-muted-foreground mb-4 text-base md:text-lg">
                Pioneer1 uses industry-leading encryption, multi-factor authentication,
                and continuous monitoring to protect your accounts and transactions.
              </p>
              <ul className="space-y-2 md:space-y-3">
                {[
                  '256-bit SSL encryption on all connections',
                  'Email OTP verification for login',
                  'Regular security audits and compliance checks',
                  'FDIC insurance protection on eligible accounts',
                  '24/7 fraud monitoring',
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 items-start text-sm md:text-base"
                  >
                    <span className="text-accent text-xl flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl p-8 md:p-12 border border-border flex items-center justify-center h-64 md:h-96"
            >
              <div className="text-center">
                <Shield className="w-16 md:w-24 h-16 md:h-24 text-accent mx-auto mb-4" />
                <p className="text-lg md:text-xl font-semibold">Bank-Grade Security</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-card-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Ready to Get Started?</h2>
            <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90">
              Join over 50,000 members who trust Pioneer1 Financial Credit Union
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/auth/register"
                className="inline-block px-6 md:px-10 py-3 md:py-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-bold text-base md:text-lg transition"
              >
                Open Account Today
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="Pioneer1 Logo" width={40} height={40} loading="eager" className="rounded-md w-auto h-auto" />
                <div>
                  <h3 className="font-bold text-sm md:text-base">Pioneer1</h3>
                  <p className="text-xs text-muted-foreground">Credit Union</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Secure digital banking for the modern member
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">Product</h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">Company</h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">Legal</h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 Pioneer1 Financial Credit Union. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
