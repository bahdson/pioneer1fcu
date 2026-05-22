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

    const { sessionId, message, conversationId } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create chat message
    const { data: messageData, error: messageError } = await supabase
      .from('chat_messages')
      .insert([
        {
          user_id: userData.user.id,
          conversation_id: conversationId,
          message: message.trim(),
          sender_type: 'user',
          is_bot_message: false,
        },
      ])
      .select()

    if (messageError) {
      console.error('Message creation error:', messageError)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    // Simulate bot response after 1 second
    setTimeout(async () => {
      try {
        await supabase.from('chat_messages').insert([
          {
            user_id: userData.user.id,
            conversation_id: conversationId,
            message: 'Hello, please wait while I connect you to a live agent...',
            sender_type: 'user',
            is_bot_message: true,
          },
        ])

        // Update chat session to mark bot as still active
        await supabase
          .from('chat_sessions')
          .update({ is_bot_active: true })
          .eq('id', sessionId)
      } catch (error) {
        console.error('Bot response error:', error)
      }
    }, 1000)

    return NextResponse.json(
      { success: true, message: messageData?.[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Chat error:', error)
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

    const conversationId = request.nextUrl.searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversationId' },
        { status: 400 }
      )
    }

    // Fetch messages for conversation
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Fetch messages error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
