"use client";

import { useState } from 'react';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';

export default function Home() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);

  return (
    <div className="h-screen w-full flex bg-background text-foreground">
      <LeftSidebar 
        characterImage={characterImage} 
        setCharacterImage={setCharacterImage} 
      />
      <main className="flex-1 flex flex-col">
        <ChatContainer characterImage={characterImage} />
      </main>
    </div>
  );
}
