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
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user's check deposits
    const { data: deposits, error: depositError } = await supabase
      .from('check_deposits')
      .select('*')
      .eq('user_id', data.user.id)
      .order('created_at', { ascending: false })

    if (depositError) {
      console.error('Failed to fetch check deposits:', depositError)
      return NextResponse.json(
        { error: 'Failed to fetch check deposits' },
        { status: 500 }
      )
    }

    return NextResponse.json(deposits, { status: 200 })
  } catch (error) {
    console.error('Check deposits fetch error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

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

    // Get user from Supabase auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const frontImage = formData.get('frontImage') as File
    const backImage = formData.get('backImage') as File
    const amount = formData.get('amount') as string

    if (!frontImage || !backImage || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a production app, you would upload images to cloud storage
    // For now, we'll store just the metadata
    const { error: insertError } = await supabase
      .from('check_deposits')
      .insert([
        {
          user_id: authData.user.id,
          amount: parseFloat(amount),
          status: 'pending',
          front_image_url: `${frontImage.name}`, // In production, use actual S3/Blob URL
          back_image_url: `${backImage.name}`, // In production, use actual S3/Blob URL
        },
      ])

    if (insertError) {
      console.error('Failed to create check deposit:', insertError)
      return NextResponse.json(
        { error: 'Failed to create check deposit' },
        { status: 500 }
      )
    }

    // Create notification for user
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: authData.user.id,
          title: 'Check Deposit Submitted',
          message: `Check deposit of $${parseFloat(amount).toFixed(2)} has been submitted for verification.`,
          notification_type: 'transaction',
          is_read: false,
        },
      ])

    return NextResponse.json(
      {
        success: true,
        message: 'Check deposit submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Check deposit creation error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
