import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Yuki AI - Your Perfect AI Girlfriend & Virtual Companion',
    template: '%s | Yuki AI - AI Girlfriend Chat'
  },
  description: 'Meet Yuki, your ideal AI girlfriend and virtual companion. Experience intimate conversations, emotional support, and personalized AI girlfriend chat. Free AI companion with advanced personality.',
  keywords: [
    'AI girlfriend',
    'virtual girlfriend', 
    'AI companion',
    'AI chat',
    'virtual companion',
    'AI relationship',
    'digital girlfriend',
    'AI dating',
    'virtual dating',
    'emotional AI',
    'AI chatbot girlfriend',
    'virtual relationship',
    'AI romance',
    'digital companion',
    'AI partner'
  ],
  authors: [{ name: 'Yuki AI Team' }],
  creator: 'Yuki AI',
  publisher: 'Yuki AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yuki.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Yuki AI',
    title: 'Yuki AI - Your Perfect AI Girlfriend & Virtual Companion',
    description: 'Experience the future of AI relationships with Yuki. Your personalized AI girlfriend ready for meaningful conversations and emotional connection.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Yuki AI - Virtual Girlfriend Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yuki AI - Your Perfect AI Girlfriend',
    description: 'Meet your ideal AI girlfriend. Intimate conversations, emotional support, and personalized virtual companion experience.',
    images: ['/logo.png'],
    creator: '@yukiai',
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
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}