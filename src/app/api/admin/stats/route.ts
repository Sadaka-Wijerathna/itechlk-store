export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get total revenue from completed orders
    const completedOrders = await prisma.order.findMany({
      where: { status: 'COMPLETED' },
      select: { totalAmount: true },
    })

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    )

    // Get total orders count
    const totalOrders = await prisma.order.count()

    // Get completed orders count
    const completedOrdersCount = await prisma.order.count({
      where: { status: 'COMPLETED' },
    })

    // Get pending orders count
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' },
    })

    // Get total customers
    const totalCustomers = await prisma.user.count()

    // Get active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { isActive: true },
    })

    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    })

    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const revenueByMonth = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    })

    // Group revenue by month
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monthlyRevenue = revenueByMonth.reduce((acc: any, order) => {
      const month = order.createdAt.toISOString().slice(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = 0
      }
      acc[month] += order.totalAmount
      return acc
    }, {})

    // Get top selling products (only from COMPLETED orders)
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: 'COMPLETED',
        },
      },
      _count: true,
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    })

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true },
        })
        return {
          productId: item.productId,
          name: product?.name || 'Unknown',
          sales: item._sum.quantity || 0,
          revenue: (item._sum.quantity || 0) * (product?.price || 0),
        }
      })
    )

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        completedOrders: completedOrdersCount,
        pendingOrders,
        totalCustomers,
        activeSubscriptions,
        ordersByStatus,
        monthlyRevenue,
        topProducts: topProductsWithDetails,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
