import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { sendOTPEmail } from '@/lib/resend-service'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Sign up with Supabase (no email verification link needed)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email verification links
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Generate OTP for signup verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in database
    const { error: otpError } = await supabase
      .from('otp_sessions')
      .insert([
        {
          email,
          otp_code: otp,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        },
      ])

    if (otpError) {
      console.error('OTP creation error:', otpError)
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp)
    } catch (emailError) {
      console.error('Failed to send OTP:', emailError)
    }

    // Insert user profile with auto-generated account/routing numbers
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user?.id,
          email,
          full_name: fullName,
          account_balance: 0,
          is_verified: false,
          is_frozen: false,
        },
      ])

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Check your email for a 6-digit verification code.',
        user: data.user,
        requiresOTP: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
