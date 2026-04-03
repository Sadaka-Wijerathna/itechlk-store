import { NextResponse } from 'next/server'
import { getTelegramBot } from '@/lib/services/telegram'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const bot = getTelegramBot()
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

    if (!bot || !adminChatId) {
      console.warn('Telegram bot not configured for contact form')
      // Fallback for demo or missing config
      return NextResponse.json({ success: true, warning: 'Bot not configured, message ignored' })
    }

    const adminChatIds = adminChatId.split(',').map(id => id.trim())

    const telegramMessage = `📩 *NEW CONTACT MESSAGE*

👤 *From:* ${name}
✉️ *Email:* ${email}
📌 *Subject:* ${subject}

💬 *Message:*
${message}`

    const sendPromises = adminChatIds.map(chatId =>
      bot.sendMessage(chatId, telegramMessage, { parse_mode: 'Markdown' }).catch(err => {
        console.error(`Failed to send contact message to chat ${chatId}:`, err)
        return null
      })
    )

    await Promise.all(sendPromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact Form API Error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
