export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
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

    // Fetch user's orders with items and products
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Get last 10 orders
    })

    // Transform the data for frontend
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      total: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentReceipt: order.paymentReceipt,
      invoicePdf: order.invoicePdf,
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        months: item.months,
        price: item.price,
      })),
    }))

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
