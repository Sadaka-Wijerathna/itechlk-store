export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmation } from '@/lib/services/email'
import { sendOrderNotificationToAdmin } from '@/lib/services/telegram'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { items, customerInfo, paymentReceipt } = body

    // Validate input
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    if (!customerInfo?.fullName || !customerInfo?.email || !customerInfo?.whatsappNumber) {
      return NextResponse.json({ error: 'Missing customer information' }, { status: 400 })
    }

    // Calculate total
    const totalAmount = items.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, item: any) => sum + item.price * item.quantity * item.months,
      0
    )

    // Get products from database to get real ObjectIDs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productIdentifiers = items.map((item: any) => item.id)

    console.log('🔍 Looking up products with identifiers:', productIdentifiers)

    // Try to find products by ID first (MongoDB ObjectId), then by slug
    const dbProducts = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: productIdentifiers } },
          { slug: { in: productIdentifiers } },
        ],
      },
    })

    console.log('📦 Found products:', dbProducts.length, 'out of', productIdentifiers.length)
    console.log('   Products found:', dbProducts.map(p => `${p.slug} (${p.id})`).join(', '))

    // Create a map of both ID and slug to product ID
    const identifierToIdMap = new Map()
    dbProducts.forEach(p => {
      identifierToIdMap.set(p.id, p.id)
      identifierToIdMap.set(p.slug, p.id)
    })

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        totalAmount,
        status: 'PENDING',
        paymentMethod: 'BANK_TRANSFER',
        paymentReceipt,
        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: items.map((item: any) => {
            const productId = identifierToIdMap.get(item.id)
            
            if (!productId) {
              throw new Error(`Product not found for identifier: ${item.id}`)
            }
            
            return {
              productId,
              quantity: item.quantity,
              months: item.months,
              price: item.price,
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update user profile if needed
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: customerInfo.fullName,
        whatsappNumber: customerInfo.whatsappNumber,
      },
    })

    // Send email confirmation
    await sendOrderConfirmation(
      customerInfo.email,
      order.orderNumber,
      totalAmount
    )

    // Send Telegram notification to admin
    await sendOrderNotificationToAdmin({
      orderNumber: order.orderNumber,
      customerName: customerInfo.fullName,
      customerEmail: customerInfo.email,
      customerWhatsApp: customerInfo.whatsappNumber,
      products: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        months: item.months,
      })),
      totalAmount,
      paymentReceipt,
    })

    return NextResponse.json({ 
      success: true, 
      orderNumber: order.orderNumber,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      }
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Fetch orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
