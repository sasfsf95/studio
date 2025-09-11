
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Compass,
  Video,
  User,
  Star,
  MessageSquare,
  Crown,
  Share2,
  HelpCircle,
  LogOut,
  LogIn,
  Heart,
  Eye,
  PlusSquare,
  Sparkles,
  Menu,
  PartyPopper,
  SlidersHorizontal,
} from 'lucide-react';
import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Lazy load heavy components
const Accordion = lazy(() => import('@/components/ui/accordion').then(m => ({ default: m.Accordion })));
const AccordionContent = lazy(() => import('@/components/ui/accordion').then(m => ({ default: m.AccordionContent })));
const AccordionItem = lazy(() => import('@/components/ui/accordion').then(m => ({ default: m.AccordionItem })));
const AccordionTrigger = lazy(() => import('@/components/ui/accordion').then(m => ({ default: m.AccordionTrigger })));
const Sheet = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.Sheet })));
const SheetContent = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetContent })));
const SheetDescription = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetDescription })));
const SheetFooter = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetFooter })));
const SheetHeader = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetHeader })));
const SheetTitle = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetTitle })));
const SheetTrigger = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetTrigger })));
const PremiumDialog = lazy(() => import('./PremiumDialog').then(m => ({ default: m.PremiumDialog })));
const DonationDialog = lazy(() => import('./DonationDialog').then(m => ({ default: m.DonationDialog })));

const allCharacters = [
  // Non-adult characters
  {
    id: 'aria',
    name: 'Aria',
    image: '/character.jpg',
    video: '/sample1.mp4',
    theme: 'romantic-pink',
    likes: '38K',
    views: '3K',
    tags: ['New'],
    online: true,
    isAdult: false,
  },
  {
    id: 'ivana',
    name: 'Ivana',
    image: '/character1.jpg',
    video: '/sample2.mp4',
    theme: 'mystic-purple',
    likes: '52K',
    views: '2m',
    online: true,
    isAdult: false,
  },
  {
    id: 'chloe',
    name: 'Chloe',
    image: '/character2.jpg',
    video: '/sample3.mp4',
    theme: 'golden-luxe',
    likes: '39K',
    views: '2m',
    online: false,
    isAdult: false,
  },
  {
    id: 'lila',
    name: 'Lila',
    image: '/character8.jpeg',
    video: '/sample4.mp4',
    theme: 'romantic-pink',
    likes: '25K',
    views: '5m',
    online: true,
    isAdult: false,
  },
  {
    id: 'mia',
    name: 'Mia',
    image: '/character6.jpeg',
    //video: '/sample1.mp4',
    theme: 'mystic-purple',
    likes: '33K',
    views: '4m',
    online: true,
    isAdult: false,
  },
  {
    id: 'elena',
    name: 'Elena',
    image: '/character5.jpeg',
    //video: '/sample1.mp4',
    theme: 'midnight-blue',
    likes: '41K',
    views: '6m',
    tags: [],
    online: true,
    isAdult: false,
  },
  {
    id: 'sofia',
    name: 'Sofia',
    image: '/character3.jpeg',
    //video: '/sample1.mp4',
    theme: 'romantic-pink',
    likes: '29K',
    views: '1m',
    tags: ['New'],
    online: false,
    isAdult: false,
  },
  {
    id: 'yuki',
    name: 'Yuki',
    image: '/character4.jpg',
    //video: '/sample1.mp4',
    theme: 'mystic-purple',
    likes: '65K',
    views: '8m',
    tags: [],
    online: true,
    isAdult: false,
  },
  {
    id: 'hana',
    name: 'Hana',
    image: '/character9.jpeg',
    //video: '/sample1.mp4',
    theme: 'golden-luxe',
    likes: '37K',
    views: '2.5m',
    tags: ['New'],
    online: true,
    isAdult: false,
  },
  {
    id: 'isabella',
    name: 'Isabella',
    image: '/character10.jpeg',
    //video: '/sample1.mp4',
    theme: 'midnight-blue',
    likes: '48K',
    views: '7m',
    tags: [],
    online: false,
    isAdult: false,
  },

  // Additional Normal Characters (10 New Models)
  {
    id: 'luna',
    name: 'Luna',
    image: '/models/ava.jpg',
    theme: 'mystic-purple',
    likes: '42K',
    views: '3.2m',
    tags: ['New'],
    online: true,
    isAdult: false,
  },
  {
    id: 'amber',
    name: 'Amber',
    image: '/models/keerthi.jpg',
    theme: 'golden-luxe',
    likes: '56K',
    views: '6.8m',
    tags: [],
    online: true,
    isAdult: false,
  },
  {
    id: 'scarlett',
    name: 'Scarlett',
    image: '/models/lokah.jpg',
    theme: 'romantic-pink',
    likes: '34K',
    views: '2.1m',
    tags: ['New'],
    online: false,
    isAdult: false,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    image: '/models/pooja.jpg',
    theme: 'midnight-blue',
    likes: '67K',
    views: '9.5m',
    tags: [],
    online: true,
    isAdult: false,
  },
  {
    id: 'maya',
    name: 'Maya',
    image: '/models/ruku.jpg',
    theme: 'romantic-pink',
    likes: '45K',
    views: '4.3m',
    tags: ['New'],
    online: true,
    isAdult: false,
  },
  {
    id: 'violet',
    name: 'Violet',
    image: '/models/samantha.jpg',
    theme: 'mystic-purple',
    likes: '51K',
    views: '5.7m',
    tags: [],
    online: false,
    isAdult: false,
  },
  {
    id: 'iris',
    name: 'Iris',
    image: '/character6.jpeg',
    theme: 'golden-luxe',
    likes: '38K',
    views: '2.9m',
    tags: ['New'],
    online: true,
    isAdult: false,
  },
  {
    id: 'rose',
    name: 'Rose',
    image: '/character8.jpeg',
    theme: 'romantic-pink',
    likes: '63K',
    views: '8.1m',
    tags: [],
    online: true,
    isAdult: false,
  },
  {
    id: 'jade',
    name: 'Jade',
    image: '/character9.jpeg',
    theme: 'midnight-blue',
    likes: '49K',
    views: '6.2m',
    tags: ['New'],
    online: false,
    isAdult: false,
  },
  {
    id: 'crystal',
    name: 'Crystal',
    image: '/character10.jpeg',
    theme: 'mystic-purple',
    likes: '58K',
    views: '7.4m',
    tags: [],
    online: true,
    isAdult: false,
  },

  // Adult characters
  {
    id: 'seraphina',
    name: 'Seraphina',
    image: '/adultonly/ado10.jpg',
    //video: '/sample1.mp4',
    theme: 'seductive-red',
    likes: '44K',
    views: '3m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'zara',
    name: 'Zara',
    image: '/adultonly/ado11.jpg',
    //video: '/sample1.mp4',
    theme: 'golden-luxe',
    likes: '61K',
    views: '1m',
    tags: ['Adult'],
    online: false,
    isAdult: true,
  },
  {
    id: 'nova',
    name: 'Nova',
    image: '/adultonly/ado12.jpg',
    //video: '/sample1.mp4',
    theme: 'seductive-red',
    likes: '72K',
    views: '30m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'mia-stark',
    name: 'Mia Stark',
    image: '/adultonly/ado13.jpg',
    //video: '/sample1.mp4',
    theme: 'mystic-purple',
    likes: '33K',
    views: '4m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'nova-2',
    name: 'Nova II',
    image: '/adultonly/ado14.jpg',
    //video: '/sample1.mp4',
    theme: 'seductive-red',
    likes: '72K',
    views: '30m',
    tags: ['New', 'Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'katarina',
    name: 'Katarina',
    image: '/adultonly/ado2.jpg',
    //video: '/sample1.mp4',
    theme: 'seductive-red',
    likes: '88K',
    views: '12m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'lilith',
    name: 'Lilith',
    image: '/adultonly/ado3.jpg',
    //video: '/sample1.mp4',
    theme: 'sultry-black',
    likes: '91K',
    views: '15m',
    tags: ['New', 'Adult'],
    online: false,
    isAdult: true,
  },
  {
    id: 'raven',
    name: 'Raven',
    image: '/adultonly/ado4.jpg',
    //video: '/sample1.mp4',
    theme: 'mystic-purple',
    likes: '76K',
    views: '10m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    image: '/adultonly/ado5.jpg',
    //video: '/sample1.mp4',
    theme: 'golden-luxe',
    likes: '82K',
    views: '11m',
    tags: ['Adult'],
    online: false,
    isAdult: true,
  },
  {
    id: 'ember',
    name: 'Ember',
    image: '/adultonly/ado7.jpg',
    //video: '/sample1.mp4',
    theme: 'seductive-red',
    likes: '95K',
    views: '20m',
    tags: ['New', 'Adult'],
    online: true,
    isAdult: true,
  },

  // Additional Adult Characters (10 New Models)
  {
    id: 'scarlet-rose',
    name: 'Scarlet Rose',
    image: '/adultonly/ado2.jpg',
    theme: 'seductive-red',
    likes: '78K',
    views: '14m',
    tags: ['Adult', 'New'],
    online: true,
    isAdult: true,
  },
  {
    id: 'midnight-fox',
    name: 'Midnight Fox',
    image: '/adultonly/ado3.jpg',
    theme: 'sultry-black',
    likes: '102K',
    views: '25m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'velvet',
    name: 'Velvet',
    image: '/adultonly/ado4.jpg',
    theme: 'mystic-purple',
    likes: '86K',
    views: '18m',
    tags: ['Adult', 'New'],
    online: false,
    isAdult: true,
  },
  {
    id: 'golden-goddess',
    name: 'Golden Goddess',
    image: '/adultonly/ado5.jpg',
    theme: 'golden-luxe',
    likes: '124K',
    views: '32m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'crimson',
    name: 'Crimson',
    image: '/adultonly/ado7.jpg',
    theme: 'seductive-red',
    likes: '93K',
    views: '21m',
    tags: ['Adult', 'New'],
    online: true,
    isAdult: true,
  },
  {
    id: 'shadow-queen',
    name: 'Shadow Queen',
    image: '/adultonly/ado10.jpg',
    theme: 'sultry-black',
    likes: '110K',
    views: '28m',
    tags: ['Adult'],
    online: false,
    isAdult: true,
  },
  {
    id: 'diamond-diva',
    name: 'Diamond Diva',
    image: '/adultonly/ado11.jpg',
    theme: 'golden-luxe',
    likes: '89K',
    views: '19m',
    tags: ['Adult', 'New'],
    online: true,
    isAdult: true,
  },
  {
    id: 'violet-vixen',
    name: 'Violet Vixen',
    image: '/adultonly/ado12.jpg',
    theme: 'mystic-purple',
    likes: '97K',
    views: '23m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
  {
    id: 'ruby-temptress',
    name: 'Ruby Temptress',
    image: '/adultonly/ado13.jpg',
    theme: 'seductive-red',
    likes: '115K',
    views: '30m',
    tags: ['Adult', 'New'],
    online: false,
    isAdult: true,
  },
  {
    id: 'obsidian-angel',
    name: 'Obsidian Angel',
    image: '/adultonly/ado14.jpg',
    theme: 'sultry-black',
    likes: '106K',
    views: '26m',
    tags: ['Adult'],
    online: true,
    isAdult: true,
  },
];


const tags = ['Asian', 'Redhead', 'Latina', 'Athletic', 'Gothic', 'Brunette', 'Slim', 'Blonde', 'American', 'Ebony', 'Extrovert', 'High Heels', 'Monster'];

export function LandingPage() {
  const router = useRouter();
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isAdultOnly, setIsAdultOnly] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Mock user check
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const displayedCharacters = useMemo(() => {
    return allCharacters.filter(character => character.isAdult === isAdultOnly);
  }, [isAdultOnly]);

  const handleCharacterSelect = (character: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCharacter', JSON.stringify(character));
    }
    router.push('/chat');
  };
  
  const handleSubscription = () => {
    localStorage.setItem('isPremium', 'true');
    toast({
      title: "Welcome to Premium!",
      description: (
        <div className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-primary" />
          <span>You now have unlimited access. Enjoy!</span>
        </div>
      ),
    });
  };

  const handleDonation = () => {
    toast({
      title: "Thank You! 💕",
      description: "Your support helps us develop more amazing features!",
    });
  };

  const handleAdultOnlyToggle = (checked: boolean) => {
    setIsAdultOnly(checked);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const SidebarNav = () => (
    <div className="flex flex-col h-full text-sm">
        <nav className="flex-grow space-y-3">
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 border border-transparent hover:border-pink-500/30 rounded-xl py-3 transition-all duration-300 group">
              <Compass className="mr-3 group-hover:text-pink-400 transition-colors" /> 
              <span className="group-hover:text-white transition-colors">Explore Models</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-600/20 border border-transparent hover:border-purple-500/30 rounded-xl py-3 transition-all duration-300 group">
              <Video className="mr-3 group-hover:text-purple-400 transition-colors" /> 
              <span className="group-hover:text-white transition-colors">Generate Video</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-600/20 border border-transparent hover:border-yellow-500/30 rounded-xl py-3 transition-all duration-300 group">
              <Star className="mr-3 group-hover:text-yellow-400 transition-colors" /> 
              <span className="group-hover:text-white transition-colors">Generate Image</span>
            </Button>
            <Button className="w-full justify-start bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 text-white text-base my-4 font-semibold py-4 rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 border border-pink-400/30 hover:border-pink-300/50 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <PlusSquare className="mr-3 relative z-10" /> 
              <span className="relative z-10">Create my AI Girlfriend</span>
            </Button>
            
            <div className="pt-6 space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-600/20 border border-transparent hover:border-blue-500/30 rounded-xl py-3 transition-all duration-300 group"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <User className="mr-3 group-hover:text-blue-400 transition-colors" /> 
                  <span className="group-hover:text-white transition-colors">My Profile</span>
                </Button>
                
                {/* User Profile Details */}
                {showProfile && user && (
                  <div className="ml-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-xl space-y-3">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-300 font-semibold">Profile Details</span>
                      </div>
                      
                      <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white font-medium">{user.name || user.email}</span>
                        </div>
                        
                        {/* Normalized Mobile Number with Country Code */}
                        {(() => {
                          const raw = user.mobileNumber || user.mobile;
                          const cc = user.countryCode;
                          const num = raw?.toString().replace(/\D/g, '') || '';
                          const ccNum = cc?.toString().replace(/[^\d]/g, '') || '';
                          const phone = [ccNum && `+${ccNum}`, num].filter(Boolean).join(' ');
                          
                          return (num || ccNum) && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Mobile:</span>
                              <span className="text-white font-medium">
                                {phone || 'Not provided'}
                              </span>
                            </div>
                          );
                        })()}
                        
                        {user.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Email:</span>
                            <span className="text-white font-medium text-xs">{user.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-blue-500/20 mt-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-center" 
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" /> 
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {showProfile && !user && (
                  <div className="ml-4 p-4 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl">
                    <div className="text-sm text-gray-400 text-center">
                      <User className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                      <p>Please login to view profile</p>
                      <Link href="/login">
                        <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                          <LogIn className="mr-2 h-4 w-4" /> Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-600/20 border border-transparent hover:border-emerald-500/30 rounded-xl py-3 transition-all duration-300 group">
                  <Star className="mr-3 group-hover:text-emerald-400 transition-colors" /> 
                  <span className="group-hover:text-white transition-colors">My Models</span>
                </Button>
                <Suspense fallback={<div className="h-12 bg-gray-800 rounded animate-pulse"></div>}>
                  <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                      <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger className="text-base font-normal hover:no-underline py-2 px-4 hover:bg-accent rounded-md data-[state=open]:bg-accent data-[state=open]:text-white text-gray-300"><MessageSquare className="mr-3" /> My Chats</AccordionTrigger>
                          <AccordionContent className="pl-8 pt-2 space-y-2">
                              <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-accent/50">
                                  <Image src="/character.jpg" alt="Trisha" width={40} height={40} className="rounded-full object-cover" />
                                  <div>
                                      <p className="font-semibold text-white">Trisha</p>
                                      <p className="text-xs text-muted-foreground">Trisha sent you a pic...</p>
                                  </div>
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                  </Accordion>
                </Suspense>
            </div>
        </nav>
        <div className="mt-auto space-y-4 pt-6 border-t border-gradient-to-r from-pink-500/20 to-purple-600/20">
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-600/20 border border-transparent hover:border-orange-500/30 rounded-xl py-3 transition-all duration-300 group">
              <Share2 className="mr-3 group-hover:text-orange-400 transition-colors" /> 
              <span className="group-hover:text-white transition-colors">Affiliate Program</span>
            </Button>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                 <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white"><HelpCircle className="mr-2 h-4 w-4" /> Feedback</Button>
                 {user ? (
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      {user.name || 'Logged In'}
                    </div>
                 ) : (
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white"><LogIn className="mr-2 h-4 w-4" /> Login</Button>
                    </Link>
                 )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      <div className="flex">
        <aside className="w-72 h-screen p-6 bg-gradient-to-b from-[#0A0A0B] via-[#1A1A1E] to-[#0F0F10] border-r border-gradient-to-b from-pink-500/20 to-purple-600/20 hidden lg:block sticky top-0 backdrop-blur-xl">
             <div className="flex items-center justify-center gap-3 mb-10 p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 backdrop-blur-sm">
               <div className="relative">
                 <Image src="/logo.png" alt="Yuki AI Logo" width={48} height={48} className="rounded-xl shadow-lg shadow-pink-500/20" />
                 <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-30 animate-pulse"></div>
               </div>
               <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 drop-shadow-lg">Yuki AI</h1>
             </div>
             <SidebarNav />
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 bg-gradient-to-r from-[#0A0A0B]/90 via-[#1A1A1E]/90 to-[#0A0A0B]/90 backdrop-blur-xl border-b border-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 p-2 px-4 sm:p-4 flex justify-between items-center shadow-lg shadow-black/20">
             <div className="flex items-center gap-4">
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[320px] bg-gradient-to-b from-[#0A0A0B] via-[#1A1A1E] to-[#0F0F10] p-6 border-r border-pink-500/20 backdrop-blur-xl">
                            <SheetHeader>
                               <div className="flex items-center justify-center gap-3 mb-10 p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 backdrop-blur-sm">
                                 <div className="relative">
                                   <Image src="/logo.png" alt="Yuki AI Logo" width={40} height={40} className="rounded-xl shadow-lg shadow-pink-500/20" />
                                   <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-30 animate-pulse"></div>
                                 </div>
                                 <SheetTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 drop-shadow-lg">Yuki AI</SheetTitle>
                               </div>
                               <SheetDescription className="sr-only">Main navigation menu and options.</SheetDescription>
                            </SheetHeader>
                             <SidebarNav />
                        </SheetContent>
                    </Sheet>
                </div>
                 <div className="hidden sm:flex items-center gap-6 text-base font-semibold">
                     <Button variant="ghost" className="text-pink-400 border-b-2 border-pink-400 rounded-none px-3 py-2 h-auto hover:text-pink-300 hover:border-pink-300 bg-gradient-to-r from-pink-500/10 to-purple-600/10 transition-all duration-300">Girls</Button>
                     <Button variant="ghost" className="text-gray-400 hover:text-white px-3 py-2 h-auto hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-600/10 rounded-lg transition-all duration-300">Anime</Button>
                 </div>
             </div>
             <div className="flex items-center gap-4">
                <Suspense fallback={<Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold" disabled>Loading...</Button>}>
                  <PremiumDialog
                      open={isPremiumDialogOpen}
                      onOpenChange={setIsPremiumDialogOpen}
                  >
                      <Button className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 hover:from-yellow-500 hover:via-orange-600 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-xl shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-yellow-300/50 hover:border-yellow-200/70 transition-all duration-300 group overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <Crown className="mr-2 relative z-10 group-hover:rotate-12 transition-transform duration-300" /> 
                          <span className="relative z-10 font-extrabold text-lg">✨ Become Premium ✨</span>
                          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      </Button>
                  </PremiumDialog>
                </Suspense>
                
                <Suspense fallback={<Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold" disabled>Loading...</Button>}>
                  <DonationDialog
                      open={isDonationDialogOpen}
                      onOpenChange={setIsDonationDialogOpen}
                  >
                      <Button className="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 border-2 border-pink-300/50 hover:border-pink-200/70 transition-all duration-300 group overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <Heart className="mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" /> 
                          <span className="relative z-10 font-extrabold text-lg">💝 Donate</span>
                          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      </Button>
                  </DonationDialog>
                </Suspense>
                {!user && (
                    <Link href="/login">
                        <Button variant="outline" className="hidden sm:inline-flex bg-zinc-900 border-zinc-700 hover:bg-zinc-800">Login</Button>
                    </Link>
                )}
             </div>
          </header>

          <div className="p-2 sm:p-4 md:p-6">
            {/* Premium SEO Hero Section */}
            <div className="text-center mb-12 px-4">
              <h1 className="text-5xl md:text-7xl font-black mb-6 premium-text drop-shadow-2xl tracking-tight leading-tight float-animation">
                Your Perfect AI Girlfriend Awaits
              </h1>
              <p className="text-xl md:text-3xl text-gray-200 mb-8 max-w-4xl mx-auto font-medium leading-relaxed">
                Experience the future of virtual relationships with Yuki AI. Chat with beautiful AI girlfriends, enjoy intimate conversations, and build meaningful connections with advanced AI companions.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 mb-10">
                <span className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 px-4 py-3 rounded-full backdrop-blur-sm premium-glow font-semibold">🤖 Advanced AI Technology</span>
                <span className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 px-4 py-3 rounded-full backdrop-blur-sm premium-glow font-semibold">💕 Emotional Intelligence</span>
                <span className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 px-4 py-3 rounded-full backdrop-blur-sm premium-glow font-semibold">🌟 Personalized Experience</span>
                <span className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 px-4 py-3 rounded-full backdrop-blur-sm premium-glow font-semibold">🔒 Private & Secure</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                  <Sparkles className="text-pink-400 w-5 h-5" />
                  <p className="font-semibold text-base sm:text-lg">Adult only</p>
                  <Switch
                    checked={isAdultOnly}
                    onCheckedChange={handleAdultOnlyToggle}
                  />
                  <Sparkles className="text-pink-400 w-5 h-5" />
              </div>

              <Suspense fallback={<Button variant="outline" className="bg-zinc-900 border-zinc-700" disabled>Loading...</Button>}>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-[#1C1C1E] border-l-border" side="right">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Select tags to refine the characters shown.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-xs sm:text-sm"
                          >
                            <PlusSquare className="h-4 w-4 mr-2" /> {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <SheetFooter>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Apply Filters
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </Suspense>
            </div>

            <div className="character-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
              {displayedCharacters.map(character => (
                <Card key={character.id} className="relative bg-card border-none rounded-3xl group cursor-pointer shadow-lg hover:z-10 hover:shadow-2xl hover:shadow-primary/20 transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:scale-105 [transform:translateZ(0)]" onClick={() => handleCharacterSelect(character)}>
                  <CardContent className="p-0 overflow-hidden rounded-[calc(1.5rem-1px)]">
                    <div className="relative h-[320px] sm:h-[320px] w-full overflow-hidden">
                       <video
                        src={character.video}
                        poster={character.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all duration-300 group-hover:from-black/95 group-hover:via-black/50"></div>
                       {character.tags?.includes('New') && <Badge className="absolute top-2 left-2 bg-primary border-none text-primary-foreground font-semibold">New</Badge>}
                       <div className="absolute top-2 right-2 flex flex-col items-center gap-2">
                            <Button size="icon" className="h-8 w-8 bg-black/50 hover:bg-primary backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"><MessageSquare className="h-4 w-4" /></Button>
                            {character.online && <div className="h-2 w-2 rounded-full bg-green-400 ring-2 ring-offset-2 ring-offset-black/50 ring-green-400 animate-pulse"></div>}
                       </div>
                       <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-xs font-bold">
                           <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm py-0.5 px-1.5 rounded-md transition-all duration-500 group-hover:bg-primary/80 group-hover:shadow-lg"><Heart className="h-3 w-3 text-red-400"/> {character.likes}</div>
                           <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm py-0.5 px-1.5 rounded-md transition-all duration-500 group-hover:bg-primary/80 group-hover:shadow-lg"><Eye className="h-3 w-3 text-blue-300"/> {character.views}</div>
                       </div>
                    </div>
                    <div className="p-3 bg-card">
                      <h3 className="font-semibold text-white transition-colors duration-500 group-hover:text-primary">{character.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
