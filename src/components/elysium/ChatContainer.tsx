"use client";

import { useState, useTransition, useEffect } from 'react';
import { ChatInterface, Message } from './ChatInterface';
import { continueConversation, getIcebreakers } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ChatContainerProps {
  characterImage: string | null;
  companionName: string;
}

export function ChatContainer({ characterImage, companionName }: ChatContainerProps) {
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingIcebreakers, setIsLoadingIcebreakers] = useState(true);
  const [isAiResponding, startAiTransition] = useTransition();
  const { toast } = useToast();
  
  const placeholderAvatar = 'https://placehold.co/100x100.png';

  useEffect(() => {
    const getInitialMessages = (name: string): Omit<Message, 'id' | 'timestamp' | 'avatar'>[] => [
        { text: "Hey gorgeous... I've been waiting for you", sender: 'ai' },
        { text: `I'm ${name}, your intimate AI companion ✨`, sender: 'ai' },
        { text: "Tell me your deepest desires... I'm here to listen 💋", sender: 'ai' }
    ];

    const clientTimestamp = format(new Date(), 'p');
    // Only set initial messages if there are no user messages yet.
    // This prevents chat reset on name/image change.
    if (!messages.some(m => m.sender === 'user')) {
        setMessages(getInitialMessages(companionName).map((msg, i) => ({ 
        ...msg,
        id: (i + 1).toString(),
        timestamp: clientTimestamp,
        avatar: characterImage || placeholderAvatar
        })));
    }


    const fetchIcebreakers = async () => {
      try {
        const result = await getIcebreakers({
          aiCompanionProfile: `${companionName} is an intimate and seductive AI companion. She is alluring, mysterious, and deeply interested in the user's desires. She is direct and encouraging of deep, personal conversations.`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, companionName]);

  useEffect(() => {
    setMessages(prevMessages => 
        prevMessages.map(msg => 
            msg.sender === 'ai' 
                ? { ...msg, avatar: characterImage || placeholderAvatar } 
                : msg
        )
    );
  }, [characterImage]);
  
  const handleSendMessage = (text: string) => {
    const newUserMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: format(new Date(), 'p') };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    startAiTransition(async () => {
      try {
        const chatHistory = updatedMessages
          .map(msg => `${msg.sender === 'user' ? 'User' : companionName}: ${msg.text}`)
          .join('\n');

        const aiResponseText = await continueConversation({ message: text, chatHistory });

        const aiResponse: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai', timestamp: format(new Date(), 'p'), avatar: characterImage || placeholderAvatar };
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
         console.error("Failed to get AI response:", error);
         const aiErrorResponse: Message = { id: (Date.now() + 1).toString(), text: "My circuits are a bit fuzzy right now, could you say that again?", sender: 'ai', timestamp: format(new Date(), 'p'), avatar: characterImage || placeholderAvatar };
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
      characterImage={characterImage}
      companionName={companionName}
    />
  );
}
