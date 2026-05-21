import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { sendPasswordChangeEmail } from '@/lib/resend-service'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, userName } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email' },
        { status: 400 }
      )
    }

    // Send email notification
    try {
      await sendPasswordChangeEmail(email, userName)
    } catch (emailError) {
      console.error('Failed to send password change email:', emailError)
    }

    // Create notification record in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: 'Password Changed',
          message: 'Your Pioneer1 account password has been successfully changed. If you did not make this change, please contact support immediately.',
          notification_type: 'alert',
          is_read: false,
        },
      ])

    if (notificationError) {
      console.error('Failed to create notification record:', notificationError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password change notification sent successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password change notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send password change notification' },
      { status: 500 }
    )
  }
}
