import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

export function Header() {
  return (
    <header className="p-3 px-6 border-b border-border/30 shadow-sm bg-background/50 backdrop-blur-lg z-10 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Crown className="h-6 w-6 text-yellow-400" />
        <h1 className="text-lg font-semibold text-foreground tracking-wider">Premium Experience</h1>
      </div>
      <Button size="sm" className="font-bold bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground rounded-full px-5 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
        VIP
      </Button>
    </header>
  );
}
