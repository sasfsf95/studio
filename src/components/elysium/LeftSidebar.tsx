"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Sparkles, MessageSquare, Heart, Camera, Flame } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface LeftSidebarProps {
  characterImage: string | null;
  setCharacterImage: (image: string | null) => void;
}

export function LeftSidebar({ characterImage, setCharacterImage }: LeftSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  
  return (
    <aside className="w-[360px] bg-black/30 p-4 flex flex-col space-y-6 border-r border-white/5 overflow-y-auto">
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
                Aria <Sparkles className="h-6 w-6 text-primary" />
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
          <CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5 text-primary/80"/> Details &amp; Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
                <p className="flex items-center gap-2 text-muted-foreground"><MessageSquare className="h-4 w-4" /> Messages</p>
                <p className="font-semibold">3</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="flex items-center gap-2 text-muted-foreground"><Heart className="h-4 w-4" /> Love</p>
                <p className="font-semibold">45%</p>
            </div>
            <Progress value={45} className="h-2 bg-secondary" />

            <Separator className="!my-6 bg-white/10" />

            <div>
              <Label htmlFor="companion-name" className="text-muted-foreground text-xs font-medium">Name</Label>
              <Input id="companion-name" defaultValue="Aria" className="mt-1 bg-black/40 border-white/10 h-9" />
            </div>
            <div>
              <Label htmlFor="personality" className="text-muted-foreground text-xs font-medium">Personality</Label>
              <Select defaultValue="romantic-pink">
                <SelectTrigger id="personality" className="mt-1 bg-black/40 border-white/10 h-9">
                  <SelectValue placeholder="Select a personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romantic-pink">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" style={{ color: '#f472b6' }}/> Romantic Pink
                    </div>
                  </SelectItem>
                  <SelectItem value="seductive-red">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4" style={{ color: '#ef4444' }}/> Seductive Red
                    </div>
                  </SelectItem>
                  <SelectItem value="dreamy-purple">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" style={{ color: '#a855f7' }}/> Dreamy Purple
                    </div>
                  </SelectItem>
                  <SelectItem value="elegant-dark">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" style={{ color: '#9ca3af' }}/> Elegant Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="fantasy-gold">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" style={{ color: '#eab308' }}/> Fantasy Gold
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="visual-theme" className="text-muted-foreground text-xs font-medium">Visual Theme</Label>
              <Select defaultValue="romantic-pink">
                <SelectTrigger id="visual-theme" className="mt-1 bg-black/40 border-white/10 h-9">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romantic-pink">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" style={{ color: '#f472b6' }}/> Romantic Pink
                    </div>
                  </SelectItem>
                   <SelectItem value="seductive-red">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4" style={{ color: '#ef4444' }}/> Seductive Red
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
        </CardContent>
      </Card>
    </aside>
  );
}
