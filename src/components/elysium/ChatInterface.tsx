"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Loader2 } from 'lucide-react';
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
    <div className="flex flex-col h-full p-2 sm:p-4 space-y-4">
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-6 p-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex items-end gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.sender === 'ai' && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Elara" data-ai-hint="beautiful anime girl" />
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>
              )}
              <div className={cn('max-w-sm md:max-w-md lg:max-w-lg p-3 px-4 rounded-2xl text-base leading-relaxed', msg.sender === 'user' ? 'bg-accent text-accent-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none shadow-sm')}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isAiResponding && (
             <div className="flex items-end gap-3 justify-start">
               <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Elara" data-ai-hint="beautiful anime girl" />
                  <AvatarFallback>E</AvatarFallback>
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
               <Sparkles className="h-5 w-5 text-accent-foreground/80 flex-shrink-0" />
               {icebreakers.slice(0, 3).map((ice, index) => (
                  <Button key={index} variant="outline" size="sm" className="rounded-full bg-background/70 hover:bg-accent hover:border-accent" onClick={() => handleIcebreakerClick(ice)}>
                     {ice}
                  </Button>
               ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-start gap-2 border-t pt-4">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 bg-background resize-none"
          rows={1}
        />
        <Button size="icon" onClick={handleSend} disabled={!inputValue.trim() || isAiResponding} className="bg-accent hover:bg-accent/90 flex-shrink-0">
          <Send className="h-5 w-5 text-accent-foreground" />
        </Button>
      </div>
    </div>
  );
}
