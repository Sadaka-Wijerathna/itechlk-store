/**
 * Next.js Instrumentation Hook
 * This file is automatically called when the server starts
 * Perfect for initializing server-side services like Telegram bot
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on Node.js runtime (server-side)
    const { setupTelegramBot } = await import('@/lib/services/telegram')
    
    // Initialize Telegram bot (webhook mode - no polling)
    // Polling is disabled to prevent 409 Conflict errors in serverless
    setupTelegramBot()
    
    console.log('✅ Telegram bot initialized (webhook mode)')
    console.log('ℹ️ To configure webhook, call POST /api/telegram/setup with secret')
  }
}
