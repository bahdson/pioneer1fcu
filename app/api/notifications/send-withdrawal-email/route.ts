import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { sendWithdrawalNotificationEmail } from '@/lib/resend-service'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, amount, destination, transactionId } = await request.json()

    if (!userId || !email || !amount || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email, amount, destination' },
        { status: 400 }
      )
    }

    // Send email notification
    try {
      await sendWithdrawalNotificationEmail(email, amount, destination, transactionId)
    } catch (emailError) {
      console.error('Failed to send withdrawal email:', emailError)
    }

    // Create notification record in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: 'Withdrawal Processed',
          message: `Your withdrawal of $${amount.toFixed(2)} to ${destination} has been processed.`,
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
        message: 'Withdrawal notification sent successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Withdrawal notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send withdrawal notification' },
      { status: 500 }
    )
  }
}
