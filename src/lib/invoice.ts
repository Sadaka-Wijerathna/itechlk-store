import jsPDF from 'jspdf'
import { formatPrice } from './utils'
import { generateInvoiceHTML, printInvoice as printInvoiceHTML, downloadInvoiceHTML } from './generateInvoiceHTML'

// Re-export the HTML-based invoice functions for easy access
export { generateInvoiceHTML, printInvoiceHTML, downloadInvoiceHTML }

interface InvoiceData {
  orderNumber: string
  orderDate: Date
  customer: {
    name: string
    email: string
    whatsappNumber: string
  }
  items: Array<{
    name: string
    description?: string
    quantity: number
    months: number
    price: number
    total: number
  }>
  subtotal: number
  tax?: number
  discount?: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  estimatedDelivery?: string
  notes?: string
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF()
  
  // Enhanced Colors
  const primaryColor: [number, number, number] = [102, 126, 234] // #667eea
  const secondaryColor: [number, number, number] = [118, 75, 162] // #764ba2
  const darkColor: [number, number, number] = [23, 23, 23]
  const grayColor: [number, number, number] = [115, 115, 115]
  const lightGray: [number, number, number] = [245, 245, 245]
  const successColor: [number, number, number] = [16, 185, 129]
  const warningColor: [number, number, number] = [245, 158, 11]
  const dangerColor: [number, number, number] = [239, 68, 68]
  
  let yPos = 0

  // ============================================
  // HEADER SECTION - Gradient Background
  // ============================================
  
  // Gradient effect (simulated with multiple rectangles)
  for (let i = 0; i < 45; i++) {
    const r = primaryColor[0] + (secondaryColor[0] - primaryColor[0]) * (i / 45)
    const g = primaryColor[1] + (secondaryColor[1] - primaryColor[1]) * (i / 45)
    const b = primaryColor[2] + (secondaryColor[2] - primaryColor[2]) * (i / 45)
    doc.setFillColor(r, g, b)
    doc.rect(0, i, 210, 1, 'F')
  }
  
  // Company Name with Shadow Effect
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  yPos = 22
  doc.text('iTechLK', 20, yPos)
  
  // Tagline
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  yPos += 7
  doc.text('Premium Digital Subscriptions', 20, yPos)
  
  // Contact Info in Header
  doc.setFontSize(8)
  yPos += 5
  doc.text('Email: support@itechlk.store  |  Phone: +94 74 257 0943', 20, yPos)
  
  // INVOICE Badge - Top Right
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(150, 15, 40, 12, 2, 2, 'F')
  doc.setTextColor(...primaryColor)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 170, 23, { align: 'center' })
  
  // ============================================
  // INVOICE INFO SECTION
  // ============================================
  
  yPos = 55
  
  // Left Side - Invoice Details
  doc.setFillColor(...lightGray)
  doc.roundedRect(20, yPos, 85, 35, 3, 3, 'F')
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Details', 25, yPos + 7)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  
  yPos += 13
  doc.text('Invoice Number:', 25, yPos)
  doc.setTextColor(...darkColor)
  doc.setFont('helvetica', 'bold')
  doc.text(data.orderNumber, 60, yPos)
  
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text('Invoice Date:', 25, yPos)
  doc.setTextColor(...darkColor)
  doc.text(new Date(data.orderDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), 60, yPos)
  
  yPos += 6
  doc.setTextColor(...grayColor)
  doc.text('Payment Method:', 25, yPos)
  doc.setTextColor(...darkColor)
  doc.text(data.paymentMethod, 60, yPos)
  
  yPos += 6
  doc.setTextColor(...grayColor)
  doc.text('Delivery Time:', 25, yPos)
  doc.setTextColor(...darkColor)
  doc.text(data.estimatedDelivery || '5-15 minutes', 60, yPos)
  
  // Right Side - Status Badge
  const statusX = 115
  const statusY = 55
  
  doc.setFillColor(...lightGray)
  doc.roundedRect(statusX, statusY, 75, 35, 3, 3, 'F')
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Status', statusX + 5, statusY + 7)
  
  // Status Badge with Icon
  let statusColor = warningColor
  let statusText = 'PENDING'
  
  if (data.paymentStatus === 'COMPLETED') {
    statusColor = successColor
    statusText = 'PAID'
  } else if (data.paymentStatus === 'CANCELLED' || data.paymentStatus === 'FAILED') {
    statusColor = dangerColor
    statusText = 'FAILED'
  }
  
  doc.setFillColor(...statusColor)
  doc.roundedRect(statusX + 5, statusY + 12, 65, 18, 3, 3, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(statusText, statusX + 37.5, statusY + 24, { align: 'center' })
  
  // ============================================
  // CUSTOMER & COMPANY INFO
  // ============================================
  
  yPos = 100
  
  // Customer Information - Left
  doc.setFillColor(250, 250, 255)
  doc.roundedRect(20, yPos, 85, 40, 3, 3, 'F')
  
  doc.setTextColor(...primaryColor)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO', 25, yPos + 7)
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(data.customer.name, 25, yPos + 15)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.text(`Email: ${data.customer.email}`, 25, yPos + 22)
  doc.text(`WhatsApp: ${data.customer.whatsappNumber}`, 25, yPos + 28)
  
  // Add customer ID or reference
  doc.setFontSize(8)
  doc.text(`Customer ID: ${data.customer.email.split('@')[0].toUpperCase()}`, 25, yPos + 34)
  
  // Company Information - Right
  doc.setFillColor(250, 250, 255)
  doc.roundedRect(115, yPos, 75, 40, 3, 3, 'F')
  
  doc.setTextColor(...primaryColor)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('FROM', 120, yPos + 7)
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('iTechLK Store', 120, yPos + 15)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.text('Morawaka, Sri Lanka', 120, yPos + 22)
  doc.text('Email: support@itechlk.store', 120, yPos + 28)
  doc.text('Phone: +94 74 257 0943', 120, yPos + 34)
  
  // ============================================
  // ITEMS TABLE - Enhanced
  // ============================================
  
  yPos = 150
  
  // Table Title
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...darkColor)
  doc.text('Order Items', 20, yPos)
  
  yPos += 8
  
  // Table Header with Gradient
  doc.setFillColor(...primaryColor)
  doc.roundedRect(20, yPos - 6, 170, 10, 2, 2, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('PRODUCT', 25, yPos)
  doc.text('QTY', 115, yPos, { align: 'center' })
  doc.text('DURATION', 135, yPos, { align: 'center' })
  doc.text('PRICE', 160, yPos, { align: 'right' })
  doc.text('TOTAL', 185, yPos, { align: 'right' })
  
  // Table Items with alternating colors
  yPos += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  data.items.forEach((item, index) => {
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(252, 252, 252)
      doc.rect(20, yPos - 5, 170, 10, 'F')
    }
    
    // Product Name (Bold)
    doc.setTextColor(...darkColor)
    doc.setFont('helvetica', 'bold')
    doc.text(item.name, 25, yPos)
    
    // Product Description (if available)
    if (item.description) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...grayColor)
      doc.text(item.description, 25, yPos + 3)
      doc.setFontSize(9)
    }
    
    // Quantity
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...darkColor)
    doc.text(`${item.quantity}x`, 115, yPos, { align: 'center' })
    
    // Duration
    doc.text(`${item.months} ${item.months > 1 ? 'months' : 'month'}`, 135, yPos, { align: 'center' })
    
    // Unit Price
    doc.text(`LKR ${formatPrice(item.price)}`, 160, yPos, { align: 'right' })
    
    // Total (Bold)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text(`LKR ${formatPrice(item.total)}`, 185, yPos, { align: 'right' })
    
    yPos += item.description ? 12 : 10
  })
  
  // ============================================
  // TOTALS SECTION - Enhanced
  // ============================================
  
  yPos += 5
  
  // Divider Line
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(115, yPos, 190, yPos)
  
  yPos += 8
  
  // Subtotal
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text('Subtotal:', 135, yPos)
  doc.setTextColor(...darkColor)
  doc.text(`LKR ${formatPrice(data.subtotal)}`, 185, yPos, { align: 'right' })
  
  // Tax (if applicable)
  if (data.tax && data.tax > 0) {
    yPos += 7
    doc.setTextColor(...grayColor)
    doc.text(`Tax (${((data.tax / data.subtotal) * 100).toFixed(1)}%):`, 135, yPos)
    doc.setTextColor(...darkColor)
    doc.text(`LKR ${formatPrice(data.tax)}`, 185, yPos, { align: 'right' })
  }
  
  // Discount (if applicable)
  if (data.discount && data.discount > 0) {
    yPos += 7
    doc.setTextColor(16, 185, 129)
    doc.text('Discount:', 135, yPos)
    doc.text(`-LKR ${formatPrice(data.discount)}`, 185, yPos, { align: 'right' })
  }
  
  // Total Amount - Highlighted Box
  yPos += 10
  doc.setFillColor(...primaryColor)
  doc.roundedRect(115, yPos - 6, 75, 14, 2, 2, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL AMOUNT:', 135, yPos + 2)
  doc.setFontSize(14)
  doc.text(`LKR ${formatPrice(data.totalAmount)}`, 185, yPos + 2, { align: 'right' })
  
  // Amount in Words
  yPos += 12
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...grayColor)
  const amountInWords = numberToWords(data.totalAmount)
  doc.text(`Amount in words: ${amountInWords} Rupees Only`, 115, yPos)
  
  // ============================================
  // PAYMENT INFORMATION BOX
  // ============================================
  
  yPos += 10
  
  doc.setFillColor(250, 250, 255)
  doc.roundedRect(20, yPos, 170, 25, 3, 3, 'F')
  
  // Title
  doc.setTextColor(...primaryColor)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Information', 25, yPos + 7)
  
  // Payment Details
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...darkColor)
  
  yPos += 14
  doc.text(`Payment Method: ${data.paymentMethod}`, 25, yPos)
  doc.text(`Status: ${data.paymentStatus}`, 100, yPos)
  
  yPos += 6
  doc.setTextColor(...grayColor)
  doc.setFontSize(8)
  doc.text('Payment verified and processed securely', 25, yPos)
  
  // ============================================
  // NOTES SECTION (if any)
  // ============================================
  
  if (data.notes) {
    yPos += 12
    doc.setFillColor(255, 250, 240)
    doc.roundedRect(20, yPos, 170, 15, 3, 3, 'F')
    
    doc.setTextColor(245, 158, 11)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes:', 25, yPos + 6)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...darkColor)
    doc.text(data.notes, 25, yPos + 11)
  }
  
  // ============================================
  // TERMS & CONDITIONS
  // ============================================
  
  yPos = 250
  
  doc.setFillColor(...lightGray)
  doc.roundedRect(20, yPos, 170, 28, 3, 3, 'F')
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Terms & Conditions', 25, yPos + 6)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...grayColor)
  
  const terms = [
    '• Account credentials will be delivered via WhatsApp within 5-15 minutes after payment verification.',
    '• All sales are final. Refunds are only available if we cannot deliver the service as promised.',
    '• Subscription duration starts from the date of account delivery, not the purchase date.',
    '• Customers are responsible for maintaining the security of their account credentials.',
    '• For support or inquiries, contact us via WhatsApp: +94 74 257 0943 or email: support@itechlk.store'
  ]
  
  let termY = yPos + 11
  terms.forEach(term => {
    doc.text(term, 25, termY, { maxWidth: 160 })
    termY += 3.5
  })
  
  // ============================================
  // FOOTER - Gradient Bar
  // ============================================
  
  // Gradient footer
  for (let i = 0; i < 15; i++) {
    const alpha = (i / 15)
    const r = primaryColor[0] + (secondaryColor[0] - primaryColor[0]) * alpha
    const g = primaryColor[1] + (secondaryColor[1] - primaryColor[1]) * alpha
    const b = primaryColor[2] + (secondaryColor[2] - primaryColor[2]) * alpha
    doc.setFillColor(r, g, b)
    doc.rect(0, 282 + i, 210, 1, 'F')
  }
  
  // Footer Text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Thank you for your business!', 105, 288, { align: 'center' })
  
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('iTechLK Store - Premium Digital Subscriptions at Affordable Prices', 105, 292, { align: 'center' })
  doc.text('This is a computer-generated invoice and does not require a signature', 105, 295, { align: 'center' })
  
  // Save the PDF
  doc.save(`Invoice-${data.orderNumber}.pdf`)
}

// Helper function to convert number to words (simplified)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero'
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  
  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '')
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '')
  
  return num.toLocaleString()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prepareInvoiceData(order: any): InvoiceData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = order.items.map((item: any) => {
    const total = item.price * item.quantity * item.months
    return {
      name: item.product.name,
      description: item.product.description || '',
      quantity: item.quantity,
      months: item.months,
      price: item.price,
      total: total
    }
  })
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0)
  
  // Calculate tax if applicable (0% for now)
  const taxRate = 0
  const tax = subtotal * taxRate
  
  // Calculate discount if applicable
  const discount = 0
  
  return {
    orderNumber: order.orderNumber,
    orderDate: order.createdAt,
    customer: {
      name: order.user.name || 'Valued Customer',
      email: order.user.email,
      whatsappNumber: order.user.whatsappNumber || 'Not provided'
    },
    items,
    subtotal,
    tax,
    discount,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Online Payment',
    paymentStatus: order.status,
    estimatedDelivery: order.estimatedTime || '5-15 minutes',
    notes: order.adminNotes || undefined
  }
}
