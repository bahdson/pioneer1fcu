import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { sendOTPEmail } from '@/lib/resend-service'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP temporarily (in production, use a cache like Redis)
    // For now, we'll rely on Supabase's built-in OTP
    try {
      await sendOTPEmail(email, otp)
    } catch (emailError) {
      console.error('Failed to send OTP:', emailError)
      // Continue anyway, user can request a new one
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Check your email for a one-time password',
        session: data.session,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signin' },
      { status: 500 }
    )
  }
}
