import { CharacterDisplay } from '@/components/elysium/CharacterDisplay';
import { ChatContainer } from '@/components/elysium/ChatContainer';
import { Header } from '@/components/elysium/Header';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-background text-foreground">
      <CharacterDisplay />
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-1 flex md:justify-center overflow-hidden">
           <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col">
            <ChatContainer />
          </div>
        </main>
      </div>
    </div>
  );
}
