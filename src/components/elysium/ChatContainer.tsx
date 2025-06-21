"use client";

import { useState, useTransition } from 'react';
import { UserProfile } from './UserProfile';
import { ChatInterface, Message } from './ChatInterface';
import { continueConversation, getIcebreakers } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function ChatContainer() {
  const [userInterests, setUserInterests] = useState<string | null>(null);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiResponding, startAiTransition] = useTransition();
  const { toast } = useToast();

  const handleProfileSubmit = async (interests: string) => {
    setUserInterests(interests);
    setIsLoading(true);
    
    setMessages([{
      id: '1',
      text: `Hey gorgeous... I've been waiting for you. Tell me more about your interest in ${interests}. I want to know everything.`,
      sender: 'ai'
    }]);

    try {
      const result = await getIcebreakers({
        aiCompanionProfile: "Raven is an intimate and seductive AI companion. She is alluring, mysterious, and deeply interested in the user's desires. She is direct and encouraging of deep, personal conversations.",
        userInterests: interests
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
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = (text: string) => {
    const newUserMessage: Message = { id: Date.now().toString(), text, sender: 'user' };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    startAiTransition(async () => {
      try {
        const chatHistory = updatedMessages
          .map(msg => `${msg.sender === 'user' ? 'User' : 'Raven'}: ${msg.text}`)
          .join('\n');

        const aiResponseText = await continueConversation({ message: text, chatHistory });

        const aiResponse: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
         console.error("Failed to get AI response:", error);
         const aiErrorResponse: Message = { id: (Date.now() + 1).toString(), text: "My circuits are a bit fuzzy right now, could you say that again?", sender: 'ai' };
         setMessages(prev => [...prev, aiErrorResponse]);
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {!userInterests ? (
        <UserProfile onSubmit={handleProfileSubmit} isLoading={isLoading} />
      ) : (
        <ChatInterface
          messages={messages}
          icebreakers={icebreakers}
          onSendMessage={handleSendMessage}
          isLoadingIcebreakers={isLoading}
          isAiResponding={isAiResponding}
        />
      )}
    </div>
  );
}
