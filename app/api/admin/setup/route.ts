import { createClient } from '@supabase/supabase-js'
import { hash } from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(req: Request) {
  try {
    const { email, password, full_name } = await req.json()

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create admin user via Supabase Auth
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || 'Admin',
      },
    })

    if (authError) {
      console.error('[v0] Auth error:', authError)
      return Response.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create user record
    const { error: userError } = await supabase
      .from('users')
      .update({
        full_name: full_name || 'Admin',
        account_type: 'admin',
        is_verified: true,
      })
      .eq('id', authData.user.id)

    if (userError) {
      console.error('[v0] User creation error:', userError)
      return Response.json(
        { error: userError.message },
        { status: 400 }
      )
    }

    // Create admin record
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: authData.user.id,
        role: 'admin',
        permissions: ['manage_users', 'manage_balances', 'manage_withdrawals', 'manage_wallets'],
      })

    if (adminError) {
      console.error('[v0] Admin record error:', adminError)
      return Response.json(
        { error: adminError.message },
        { status: 400 }
      )
    }

    return Response.json({
      message: 'Admin account created successfully',
      user_id: authData.user.id,
      email: authData.user.email,
    })
  } catch (error) {
    console.error('[v0] Admin setup error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
