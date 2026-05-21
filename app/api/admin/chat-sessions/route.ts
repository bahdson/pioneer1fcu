import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)

    // Get user from Supabase auth
    const { data: adminData, error: adminError } = await supabase.auth.getUser(token)

    if (adminError || !adminData.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
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

    // Get all chat sessions with message counts
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*, chat_messages(count)')
      .order('updated_at', { ascending: false })

    if (sessionsError) {
      console.error('Failed to fetch chat sessions:', sessionsError)
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      )
    }

    // Format response with message counts
    const formattedSessions = sessions.map((session: any) => ({
      ...session,
      message_count: session.chat_messages?.[0]?.count || 0,
      chat_messages: undefined,
    }))

    return NextResponse.json(formattedSessions, { status: 200 })
  } catch (error) {
    console.error('Chat sessions fetch error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
