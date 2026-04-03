import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  totalAmount: number
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Thank you for your order!</h2>
          <p>Your order has been received and is being processed.</p>
          
          <div class="info-box">
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> LKR ${totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> Processing Payment</p>
          </div>

          <p>We will verify your payment within <strong>5-15 minutes</strong> and send you the account details via WhatsApp.</p>
          
          <p>If you have any questions, feel free to contact us on WhatsApp: <strong>{config.contact.whatsapp}</strong></p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders" class="button">View Order Status</a>
        </div>
        <div class="footer">
          <p>© 2024 iTechLK Store. All rights reserved.</p>
          <p>Premium accounts at affordable prices</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  })
}

export async function sendOrderStatusUpdate(
  email: string,
  orderNumber: string,
  status: string,
  message: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        .status-completed { background: #10b981; color: white; }
        .status-processing { background: #f59e0b; color: white; }
        .status-cancelled { background: #ef4444; color: white; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Order Update</h1>
        </div>
        <div class="content">
          <h2>Order Status Updated</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Status:</strong> <span class="status status-${status.toLowerCase()}">${status}</span></p>
          <p>${message}</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders" class="button">View Order Details</a>
        </div>
        <div class="footer">
          <p>© 2024 iTechLK Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Update - ${orderNumber}`,
    html,
  })
}

export async function sendSubscriptionExpiryReminder(
  email: string,
  productName: string,
  expiryDate: Date
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Subscription Expiring Soon</h1>
        </div>
        <div class="content">
          <h2>Your subscription is about to expire</h2>
          
          <div class="warning">
            <p><strong>${productName}</strong> subscription will expire on <strong>${expiryDate.toLocaleDateString()}</strong></p>
          </div>

          <p>Don't lose access to your premium features! Renew your subscription now to continue enjoying uninterrupted service.</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/products" class="button">Renew Now</a>
          
          <p>Need help? Contact us on WhatsApp: <strong>{config.contact.whatsapp}</strong></p>
        </div>
        <div class="footer">
          <p>© 2024 iTechLK Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `⏰ Your ${productName} subscription expires in 3 days`,
    html,
  })
}
