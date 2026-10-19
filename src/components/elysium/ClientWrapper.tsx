"use client";

import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { AgeGate } from '@/components/elysium/AgeGate';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (localStorage.getItem('ageVerified') === 'true') {
      setIsVerified(true);
    }
  }, []);

  const handleVerification = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsVerified(true);
  };

  // Avoid hydration mismatch — render nothing until client mounts
  if (!isClient) {
    return null;
  }

  return (
    <>
      {isVerified ? (
        <>
          {children}
          <Toaster />
        </>
      ) : (
        <AgeGate onVerify={handleVerification} />
      )}
    </>
  );
}
