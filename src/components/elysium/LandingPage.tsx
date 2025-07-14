
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Upload,
  Menu,
  PartyPopper,
  SlidersHorizontal,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PremiumDialog } from './PremiumDialog';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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
];


const tags = ['Asian', 'Redhead', 'Latina', 'Athletic', 'Gothic', 'Brunette', 'Slim', 'Blonde', 'American', 'Ebony', 'Extrovert', 'High Heels', 'Monster'];

export function LandingPage() {
  const router = useRouter();
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isAdultOnly, setIsAdultOnly] = useState(false);
  const [user, setUser] = useState<any>(null);

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
        <nav className="flex-grow space-y-2">
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-accent"><Compass className="mr-3" /> Explore Models</Button>
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-accent"><Video className="mr-3" /> Generate Video</Button>
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-accent"><Star className="mr-3" /> Generate Image</Button>
            <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground text-base my-2 font-semibold"><PlusSquare className="mr-3" /> Create my Ai Girlfriend</Button>
            
            <div className="pt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-accent"><User className="mr-3" /> My profile</Button>
                <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-accent"><Star className="mr-3" /> My Models</Button>
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="text-base font-normal hover:no-underline py-2 px-4 hover:bg-accent rounded-md data-[state=open]:bg-accent data-[state=open]:text-white text-gray-300"><MessageSquare className="mr-3" /> My Chats</AccordionTrigger>
                        <AccordionContent className="pl-8 pt-2 space-y-2">
                            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-accent/50">
                                <img src="/character.jpg" alt="Trisha" width={40} height={40} className="rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-white">Trisha</p>
                                    <p className="text-xs text-muted-foreground">Trisha sent you a pic...</p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </nav>
        <div className="mt-auto space-y-2">
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-accent"><Share2 className="mr-3" /> Affiliate Program</Button>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4">
                 <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white"><HelpCircle className="mr-2 h-4 w-4" /> Feedback</Button>
                 {user ? (
                    <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
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
        <aside className="w-72 h-screen p-4 bg-[#1C1C1E] border-r border-border hidden lg:block sticky top-0">
             <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">yuki.ai</h1>
             <SidebarNav />
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 bg-[#1C1C1E]/80 backdrop-blur-sm border-b border-border p-2 px-4 sm:p-4 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] bg-[#1C1C1E] p-4 border-r-0">
                            <SheetHeader>
                               <SheetTitle className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">yuki.ai</SheetTitle>
                               <SheetDescription className="sr-only">Main navigation menu and options.</SheetDescription>
                            </SheetHeader>
                             <SidebarNav />
                        </SheetContent>
                    </Sheet>
                </div>
                 <div className="hidden sm:flex items-center gap-6 text-base font-semibold">
                     <Button variant="ghost" className="text-primary border-b-2 border-primary rounded-none px-1 py-0 h-auto hover:text-primary">Girls</Button>
                     <Button variant="ghost" className="text-muted-foreground hover:text-white px-1 py-0 h-auto">Anime</Button>
                 </div>
             </div>
             <div className="flex items-center gap-4">
                <PremiumDialog
                    open={isPremiumDialogOpen}
                    onOpenChange={setIsPremiumDialogOpen}
                    onSubscribed={handleSubscription}
                >
                    <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:opacity-90"><Crown className="mr-2" /> Become Premium</Button>
                </PremiumDialog>
                {!user && (
                    <Link href="/login">
                        <Button variant="outline" className="hidden sm:inline-flex bg-zinc-900 border-zinc-700 hover:bg-zinc-800">Login</Button>
                    </Link>
                )}
             </div>
          </header>

          <div className="p-2 sm:p-4 md:p-6">
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
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
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
