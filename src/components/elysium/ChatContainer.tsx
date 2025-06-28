
"use client";

import { useState, useTransition, useEffect } from 'react';
import { ChatInterface, Message } from './ChatInterface';
import { continueConversation, getIcebreakers } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PremiumDialog } from './PremiumDialog';

interface ChatContainerProps {
  characterImage: string | null;
  companionName: string;
}

export function ChatContainer({ characterImage, companionName }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoadingIcebreakers, setIsLoadingIcebreakers] = useState(true);
  const [isAiResponding, startAiTransition] = useTransition();
  const { toast } = useToast();
  
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  
  const FREE_MESSAGE_LIMIT = 30;
  const userMessageCount = messages.filter(msg => msg.sender === 'user').length;
  const messagesLeft = FREE_MESSAGE_LIMIT - userMessageCount;
  const isLocked = !isPremium && userMessageCount >= FREE_MESSAGE_LIMIT;

  const placeholderAvatar = 'https://placehold.co/400x600.png';

  // Load initial state and messages from localStorage
  useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premiumStatus);

    const chatKey = `chat_messages_${companionName}`;
    let initialMessages: Message[] = [];
    try {
        const savedMessagesRaw = localStorage.getItem(chatKey);
        if (savedMessagesRaw) {
            initialMessages = JSON.parse(savedMessagesRaw);
        }
    } catch (error) {
        console.error("Failed to parse messages from localStorage", error);
        localStorage.removeItem(chatKey); // Clear corrupted data
    }
    
    if (initialMessages.length > 0) {
        setMessages(initialMessages.map(msg => 
            msg.sender === 'ai' 
                ? { ...msg, avatar: characterImage || placeholderAvatar } 
                : msg
        ));
    } else {
        const getInitialMessages = (name: string): Omit<Message, 'id' | 'timestamp' | 'avatar'>[] => [
            { text: "Hey gorgeous... I've been waiting for you", sender: 'ai' },
            { text: `I'm ${name}, your intimate AI companion ✨`, sender: 'ai' },
            { text: "Tell me your deepest desires... I'm here to listen 💋", sender: 'ai' }
        ];
        const clientTimestamp = format(new Date(), 'p');
        const welcomeMessages = getInitialMessages(companionName).map((msg, i) => ({ 
            ...msg,
            id: `${Date.now()}-${i}`,
            timestamp: clientTimestamp,
            avatar: characterImage || placeholderAvatar
        }));
        setMessages(welcomeMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companionName]);
  
  // Update avatars when characterImage changes
  useEffect(() => {
    setMessages(prevMessages => 
        prevMessages.map(msg => 
            msg.sender === 'ai' 
                ? { ...msg, avatar: characterImage || placeholderAvatar } 
                : msg
        )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterImage]);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0 && messages.some(m => m.sender === 'user')) {
        const chatKey = `chat_messages_${companionName}`;
        localStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, companionName]);

  // Fetch icebreakers
  useEffect(() => {
    const fetchIcebreakers = async () => {
      setIsLoadingIcebreakers(true);
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
  }, [toast, companionName]);

  const handleSendMessage = (text: string, imageUrl?: string) => {
    if (!text.trim() && !imageUrl) return;

    if (isLocked) {
        setShowPremiumDialog(true);
        toast({
            title: "Free Message Limit Reached",
            description: "Please subscribe to premium to continue chatting.",
            variant: "destructive",
        });
        return;
    }

    const newUserMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: format(new Date(), 'p'), imageUrl };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    startAiTransition(async () => {
      try {
        const chatHistory = updatedMessages
          .map(msg => {
            let historyLine = `${msg.sender === 'user' ? 'User' : companionName}: ${msg.text}`;
            if (msg.imageUrl) {
                historyLine += " (sent an image)";
            }
            return historyLine;
          })
          .join('\n');

        const aiResponseText = await continueConversation({ message: text, chatHistory, imageUrl });

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
    <>
      <PremiumDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
      />
      <ChatInterface
        messages={messages}
        icebreakers={icebreakers}
        onSendMessage={handleSendMessage}
        isLoadingIcebreakers={isLoadingIcebreakers}
        isAiResponding={isAiResponding}
        characterImage={characterImage}
        companionName={companionName}
        isLocked={isLocked}
        messagesLeft={isPremium ? null : messagesLeft}
      />
    </>
  );
}
