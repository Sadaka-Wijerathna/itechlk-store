export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as staticProducts } from '@/lib/products'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { isPopular: 'desc' },
        { name: 'asc' },
      ],
    })

    // Calculate average rating for each product
    const productsWithRatings = products.map((product) => {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = product.reviews.length > 0 
        ? totalRating / product.reviews.length 
        : 0

      // Find static product to get default rating if no reviews exist
      const staticProduct = staticProducts.find(p => p.slug === product.slug)
      const finalRating = averageRating > 0 ? averageRating : (staticProduct?.rating || 0)
      const finalReviewCount = product.reviews.length > 0 ? product.reviews.length : (staticProduct?.reviews || 0)

      return {
        ...product,
        rating: finalRating,
        reviewCount: finalReviewCount,
        reviews: undefined, // Remove reviews array from response
      }
    })

    return NextResponse.json({ products: productsWithRatings })
  } catch (error) {
    console.error('Fetch products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
