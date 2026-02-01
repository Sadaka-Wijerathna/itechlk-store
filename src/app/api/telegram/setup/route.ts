import { NextRequest, NextResponse } from 'next/server'
import { setupTelegramWebhook, getTelegramBot } from '@/lib/services/telegram'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    
    // Allow authentication with either TELEGRAM_SETUP_SECRET or TELEGRAM_BOT_TOKEN
    const validSecret = process.env.TELEGRAM_SETUP_SECRET || process.env.TELEGRAM_BOT_TOKEN
    
    if (!validSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error: No secret configured',
          debug: {
            hasSetupSecret: !!process.env.TELEGRAM_SETUP_SECRET,
            hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
            botTokenPrefix: process.env.TELEGRAM_BOT_TOKEN?.substring(0, 10) + '...',
          }
        },
        { status: 500 }
      )
    }
    
    if (secret !== validSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized - Invalid secret',
          debug: {
            receivedSecretPrefix: secret?.substring(0, 10) + '...',
            expectedSecretPrefix: validSecret?.substring(0, 10) + '...',
            secretsMatch: secret === validSecret,
          }
        },
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
