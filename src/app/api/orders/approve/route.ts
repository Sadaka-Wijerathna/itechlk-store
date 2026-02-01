import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Enable edge runtime for faster cold starts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('📥 Approve API called')
  
  try {
    const body = await request.json()
    console.log('📦 Request body:', body)
    
    const { orderNumber, action } = body

    if (!orderNumber || !action) {
      console.error('❌ Missing orderNumber or action')
      return NextResponse.json(
        { success: false, error: 'Missing orderNumber or action' },
        { status: 400 }
      )
    }

    console.log(`🔍 Finding order: ${orderNumber}`)
    
    // Find the order with optimized query (only fetch needed fields)
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        status: true,
        items: {
          select: {
            id: true,
            productId: true,
            months: true,
            product: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      },
    })

    if (!order) {
      console.error(`❌ Order not found: ${orderNumber}`)
      return NextResponse.json(
        { success: false, error: 'Order not found' }, 
        { status: 404 }
      )
    }

    console.log(`✅ Order found: ${order.id}, Status: ${order.status}`)

    // Check if order is already processed
    if (order.status === 'COMPLETED' && action === 'approve') {
      console.log('⚠️ Order already approved')
      return NextResponse.json({
        success: true,
        message: 'Order already approved',
        order: {
          orderNumber: order.orderNumber,
          status: 'COMPLETED',
        },
        alreadyProcessed: true,
      })
    }

    if (order.status === 'CANCELLED' && action === 'reject') {
      console.log('⚠️ Order already rejected')
      return NextResponse.json({
        success: true,
        message: 'Order already rejected',
        order: {
          orderNumber: order.orderNumber,
          status: 'CANCELLED',
        },
        alreadyProcessed: true,
      })
    }

    if (action === 'approve') {
      console.log('✅ Approving order...')
      
      // Use transaction for atomic operations
      const result = await prisma.$transaction(async (tx) => {
        // Update order status
        const updatedOrder = await tx.order.update({
          where: { orderNumber },
          data: {
            status: 'COMPLETED',
            verifiedAt: new Date(),
          },
        })

        console.log('📝 Creating subscriptions in parallel...')
        
        // Create all subscriptions in parallel for better performance
        const subscriptionPromises = order.items.map(async (item) => {
          const startDate = new Date()
          const endDate = new Date()
          endDate.setMonth(endDate.getMonth() + item.months)

          return tx.subscription.create({
            data: {
              userId: order.userId,
              productId: item.productId,
              orderId: order.id,
              startDate,
              endDate,
              isActive: true,
            },
          })
        })

        const subscriptions = await Promise.all(subscriptionPromises)
        
        console.log(`✅ Created ${subscriptions.length} subscriptions in parallel`)
        
        return { updatedOrder, subscriptions }
      })

      const duration = Date.now() - startTime
      console.log(`✅ Order approved successfully in ${duration}ms. Created ${result.subscriptions.length} subscriptions`)

      return NextResponse.json({
        success: true,
        message: 'Order approved and subscriptions created',
        order: {
          orderNumber: order.orderNumber,
          status: 'COMPLETED',
        },
        subscriptions: result.subscriptions.length,
        processingTime: `${duration}ms`,
      })
    } else if (action === 'reject') {
      console.log('❌ Rejecting order...')
      
      // Simple update for rejection
      await prisma.order.update({
        where: { orderNumber },
        data: {
          status: 'CANCELLED',
        },
      })

      const duration = Date.now() - startTime
      console.log(`✅ Order rejected successfully in ${duration}ms`)

      return NextResponse.json({
        success: true,
        message: 'Order rejected',
        order: {
          orderNumber: order.orderNumber,
          status: 'CANCELLED',
        },
        processingTime: `${duration}ms`,
      })
    }

    console.error(`❌ Invalid action: ${action}`)
    return NextResponse.json(
      { success: false, error: 'Invalid action' }, 
      { status: 400 }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ Order approval error after ${duration}ms:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process order',
        processingTime: `${duration}ms`,
      },
      { status: 500 }
    )
  }
}
