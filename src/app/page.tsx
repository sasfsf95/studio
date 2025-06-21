import { CharacterDisplay } from '@/components/elysium/CharacterDisplay';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { Header } from '@/components/elysium/Header';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 lg:w-2/5 flex-shrink-0 relative overflow-hidden hidden md:block">
          <CharacterDisplay />
        </div>
        <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col bg-primary/20">
          <ChatContainer />
        </div>
      </main>
    </div>
  );
}
