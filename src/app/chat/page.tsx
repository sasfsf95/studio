
"use client";

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, Loader2, Sparkles, Menu, PartyPopper, ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { PremiumDialog } from '@/components/elysium/PremiumDialog';
import Link from 'next/link';

export default function ChatPage() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [characterId, setCharacterId] = useState<string>('');
  const [theme, setTheme] = useState('romantic-pink');
  const [companionName, setCompanionName] = useState('Aria');
  const [isReady, setIsReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
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
    const premiumStatus = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premiumStatus);
    
    try {
      const storedCharacter = localStorage.getItem('selectedCharacter');
      if (storedCharacter) {
        const character = JSON.parse(storedCharacter);
        setCharacterImage(character.image || '/character.jpg');
        setCharacterId(character.id || 'default-chat');
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
    setTimeout(() => setIsReady(true), 1000);
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
        id: characterId,
      };

      localStorage.setItem('selectedCharacter', JSON.stringify(updatedCharacter));
    } catch (error) {
      console.error("Failed to save character to localStorage", error);
    }
  }, [characterImage, companionName, theme, isReady, characterId]);

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
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
                <Heart className="w-24 h-24 text-primary animate-heartbeat" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-twinkle" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
                Connecting...
            </h1>
            <p className="text-muted-foreground">Preparing your intimate experience...</p>
            <div className="mt-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <PremiumDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
      />
      <div className="h-screen w-full flex bg-background text-foreground">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[360px] border-r border-white/5">
          <LeftSidebar 
            characterImage={characterImage} 
            setCharacterImage={setCharacterImage} 
            theme={theme}
            setTheme={setTheme}
            companionName={companionName}
            setCompanionName={setCompanionName}
            isPremium={isPremium}
            setShowPremiumDialog={setShowPremiumDialog}
          />
        </aside>

        <main className="flex-1 flex flex-col h-full">
          {/* Mobile Header & Sidebar Sheet */}
          <div className="md:hidden flex items-center justify-between p-2 border-b border-white/10 bg-black/50 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/50 hover:text-white rounded-full transition-colors" onClick={() => router.push('/')}>
                  <ArrowLeft className="h-6 w-6" />
                  <span className="sr-only">Back</span>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent/50 hover:text-white rounded-full transition-colors">
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
                    isPremium={isPremium}
                    setShowPremiumDialog={setShowPremiumDialog}
                  />
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={characterImage || undefined} alt={companionName} />
                <AvatarFallback>{companionName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{companionName}</span>
            </div>
             {/* Spacer to balance the trigger buttons */}
            <div className="w-20"></div>
          </div>
          
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between p-3 border-b border-white/10">
              <Button variant="ghost" onClick={() => router.push('/')} className="hover:bg-accent/50 text-muted-foreground hover:text-foreground font-normal rounded-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={characterImage || undefined} alt={companionName} />
                  <AvatarFallback>{companionName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-lg">{companionName}</span>
              </div>
              <div className="w-24"></div> {/* Spacer */}
          </div>

          <div className="flex-1 overflow-y-auto">
            <ChatContainer 
              characterImage={characterImage} 
              companionName={companionName} 
              isPremium={isPremium} 
              setShowPremiumDialog={setShowPremiumDialog}
              chatId={characterId}
            />
          </div>
        </main>
      </div>
    </>
  );
}
