"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Heart, Sparkles, Sun, Camera, Gift, Drama, Flame, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: string;
  avatar?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  icebreakers: string[];
  onSendMessage: (text: string) => void;
  isLoadingIcebreakers: boolean;
  isAiResponding: boolean;
  characterImage: string | null;
  companionName: string;
}

const icebreakerIcons = [
    <Heart className="h-4 w-4" />,
    <Sparkles className="h-4 w-4" />,
    <Sun className="h-4 w-4" />,
    <Camera className="h-4 w-4" />,
    <Gift className="h-4 w-4" />,
];

export function ChatInterface({ messages, icebreakers, onSendMessage, isLoadingIcebreakers, isAiResponding, characterImage, companionName }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

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

  const conversationStarted = messages.some((msg) => msg.sender === 'user');

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-8 p-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex items-start gap-4 animate-message-in",
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.sender === 'ai' && (
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                  <AvatarImage src={msg.avatar} alt={companionName} data-ai-hint="beautiful brunette woman" className="object-cover object-top" />
                  <AvatarFallback>{companionName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "flex flex-col gap-1.5",
                msg.sender === 'user' ? 'items-end' : 'items-start'
              )}>
                  <div className={cn(
                    'max-w-md p-3 px-4 rounded-2xl text-base leading-relaxed transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer',
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground rounded-br-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
                      : 'bg-card text-card-foreground rounded-bl-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30'
                  )}>
                    <p>{msg.text}</p>
                  </div>
                  {msg.timestamp && <p className="text-xs text-muted-foreground px-1">{msg.timestamp}</p>}
              </div>
              {msg.sender === 'user' && (
                <Avatar className="h-10 w-10 border-2 border-border">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isAiResponding && (
             <div className="flex items-start gap-4 justify-start animate-message-in">
               <Avatar className="h-10 w-10 border-2 border-primary/50">
                  <AvatarImage src={characterImage || "https://placehold.co/100x100.png"} alt={companionName} data-ai-hint="beautiful brunette woman" className="object-cover object-top" />
                  <AvatarFallback>{companionName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="max-w-sm p-3 px-4 rounded-2xl rounded-bl-lg bg-card text-card-foreground">
                  <div className="flex items-center justify-center space-x-2 h-6">
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
      
      <div className="space-y-4">
        {!conversationStarted && (
          isLoadingIcebreakers ? (
              <div className="flex items-center justify-center p-2"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : (
              <div className="flex flex-wrap gap-2 items-center justify-start">
                  {icebreakers.slice(0, 5).map((ice, index) => (
                      <Button key={index} variant="outline" size="sm" className="rounded-full bg-black/30 border-white/10 text-muted-foreground hover:bg-black/50 hover:text-foreground" onClick={() => handleIcebreakerClick(ice)}>
                          {icebreakerIcons[index % icebreakerIcons.length]} {ice}
                      </Button>
                  ))}
              </div>
          )
        )}

        <div className="flex justify-start items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="rounded-full bg-black/30 border-white/10 text-muted-foreground hover:bg-black/50 hover:text-foreground">
                <Gift className="mr-2 h-4 w-4" /> Send Gift
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-black/30 border-white/10 text-muted-foreground hover:bg-black/50 hover:text-foreground">
                <Drama className="mr-2 h-4 w-4" /> Role Play
            </Button>
            <Button variant="default" size="sm" className="rounded-full bg-gradient-to-r from-primary to-fuchsia-600 text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                <Flame className="mr-2 h-4 w-4" /> Get Intimate
            </Button>
        </div>
      
        <div className="flex items-end gap-2 border rounded-xl p-2 bg-black/40 border-white/10">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Tell me your desires..."
            className="flex-1 bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 max-h-32"
            rows={1}
          />
          <Button size="icon" variant="ghost" disabled={isAiResponding} className="flex-shrink-0 h-10 w-10 rounded-full bg-primary hover:bg-primary/90">
              <Mic className="h-5 w-5 text-primary-foreground" />
          </Button>
          <Button size="icon" onClick={handleSend} disabled={!inputValue.trim() || isAiResponding} className="bg-input hover:bg-input/80 flex-shrink-0 h-10 w-10 rounded-lg">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
