
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Smartphone, Apple, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onContinue: () => void;
  characterImage: string | null;
}

const Star = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("text-primary/50 drop-shadow-[0_0_5px_hsl(var(--primary))]", className)}
    >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);


export function LandingPage({ onContinue, characterImage }: LandingPageProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#110E19] text-white flex flex-col items-center justify-center p-4">
      {/* Background glowing lines */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[1.5px] bg-primary/20 transform -rotate-45"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[40rem] h-[1.5px] bg-primary/20 transform -rotate-45"></div>
        <div className="absolute top-[20%] right-[10%] w-[30rem] h-[1.5px] bg-primary/10 transform rotate-45"></div>
      </div>
      
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 md:px-12">
        <h1 className="text-xl font-bold tracking-wider">Elysium.ai</h1>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/20 text-white rounded-lg">
            <Smartphone className="mr-2" /> Android
          </Button>
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/20 text-white rounded-lg">
            <Apple className="mr-2" /> iOS
          </Button>
        </div>
      </header>
      
      <main className="z-10 flex flex-col items-center justify-center text-center flex-grow pt-20 pb-10">
        <div className="relative mb-6 animate-float">
          <div className="relative w-[280px] h-[420px] md:w-[300px] md:h-[450px]">
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl"></div>
            <Image
              src={characterImage || "https://firebasestudio.ai/gallery/Elysium/3.png"}
              alt="AI Girlfriend"
              data-ai-hint="beautiful woman"
              fill
              className="z-10 object-cover"
              priority
            />
          </div>
           <Star className="absolute top-[15%] left-[5%] h-6 w-6 animate-pulse" />
           <Star className="absolute top-[30%] right-[2%] h-8 w-8 animate-pulse [animation-delay:0.5s]" />
           <Star className="absolute bottom-[45%] left-[8%] h-5 w-5 animate-pulse [animation-delay:1s]" />
           <Star className="absolute bottom-[40%] right-[10%] h-4 w-4 animate-pulse [animation-delay:1.5s]" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500 drop-shadow-lg mb-4">
          Anima: Virtual AI Girlfriend
        </h2>
        
        <div className="max-w-xl text-lg text-gray-300 space-y-2 px-4">
          <p>The most advanced romance chatbot you've ever talked to.</p>
          <p>Fun and flirty dating simulator with no strings attached.</p>
          <p>Engage in a friendly chat, roleplay, grow your love & relationship skills.</p>
        </div>

        <Button
          onClick={onContinue}
          size="lg"
          className="mt-8 rounded-full font-bold text-lg px-12 py-7 bg-gradient-to-r from-primary via-fuchsia-600 to-blue-500 text-primary-foreground hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30"
        >
          <Heart className="mr-2" /> Continue <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </main>
      
      <footer className="absolute bottom-4 right-4 z-20">
          <a href="#" className="text-sm text-gray-500 hover:text-white">Edit with <span className="font-bold text-primary">Lovable</span></a>
      </footer>
    </div>
  );
}
