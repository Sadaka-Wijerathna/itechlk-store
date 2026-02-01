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
