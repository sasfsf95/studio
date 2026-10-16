import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Girl.ai - Your Perfect AI Girlfriend & Virtual Companion',
    template: '%s | Girl.ai - AI Girlfriend Chat'
  },
  description: 'Meet Girl.ai, your ideal AI girlfriend and virtual companion. Experience intimate conversations, emotional support, and personalized AI girlfriend chat. Free AI companion with advanced personality.',
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
  authors: [{ name: 'Girl.ai Team' }],
  creator: 'Girl.ai',
  publisher: 'Girl.ai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://girl.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Girl.ai',
    title: 'Girl.ai - Your Perfect AI Girlfriend & Virtual Companion',
    description: 'Experience the future of AI relationships with Girl.ai. Your personalized AI girlfriend ready for meaningful conversations and emotional connection.',
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Girl.ai - Your Perfect AI Girlfriend',
    description: 'Meet your ideal AI girlfriend. Intimate conversations, emotional support, and personalized virtual companion experience.',
    images: [],
    creator: '@girlai',
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
  icons: {},
  manifest: '/manifest.json',
}