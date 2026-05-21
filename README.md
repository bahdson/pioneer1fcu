# Pioneer1 Financial Credit Union

A modern, production-ready fintech banking web application built with cutting-edge technologies.

![Pioneer1 Banner](https://images.unsplash.com/photo-1563013544-824b7b4d4784?w=1200&h=300&fit=crop)

## 🏦 Features

### User Features
- **Secure Authentication**: Email + Password with OTP verification
- **Account Dashboard**: Real-time balance and account overview
- **Transaction History**: Complete transaction tracking
- **Bitcoin Deposits**: QR code-based Bitcoin deposits with wallet: `bc1qumcfjj9uk26se5xc3vjzpvffvwehz7rxstgt7r`
- **Withdrawal System**: Secure withdrawal requests with status tracking
- **Profile Management**: Edit account information and change passwords
- **Account Protection**: Freeze/unfreeze account status monitoring

### Admin Features
- **Member Management**: View and edit all member accounts
- **Balance Control**: Adjust member balances
- **Account Freezing**: Freeze/unfreeze accounts for compliance
- **User Management**: Delete or suspend users
- **Withdrawal Oversight**: Monitor and manage withdrawal requests
- **Crypto Management**: Configure and manage Bitcoin wallet addresses

### Technical Features
- **Bank-Grade Security**: TLS/SSL encryption, secure authentication, OTP verification
- **Modern UI**: Dark blue professional banking theme with smooth animations
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live balance and transaction updates
- **Email Notifications**: Branded emails via Resend service
- **Bitcoin Integration**: Full cryptocurrency support with QR codes

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Email OTP
- **Email**: Resend (Email delivery)
- **Styling**: Custom design tokens, dark mode support
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account (https://supabase.com)
- Resend account (https://resend.com)
- Bitcoin wallet address for deposits

## 🚀 Quick Start

### 1. Clone or Download

```bash
# If using GitHub
git clone <repository-url>
cd pioneer1-banking

# Or download the ZIP file and extract
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Then fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

1. Go to Supabase → SQL Editor
2. Create a new query
3. Copy and paste contents of `schema.sql`
4. Execute the query

### 5. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## 📖 Usage Guide

### User Flows

#### Register New Account
1. Click "Get Started" on home page
2. Fill in name, email, password
3. Click "Create Account"
4. Check email for verification link
5. Once verified, log in with credentials

#### Login with OTP
1. Enter email and password
2. You'll receive a 6-digit code via email
3. Enter the code on the verification page
4. You're now authenticated!

#### Deposit Bitcoin
1. Go to Dashboard → Bitcoin Deposit
2. Scan QR code with your Bitcoin wallet
3. Or copy the wallet address manually
4. Send Bitcoin from your wallet
5. Wait for blockchain confirmation
6. Funds appear in your account

#### Request Withdrawal
1. Go to Dashboard → Withdraw
2. Enter amount and destination address
3. Submit request
4. Admin processes the withdrawal
5. Funds transferred to your address

### Admin Access

1. Navigate to `http://localhost:3000/admin/login`
2. Use default credentials:
   - Email: `admin@pioneer1fcu.com`
   - Password: `SecureAdmin123!`
3. Change these immediately in production!

## 📁 Project Structure

```
pioneer1-banking/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── auth/                 # Auth pages (login, register)
│   ├── dashboard/            # User dashboard
│   ├── admin/                # Admin panel
│   └── api/                  # Backend API routes
├── components/               # Reusable components
├── lib/                      # Utilities and helpers
├── schema.sql               # Database schema
├── SETUP.md                 # Detailed setup guide
└── README.md                # This file
```

## 🔐 Security Features

- **Supabase Auth**: Industry-standard authentication
- **OTP Verification**: Email-based one-time passwords
- **Password Hashing**: Secure password storage
- **TLS/SSL**: All data encrypted in transit
- **Session Management**: Automatic session handling
- **RLS Support**: Row-level security ready (configure in Supabase)

## 🎨 Customization

### Change Theme Colors

Edit `app/globals.css` and modify the design tokens:

```css
:root {
  --primary: oklch(0.28 0.15 250);    /* Dark blue */
  --secondary: oklch(0.35 0.18 250);  /* Medium blue */
  --accent: oklch(0.56 0.2 40);       /* Gold/Orange */
}
```

### Change Brand Name

1. Update all instances of "Pioneer1" in components
2. Update email templates in `lib/resend-service.ts`
3. Update email sender address
4. Update website logo and favicon

### Change Bitcoin Wallet

Edit `app/dashboard/deposit/page.tsx`:

```tsx
const BITCOIN_WALLET = 'your_new_wallet_address'
```

## 📊 Database Schema

### Users
- `id`: UUID
- `email`: Unique email
- `full_name`: Account holder name
- `balance`: Current balance
- `is_frozen`: Account status
- Timestamps

### Transactions
- `id`: UUID
- `user_id`: Foreign key
- `type`: deposit/withdrawal
- `amount`: Transaction amount
- `status`: pending/completed
- `description`: Transaction details

### Withdrawal Requests
- `id`: UUID
- `user_id`: Foreign key
- `amount`: Withdrawal amount
- `destination_address`: Where to send funds
- `status`: pending/processing/completed

See `schema.sql` for complete schema definition.

## 🚀 Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Deploy to Other Platforms

Works with any Node.js hosting:
- AWS Amplify
- Netlify
- Railway
- Render
- Digital Ocean App Platform

## 🐛 Troubleshooting

### OTP emails not sending?
- Check Resend API key in environment
- Verify email domain in Resend dashboard
- Check Resend logs for errors

### Can't connect to Supabase?
- Verify Supabase URL and key are correct
- Check Supabase project is active
- Ensure schema.sql has been run

### Bitcoin QR code not showing?
- Verify wallet address is valid
- Check browser console for errors
- Ensure qrcode package is installed

### Admin login failing?
- Verify credentials are correct
- Clear browser cache
- Check API route is accessible

See `SETUP.md` for more detailed troubleshooting.

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup and configuration
- [Environment Variables](./SETUP.md#environment-setup) - All required env vars
- [Database Schema](./SETUP.md#database-schema-details) - Complete schema details
- [Security Features](./SETUP.md#security-features) - Security implementation details

## 🤝 Contributing

This is a production-ready starter template. Feel free to:
- Customize colors and branding
- Add new features
- Improve security measures
- Optimize performance

## ⚖️ Legal

- FDIC insurance information (add your details)
- Privacy policy (implement)
- Terms of service (implement)
- Compliance requirements (varies by jurisdiction)

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting section](./SETUP.md#troubleshooting)
2. Review code comments in relevant files
3. Check Supabase documentation
4. Check Resend documentation

## 📄 License

Pioneer1 Financial Credit Union © 2025

---

## ✨ Key Highlights

✅ Production-ready code  
✅ Complete auth system with OTP  
✅ Bitcoin integration  
✅ Admin dashboard  
✅ Responsive design  
✅ Bank-grade security  
✅ Professional UI/UX  
✅ Fully documented  
✅ Easy to customize  
✅ Ready for deployment  

---

**Built with ❤️ using Next.js, Supabase, and Resend**

Start your fintech journey with Pioneer1 today! 🚀
