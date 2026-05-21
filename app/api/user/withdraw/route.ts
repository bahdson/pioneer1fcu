import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    const { amount, address } = await request.json()

    if (!amount || !address) {
      return NextResponse.json(
        { error: 'Amount and address are required' },
        { status: 400 }
      )
    }

    // Get user from session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to check balance
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('balance, is_frozen')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    if (userProfile.is_frozen) {
      return NextResponse.json(
        { error: 'Your account is frozen and cannot withdraw' },
        { status: 403 }
      )
    }

    if (amount > userProfile.balance) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Create withdrawal request
    const { data: withdrawal, error: withdrawError } = await supabase
      .from('withdrawal_requests')
      .insert([
        {
          user_id: user.id,
          amount,
          destination_address: address,
          status: 'pending',
        },
      ])
      .select()

    if (withdrawError) {
      return NextResponse.json(
        { error: 'Failed to create withdrawal request' },
        { status: 500 }
      )
    }

    // Deduct from balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: userProfile.balance - amount })
      .eq('id', user.id)

    if (updateError) {
      console.error('Balance update error:', updateError)
    }

    // Create transaction record
    await supabase.from('transactions').insert([
      {
        user_id: user.id,
        type: 'withdrawal',
        amount,
        description: `Withdrawal to ${address.slice(0, 10)}...`,
        status: 'pending',
      },
    ])

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal request created',
        withdrawal: withdrawal[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
