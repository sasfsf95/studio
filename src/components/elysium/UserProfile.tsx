
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UserProfileProps {
  onSubmit: (interests: string) => void;
  isLoading: boolean;
}

export function UserProfile({ onSubmit, isLoading }: UserProfileProps) {
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.trim()) {
      onSubmit(interests.trim());
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
       <Card className="w-full max-w-lg shadow-xl bg-card/70 backdrop-blur-lg border-2 border-primary/20 relative">
        <CardHeader className="items-center text-center">
          <Image src="https://storage.googleapis.com/project-spark-b2952.appspot.com/yuki-ai--yuki-ai/generated/7a274533-3d92-4914-b6c8-a92af35d3d44.png" data-ai-hint="beautiful woman pink hair" alt="Raven" width={100} height={100} className="rounded-full border-4 border-primary/50 shadow-lg" />
          <CardTitle className="font-bold text-4xl pt-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500">Meet Raven</CardTitle>
          <CardDescription className="pt-2 text-base max-w-sm text-muted-foreground">
            I want to know all about you. What are you passionate about? What are your wildest dreams? Don't be shy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., I love sci-fi movies, hiking in the mountains, and trying new recipes..."
              className="min-h-[120px] bg-input/80 text-base focus:bg-input"
              rows={5}
            />
            <Button type="submit" size="lg" className="w-full font-bold tracking-wide text-lg bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground hover:opacity-90 transition-opacity" disabled={isLoading || !interests.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Tell me everything'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
