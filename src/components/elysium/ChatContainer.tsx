
"use client";

import { useState, useTransition, useEffect } from 'react';
import { ChatInterface, Message } from './ChatInterface';
import { continueConversation, getAudio } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getUserPlan, useUserChatMessage, UserPlanData } from '@/app/plan-actions';

interface ChatContainerProps {
  characterImage: string | null;
  companionName: string;
  isPremium: boolean;
  setShowPremiumDialog: (open: boolean) => void;
  chatId: string;
  userId?: number;
}

export function ChatContainer({
  characterImage,
  companionName,
  isPremium: initialIsPremium,
  setShowPremiumDialog,
  chatId,
  userId,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoadingIcebreakers, setIsLoadingIcebreakers] = useState(false);
  const [isAiResponding, startAiTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Plan and Quota State
  const [userPlan, setUserPlan] = useState<UserPlanData | null>(null);
  const [messagesLeft, setMessagesLeft] = useState<number | null>(null);
  const [activePremium, setActivePremium] = useState<boolean>(initialIsPremium);

  // Load user plan from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function loadPlan() {
      // 1. Check if userId is passed or stored in localStorage
      let resolvedUserId = userId;
      if (!resolvedUserId) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            resolvedUserId = parsed.id;
          }
        } catch (e) {
          console.error("Failed to read user from localStorage", e);
        }
      }

      if (resolvedUserId) {
        const plan = await getUserPlan(resolvedUserId);
        if (isMounted && plan) {
          setUserPlan(plan);
          const hasPremium = plan.premium_plan > 0 && (
            !plan.premium_expires_at || new Date(plan.premium_expires_at).getTime() > Date.now()
          );
          setActivePremium(hasPremium);
          setMessagesLeft(hasPremium ? null : Number(plan.monthly_message_limit ?? 30));
          localStorage.setItem('user_plan', JSON.stringify(plan));
          localStorage.setItem('isPremium', hasPremium ? 'true' : 'false');
          return;
        }
      }

      // Fallback to localStorage cache
      const cachedPlan = localStorage.getItem('user_plan');
      if (cachedPlan && isMounted) {
        try {
          const plan = JSON.parse(cachedPlan);
          setUserPlan(plan);
          const hasPremium = Number(plan.premium_plan) > 0;
          setActivePremium(hasPremium);
          setMessagesLeft(hasPremium ? null : Number(plan.monthly_message_limit ?? 30));
        } catch (e) {}
      }
    }

    loadPlan();

    return () => {
      isMounted = false;
    };
  }, [userId, initialIsPremium]);

  const isLocked = !activePremium && messagesLeft !== null && messagesLeft <= 0;
  const placeholderAvatar = 'https://placehold.co/400x600.png';

  // Always start fresh — no chat history saved between sessions
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companionName, chatId]);

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

  // Use a static list of icebreakers to avoid API calls.
  useEffect(() => {
    setIsLoadingIcebreakers(true);
    const staticIcebreakers = [
      "Tell me a secret...",
      "What's on your mind?",
      "I can't stop thinking about you.",
      "Send me a selfie?",
      "You make my heart race."
    ];
    setIcebreakers(staticIcebreakers);
    setIsLoadingIcebreakers(false);
  }, []);

  const handleSendMessage = async (text: string, imageUrl?: string) => {
    if (!text.trim() && !imageUrl) return;

    // Check if free message limit is reached
    if (isLocked) {
      toast({
        variant: 'destructive',
        title: 'Free Limit Reached',
        description: 'Free limit completed please get premium',
      });
      router.push('/subscribe');
      return;
    }

    // Resolve userId for updating user_plan in Supabase
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          resolvedUserId = parsed.id;
        }
      } catch (e) {}
    }

    // Update monthly message limit in Supabase for free users
    if (!activePremium && resolvedUserId) {
      const quotaResult = await useUserChatMessage(resolvedUserId);

      if (!quotaResult.allowed) {
        setMessagesLeft(0);
        toast({
          variant: 'destructive',
          title: 'Free Limit Reached',
          description: 'Free limit completed please get premium',
        });
        router.push('/subscribe');
        return;
      }

      setMessagesLeft(quotaResult.messagesLeft);
      if (quotaResult.plan) {
        setUserPlan(quotaResult.plan);
        localStorage.setItem('user_plan', JSON.stringify(quotaResult.plan));
      }
    } else if (!activePremium && !resolvedUserId) {
      // Local fallback if no userId found
      setMessagesLeft(prev => {
        const updated = Math.max(0, (prev ?? 30) - 1);
        if (updated <= 0) {
          toast({
            variant: 'destructive',
            title: 'Free Limit Reached',
            description: 'Free limit completed please get premium',
          });
          router.push('/subscribe');
        }
        return updated;
      });
    }

    const newUserMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: format(new Date(), 'p'), imageUrl };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    startAiTransition(async () => {
      try {
        // Send the last 5 exchanges (up to 10 messages) as context for AI memory
        const recentMessages = messages.slice(-10);
        const history = recentMessages
          .filter(msg => msg.text && msg.text.trim())
          .map(msg => ({
            role: (msg.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
            parts: [{ text: msg.text }]
          }));

        // Construct message for Gemini, including image if present.
        const messageToSend = imageUrl ? `${text} [user sent an image]` : text;
        const aiResponseData = await continueConversation({
          message: messageToSend,
          chatId,
          history,
          companionName,
        });

        let audioResult = null;
        if (activePremium && aiResponseData.type === 'text') {
          audioResult = await getAudio(aiResponseData.content);
        }

        const aiResponseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseData.type === 'text' ? aiResponseData.content : '',
          sender: 'ai',
          timestamp: format(new Date(), 'p'),
          avatar: characterImage || placeholderAvatar,
          audioUrl: aiResponseData.type === 'audio' ? aiResponseData.content : audioResult?.audioDataUri,
          imageUrl: aiResponseData.type === 'image' ? aiResponseData.content : undefined,
        };

        if (aiResponseData.type === 'error') {
          aiResponseMessage.text = aiResponseData.content;
        }

        setMessages(prev => [...prev, aiResponseMessage]);

      } catch (error) {
        console.error("Failed to get AI response:", error);
        const aiErrorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "My circuits are a bit fuzzy right now, could you say that again?",
          sender: 'ai',
          timestamp: format(new Date(), 'p'),
          avatar: characterImage || placeholderAvatar
        };
        setMessages(prev => [...prev, aiErrorResponse]);
      }
    });
  };

  return (
    <>
      <ChatInterface
        messages={messages}
        icebreakers={icebreakers}
        onSendMessage={handleSendMessage}
        isLoadingIcebreakers={isLoadingIcebreakers}
        isAiResponding={isAiResponding}
        characterImage={characterImage}
        companionName={companionName}
        isLocked={isLocked}
        messagesLeft={activePremium ? null : messagesLeft}
        isPremium={activePremium}
        setShowPremiumDialog={setShowPremiumDialog}
      />
    </>
  );
}
