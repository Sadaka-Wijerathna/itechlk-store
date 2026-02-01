import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { WhatsAppFAB } from '@/components/WhatsAppFAB'
import { ScrollProgress } from '@/components/ScrollProgress'
import { BackToTop } from '@/components/BackToTop'
import { Providers } from '@/components/Providers'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.itechlk.store'),
  title: {
    default: 'iTechLK Store - Premium Accounts at Affordable Prices',
    template: '%s | iTechLK Store',
  },
  description: 'Get premium subscriptions for Netflix, ChatGPT Plus, Canva Pro, Picsart Gold, and more at the best prices in Sri Lanka. Fast delivery, secure payments, and 24/7 support.',
  keywords: [
    'premium accounts sri lanka',
    'netflix sri lanka',
    'chatgpt plus sri lanka',
    'canva pro sri lanka',
    'picsart gold',
    'cheap subscriptions',
    'premium subscriptions',
    'digital products sri lanka',
    'streaming accounts',
    'ai tools sri lanka',
  ],
  authors: [{ name: 'iTechLK Store' }],
  creator: 'iTechLK Store',
  publisher: 'iTechLK Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.itechlk.store',
    siteName: 'iTechLK Store',
    title: 'iTechLK Store - Premium Accounts at Affordable Prices',
    description: 'Get premium subscriptions for Netflix, ChatGPT Plus, Canva Pro, and more at the best prices in Sri Lanka. Fast delivery, secure payments, and 24/7 support.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'iTechLK Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iTechLK Store - Premium Accounts at Affordable Prices',
    description: 'Get premium subscriptions for Netflix, ChatGPT Plus, Canva Pro, and more at the best prices in Sri Lanka.',
    images: ['/logo.png'],
    creator: '@itechlkstore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/logo.png', sizes: '180x180' },
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ScrollProgress />
          {children}
          <WhatsAppFAB />
          <BackToTop />
          <SpeedInsights />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
