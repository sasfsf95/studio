
"use client";

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Loader2, Sparkles, Menu, PartyPopper } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('romantic-pink');
  const [companionName, setCompanionName] = useState('Aria');
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      const isAlreadyPremium = localStorage.getItem('isPremium') === 'true';
      if (!isAlreadyPremium) {
        localStorage.setItem('isPremium', 'true');
        toast({
            title: "Welcome to Premium!",
            description: (
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-5 w-5 text-primary" />
                  <span>You now have unlimited access. Enjoy!</span>
                </div>
            ),
        });
        // We do a full page reload to ensure all components re-read from localStorage
        window.location.assign('/chat');
      } else {
         // If they are already premium and land here, just clean the URL
         router.replace('/chat', { scroll: false });
      }
    }
  }, [searchParams, router, toast]);

  useEffect(() => {
    // This code runs on the client, so window and localStorage are available.
    try {
      const storedCharacter = localStorage.getItem('selectedCharacter');
      if (storedCharacter) {
        const character = JSON.parse(storedCharacter);
        setCharacterImage(character.image || '/character.jpg');
        setTheme(character.theme || 'romantic-pink');
        setCompanionName(character.name || 'Aria');
      } else {
        // If no character is selected, redirect to home page to choose one.
        router.push('/');
        return;
      }
    } catch (error) {
        console.error("Failed to parse character from localStorage", error);
        // Fallback to default if parsing fails and redirect
        router.push('/');
        return;
    }
    // Simulate a longer loading time for the new screen to be visible
    setTimeout(() => setIsReady(true), 1500);
  }, [router]);

  useEffect(() => {
    // Don't save to localStorage until the initial character has been loaded.
    if (!isReady) return;

    try {
      const storedCharacter = localStorage.getItem('selectedCharacter');
      // Parse existing data to preserve other properties like 'id'
      const character = storedCharacter ? JSON.parse(storedCharacter) : {};
      
      const updatedCharacter = {
        ...character,
        name: companionName,
        image: characterImage,
        theme: theme,
      };

      localStorage.setItem('selectedCharacter', JSON.stringify(updatedCharacter));
    } catch (error) {
      console.error("Failed to save character to localStorage", error);
    }
  }, [characterImage, companionName, theme, isReady]);

  useEffect(() => {
    const root = document.documentElement;
    // Add dark class for chat view
    root.classList.add('dark');

    // Remove any existing theme classes
    root.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls);
      }
    });
    // Add the new theme class
    if (theme) {
      document.body.classList.add(`theme-${theme}`);
      root.classList.add(`theme-${theme}`);
    }

    return () => {
      root.classList.remove('dark');
      if (theme) {
        document.body.classList.remove(`theme-${theme}`);
        root.classList.remove(`theme-${theme}`);
      }
    }
  }, [theme]);

  if (!isReady) {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-2 bg-gradient-to-r from-pink-500/30 to-red-500/30 transform -rotate-12 blur-lg animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 transform rotate-12 blur-lg animate-pulse [animation-delay:0.5s]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                    <Heart className="w-24 h-24 text-primary animate-heartbeat" />
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-twinkle" />
                </div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
                    Loading Your Companion
                </h1>
                <p className="text-muted-foreground">Just a moment, we're preparing your intimate experience...</p>
                <div className="mt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        </div>
    );
  }
  
  return (
    <div className="h-screen w-full flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <LeftSidebar 
          characterImage={characterImage} 
          setCharacterImage={setCharacterImage} 
          theme={theme}
          setTheme={setTheme}
          companionName={companionName}
          setCompanionName={setCompanionName}
        />
      </div>

      <main className="flex-1 flex flex-col h-full">
        {/* Mobile Header & Sidebar Sheet */}
        <div className="md:hidden flex items-center justify-between p-2 border-b border-border">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 bg-black/80 backdrop-blur-sm border-r-white/5">
              <SheetTitle className="sr-only">Companion Customization</SheetTitle>
              <SheetDescription className="sr-only">Customize your AI companion's name, image, theme, and personality.</SheetDescription>
              <LeftSidebar 
                characterImage={characterImage} 
                setCharacterImage={setCharacterImage} 
                theme={theme}
                setTheme={setTheme}
                companionName={companionName}
                setCompanionName={setCompanionName}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={characterImage || undefined} alt={companionName} />
              <AvatarFallback>{companionName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{companionName}</span>
          </div>
           {/* Spacer to balance the trigger button */}
          <div className="w-10"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ChatContainer characterImage={characterImage} companionName={companionName} />
        </div>
      </main>
    </div>
  );
}
