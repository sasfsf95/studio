
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

interface AgeGateProps {
  onVerify: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps) {
  const [showExitMessage, setShowExitMessage] = useState(false);

  const handleExit = () => {
    setShowExitMessage(true);
    // Optionally redirect after a delay
    // setTimeout(() => { window.location.href = 'https://www.google.com'; }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <Card className="w-full max-w-md m-4 bg-card border-border shadow-2xl shadow-primary/20 animate-message-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Age Verification</CardTitle>
          <CardDescription>
            This application contains content that is intended for individuals who are 18 years of age or older. Please verify your age to continue.
          </CardDescription>
        </CardHeader>
        {showExitMessage ? (
            <CardContent>
                <div className="text-center text-muted-foreground p-8">
                    <p>You must be 18 or older to access this content.</p>
                </div>
            </CardContent>
        ) : (
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleExit}
              >
                Exit
              </Button>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={onVerify}
              >
                I am 18 or Older
              </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
