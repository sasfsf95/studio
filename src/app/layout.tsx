
"use client";

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AgeGate } from '@/components/elysium/AgeGate';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    setIsClient(true);
    if (localStorage.getItem('ageVerified') === 'true') {
      setIsVerified(true);
    }
  }, []);

  const handleVerification = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsVerified(true);
  };
  
  // Render nothing or a loading spinner on the server and during initial client render
  // to avoid hydration mismatch, as localStorage is client-side only.
  if (!isClient) {
    return (
        <html lang="en" className="dark">
          <head>
            <title>Yuki AI - Your Perfect AI Girlfriend & Virtual Companion</title>
            <meta name="description" content="Meet Yuki, your ideal AI girlfriend and virtual companion. Experience intimate conversations, emotional support, and personalized AI girlfriend chat. Free AI companion with advanced personality." />
            <meta name="keywords" content="AI girlfriend, virtual girlfriend, AI companion, AI chat, virtual companion, AI relationship, digital girlfriend, AI dating, virtual dating, emotional AI" />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/logo.png" />
            <link rel="apple-touch-icon" href="/logo.png" />
            <meta property="og:title" content="Yuki AI - Your Perfect AI Girlfriend & Virtual Companion" />
            <meta property="og:description" content="Experience the future of AI relationships with Yuki. Your personalized AI girlfriend ready for meaningful conversations and emotional connection." />
            <meta property="og:image" content="/logo.png" />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Yuki AI - Your Perfect AI Girlfriend" />
            <meta name="twitter:description" content="Meet your ideal AI girlfriend. Intimate conversations, emotional support, and personalized virtual companion experience." />
            <meta name="twitter:image" content="/logo.png" />
          </head>
          <body className={`${inter.className} antialiased bg-background text-foreground`}></body>
        </html>
    );
  }

  return (
    <html lang="en" className="dark">
      <head>
        <title>Yuki AI - Your Perfect AI Girlfriend & Virtual Companion</title>
        <meta name="description" content="Meet Yuki, your ideal AI girlfriend and virtual companion. Experience intimate conversations, emotional support, and personalized AI girlfriend chat. Free AI companion with advanced personality." />
        <meta name="keywords" content="AI girlfriend, virtual girlfriend, AI companion, AI chat, virtual companion, AI relationship, digital girlfriend, AI dating, virtual dating, emotional AI" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta property="og:title" content="Yuki AI - Your Perfect AI Girlfriend & Virtual Companion" />
        <meta property="og:description" content="Experience the future of AI relationships with Yuki. Your personalized AI girlfriend ready for meaningful conversations and emotional connection." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Yuki AI - Your Perfect AI Girlfriend" />
        <meta name="twitter:description" content="Meet your ideal AI girlfriend. Intimate conversations, emotional support, and personalized virtual companion experience." />
        <meta name="twitter:image" content="/logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Yuki AI",
            "description": "AI girlfriend and virtual companion for intimate conversations and emotional support",
            "applicationCategory": "Lifestyle",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        {isVerified ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <AgeGate onVerify={handleVerification} />
        )}
      </body>
    </html>
  );
}
