# Admin Account Setup Guide

## Quick Setup

An admin account has been created with the following credentials:

**Email:** Benwilks16@gmail.com  
**Password:** Schoolboy20

## Setting Up Admin Account

### Option 1: Using the Setup API (Recommended)

Make a POST request to the setup endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Benwilks16@gmail.com",
    "password": "Schoolboy20",
    "full_name": "Admin User"
  }'
```

### Option 2: Manual Setup via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Click **Add user**
4. Enter email: `Benwilks16@gmail.com`
5. Set password: `Schoolboy20`
6. Click **Create user**
7. Go to SQL Editor and run:

```sql
-- Update user as admin
UPDATE public.users 
SET account_type = 'admin', is_verified = true 
WHERE email = 'Benwilks16@gmail.com';

-- Create admin record
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT id, 'admin', '["manage_users", "manage_balances", "manage_withdrawals", "manage_wallets"]'::jsonb
FROM public.users 
WHERE email = 'Benwilks16@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admin_users WHERE user_id = public.users.id
);
```

## Accessing Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Enter credentials:
   - Email: `Benwilks16@gmail.com`
   - Password: `Schoolboy20`
3. Click Sign In
4. You'll be redirected to the admin dashboard

## Admin Dashboard Features

Once logged in, you can:

- **View All Users** - See all members and their account details
- **Edit Balances** - Adjust account balances for users
- **Manage Withdrawals** - Approve, reject, or manage withdrawal requests
- **Freeze/Unfreeze Accounts** - Restrict account access if needed
- **Delete Users** - Remove user accounts (irreversible)
- **Manage Wallets** - Configure Bitcoin wallet addresses
- **View Statistics** - See system-wide analytics and metrics

## Security Notes

⚠️ **Important:** Change the default admin password in production!

1. Log in with the default credentials
2. Go to Settings
3. Update your password
4. Never share admin credentials
5. Use strong, unique passwords
6. Enable two-factor authentication when available

## Troubleshooting

**Cannot log in?**
- Verify email is correct: `Benwilks16@gmail.com`
- Check that SUPABASE_SERVICE_ROLE_KEY is set
- Ensure user record exists in database

**Admin dashboard not loading?**
- Clear browser cache
- Check console for errors
- Verify admin_users record exists in database

**Permissions denied?**
- Verify admin_users role is set to 'admin'
- Check RLS policies are enabled
- Ensure permissions array is properly formatted

## API Endpoints

Admin endpoints available:

- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]` - Update user details
- `POST /api/admin/setup` - Create new admin account

All admin endpoints require authentication and proper admin privileges.
