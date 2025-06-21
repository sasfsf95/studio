"use client";

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';

export default function Home() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('romantic-pink');

  useEffect(() => {
    const root = document.documentElement;
    // Remove any existing theme classes
    root.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls);
      }
    });
    // Add the new theme class
    if (theme) {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <div className="h-screen w-full flex bg-background text-foreground">
      <LeftSidebar 
        characterImage={characterImage} 
        setCharacterImage={setCharacterImage} 
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-1 flex flex-col">
        <ChatContainer characterImage={characterImage} />
      </main>
    </div>
  );
}
