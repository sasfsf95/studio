"use client";

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';
import { LandingPage } from '@/components/elysium/LandingPage';

export default function Home() {
  const [characterImage, setCharacterImage] = useState<string | null>("https://firebasestudio.ai/gallery/Elysium/2.png");
  const [theme, setTheme] = useState('romantic-pink');
  const [companionName, setCompanionName] = useState('Aria');
  const [showChat, setShowChat] = useState(false);

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

  const handleContinue = () => {
    setShowChat(true);
  };

  if (!showChat) {
    return <LandingPage onContinue={handleContinue} />;
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
