import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    const { user_ids, title, message, notification_type } = await request.json()

    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid user_ids' },
        { status: 400 }
      )
    }

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    // Verify admin (in production, you'd check admin role in Supabase)
    const { data: adminData, error: adminError } = await supabase.auth.getUser(token)

    if (adminError || !adminData.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is admin (check if user exists in admin_users table)
    const { data: adminCheck } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', adminData.user.id)
      .single()

    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Create notifications for all specified users
    const notificationsToCreate = user_ids.map((userId: string) => ({
      user_id: userId,
      title,
      message,
      notification_type: notification_type || 'info',
      is_read: false,
    }))

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notificationsToCreate)

    if (insertError) {
      console.error('Failed to create notifications:', insertError)
      return NextResponse.json(
        { error: 'Failed to send notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `Notifications sent to ${user_ids.length} user${user_ids.length === 1 ? '' : 's'}`,
        count: user_ids.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send notifications error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
