
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, Heart, Sparkles, Sun, Camera, Gift, Drama, Flame, Loader2, Paperclip, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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


export function ChatInterface({ messages, icebreakers, onSendMessage, isLoadingIcebreakers, isAiResponding, characterImage, companionName, isLocked, messagesLeft, isPremium, setShowPremiumDialog }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Auto-focus chat input box when chat opens or when AI finishes responding
  useEffect(() => {
    if (!isAiResponding) {
      textareaRef.current?.focus();
    }
  }, [isAiResponding]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
    };
  }, []);

  // Voice Input: Speech-to-Text Microphone
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Unavailable',
        description: 'Voice input is not supported in this browser. Please use Chrome, Edge, or the Android app.',
      });
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      transcriptRef.current = '';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: '🎙️ Listening...',
          description: 'Speak now — your response will be generated once you finish speaking.',
        });
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }
        if (fullTranscript) {
          transcriptRef.current = fullTranscript;
          setInputValue(fullTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        transcriptRef.current = '';
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          toast({
            variant: 'destructive',
            title: 'Mic Error',
            description: `Could not recognize voice: ${event.error}`,
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const textToSend = transcriptRef.current.trim();
        if (textToSend) {
          transcriptRef.current = '';
          setInputValue('');
          if (isLocked) {
            toast({
              variant: 'destructive',
              title: 'Free Limit Reached',
              description: 'Free limit completed please get premium',
            });
            router.push('/subscribe');
            return;
          }
          if (!isAiResponding) {
            onSendMessage(textToSend, undefined);
          }
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      transcriptRef.current = '';
    }
  };

  const handleSend = () => {
    if (isLocked) {
      toast({
        variant: 'destructive',
        title: 'Free Limit Reached',
        description: 'Free limit completed please get premium',
      });
      router.push('/subscribe');
      return;
    }

    if (inputValue.trim() && !isAiResponding) {
      onSendMessage(inputValue.trim(), undefined);
      setInputValue('');
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleIcebreakerClick = (text: string) => {
    if (!isAiResponding && !isLocked) {
      onSendMessage(text, undefined);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    } else if (isLocked) {
      toast({
        variant: 'destructive',
        title: 'Limit Reached',
        description: 'Free limit completed please get premium',
      });
      router.push('/subscribe');
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
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
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
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };


  const conversationStarted = messages.some((msg) => msg.sender === 'user');

  return (
    <div className="relative h-full flex flex-col min-h-0 overflow-hidden">
      {characterImage && (
        <Image
          src={characterImage}
          alt="Chat Background"
          fill
          quality={50}
          className="absolute inset-0 h-full w-full object-cover object-top opacity-20 md:opacity-[0.08] pointer-events-none"
          data-ai-hint="beautiful woman"
          priority
        />
      )}
      <div className="relative z-10 flex flex-col h-full min-h-0 p-2 sm:p-4 gap-2 sm:gap-3">
        <ScrollArea className="flex-1 min-h-0 pr-1 sm:pr-4">
          <div className="space-y-4 sm:space-y-6 p-1 sm:p-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-start gap-2 sm:gap-3 animate-message-in",
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'ai' && (
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/50 shrink-0">
                    <AvatarImage src={msg.avatar} alt={companionName} data-ai-hint="beautiful woman" className="object-cover object-top" />
                    <AvatarFallback>{companionName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "flex flex-col gap-1 max-w-[85%] sm:max-w-md",
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                )}>
                    <div className={cn(
                      'p-2.5 px-3.5 sm:p-3 sm:px-4 rounded-2xl text-sm sm:text-base leading-relaxed transition-all duration-300 ease-out break-words',
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-primary/95 to-fuchsia-600/95 text-primary-foreground rounded-br-lg shadow-lg shadow-primary/20 border border-white/10 backdrop-blur-md'
                        : 'liquid-glass text-card-foreground rounded-bl-lg'
                    )}>
                      {msg.imageUrl && (
                        <Image src={msg.imageUrl} alt="Uploaded content" width={200} height={300} className="rounded-lg mb-2 max-w-full h-auto" data-ai-hint="photo message"/>
                      )}
                      {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                    </div>
                    {msg.timestamp && (
                      <div className="flex items-center gap-2 px-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{msg.timestamp}</p>
                      </div>
                    )}
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-border shrink-0">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isAiResponding && (
               <div className="flex items-start gap-2 sm:gap-3 justify-start animate-message-in">
                 <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/50 shrink-0">
                    <AvatarImage src={characterImage || "https://placehold.co/400x600.png"} alt={companionName} data-ai-hint="beautiful woman" className="object-cover object-top" />
                    <AvatarFallback>{companionName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="p-2.5 px-4 rounded-2xl rounded-bl-lg liquid-glass text-card-foreground">
                    <div className="flex items-center justify-center space-x-1.5 h-5">
                      <span className="h-2 w-2 bg-pink-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-pink-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-pink-400 rounded-full animate-pulse"></span>
                    </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="shrink-0 space-y-1.5 sm:space-y-2 pb-safe">
          {!conversationStarted && !isLocked && (
            isLoadingIcebreakers ? (
                <div className="flex items-center justify-center p-1"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
                    {icebreakers.slice(0, 5).map((ice, index) => (
                        <Button key={index} variant="outline" size="sm" className="rounded-full bg-black/40 border-white/10 text-muted-foreground hover:bg-black/60 hover:text-foreground text-xs h-7 px-2.5 whitespace-nowrap shrink-0" onClick={() => handleIcebreakerClick(ice)}>
                            {icebreakerIcons[index % icebreakerIcons.length]} <span className="ml-1">{ice}</span>
                        </Button>
                    ))}
                </div>
            )
          )}

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
              <Button 
                variant="outline" 
                className="rounded-full bg-black/40 border-white/10 text-muted-foreground hover:bg-black/60 hover:text-foreground text-xs h-7 px-2.5 sm:h-8 sm:px-3 whitespace-nowrap shrink-0"
                onClick={() => handlePremiumAction("I want to send you a gift 🎁")}
                disabled={isAiResponding}
              >
                  <Gift className="mr-1 h-3.5 w-3.5 text-pink-400" /> Send Gift
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full bg-black/40 border-white/10 text-muted-foreground hover:bg-black/60 hover:text-foreground text-xs h-7 px-2.5 sm:h-8 sm:px-3 whitespace-nowrap shrink-0"
                onClick={() => handlePremiumAction("Let's do some role-playing.")}
                disabled={isAiResponding}
              >
                  <Drama className="mr-1 h-3.5 w-3.5 text-purple-400" /> Role Play
              </Button>
              <Button 
                variant="default" 
                className="rounded-full bg-gradient-to-r from-primary to-fuchsia-600 text-primary-foreground shadow-sm shadow-primary/20 hover:opacity-90 transition-opacity text-xs h-7 px-2.5 sm:h-8 sm:px-3 whitespace-nowrap shrink-0 font-medium"
                onClick={() => handlePremiumAction("I want to get more intimate with you.")}
                disabled={isAiResponding}
              >
                  <Flame className="mr-1 h-3.5 w-3.5" /> Get Intimate
              </Button>
          </div>
        
          <div className="flex items-end gap-1.5 sm:gap-2 liquid-glass-active p-1.5 sm:p-2 rounded-2xl">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg, image/png, image/gif, image/webp" />
            <Button variant="ghost" size="icon" onClick={handleAttachmentClick} disabled={isAiResponding || isLocked} className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
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
              placeholder="Tell me your desires..."
              className="flex-1 bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-1.5 sm:p-2 max-h-24 sm:max-h-32 text-base leading-tight placeholder:text-muted-foreground"
              rows={1}
              disabled={isAiResponding}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={toggleVoiceInput}
              disabled={isAiResponding}
              className={cn(
                "shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300",
                isListening
                  ? "bg-red-500 text-white animate-pulse ring-4 ring-pink-500/50"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              title={isListening ? "Stop listening" : "Click to speak with voice"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            <Button onClick={handleSend} size="icon" disabled={!inputValue.trim() || isAiResponding} className="bg-primary/80 hover:bg-primary text-primary-foreground shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          {messagesLeft !== null && messagesLeft > 0 && (
            <div className="text-center text-[11px] sm:text-xs text-muted-foreground">
              You have <span className="font-bold text-pink-400">{messagesLeft}</span> monthly messages left.
            </div>
          )}
          {isLocked && (
            <div className="text-center text-xs sm:text-sm font-semibold p-2 sm:p-2.5 rounded-xl bg-pink-500/10 text-pink-300 border border-pink-500/30 flex items-center justify-center gap-2">
              <Lock className="h-3.5 w-3.5 text-pink-400 shrink-0" />
              <span>Free limit completed please get premium</span>
              <Button
                size="sm"
                className="ml-1 sm:ml-2 h-6 sm:h-7 px-2.5 sm:px-3 text-[11px] sm:text-xs bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full shadow-md font-semibold shrink-0"
                onClick={() => router.push('/subscribe')}
              >
                Get Premium ✨
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

    
