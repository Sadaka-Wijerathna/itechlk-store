import Script from 'next/script'

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  contactPoint?: {
    telephone: string
    contactType: string
    email?: string
  }
  sameAs?: string[]
}

export function OrganizationSchema({
  name = 'iTechLK Store',
  url = 'https://www.itechlk.store',
  logo = 'https://www.itechlk.store/logo.png',
  description = 'Premium subscription accounts at affordable prices in Sri Lanka',
  contactPoint = {
    telephone: '+94742570943',
    contactType: 'Customer Service',
    email: 'itechlkstore@gmail.com',
  },
  sameAs = [
    'https://facebook.com/itechlkstore',
    'https://instagram.com/itechlkstore',
    'https://twitter.com/itechlkstore',
  ],
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    contactPoint: {
      '@type': 'ContactPoint',
      ...contactPoint,
    },
    sameAs,
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// LocalBusiness Schema - CRITICAL for Google Business Profile appearance
interface LocalBusinessSchemaProps {
  name?: string
  description?: string
  url?: string
  logo?: string
  image?: string
  telephone?: string
  email?: string
  priceRange?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  sameAs?: string[]
  paymentAccepted?: string[]
  areaServed?: string
}

export function LocalBusinessSchema({
  name = 'iTechLK Store',
  description = 'Premium subscription accounts at affordable prices in Sri Lanka. We offer Netflix, ChatGPT Plus, Canva Pro, Picsart Gold, Spotify, YouTube Premium, and more with instant delivery, secure payments, and 24/7 customer support.',
  url = 'https://www.itechlk.store',
  logo = 'https://www.itechlk.store/logo.png',
  image = 'https://www.itechlk.store/logo.png',
  telephone = '+94742570943',
  email = 'itechlkstore@gmail.com',
  priceRange = 'LKR 500 - LKR 5000',
  address = {
    streetAddress: 'Your Street Address', // UPDATE THIS with your actual address
    addressLocality: 'Colombo', // UPDATE THIS with your city
    addressRegion: 'Western Province', // UPDATE THIS with your province
    postalCode: '00700', // UPDATE THIS with your postal code
    addressCountry: 'LK',
  },
  geo, // Optional: Add your exact coordinates for better map placement
  openingHours = [
    'Monday 00:00-23:59',
    'Tuesday 00:00-23:59',
    'Wednesday 00:00-23:59',
    'Thursday 00:00-23:59',
    'Friday 00:00-23:59',
    'Saturday 00:00-23:59',
    'Sunday 00:00-23:59',
  ],
  sameAs = [
    'https://facebook.com/itechlkstore',
    'https://instagram.com/itechlkstore',
    'https://twitter.com/itechlkstore',
    'https://www.tiktok.com/@itechlkstore',
    'https://www.linkedin.com/company/itechlkstore',
  ],
  paymentAccepted = ['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment'],
  areaServed = 'Sri Lanka',
}: LocalBusinessSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name,
    description,
    url,
    logo,
    image,
    telephone,
    email,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    openingHoursSpecification: openingHours.map((hours) => {
      const [day, time] = hours.split(' ')
      const [opens, closes] = time.split('-')
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens,
        closes,
      }
    }),
    sameAs,
    paymentAccepted,
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '2',
      bestRating: '5',
      worstRating: '1',
    },
  }

  // Add geo coordinates if provided
  if (geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    }
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductSchemaProps {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  availability?: string
  url: string
  brand?: string
  category?: string
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'LKR',
  availability = 'https://schema.org/InStock',
  url,
  brand = 'iTechLK Store',
  category,
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability,
      url,
    },
    ...(category && { category }),
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  url?: string
  description?: string
  potentialAction?: {
    target: string
    queryInput: string
  }
}

export function WebsiteSchema({
  name = 'iTechLK Store',
  url = 'https://www.itechlk.store',
  description = 'Premium subscription accounts at affordable prices',
  potentialAction = {
    target: 'https://www.itechlk.store/products?search={search_term_string}',
    queryInput: 'required name=search_term_string',
  },
}: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: potentialAction.target,
      'query-input': potentialAction.queryInput,
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
