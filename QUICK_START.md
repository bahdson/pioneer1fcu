# Quick Start Guide - Pioneer1 Financial Credit Union

## What's Been Set Up For You

✅ **Database Schema** - All 8 tables created in Supabase with:
  - Users, Transactions, Withdrawal Requests
  - Bitcoin Deposits, Admin Users, Crypto Wallets
  - OTP Sessions for email verification
  - Row Level Security (RLS) policies
  - Automatic timestamps and triggers

✅ **Environment Variables** - All configured:
  - **Supabase**: `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **Resend**: `RESEND_API_KEY` (in Vercel project settings)
  - **Local file**: `.env.local` created with all keys

✅ **Application Code** - Complete fintech app with:
  - User registration & OTP email verification
  - Dashboard with balance and transaction history
  - Bitcoin deposit with QR code
  - Withdrawal requests
  - Profile settings
  - Admin dashboard with user management

## File Locations

### Where to Find Your Environment Variables

1. **Local Development (.env.local)**
   - Location: `/vercel/share/v0-project/.env.local`
   - Used when running: `pnpm dev`
   - Contains: Supabase URL, keys, Resend API key

2. **Vercel Project Settings**
   - Location: https://vercel.com/dashboard → Select Project → Settings → Environment Variables
   - Sync automatically when deployed
   - Contains: All env vars including RESEND_API_KEY

### How the Environment Works

- **Local Development**: Uses `.env.local` file
- **Vercel Deployment**: Uses environment variables set in Vercel dashboard
- **v0 Preview**: Uses Vercel env vars automatically

## Running the Application

```bash
# Install dependencies (already done)
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

## Testing the Application

### User Registration Flow
1. Go to http://localhost:3000/auth/register
2. Enter email and password
3. Check email for 6-digit OTP code
4. Enter OTP to verify
5. Login with credentials

### Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Email: `admin@pioneer1fcu.com`
3. Password: `SecureAdmin123!`

### Features to Test
- Register new account
- Login with OTP verification
- View dashboard balance
- View transactions
- Bitcoin deposit (shows QR code)
- Withdrawal requests
- Profile settings
- Admin user management

## Important Notes

### Supabase Configuration
- URL: https://wgowaajsbucqqwwarxxx.supabase.co
- Database tables are ready and RLS policies are active
- Automatic user creation on signup via triggers

### Resend Email Service
- Domain verified to: `all` (catches all emails)
- Sender email: `security@pioneer1fcu.com`
- Used for OTP delivery
- Branded as "Pioneer1 Financial Credit Union"

### Bitcoin Wallet
- Address: `bc1qumcfjj9uk26se5xc3vjzpvffvwehz7rxstgt7r`
- QR codes generated automatically for deposits
- Tracked in database

## Troubleshooting

### If emails aren't sending:
1. Check RESEND_API_KEY in `.env.local`
2. Verify in Vercel dashboard: Settings → Environment Variables
3. Test key in Resend dashboard

### If database connection fails:
1. Check NEXT_PUBLIC_SUPABASE_URL in `.env.local`
2. Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
3. Verify tables in Supabase: https://app.supabase.com

### If OTP code doesn't arrive:
1. Check spam/junk folder
2. Wait 30 seconds (includes delivery time)
3. Try registering with different email

## Production Deployment

1. **Set environment variables** in Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - RESEND_API_KEY

2. **Change admin credentials**:
   - Don't use default admin email/password
   - Update in database directly via Supabase

3. **Enable production Resend domain**:
   - Verify your own domain (not "all")
   - Update sender email from `security@pioneer1fcu.com` to your domain

4. **Deploy to Vercel**:
   ```bash
   git push origin main
   # Automatically deploys with env vars
   ```

---

Everything is ready to go! Start with `pnpm dev` and test the flows.
