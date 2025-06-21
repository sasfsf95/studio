"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, Sparkles, MessageSquare, Heart, Camera, Palette } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface LeftSidebarProps {
  characterImage: string | null;
  setCharacterImage: (image: string | null) => void;
}

export function LeftSidebar({ characterImage, setCharacterImage }: LeftSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTheme, setActiveTheme] = useState('default');


  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setCharacterImage(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const themes = [
    { name: 'default', color: 'bg-primary' },
    { name: 'sunset', color: 'bg-gradient-to-br from-orange-400 to-rose-500' },
    { name: 'forest', color: 'bg-gradient-to-br from-green-400 to-teal-600' },
    { name: 'ocean', color: 'bg-gradient-to-br from-blue-400 to-indigo-600' }
  ];

  return (
    <aside className="w-[360px] bg-black/30 p-4 flex flex-col space-y-6 border-r border-white/5">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-400" />
          <h1 className="text-lg font-semibold text-foreground tracking-wider">Premium Experience</h1>
        </div>
        <Button size="sm" className="font-bold bg-primary text-primary-foreground rounded-full px-5 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-opacity">
          VIP
        </Button>
      </header>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-primary to-fuchsia-800 shadow-2xl shadow-primary/30">
           <div className="relative h-[320px] w-[240px] rounded-2xl overflow-hidden">
            <Image
              src={characterImage || "https://placehold.co/400x600.png"}
              alt="Raven AI Companion"
              data-ai-hint="beautiful dark hair woman"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-yellow-300 text-xs font-bold py-1 px-2 rounded-full border border-yellow-300/30">
                    <Sparkles className="h-4 w-4" />
                    PREMIUM
                </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button onClick={handleCameraClick} size="icon" variant="secondary" className="absolute top-3 right-3 h-9 w-9 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                <Camera className="h-5 w-5" />
            </Button>
           </div>
        </div>

        <div className="text-center">
            <h2 className="text-3xl font-bold flex items-center gap-2">
                Raven <Sparkles className="h-6 w-6 text-primary" />
            </h2>
            <p className="text-muted-foreground">Your Intimate AI Companion</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-green-400">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <p className="text-sm font-medium">Online & Ready</p>
            </div>
        </div>
      </div>
      
      <Card className="bg-card/80 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5 text-primary/80"/> Relationship Stats</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <p className="flex items-center gap-2 text-muted-foreground"><MessageSquare className="h-4 w-4" /> Messages</p>
                  <p className="font-semibold">3</p>
              </div>
              <div className="flex justify-between items-center">
                  <p className="flex items-center gap-2 text-muted-foreground"><Heart className="h-4 w-4" /> Love</p>
                  <p className="font-semibold">45%</p>
              </div>
              <Progress value={45} className="h-2 bg-secondary" />
            </div>

            <div className="border-t border-border/50 my-4" />

            <div>
              <p className="flex items-center gap-2 text-muted-foreground mb-3"><Palette className="h-4 w-4" /> Themes</p>
              <div className="flex items-center gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setActiveTheme(theme.name)}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all p-0.5",
                      "focus:outline-none ring-offset-background ring-offset-black/50 ring-offset-2 focus-visible:ring-2",
                      activeTheme === theme.name ? 'ring-2 ring-primary scale-110' : 'ring-0'
                    )}
                    aria-label={`Select ${theme.name} theme`}
                  >
                    <div className={cn("h-full w-full rounded-full", theme.color)} />
                  </button>
                ))}
              </div>
            </div>
        </CardContent>
      </Card>
    </aside>
  );
}
