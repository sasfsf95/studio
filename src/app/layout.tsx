
"use client";

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AgeGate } from '@/components/elysium/AgeGate';

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
            <title>yuki.ai</title>
            <meta name="description" content="Yuki: Virtual AI Companion" />
          </head>
          <body className="antialiased bg-background text-foreground"></body>
        </html>
    );
  }

  return (
    <html lang="en" className="dark">
      <head>
        <title>yuki.ai</title>
        <meta name="description" content="Yuki: Virtual AI Companion" />
      </head>
      <body className="antialiased bg-background text-foreground">
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
