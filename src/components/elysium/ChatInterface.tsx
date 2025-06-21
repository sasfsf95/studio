"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Loader2, Mic, Drama, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatInterfaceProps {
  messages: Message[];
  icebreakers: string[];
  onSendMessage: (text: string) => void;
  isLoadingIcebreakers: boolean;
  isAiResponding: boolean;
}

export function ChatInterface({ messages, icebreakers, onSendMessage, isLoadingIcebreakers, isAiResponding }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !isAiResponding) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleIcebreakerClick = (text: string) => {
    if (!isAiResponding) {
      onSendMessage(text);
    }
  };

  return (
    <div className="flex flex-col h-full p-2 sm:p-4 space-y-2">
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-6 p-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex items-end gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.sender === 'ai' && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Raven" data-ai-hint="beautiful dark hair woman" />
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
              )}
              <div className={cn('max-w-sm md:max-w-md lg:max-w-lg p-3 px-4 rounded-2xl text-base leading-relaxed', msg.sender === 'user' ? 'bg-secondary text-secondary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none shadow-sm')}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isAiResponding && (
             <div className="flex items-end gap-3 justify-start">
               <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Raven" data-ai-hint="beautiful dark hair woman" />
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <div className="max-w-sm md:max-w-md lg:max-w-lg p-3 px-4 rounded-2xl bg-card text-card-foreground rounded-bl-none shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                  </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {!isAiResponding && (
        <div className="space-y-3 px-1">
          {isLoadingIcebreakers && (
             <div className="flex items-center justify-center text-sm text-muted-foreground p-2">
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Thinking of some fun ways to start...
             </div>
          )}
          {!isLoadingIcebreakers && icebreakers.length > 0 && messages.length < 2 && (
            <div className="flex flex-wrap gap-2 items-center justify-center">
               <Sparkles className="h-5 w-5 text-primary/80 flex-shrink-0" />
               {icebreakers.slice(0, 3).map((ice, index) => (
                  <Button key={index} variant="secondary" size="sm" className="rounded-full" onClick={() => handleIcebreakerClick(ice)}>
                     {ice}
                  </Button>
               ))}
            </div>
          )}
        </div>
      )}

      {!isAiResponding && messages.length > 1 && (
        <div className="px-1 py-2 flex justify-center items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm" className="rounded-full">
                <Drama className="mr-2 h-4 w-4" /> Role Play
            </Button>
            <Button variant="default" size="sm" className="rounded-full bg-gradient-to-r from-primary to-fuchsia-600 text-primary-foreground">
                <Flame className="mr-2 h-4 w-4" /> Get Intimate
            </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2 border rounded-full p-1.5 bg-input mt-auto">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Tell me your desires..."
          className="flex-1 bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
          rows={1}
        />
        <Button size="icon" variant="ghost" disabled={isAiResponding} className="flex-shrink-0">
            <Mic className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button size="icon" onClick={handleSend} disabled={!inputValue.trim() || isAiResponding} className="bg-primary hover:bg-primary/90 flex-shrink-0 rounded-full">
          <Send className="h-5 w-5 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
}
