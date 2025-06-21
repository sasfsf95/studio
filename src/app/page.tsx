import { ChatContainer } from '@/components/elysium/ChatContainer';
import { LeftSidebar } from '@/components/elysium/LeftSidebar';

export default function Home() {
  return (
    <div className="h-screen w-full flex bg-background text-foreground">
      <LeftSidebar />
      <main className="flex-1 flex flex-col">
        <ChatContainer />
      </main>
    </div>
  );
}
