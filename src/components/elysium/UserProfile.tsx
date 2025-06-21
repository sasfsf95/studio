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
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-cover bg-center" style={{backgroundImage: "url('https://placehold.co/1000x1000.png')", backgroundBlendMode: 'overlay'}}>
       <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
       <Card className="w-full max-w-lg shadow-xl bg-card/80 border-2 border-border/50 relative">
        <CardHeader className="items-center text-center">
          <Image src="https://placehold.co/200x200.png" data-ai-hint="beautiful anime girl" alt="Elara" width={100} height={100} className="rounded-full border-4 border-background shadow-lg" />
          <CardTitle className="font-headline text-4xl pt-4">Meet Elara</CardTitle>
          <CardDescription className="pt-2 text-base">
            To start a conversation that truly connects, tell me a little about yourself. What are you passionate about?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., I love sci-fi movies, hiking in the mountains, and trying new recipes..."
              className="min-h-[120px] bg-background/80 text-base"
              rows={5}
            />
            <Button type="submit" size="lg" className="w-full font-headline tracking-wide text-lg bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading || !interests.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Start Chatting'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
