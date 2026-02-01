import TelegramBot from 'node-telegram-bot-api'

let bot: TelegramBot | null = null

if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
    // Optimize polling settings
    polling: {
      interval: 300, // Check every 300ms instead of default 1000ms
      autoStart: true,
      params: {
        timeout: 10, // Long polling timeout
      }
    }
  })
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

// Setup callback query handler for admin actions
export function setupTelegramBot() {
  if (!bot) {
    console.warn('⚠️ Telegram bot not initialized - bot token missing')
    return
  }

  console.log('🤖 Setting up Telegram bot callback handlers...')

  bot.on('callback_query', async (query) => {
    const startTime = Date.now()
    console.log('📥 Received callback query:', query.data)
    
    const data = query.data
    if (!data) {
      console.warn('⚠️ No data in callback query')
      return
    }

    const [action, orderNumber] = data.split('_')
    console.log(`🔄 Processing ${action} for order ${orderNumber}`)

    if (action === 'approve' || action === 'reject') {
      try {
        // IMMEDIATELY answer callback query to remove loading state
        // This makes the bot feel instant and responsive
        await bot?.answerCallbackQuery(query.id, {
          text: `⚡ Processing ${action}...`,
        })

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
        }
      } catch (error) {
        const duration = Date.now() - startTime
        console.error(`❌ Error processing order action after ${duration}ms:`, error)
        
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        const isTimeout = errorMsg.includes('aborted')
        
        await bot?.sendMessage(
          query.message?.chat.id || process.env.TELEGRAM_ADMIN_CHAT_ID!,
          `❌ ${isTimeout ? 'Timeout' : 'Error'} processing order ${orderNumber}: ${errorMsg}\n\n⏱️ Duration: ${duration}ms`
        )
      }
    }
  })

  console.log('✅ Telegram bot callback handlers ready')
}
