
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4">
      {/* Ambient background glowing spots */}
      <div className="bg-glow-spot top-1/3 left-1/3 z-0"></div>
      
      <Card className="w-full max-w-md liquid-glass-modal rounded-3xl border border-white/20 shadow-2xl animate-message-in relative z-10 p-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 backdrop-blur-md">
              <ShieldAlert className="h-12 w-12 text-pink-400 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500">Age Verification</CardTitle>
          <CardDescription className="text-gray-300 text-sm mt-2">
            This application contains content that is intended for individuals who are 18 years of age or older. Please verify your age to continue.
          </CardDescription>
        </CardHeader>
        {showExitMessage ? (
            <CardContent>
                <div className="text-center text-gray-300 p-8 liquid-glass rounded-2xl border border-white/10">
                    <p className="font-semibold">You must be 18 or older to access this content.</p>
                </div>
            </CardContent>
        ) : (
            <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                variant="outline"
                className="w-full h-12 liquid-glass border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                onClick={handleExit}
              >
                Exit
              </Button>
              <Button
                className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 border border-white/20 transition-all duration-300"
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
