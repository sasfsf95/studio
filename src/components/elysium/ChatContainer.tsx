"use client";

import { useState, useTransition, useEffect } from 'react';
import { ChatInterface, Message } from './ChatInterface';
import { continueConversation, getIcebreakers } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hey gorgeous... I've been waiting for you",
    sender: 'ai',
    timestamp: format(new Date(), 'p'),
    avatar: 'https://placehold.co/100x100.png'
  },
  {
    id: '2',
    text: "I'm Raven, your intimate AI companion ✨",
    sender: 'ai',
    timestamp: format(new Date(), 'p'),
    avatar: 'https://placehold.co/100x100.png'
  },
  {
    id: '3',
    text: "Tell me your deepest desires... I'm here to listen 💋",
    sender: 'ai',
    timestamp: format(new Date(), 'p'),
    avatar: 'https://placehold.co/100x100.png'
  }
];

export function ChatContainer() {
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoadingIcebreakers, setIsLoadingIcebreakers] = useState(true);
  const [isAiResponding, startAiTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const fetchIcebreakers = async () => {
      try {
        const result = await getIcebreakers({
          aiCompanionProfile: "Raven is an intimate and seductive AI companion. She is alluring, mysterious, and deeply interested in the user's desires. She is direct and encouraging of deep, personal conversations.",
          userInterests: "anything to start a deep, engaging, and flirty conversation"
        });
        setIcebreakers(result.icebreakerMessages);
      } catch (error) {
        console.error("Failed to get icebreakers:", error);
        toast({
          variant: "destructive",
          title: "Oh no!",
          description: "I had a little trouble thinking of conversation starters. Let's just dive in!",
        })
      } finally {
        setIsLoadingIcebreakers(false);
      }
    };
    fetchIcebreakers();
  }, [toast]);
  
  const handleSendMessage = (text: string) => {
    const newUserMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: format(new Date(), 'p') };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    startAiTransition(async () => {
      try {
        const chatHistory = updatedMessages
          .map(msg => `${msg.sender === 'user' ? 'User' : 'Raven'}: ${msg.text}`)
          .join('\n');

        const aiResponseText = await continueConversation({ message: text, chatHistory });

        const aiResponse: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai', timestamp: format(new Date(), 'p'), avatar: 'https://placehold.co/100x100.png' };
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
         console.error("Failed to get AI response:", error);
         const aiErrorResponse: Message = { id: (Date.now() + 1).toString(), text: "My circuits are a bit fuzzy right now, could you say that again?", sender: 'ai', timestamp: format(new Date(), 'p'), avatar: 'https://placehold.co/100x100.png' };
         setMessages(prev => [...prev, aiErrorResponse]);
      }
    });
  };

  return (
    <ChatInterface
      messages={messages}
      icebreakers={icebreakers}
      onSendMessage={handleSendMessage}
      isLoadingIcebreakers={isLoadingIcebreakers}
      isAiResponding={isAiResponding}
    />
  );
}
