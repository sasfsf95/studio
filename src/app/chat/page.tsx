
"use client";

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Loader2, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('romantic-pink');
  const [companionName, setCompanionName] = useState('Aria');
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This code runs on the client, so window and localStorage are available.
    try {
      const storedCharacter = localStorage.getItem('selectedCharacter');
      if (storedCharacter) {
        const character = JSON.parse(storedCharacter);
        setCharacterImage(character.image || '/lovable-uploads/492c10b7-f04b-4b13-8d6e-986c750b32e6.png');
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
      <LeftSidebar 
        characterImage={characterImage} 
        setCharacterImage={setCharacterImage} 
        theme={theme}
        setTheme={setTheme}
        companionName={companionName}
        setCompanionName={setCompanionName}
      />
      <main className="flex-1 flex flex-col">
        <ChatContainer characterImage={characterImage} companionName={companionName} />
      </main>
    </div>
  );
}
