export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const data = await request.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.price = parseFloat(data.price)
    if (data.duration !== undefined) updateData.duration = parseInt(data.duration)
    if (data.availableMonths !== undefined) updateData.availableMonths = data.availableMonths
    if (data.image !== undefined) updateData.image = data.image
    if (data.category !== undefined) updateData.category = data.category
    if (data.features !== undefined) updateData.features = data.features
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock)
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.isPopular !== undefined) updateData.isPopular = data.isPopular
    if (data.requiresAge !== undefined) updateData.requiresAge = data.requiresAge

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
