import type { Metadata, Viewport } from 'next'
 
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07050e',
};

export const metadata: Metadata = {
  title: {
    default: 'Evermate - Your Perfect AI Girlfriend & Virtual Companion',
    template: '%s | Evermate - AI Girlfriend Chat'
  },
  description: 'Meet Evermate, your ideal AI girlfriend and virtual companion. Experience intimate conversations, emotional support, and personalized AI girlfriend chat. Free AI companion with advanced personality.',
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
  authors: [{ name: 'Evermate Team' }],
  creator: 'Evermate',
  publisher: 'Evermate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://evermateai.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Evermate',
    title: 'Evermate - Your Perfect AI Girlfriend & Virtual Companion',
    description: 'Experience the future of AI relationships with Evermate. Your personalized AI girlfriend ready for meaningful conversations and emotional connection.',
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evermate - Your Perfect AI Girlfriend',
    description: 'Meet your ideal AI girlfriend. Intimate conversations, emotional support, and personalized virtual companion experience.',
    images: [],
    creator: '@evermate',
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
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
}