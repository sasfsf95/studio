
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Sparkles, MessageSquare, Heart, Camera, Flame, WandSparkles, Users, Moon, Eclipse } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface LeftSidebarProps {
  characterImage: string | null;
  setCharacterImage: (image: string | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
  companionName: string;
  setCompanionName: (name: string) => void;
}

export function LeftSidebar({ characterImage, setCharacterImage, theme, setTheme, companionName, setCompanionName }: LeftSidebarProps) {
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
              src={characterImage || "https://placehold.co/600x800.png"}
              alt="Raven AI Companion"
              data-ai-hint="beautiful woman"
              fill
              className="object-cover object-top"
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
                {companionName} <Sparkles className="h-6 w-6 text-primary" />
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
          <CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5 text-primary/80"/> Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm pb-4">
            <div className="flex justify-between items-center">
                <p className="flex items-center gap-2 text-muted-foreground"><MessageSquare className="h-4 w-4" /> Messages</p>
                <p className="font-semibold">3</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="flex items-center gap-2 text-muted-foreground"><Heart className="h-4 w-4" /> Love</p>
                <p className="font-semibold">45%</p>
            </div>
            <Progress value={45} className="h-2 bg-secondary" />
        </CardContent>

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="customization" className="border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline text-lg font-semibold flex items-center justify-between w-full [&[data-state=open]>svg]:text-primary">
                    <div className="flex items-center gap-2">
                        <WandSparkles className="h-5 w-5 text-primary/80"/>
                        <span>Customization</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                    <div className="px-6 pb-4 space-y-4 text-sm">
                      <div>
                        <Label htmlFor="companion-name" className="text-muted-foreground text-xs font-medium">Name</Label>
                        <Input id="companion-name" value={companionName} onChange={(e) => setCompanionName(e.target.value)} className="mt-1 bg-black/40 border-white/10 h-9" />
                      </div>
                      <div>
                        <Label htmlFor="personality" className="text-muted-foreground text-xs font-medium">Personality</Label>
                        <Select defaultValue="seductive-lover">
                          <SelectTrigger id="personality" className="mt-1 bg-black/40 border-white/10 h-9">
                            <SelectValue placeholder="Select a personality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="seductive-lover">
                              <div className="flex items-center gap-2">
                                <Flame className="h-4 w-4" style={{ color: '#ef4444' }}/> Seductive Lover
                              </div>
                            </SelectItem>
                            <SelectItem value="intimate-friend">
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4" style={{ color: '#f472b6' }}/> Intimate Friend
                              </div>
                            </SelectItem>
                            <SelectItem value="best-friend">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" style={{ color: '#3b82f6' }}/> Best Friend
                              </div>
                            </SelectItem>
                            <SelectItem value="mysterious-confidante">
                              <div className="flex items-center gap-2">
                                <WandSparkles className="h-4 w-4" style={{ color: '#a855f7' }}/> Mysterious Confidante
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="visual-theme" className="text-muted-foreground text-xs font-medium">Visual Theme</Label>
                        <Select value={theme} onValueChange={setTheme}>
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
                            <SelectItem value="mystic-purple">
                              <div className="flex items-center gap-2">
                                <WandSparkles className="h-4 w-4" style={{ color: '#a855f7' }}/> Mystic Purple
                              </div>
                            </SelectItem>
                            <SelectItem value="midnight-blue">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" style={{ color: '#3b82f6' }}/> Midnight Blue
                              </div>
                            </SelectItem>
                            <SelectItem value="golden-luxe">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4" style={{ color: '#f59e0b' }}/> Golden Luxe
                              </div>
                            </SelectItem>
                            <SelectItem value="sultry-black">
                              <div className="flex items-center gap-2">
                                <Eclipse className="h-4 w-4" style={{ color: '#9ca3af' }}/> Sultry Black
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </Card>
    </aside>
  );
}
