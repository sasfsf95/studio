
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Heart, Sparkles, Sun, Camera, Gift, Drama, Flame, Loader2, Paperclip, Lock, Play, Pause, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: string;
  avatar?: string;
  imageUrl?: string;
  audioUrl?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  icebreakers: string[];
  onSendMessage: (text: string, imageUrl?: string) => void;
  isLoadingIcebreakers: boolean;
  isAiResponding: boolean;
  characterImage: string | null;
  companionName: string;
  isLocked: boolean;
  messagesLeft: number | null;
  isPremium: boolean;
  setShowPremiumDialog: (open: boolean) => void;
}

const icebreakerIcons = [
    <Heart className="h-4 w-4" />,
    <Sparkles className="h-4 w-4" />,
    <Sun className="h-4 w-4" />,
    <Camera className="h-4 w-4" />,
    <Gift className="h-4 w-4" />,
];

function AudioPlayer({ src, messageId }: { src: string, messageId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    // Stop other audio players when this one starts
    const handleGlobalPlay = (event: CustomEvent) => {
        if (event.detail.id !== messageId) {
            audio.pause();
        }
    }

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('play-audio', handleGlobalPlay as EventListener);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      document.removeEventListener('play-audio', handleGlobalPlay as EventListener);
    };
  }, [messageId]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        // Dispatch event to pause other players
        const playEvent = new CustomEvent('play-audio', { detail: { id: messageId } });
        document.dispatchEvent(playEvent);
        audio.play();
      } else {
        audio.pause();
      }
    }
  };
  
  const handleStop = () => {
      const audio = audioRef.current;
      if (audio) {
          audio.pause();
          audio.currentTime = 0;
      }
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 mt-2">
      <audio ref={audioRef} src={src} preload="metadata"></audio>
      <Button onClick={togglePlayPause} variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="w-full bg-black/30 rounded-full h-1.5 flex-1">
        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <Button onClick={handleStop} variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20">
        <Square className="h-4 w-4" />
      </Button>
    </div>
  );
}


export function ChatInterface({ messages, icebreakers, onSendMessage, isLoadingIcebreakers, isAiResponding, characterImage, companionName, isLocked, messagesLeft, isPremium, setShowPremiumDialog }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

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
    if (inputValue.trim() && !isAiResponding && !isLocked) {
      onSendMessage(inputValue.trim(), undefined);
      setInputValue('');
    }
  };

  const handleIcebreakerClick = (text: string) => {
    if (!isAiResponding && !isLocked) {
      onSendMessage(text, undefined);
    }
  };

  const handleAttachmentClick = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isAiResponding && !isLocked) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onSendMessage(inputValue, imageUrl);
        setInputValue('');
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handlePremiumAction = (actionText: string) => {
    if (!isPremium) {
      setShowPremiumDialog(true);
    } else if (!isAiResponding) {
      onSendMessage(actionText);
    }
  };


  const conversationStarted = messages.some((msg) => msg.sender === 'user');

  return (
    <div className="relative h-full">
      {characterImage && (
        <img
          src={characterImage}
          alt="Chat Background"
          className="absolute inset-0 h-full w-full object-cover object-top opacity-20 md:opacity-[0.08]"
          data-ai-hint="beautiful woman"
        />
      )}
      <div className="relative z-10 flex flex-col h-full p-2 sm:p-4 space-y-4">
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-8 p-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-start gap-2 sm:gap-4 animate-message-in",
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'ai' && (
                  <Avatar className={cn(
                    "h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/50 transition-all",
                    activeAudio === msg.id && "ring-4 ring-primary animate-pulse"
                    )}>
                    <AvatarImage src={msg.avatar} alt={companionName} data-ai-hint="beautiful woman" className="object-cover object-top" />
                    <AvatarFallback>{companionName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "flex flex-col gap-1.5",
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                )}>
                    <div className={cn(
                      'max-w-md p-3 px-4 rounded-2xl text-sm sm:text-base leading-relaxed transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer',
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground rounded-br-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
                        : 'bg-card text-card-foreground rounded-bl-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30'
                    )}>
                      {msg.imageUrl && (
                        <img src={msg.imageUrl} alt="Uploaded content" className="rounded-lg mb-2 max-w-full h-auto" data-ai-hint="photo message"/>
                      )}
                      {msg.text && <p>{msg.text}</p>}
                      {msg.audioUrl && (
                        <AudioPlayer src={msg.audioUrl} messageId={msg.id} />
                      )}
                    </div>
                    {msg.timestamp && <p className="text-xs text-muted-foreground px-1">{msg.timestamp}</p>}
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-border">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isAiResponding && (
               <div className="flex items-start gap-4 justify-start animate-message-in">
                 <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage src={characterImage || "https://placehold.co/400x600.png"} alt={companionName} data-ai-hint="beautiful woman" className="object-cover object-top" />
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
          {!conversationStarted && !isLocked && (
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
              <Button 
                variant="outline" 
                className="rounded-full bg-black/30 border-white/10 text-muted-foreground hover:bg-black/50 hover:text-foreground text-xs h-8 px-2.5 sm:text-sm sm:h-9 sm:px-3"
                onClick={() => handlePremiumAction("I want to send you a gift 🎁")}
                disabled={isAiResponding}
              >
                  <Gift className="mr-2 h-4 w-4" /> Send Gift
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full bg-black/30 border-white/10 text-muted-foreground hover:bg-black/50 hover:text-foreground text-xs h-8 px-2.5 sm:text-sm sm:h-9 sm:px-3"
                onClick={() => handlePremiumAction("Let's do some role-playing.")}
                disabled={isAiResponding}
              >
                  <Drama className="mr-2 h-4 w-4" /> Role Play
              </Button>
              <Button 
                variant="default" 
                className="rounded-full bg-gradient-to-r from-primary to-fuchsia-600 text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity text-xs h-8 px-2.5 sm:text-sm sm:h-9 sm:px-3"
                onClick={() => handlePremiumAction("I want to get more intimate with you.")}
                disabled={isAiResponding}
              >
                  <Flame className="mr-2 h-4 w-4" /> Get Intimate
              </Button>
          </div>
        
          <div className="flex items-end gap-2 border rounded-xl p-2 bg-black/40 border-white/10">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg, image/png, image/gif, image/webp" />
            <Button variant="ghost" onClick={handleAttachmentClick} disabled={isAiResponding || isLocked} className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                <Paperclip className="h-5 w-5 text-primary" />
            </Button>
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
              placeholder={isLocked ? "Subscribe to send more messages" : "Tell me your desires..."}
              className="flex-1 bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 max-h-32 text-sm sm:text-base"
              rows={1}
              disabled={isAiResponding || isLocked}
            />
            <Button variant="ghost" disabled={isAiResponding || isLocked} className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                <Mic className="h-5 w-5 text-primary-foreground" />
            </Button>
            <Button onClick={handleSend} disabled={!inputValue.trim() || isAiResponding || isLocked} className="bg-input hover:bg-input/80 flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {isLocked ? <Lock className="h-5 w-5"/> : <Send className="h-5 w-5" />}
            </Button>
          </div>
           {messagesLeft !== null && messagesLeft > 0 && messagesLeft <= 10 && (
                <div className="text-center text-xs text-muted-foreground">
                    You have <span className="font-bold text-primary">{messagesLeft}</span> free messages left.
                </div>
            )}
            {isLocked && (
                <div className="text-center text-sm text-primary font-semibold p-2 rounded-md">
                    You've reached your free message limit. Subscribe to continue!
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
