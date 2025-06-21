import { CharacterDisplay } from '@/components/elysium/CharacterDisplay';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { Header } from '@/components/elysium/Header';

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block md:w-1/2 lg:w-2/5">
          <CharacterDisplay />
        </div>
        <main className="flex-1 flex flex-col">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
}
