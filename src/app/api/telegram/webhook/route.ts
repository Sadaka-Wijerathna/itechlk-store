import { NextRequest, NextResponse } from 'next/server'
import { processCallbackQuery } from '@/lib/services/telegram'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Telegram webhook received:', JSON.stringify(body, null, 2))

    // Telegram sends updates in this format
    if (body.callback_query) {
      console.log('🔘 Processing callback query from webhook')
      const result = await processCallbackQuery(body.callback_query)
      return NextResponse.json({ success: true, result })
    }

    // Handle other update types if needed
    if (body.message) {
      console.log('💬 Received message (ignoring for now)')
      return NextResponse.json({ success: true, message: 'Message received' })
    }

    console.log('ℹ️ Unknown update type')
    return NextResponse.json({ success: true, message: 'Update received' })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Webhook processing failed' 
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Telegram webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
