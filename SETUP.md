# Pioneer1 Financial Credit Union - Setup Guide

## Overview

Pioneer1 Financial Credit Union is a modern, production-ready fintech banking application built with Next.js, Supabase, and Resend. It features comprehensive user authentication with OTP verification, Bitcoin deposits, withdrawal management, and a full admin dashboard.

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with Email OTP
- **Email**: Resend (Email delivery service)
- **Styling**: Custom design tokens with dark blue banking theme
- **Crypto**: Bitcoin wallet integration with QR code generation

## Project Structure

```
/app
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles with design tokens
├── auth/
│   ├── login/page.tsx         # User login with OTP
│   └── register/page.tsx       # User registration
├── dashboard/
│   ├── page.tsx               # Main dashboard
│   ├── deposit/page.tsx        # Bitcoin deposit page
│   ├── withdraw/page.tsx       # Withdrawal request page
│   └── settings/page.tsx       # Account settings
├── admin/
│   ├── login/page.tsx         # Admin login
│   └── dashboard/page.tsx      # Admin management dashboard
└── api/
    ├── auth/
    │   ├── signup/route.ts     # Registration endpoint
    │   ├── signin/route.ts      # Login endpoint
    │   ├── verify-otp/route.ts  # OTP verification
    │   └── logout/route.ts      # Logout endpoint
    ├── user/
    │   ├── profile/route.ts     # Get user profile
    │   ├── transactions/route.ts # Get transactions
    │   ├── withdraw/route.ts     # Submit withdrawal request
    │   ├── update-profile/route.ts # Update profile
    │   └── change-password/route.ts # Change password
    └── admin/
        ├── login/route.ts       # Admin authentication
        └── users/route.ts       # Manage all users

/components
├── dashboard-sidebar.tsx       # Dashboard navigation
└── balance-card.tsx           # Account balance display

/lib
├── supabase-client.ts         # Supabase client initialization
├── auth-utils.ts              # Auth utility functions
└── resend-service.ts          # Email service integration

/schema.sql                     # Database schema setup
```

## Environment Setup

### 1. Install Dependencies

```bash
pnpm install
```

All required dependencies are already listed in `package.json`:
- `@supabase/supabase-js` - Database client
- `resend` - Email delivery
- `framer-motion` - Animations
- `qrcode` - QR code generation
- `lucide-react` - Icons

### 2. Configure Supabase

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. In Supabase dashboard, go to Settings → API
4. Copy your `Project URL` and `anon key`
5. Add to your environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Configure Resend

1. Create a Resend account at https://resend.com
2. Add a domain and verify it (for production)
3. Get your API key from the Resend dashboard
4. Add to your environment:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### 4. Set Up Database Schema

1. Go to Supabase → SQL Editor
2. Create a new query
3. Copy the contents of `schema.sql` from the project root
4. Run the query to create all tables

The schema includes:
- `users` - User accounts with balance tracking
- `transactions` - Transaction history
- `withdrawal_requests` - Withdrawal management
- `bitcoin_deposits` - Bitcoin deposit tracking
- `admin_users` - Admin account management
- `crypto_wallets` - Cryptocurrency wallet addresses

### 5. Enable Email Confirmation in Supabase

1. Go to Authentication → Providers → Email
2. Enable both "Confirm email" and "Enable the built-in email editor"
3. Configure email templates (optional, Resend handles sending)

### 6. Set App URL

Add your app URL to the environment:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
# or
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # Production
```

## Running the Application

### Development

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## Authentication Flow

### User Registration

1. User fills registration form with email, password, and full name
2. Password is securely hashed by Supabase
3. User profile is created in the database
4. Verification email is sent via Resend

### User Login

1. User enters email and password
2. Credentials are verified with Supabase Auth
3. 6-digit OTP is generated and sent via Resend
4. User enters OTP on the verification page
5. Session is created and user is redirected to dashboard

### OTP Email Template

The OTP emails are sent from `security@pioneer1fcu.com` with:
- Professional banking design
- 6-digit code prominently displayed
- 10-minute expiration notice
- Security warnings and information
- Full Pioneer1 branding

## Admin Features

### Admin Login

Access admin panel at `/admin/login`

**Default Credentials**:
- Email: `admin@pioneer1fcu.com`
- Password: `SecureAdmin123!`

⚠️ **IMPORTANT**: Change these credentials immediately in production!

### Admin Dashboard

The admin can:
- View all member accounts
- Edit member balances
- Freeze/unfreeze accounts
- Delete or suspend users
- Manage withdrawal requests
- Configure crypto wallet addresses

## Bitcoin Integration

### Deposit Wallet

**Bitcoin Wallet Address**: `bc1qumcfjj9uk26se5xc3vjzpvffvwehz7rxstgt7r`

### Deposit Flow

1. User navigates to "Deposit" page
2. QR code is displayed for the wallet address
3. User scans QR code with their Bitcoin wallet
4. User sends Bitcoin transaction
5. Deposit request is created and awaits confirmation
6. Once blockchain confirms, balance is updated

## Security Features

### Authentication
- Email + password with secure Supabase Auth
- Email OTP verification for additional security
- Automatic session management
- Secure logout functionality

### Data Protection
- All data encrypted in transit with TLS/SSL
- Sensitive passwords hashed with bcrypt
- Database-level security with Supabase RLS
- No sensitive data in local storage

### User Privacy
- GDPR-compliant data handling
- Secure password reset mechanism
- Account deletion functionality
- Transaction history privacy

## Database Schema Details

### Users Table
```sql
- id: UUID (primary key)
- email: TEXT (unique)
- full_name: TEXT
- balance: DECIMAL(19,4)
- is_frozen: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Transactions Table
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- type: TEXT (deposit/withdrawal)
- amount: DECIMAL(19,4)
- description: TEXT
- status: TEXT (completed/pending)
- created_at: TIMESTAMP
```

### Withdrawal Requests Table
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- amount: DECIMAL(19,4)
- destination_address: TEXT
- status: TEXT (pending/processing/completed)
- created_at: TIMESTAMP
```

### Bitcoin Deposits Table
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- transaction_hash: TEXT
- amount_btc: DECIMAL(16,8)
- status: TEXT (pending/confirmed)
- created_at: TIMESTAMP
```

## Customization

### Change Banking Theme Colors

Edit `/app/globals.css` and modify the design tokens:

```css
:root {
  --primary: oklch(0.28 0.15 250);  /* Dark blue */
  --secondary: oklch(0.35 0.18 250); /* Medium blue */
  --accent: oklch(0.56 0.2 40);      /* Gold/Orange */
}
```

### Change Brand Name

Replace `Pioneer1` with your institution name:
- In `/app/page.tsx` (landing page)
- In components and email templates
- In email sender addresses (update Resend configuration)

### Add Custom Email Templates

Edit `/lib/resend-service.ts` to customize:
- OTP email design
- Welcome email
- Reset password emails
- Account confirmation emails

### Configure Withdrawal Limits

Edit `/app/dashboard/withdraw/page.tsx`:

```tsx
// Current limits:
// Minimum: $10
// Maximum per day: $5,000
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel
```

Set environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all required env vars from `.env.example`

### Deploy to Other Platforms

The application is compatible with any Node.js hosting:
- AWS Amplify
- Netlify
- Railway
- Render
- Digital Ocean

## Troubleshooting

### OTP Not Sending

1. Check Resend API key is valid
2. Verify email domain is configured in Resend
3. Check email logs in Resend dashboard
4. Ensure `RESEND_API_KEY` env var is set

### Supabase Connection Issues

1. Verify `NEXT_PUBLIC_SUPABASE_URL` and key are correct
2. Check Supabase project is active
3. Verify database tables are created (run schema.sql)
4. Check for network connectivity

### QR Code Not Generating

1. Ensure `qrcode` package is installed
2. Verify Bitcoin wallet address is valid
3. Check browser console for errors
4. Verify image element has proper styling

### Admin Access Denied

1. Verify admin token is stored in localStorage
2. Check admin credentials in environment
3. Ensure API endpoint is accessible
4. Clear browser cache and try again

## Production Checklist

- [ ] Change admin credentials
- [ ] Update Bitcoin wallet address to production wallet
- [ ] Configure custom email domain in Resend
- [ ] Set up RLS (Row Level Security) in Supabase
- [ ] Enable HTTPS on all URLs
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure transaction logging
- [ ] Set up monitoring and alerts
- [ ] Test all auth flows
- [ ] Test withdrawal limits
- [ ] Configure rate limiting
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Enable 2FA for admin accounts

## Support & Contact

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check Supabase documentation
4. Check Resend documentation

## License

Pioneer1 Financial Credit Union © 2025. All rights reserved.

---

Built with Next.js, Supabase, and Resend ❤️
