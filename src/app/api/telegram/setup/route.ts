import { NextRequest, NextResponse } from 'next/server'
import { setupTelegramWebhook, getTelegramBot } from '@/lib/services/telegram'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Simple authentication - you can improve this
    const { secret } = await request.json()
    
    if (secret !== process.env.TELEGRAM_SETUP_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔧 Setting up Telegram webhook...')
    const result = await setupTelegramWebhook()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook configured successfully',
        webhookUrl: result.webhookUrl,
        webhookInfo: result.info,
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Setup error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Setup failed' 
      },
      { status: 500 }
    )
  }
}

// Get webhook status
export async function GET() {
  try {
    const bot = getTelegramBot()
    if (!bot) {
      return NextResponse.json({
        success: false,
        error: 'Bot not initialized'
      }, { status: 500 })
    }

    const info = await bot.getWebHookInfo()
    
    return NextResponse.json({
      success: true,
      webhookInfo: info,
      configured: !!info.url,
      pendingUpdates: info.pending_update_count,
    })
  } catch (error) {
    console.error('❌ Error getting webhook info:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get webhook info' 
      },
      { status: 500 }
    )
  }
}
