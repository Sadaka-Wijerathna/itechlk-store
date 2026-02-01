import TelegramBot from 'node-telegram-bot-api'

let bot: TelegramBot | null = null

// Initialize bot WITHOUT polling for serverless environments
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
    polling: false, // Disable polling in serverless - use webhooks instead
  })
  console.log('✅ Telegram bot initialized (webhook mode)')
}

interface OrderNotification {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerWhatsApp: string
  products: Array<{ name: string; quantity: number; months: number }>
  totalAmount: number
  paymentReceipt?: string
}

export async function sendOrderNotificationToAdmin(data: OrderNotification) {
  if (!bot || !process.env.TELEGRAM_ADMIN_CHAT_ID) {
    console.warn('Telegram bot not configured')
    return { success: false }
  }

  // Support multiple admin chat IDs separated by comma
  const adminChatIds = process.env.TELEGRAM_ADMIN_CHAT_ID.split(',').map(id => id.trim())

  const productsText = data.products
    .map((p) => `  • ${p.name} x${p.quantity} (${p.months} month${p.months > 1 ? 's' : ''})`)
    .join('\n')

  const message = `🔔 *NEW ORDER RECEIVED*

📋 *Order Details:*
Order Number: \`${data.orderNumber}\`
Total Amount: *LKR ${data.totalAmount.toFixed(2)}*

👤 *Customer Information:*
Name: ${data.customerName}
Email: ${data.customerEmail}
WhatsApp: [Contact Customer](https://wa.me/${data.customerWhatsApp.replace(/[^0-9]/g, '')})

🛍️ *Products:*
${productsText}

${data.paymentReceipt ? '📎 Payment receipt attached below' : '⏳ Waiting for payment receipt'}

*Action Required:* Verify payment and approve order`

  try {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '✅ Approve Order', callback_data: `approve_${data.orderNumber}` },
          { text: '❌ Reject Order', callback_data: `reject_${data.orderNumber}` },
        ],
        [
          { text: '💬 Contact Customer', url: `https://wa.me/${data.customerWhatsApp.replace(/[^0-9]/g, '')}` },
        ],
      ],
    }

    // Send to all admin chat IDs in parallel for faster delivery
    const sendPromises = adminChatIds.map(async (chatId) => {
      try {
        // If payment receipt exists, send it with the message as caption
        if (data.paymentReceipt && data.paymentReceipt.startsWith('http')) {
          return await bot!.sendPhoto(chatId, data.paymentReceipt, {
            caption: message,
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          })
        } else {
          // If no receipt, send text message only
          return await bot!.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          })
        }
      } catch (error) {
        console.error(`Failed to send to chat ${chatId}:`, error)
        return null
      }
    })

    await Promise.all(sendPromises)
    return { success: true }
  } catch (error) {
    console.error('Telegram notification error:', error)
    return { success: false, error }
  }
}

export async function sendOrderApprovalNotification(
  orderNumber: string,
  status: 'approved' | 'rejected'
) {
  if (!bot || !process.env.TELEGRAM_ADMIN_CHAT_ID) {
    return { success: false }
  }

  // Support multiple admin chat IDs separated by comma
  const adminChatIds = process.env.TELEGRAM_ADMIN_CHAT_ID.split(',').map(id => id.trim())

  const message =
    status === 'approved'
      ? `✅ Order ${orderNumber} has been approved and customer notified.`
      : `❌ Order ${orderNumber} has been rejected.`

  try {
    // Send to all admin chat IDs in parallel
    const sendPromises = adminChatIds.map(chatId => 
      bot!.sendMessage(chatId, message).catch(err => {
        console.error(`Failed to send to chat ${chatId}:`, err)
        return null
      })
    )
    
    await Promise.all(sendPromises)
    return { success: true }
  } catch (error) {
    console.error('Telegram notification error:', error)
    return { success: false, error }
  }
}

// Process callback query (called from webhook endpoint)
export async function processCallbackQuery(query: any) {
  const startTime = Date.now()
  console.log('📥 Processing callback query:', query.data)
  
  const data = query.data
  if (!data) {
    console.warn('⚠️ No data in callback query')
    return { success: false, error: 'No data in callback query' }
  }

  const [action, orderNumber] = data.split('_')
  console.log(`🔄 Processing ${action} for order ${orderNumber}`)

  if (action === 'approve' || action === 'reject') {
    try {
      // Try to answer callback query
      try {
        await bot?.answerCallbackQuery(query.id, {
          text: `⚡ Processing ${action}...`,
        })
      } catch (callbackError: any) {
        // Handle old/expired callback queries gracefully
        if (callbackError.message?.includes('query is too old') || 
            callbackError.message?.includes('query ID is invalid')) {
          console.warn('⚠️ Callback query expired or invalid, continuing anyway...')
          // Send a new message instead since we can't answer the old callback
          await bot?.sendMessage(
            query.message?.chat.id || process.env.TELEGRAM_ADMIN_CHAT_ID!,
            `⚠️ This button is too old. Processing order ${orderNumber} anyway...\n⏳ ${action === 'approve' ? 'Approving' : 'Rejecting'} order...`
          )
        } else {
          throw callbackError // Re-throw if it's a different error
        }
      }

      // Update message immediately with "Processing..." status
      const processingEmoji = action === 'approve' ? '⏳' : '⏳'
      const processingText = action === 'approve' ? 'PROCESSING APPROVAL...' : 'PROCESSING REJECTION...'
      
      try {
        if (query.message?.caption) {
          await bot?.editMessageCaption(
            `${query.message.caption}\n\n${processingEmoji} *Status: ${processingText}*`,
            {
              chat_id: query.message.chat.id,
              message_id: query.message.message_id,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [] }, // Remove buttons immediately
            }
          )
        } else if (query.message?.text) {
          await bot?.editMessageText(
            `${query.message.text}\n\n${processingEmoji} *Status: ${processingText}*`,
            {
              chat_id: query.message.chat.id,
              message_id: query.message.message_id,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [] }, // Remove buttons immediately
            }
          )
        }
      } catch (editError) {
        console.warn('⚠️ Could not update message immediately:', editError)
      }

      // Call API to update order status and create subscriptions
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
      console.log(`🌐 Calling API: ${apiUrl}/api/orders/approve`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch(`${apiUrl}/api/orders/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          action,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const duration = Date.now() - startTime
      console.log(`📡 API Response status: ${response.status} (${duration}ms)`)
      const result = await response.json()
      console.log('📦 API Result:', result)

      if (result.success) {
        // Send success notification
        const statusEmoji = action === 'approve' ? '✅' : '❌'
        const statusText = action === 'approve' ? 'APPROVED' : 'REJECTED'
        const processingTimeText = result.processingTime ? ` (${result.processingTime})` : ''
        const alreadyProcessedText = result.alreadyProcessed ? ' (Already processed)' : ''

        // Update the message with final status
        try {
          if (query.message?.caption) {
            await bot?.editMessageCaption(
              `${query.message.caption}\n\n${statusEmoji} *Status: ${statusText}*${processingTimeText}${alreadyProcessedText}`,
              {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [] },
              }
            )
          } else if (query.message?.text) {
            await bot?.editMessageText(
              `${query.message.text}\n\n${statusEmoji} *Status: ${statusText}*${processingTimeText}${alreadyProcessedText}`,
              {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [] },
              }
            )
          }
        } catch (editError) {
          console.error('⚠️ Could not edit message:', editError)
          // If editing fails, send a new message
          const successMessage = action === 'approve' 
            ? `✅ Order ${orderNumber} approved! Subscriptions created.${processingTimeText}`
            : `❌ Order ${orderNumber} rejected.${processingTimeText}`
          await bot?.sendMessage(query.message?.chat.id || process.env.TELEGRAM_ADMIN_CHAT_ID!, successMessage)
        }

        console.log(`✅ Successfully processed ${action} for order ${orderNumber} in ${duration}ms`)
        return { success: true, duration }
      } else {
        console.error('❌ API returned error:', result.error)
        
        // Update message with error
        try {
          const errorMessage = `❌ *ERROR: ${result.error || 'Unknown error'}*`
          if (query.message?.caption) {
            await bot?.editMessageCaption(
              `${query.message.caption}\n\n${errorMessage}`,
              {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                parse_mode: 'Markdown',
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: '🔄 Retry Approve', callback_data: `approve_${orderNumber}` },
                      { text: '🔄 Retry Reject', callback_data: `reject_${orderNumber}` },
                    ],
                  ],
                },
              }
            )
          } else if (query.message?.text) {
            await bot?.editMessageText(
              `${query.message.text}\n\n${errorMessage}`,
              {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                parse_mode: 'Markdown',
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: '🔄 Retry Approve', callback_data: `approve_${orderNumber}` },
                      { text: '🔄 Retry Reject', callback_data: `reject_${orderNumber}` },
                    ],
                  ],
                },
              }
            )
          }
        } catch (editError) {
          await bot?.sendMessage(
            query.message?.chat.id || process.env.TELEGRAM_ADMIN_CHAT_ID!,
            `❌ Failed to ${action} order ${orderNumber}: ${result.error || 'Unknown error'}`
          )
        }
        return { success: false, error: result.error }
      }
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`❌ Error processing order action after ${duration}ms:`, error)
      
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      const isTimeout = errorMsg.includes('aborted')
      const isOldQuery = errorMsg.includes('query is too old') || errorMsg.includes('query ID is invalid')
      
      // Provide user-friendly error messages
      let userMessage = ''
      if (isOldQuery) {
        userMessage = `⚠️ Order ${orderNumber}: This button expired (>48hrs old).\n\n📌 To process this order:\n1. Go to Admin Dashboard\n2. Find order ${orderNumber}\n3. Approve/Reject from there\n\n⏱️ Duration: ${duration}ms`
      } else if (isTimeout) {
        userMessage = `⏱️ Timeout processing order ${orderNumber}\n\nThe operation took too long. Please try again or check the admin dashboard.\n\n⏱️ Duration: ${duration}ms`
      } else {
        userMessage = `❌ Error processing order ${orderNumber}: ${errorMsg}\n\n⏱️ Duration: ${duration}ms`
      }
      
      await bot?.sendMessage(
        query.message?.chat.id || process.env.TELEGRAM_ADMIN_CHAT_ID!,
        userMessage
      )
      return { success: false, error: errorMsg }
    }
  }
  
  return { success: false, error: 'Invalid action' }
}

// Setup webhook (for serverless environments)
export async function setupTelegramWebhook() {
  if (!bot) {
    console.warn('⚠️ Telegram bot not initialized - bot token missing')
    return { success: false }
  }

  // Use www subdomain to avoid redirects
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.itechlk.store'
  const webhookUrl = baseUrl.includes('www.') 
    ? `${baseUrl}/api/telegram/webhook`
    : `${baseUrl.replace('://', '://www.')}/api/telegram/webhook`
  
  try {
    // Delete any existing webhook first
    await bot.deleteWebHook()
    console.log('🗑️ Deleted existing webhook')
    
    // Set new webhook
    const result = await bot.setWebHook(webhookUrl)
    console.log(`✅ Telegram webhook set to: ${webhookUrl}`)
    
    // Verify webhook
    const info = await bot.getWebHookInfo()
    console.log('📋 Webhook info:', info)
    
    return { success: true, webhookUrl, info }
  } catch (error) {
    console.error('❌ Failed to setup webhook:', error)
    return { success: false, error }
  }
}

// For backward compatibility - now does nothing in production
export function setupTelegramBot() {
  if (!bot) {
    console.warn('⚠️ Telegram bot not initialized - bot token missing')
    return
  }

  // In serverless/production, we use webhooks instead of polling
  // Polling causes "409 Conflict" errors with multiple instances
  console.log('ℹ️ Telegram bot ready (webhook mode - no polling)')
  console.log('ℹ️ Use /api/telegram/webhook endpoint to receive updates')
  console.log('ℹ️ Call setupTelegramWebhook() to configure webhook')
}

// Get bot instance for sending messages
export function getTelegramBot() {
  return bot
}
