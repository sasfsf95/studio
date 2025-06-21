
"use client";

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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
        setCharacterImage(character.image || 'https://firebasestudio.ai/gallery/Elysium/4.png');
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
    setIsReady(true);
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
        <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
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
