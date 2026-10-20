import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientWrapper } from '@/components/elysium/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07050e',
};

export const metadata: Metadata = {
  title: 'Girl.ai - Your Perfect AI Girlfriend & Virtual Companion',
  description:
    'Meet Girl.ai, your ideal AI girlfriend and virtual companion. Experience intimate conversations, emotional support, and personalized AI girlfriend chat. Free AI companion with advanced personality.',
  keywords:
    'AI girlfriend, virtual girlfriend, AI companion, AI chat, virtual companion, AI relationship, digital girlfriend, AI dating, virtual dating, emotional AI',
  robots: 'index, follow',
  openGraph: {
    title: 'Girl.ai - Your Perfect AI Girlfriend & Virtual Companion',
    description:
      'Experience the future of AI relationships with Girl.ai. Your personalized AI girlfriend ready for meaningful conversations and emotional connection.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Girl.ai - Your Perfect AI Girlfriend',
    description:
      'Meet your ideal AI girlfriend. Intimate conversations, emotional support, and personalized virtual companion experience.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#07050e" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Girl.ai',
              description:
                'AI girlfriend and virtual companion for intimate conversations and emotional support',
              applicationCategory: 'Lifestyle',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground h-full w-full overflow-x-hidden min-h-screen min-h-[100dvh]`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
