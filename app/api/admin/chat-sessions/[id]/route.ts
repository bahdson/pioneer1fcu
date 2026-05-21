import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    const { id } = params
    const { status } = await request.json()

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

    // Update chat session status
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update chat session:', updateError)
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Chat session updated' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Chat session update error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
