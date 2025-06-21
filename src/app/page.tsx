import { CharacterDisplay } from '@/components/elysium/CharacterDisplay';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { Header } from '@/components/elysium/Header';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/3 flex-shrink-0 relative overflow-hidden hidden md:block">
          <CharacterDisplay />
        </div>
        <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col bg-card">
          <ChatContainer />
        </div>
      </main>
    </div>
  );
}
