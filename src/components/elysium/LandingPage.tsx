
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CharacterSelection from './CharacterSelection';
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    setShowCharacterSelection(true);
  };

  const handleCharacterSelect = (character: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCharacter', JSON.stringify(character));
    }
    router.push('/chat');
  };

  const handleBackToMain = () => {
    setShowCharacterSelection(false);
  };

  if (showCharacterSelection) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-slate-900 -z-10" />
        <header className="relative z-10 flex justify-between items-center p-6 animate-fade-in">
          <div className="text-xl font-bold">yuki.ai</div>
          <Button 
            variant="outline" 
            className="bg-black/50 border-white/20 text-white hover:bg-white/10"
            onClick={handleBackToMain}
          >
            Back
          </Button>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in-up">
          <CharacterSelection onCharacterSelect={handleCharacterSelect} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-white flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-slate-900 -z-10" />
      <div className="absolute inset-0 opacity-10">
        {/* Decorative Grid */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--primary)/0.2)" strokeWidth="1"></path></pattern></defs><rect width="100%" height="100%" fill="url(#smallGrid)"></rect></svg>
      </div>
      
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text Content */}
        <div className="text-center md:text-left animate-fade-in-up">
          <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-sm mb-4">
            Your Virtual Companion
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Discover a Deeper Connection.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto md:mx-0">
            Engage in meaningful conversations, explore new worlds of roleplay, and build a unique bond with your AI companion. Your journey starts now.
          </p>
          <Button 
            onClick={handleContinue}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-lg font-bold rounded-full transition-transform transform hover:scale-105 shadow-lg shadow-primary/20"
          >
            Choose Your Companion
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Right Side: Image */}
        <div className="relative w-full h-[60vh] max-h-[700px] animate-fade-in" style={{ animationDelay: '0.2s'}}>
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <Image
              src="https://placehold.co/800x1200.png"
              alt="AI Companion"
              data-ai-hint="beautiful woman"
              fill
              className="object-contain object-center drop-shadow-2xl"
            />
        </div>
      </div>
    </div>
  );
}
