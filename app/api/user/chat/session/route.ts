import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has an active session
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('status', 'active')
      .single()

    if (existingSession) {
      return NextResponse.json({ session: existingSession })
    }

    // Create new chat session
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert([
        {
          user_id: userData.user.id,
          status: 'active',
          is_bot_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Session creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error('Chat session error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's active session
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Session fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ session: session || null })
  } catch (error) {
    console.error('Chat session error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
