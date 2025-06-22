"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Heart,
  Eye,
  PlusSquare,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const characters = [
    {
    id: 'aria',
    name: 'Aria',
    image: 'https://firebasestudio.ai/yuki-ai--yuki-ai/yv214d.png',
    hint: 'beautiful woman',
    theme: 'romantic-pink',
    likes: '38K',
    views: '3K',
    tags: ['New'],
    online: true,
  },
  {
    id: 'ivana',
    name: 'Ivana',
    image: 'https://placehold.co/400x600.png',
    hint: 'mysterious woman bondage',
    theme: 'mystic-purple',
    likes: '52K',
    views: '2m',
    online: true,
  },
  {
    id: 'chloe',
    name: 'Chloe',
    image: 'https://placehold.co/400x600.png',
    hint: 'playful woman glasses',
    theme: 'golden-luxe',
    likes: '39K',
    views: '2m',
    online: false,
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    image: 'https://placehold.co/400x600.png',
    hint: 'elegant woman lingerie',
    theme: 'seductive-red',
    likes: '44K',
    views: '3m',
    online: true,
  },
  {
    id: 'lila',
    name: 'Lila',
    image: 'https://placehold.co/400x600.png',
    hint: 'sweet woman',
    theme: 'romantic-pink',
    likes: '25K',
    views: '5m',
    online: true,
  },
  {
    id: 'zara',
    name: 'Zara',
    image: 'https://placehold.co/400x600.png',
    hint: 'adventurous woman',
    theme: 'golden-luxe',
    likes: '61K',
    views: '1m',
    online: false,
  },
  {
    id: 'mia',
    name: 'Mia',
    image: 'https://placehold.co/400x600.png',
    hint: 'artistic woman',
    theme: 'mystic-purple',
    likes: '33K',
    views: '4m',
    online: true,
  },
  {
    id: 'nova',
    name: 'Nova',
    image: 'https://placehold.co/400x600.png',
    hint: 'futuristic woman',
    theme: 'seductive-red',
    likes: '72K',
    views: '30m',
    online: true,
  }
];

const tags = ['Asian', 'Redhead', 'Latina', 'Athletic', 'Gothic', 'Brunette', 'Slim', 'Blonde', 'American', 'Ebony', 'Extrovert', 'High Heels', 'Monster'];

export function LandingPage() {
  const router = useRouter();

  const handleCharacterSelect = (character: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCharacter', JSON.stringify(character));
    }
    router.push('/chat');
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
                                <Image src="https://placehold.co/40x40.png" alt="Trisha" width={40} height={40} className="rounded-full" data-ai-hint="woman" />
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
            <Button variant="secondary" className="w-full justify-between bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 text-base font-bold">Become Premium <Badge variant="destructive" className="bg-destructive/80 text-white">-75% OFF</Badge></Button>
            <Button variant="ghost" className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-accent"><Share2 className="mr-3" /> Affiliate Program</Button>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4">
                 <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white"><HelpCircle className="mr-2 h-4 w-4" /> Feedback</Button>
                 <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
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
          <header className="sticky top-0 z-20 bg-[#1C1C1E]/80 backdrop-blur-sm border-b border-border p-4 flex justify-between items-center">
             <div className="flex items-center gap-6 text-base font-semibold">
                 <Button variant="ghost" className="text-primary border-b-2 border-primary rounded-none px-1 py-0 h-auto hover:text-primary">Girls</Button>
                 <Button variant="ghost" className="text-muted-foreground hover:text-white px-1 py-0 h-auto">Anime</Button>
                 <Button variant="ghost" className="text-muted-foreground hover:text-white px-1 py-0 h-auto">Guys</Button>
             </div>
             <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:opacity-90"><Crown className="mr-2" /> Become Premium</Button>
          </header>

          <div className="p-4 md:p-6">
            <div className="bg-zinc-900/50 border border-border p-4 rounded-lg mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Image src="https://placehold.co/150x150.png" width={100} height={100} alt="Indian Webcam" className="rounded-lg object-cover hidden sm:block" data-ai-hint="indian woman"/>
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">Hot Indian Webcams – 24x7 LIVE <Badge className="bg-orange-500 border-none text-white">hot</Badge></h2>
                        <p className="text-muted-foreground">100% Real देसी गर्ल्स CAM Chat ke liye online hain.</p>
                    </div>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full md:w-auto shadow-lg shadow-orange-500/20">Chat Shuru Karo!</Button>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Chat with Your Dream AI Girlfriend – Anytime, Anywhere</h2>
            <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="text-pink-400 w-5 h-5" />
                <Sparkles className="text-pink-500 w-5 h-5" />
                <Sparkles className="text-pink-400 w-5 h-5" />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked/>
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-800/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Button key={tag} variant="outline" size="sm" className="rounded-full bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600">
                    <PlusSquare className="h-4 w-4 mr-2" /> {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {characters.map(character => (
                <Card key={character.id} className="bg-card border-border overflow-hidden rounded-lg group cursor-pointer shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300" onClick={() => handleCharacterSelect(character)}>
                  <CardContent className="p-0">
                    <div className="relative h-[300px] w-full">
                      <Image
                        src={character.image}
                        alt={character.name}
                        data-ai-hint={character.hint}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                       {character.tags?.includes('New') && <Badge className="absolute top-2 left-2 bg-primary border-none text-primary-foreground font-semibold">New</Badge>}
                       <div className="absolute top-2 right-2 flex flex-col items-center gap-2">
                            <Button size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/80 backdrop-blur-sm"><MessageSquare className="h-4 w-4" /></Button>
                            {character.online && <div className="h-2 w-2 rounded-full bg-green-400 ring-2 ring-offset-2 ring-offset-black/50 ring-green-400 animate-pulse"></div>}
                       </div>
                       <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-xs font-bold">
                           <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm py-0.5 px-1.5 rounded-md"><Heart className="h-3 w-3 text-red-400"/> {character.likes}</div>
                           <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm py-0.5 px-1.5 rounded-md"><Eye className="h-3 w-3 text-blue-300"/> {character.views}</div>
                       </div>
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
