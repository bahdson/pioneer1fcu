import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { sendDepositNotificationEmail } from '@/lib/resend-service'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, amount, transactionId } = await request.json()

    if (!userId || !email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email, amount' },
        { status: 400 }
      )
    }

    // Send email notification
    try {
      await sendDepositNotificationEmail(email, amount, transactionId)
    } catch (emailError) {
      console.error('Failed to send deposit email:', emailError)
    }

    // Create notification record in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: 'Deposit Received',
          message: `You have received a deposit of $${amount.toFixed(2)} to your Pioneer1 account.`,
          notification_type: 'transaction',
          related_transaction_id: transactionId,
          is_read: false,
        },
      ])

    if (notificationError) {
      console.error('Failed to create notification record:', notificationError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit notification sent successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Deposit notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send deposit notification' },
      { status: 500 }
    )
  }
}
