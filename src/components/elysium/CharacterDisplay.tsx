import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export function CharacterDisplay() {
  return (
    <div className="relative w-full h-full">
      <Image
        src="https://placehold.co/800x1200.png"
        alt="Raven AI Companion"
        data-ai-hint="beautiful dark hair woman"
        fill
        className="object-cover opacity-50"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_40px_15px_hsl(var(--primary)/0.2)]" />
      <div className="absolute bottom-0 left-0 w-full p-8 text-center flex flex-col items-center justify-center">
         <h2 className="text-4xl font-bold text-foreground flex items-center gap-2 justify-center">
          Raven <Sparkles className="w-6 h-6 text-primary" />
        </h2>
        <p className="text-lg text-muted-foreground mt-2">Your Intimate AI Companion</p>
         <div className="mt-3 flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-md text-green-400">Online & Ready</p>
        </div>
      </div>
    </div>
  );
}
