# OTP Email Delivery Debugging Guide

## Issue: OTP Code Not Being Received

If you're not receiving OTP codes when signing up or logging in, follow these steps:

### Step 1: Verify Resend API Key

Check that your Resend API key is correctly configured:

```bash
# On .env.local or Vercel environment variables
RESEND_API_KEY=re_2krUNLJx_MabqXXnVnaocJrxotDSkxc6f
```

⚠️ Make sure there are NO spaces or quotes around the key.

### Step 2: Check Sender Email Configuration

Resend requires you to verify the sender domain:

1. Go to **Resend Dashboard** → **Domains**
2. You should see `pioneer1fcu.com` (if set up)
3. Or use the default sender: `onboarding@resend.dev` (for testing)

**Current Configuration:**
- Sender: `security@pioneer1fcu.com` (production)
- Fallback: `onboarding@resend.dev` (testing)

### Step 3: Check Supabase Configuration

1. Go to **Supabase Dashboard** → **Authentication**
2. Check **Email Templates** - you should see OTP email template
3. Verify auth settings are enabled

### Step 4: Enable Debug Logging

Add console logging to see what's happening. The code already includes logging:

```typescript
console.error('Resend error:', result.error)
console.error('Failed to send OTP email:', error)
```

Check your browser console and server logs for errors.

### Step 5: Test Email Delivery

Create a test route to verify Resend is working:

```bash
# Test via API
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "otp": "123456"
  }'
```

### Step 6: Check Email Spam Folder

OTP emails might end up in spam:

1. Check your spam/junk folder
2. Look for emails from `security@pioneer1fcu.com`
3. Mark as "Not Spam"
4. Add to contacts

### Step 7: Verify User Sign Up Flow

When you register:
1. Enter email (e.g., `test@example.com`)
2. Enter password
3. Click Register
4. You should be redirected to OTP verification page
5. Check email for 6-digit code

If step 4 fails, the OTP generation might be failing.

## Common Issues & Solutions

### Issue 1: "Invalid API Key"
**Solution:**
- Verify key is exactly: `re_2krUNLJx_MabqXXnVnaocJrxotDSkxc6f`
- No spaces before/after
- Check Vercel environment variables are updated
- Restart dev server: `pnpm dev`

### Issue 2: "Sender Not Verified"
**Solution:**
- For development, use `onboarding@resend.dev`
- For production, verify domain in Resend dashboard
- Update sender email in `lib/resend-service.ts`

### Issue 3: "OTP Expired"
**Solution:**
- OTP codes expire in 10 minutes
- Request a new OTP if timeout occurs
- Check system time is correct

### Issue 4: "Email Address Invalid"
**Solution:**
- Verify email format is correct
- Check for typos
- Use valid email addresses for testing

## Updating Resend Configuration

If you need to change the sender email:

1. **In code** (`lib/resend-service.ts`):
```typescript
from: 'your-email@pioneer1fcu.com',  // Change this
```

2. **In Resend Dashboard**:
   - Add domain
   - Verify DNS records
   - Test delivery

3. **Update environment variables**:
```bash
RESEND_API_KEY=your_new_key_here
```

## Testing OTP Flow Locally

```bash
# 1. Start dev server
pnpm dev

# 2. Go to register page
# http://localhost:3000/auth/register

# 3. Fill form:
# - Email: test@example.com
# - Password: TestPass123!
# - Confirm: TestPass123!

# 4. Click Register

# 5. Check terminal for:
# - "[v0] OTP sent successfully"
# - Resend API response

# 6. Check email for code

# 7. Enter code on verification page
```

## Email Headers to Check

When you receive an OTP email, check the headers:

- **From:** `security@pioneer1fcu.com`
- **Subject:** `Your Pioneer1 Financial Credit Union Security Code`
- **To:** Your registered email
- **Reply-To:** Should be configured in Resend

## Resend Dashboard Checks

1. Go to **Resend Dashboard**
2. Click **Emails** tab
3. You should see sent emails:
   - Status: ✓ Delivered
   - Status: ⚠ Bounced (bad email)
   - Status: ✗ Failed (API error)

Click an email to see full details.

## Advanced Debugging

### Check database OTP records

```sql
-- In Supabase SQL Editor
SELECT * FROM public.otp_sessions 
ORDER BY created_at DESC 
LIMIT 5;

-- Should show:
-- id, email, otp_code (not visible), is_used, expires_at
```

### Verify auth flow

```sql
-- Check if user was created
SELECT id, email, is_verified 
FROM public.users 
WHERE email = 'test@example.com';

-- Should return user record
```

## Contact Support

If problems persist:

1. Check **Resend Status** - `status.resend.com`
2. Review **Supabase Logs** - Dashboard > Logs
3. Check **browser console** - F12 > Console tab
4. Check **server logs** - Terminal output

## Quick Checklist

- [ ] RESEND_API_KEY is set correctly
- [ ] Resend domain is verified (or using onboarding@resend.dev)
- [ ] Supabase authentication is enabled
- [ ] Email address is valid and not a test email
- [ ] Server has internet connection
- [ ] Firewall isn't blocking Resend API
- [ ] OTP codes not expired (10 min limit)
- [ ] Database OTP records are being created

Once you verify each item, the OTP emails should arrive within 30 seconds!
