import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Add YouTube Premium
    const youtubeProduct = await prisma.product.upsert({
      where: { slug: 'youtube-premium' },
      update: {
        name: 'YouTube Premium',
        description: 'Ad-free YouTube with background play and downloads',
        price: 400,
        duration: 1,
        availableMonths: [1],
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Youtube_logo.png/1200px-Youtube_logo.png',
        category: 'Entertainment',
        features: ['Ad-free Videos', 'Background Play', 'Offline Downloads', 'YouTube Music Premium'],
        stock: 100,
        isActive: true,
        isPopular: true,
        requiresAge: false,
      },
      create: {
        name: 'YouTube Premium',
        slug: 'youtube-premium',
        description: 'Ad-free YouTube with background play and downloads',
        price: 400,
        duration: 1,
        availableMonths: [1],
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Youtube_logo.png/1200px-Youtube_logo.png',
        category: 'Entertainment',
        features: ['Ad-free Videos', 'Background Play', 'Offline Downloads', 'YouTube Music Premium'],
        stock: 100,
        isActive: true,
        isPopular: true,
        requiresAge: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'YouTube Premium added successfully',
      product: youtubeProduct,
    })
  } catch (error) {
    console.error('Error adding YouTube Premium:', error)
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    )
  }
}
