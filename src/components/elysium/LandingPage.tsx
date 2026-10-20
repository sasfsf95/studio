
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Compass,
  Star,
  User,
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
  ImagePlus,
  Video,
  Phone,
  ChevronRight,
  Zap,
  Bot,
} from 'lucide-react';
import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Lazy load heavy components
const Sheet = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.Sheet })));
const SheetContent = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetContent })));
const SheetDescription = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetDescription })));
const SheetFooter = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetFooter })));
const SheetHeader = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetHeader })));
const SheetTitle = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetTitle })));
const SheetTrigger = lazy(() => import('@/components/ui/sheet').then(m => ({ default: m.SheetTrigger })));
const PremiumDialog = lazy(() => import('./PremiumDialog').then(m => ({ default: m.PremiumDialog })));
const DonationDialog = lazy(() => import('./DonationDialog').then(m => ({ default: m.DonationDialog })));

import { allCharacters } from '@/data/characters';


const tags = ['Asian', 'Redhead', 'Latina', 'Athletic', 'Gothic', 'Brunette', 'Slim', 'Blonde', 'American', 'Ebony', 'Extrovert', 'High Heels', 'Monster'];

export function LandingPage() {
  const router = useRouter();
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // User check
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const storedPlan = localStorage.getItem('user_plan');
        if (storedPlan) {
          parsed.plan = JSON.parse(storedPlan);
        }
        setUser(parsed);
      } catch (e) {}
    }
  }, []);


  const displayedCharacters = useMemo(() => {
    return allCharacters.filter(character => !character.isAdult);
  }, []);

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



  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('user_plan');
    localStorage.removeItem('isPremium');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const SidebarNav = () => (
    <div className="flex flex-col h-full">

      {/* ── MAIN MODULES ─────────────────────────── */}
      <nav className="flex-grow space-y-1 overflow-y-auto pr-1 thin-scroll">

        {/* Section: Discover */}
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-3 pt-2 pb-1">Discover</p>

        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-pink-300 bg-gradient-to-r from-pink-500/20 to-purple-600/15 border border-pink-500/25 hover:border-pink-400/50 hover:from-pink-500/30 hover:to-purple-600/25 transition-all duration-200 group"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30">
            <Compass className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left">Explore Girls</span>
          <ChevronRight className="h-3.5 w-3.5 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-200 group"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <MessageSquare className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left">My Chats</span>
          <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Section: Create */}
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-3 pt-5 pb-1">Create</p>

        {/* Create Image */}
        <button
          onClick={() => toast({ title: '🖼️ Coming Soon!', description: 'AI image generation is on the way.' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-200 group"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/25">
            <ImagePlus className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left">Create Image</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">SOON</span>
        </button>

        {/* Generate Video */}
        <button
          onClick={() => toast({ title: '🎬 Coming Soon!', description: 'AI video generation is coming soon.' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-200 group"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
            <Video className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left">Generate Video</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">SOON</span>
        </button>

        {/* AI Calls */}
        <button
          onClick={() => toast({ title: '📞 Coming Soon!', description: 'Voice calls with your AI companion are coming.' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-200 group"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/25">
            <Phone className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left">AI Calls</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">SOON</span>
        </button>

        {/* Create AI GF */}
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:via-fuchsia-600 hover:to-purple-700 border border-pink-400/30 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-200 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <Bot className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left relative z-10">Create AI Girlfriend</span>
          <Zap className="h-3.5 w-3.5 text-yellow-300 relative z-10" />
        </button>

        {/* Section: Account */}
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-3 pt-5 pb-1">Account</p>

        {/* My Models */}
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-200 group"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
            <Star className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left">My Models</span>
          <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* My Profile */}
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-200 group"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/25">
            <User className="h-4 w-4 text-white" />
          </span>
          <span className="flex-1 text-left">My Profile</span>
          <ChevronRight className={`h-3.5 w-3.5 transition-all duration-200 ${showProfile ? 'rotate-90 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
        </button>

        {/* Profile Dropdown */}
        {showProfile && user && (
          <div className="mx-2 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl space-y-2.5 text-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">{user.name || 'User'}</p>
                <p className="text-white/40 text-xs">{user.email || ''}</p>
              </div>
            </div>
            {(() => {
              const raw = user.mobileNumber || user.mobile;
              const cc = user.countryCode;
              const num = raw?.toString().replace(/\D/g, '') || '';
              const ccNum = cc?.toString().replace(/[^\d]/g, '') || '';
              const phone = [ccNum && `+${ccNum}`, num].filter(Boolean).join(' ');
              return (num || ccNum) && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Mobile</span>
                  <span className="text-white/80 font-medium">{phone}</span>
                </div>
              );
            })()}
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-white/40 text-xs">Plan</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                user.plan?.premium_plan > 0
                  ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white'
                  : 'bg-white/10 text-pink-300'
              }`}>
                {user.plan?.premium_plan > 0 ? '👑 Premium' : 'Free Plan'}
              </span>
            </div>
            {user.plan?.premium_plan === 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Messages Left</span>
                <span className="text-pink-400 font-semibold">{user.plan.monthly_message_limit ?? 30} / 30</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        )}
        {showProfile && !user && (
          <div className="mx-2 p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-white/20" />
            <p className="text-white/40 text-xs mb-3">Please login to view profile</p>
            <Link href="/login">
              <button className="w-full py-1.5 rounded-lg text-xs text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold transition-all">
                <LogIn className="inline mr-1 h-3.5 w-3.5" /> Login
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* ── FOOTER ───────────────────────────────── */}
      <div className="pt-4 mt-4 border-t border-white/8 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 group">
          <Share2 className="h-4 w-4" />
          <span>Affiliate Program</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 group">
          <HelpCircle className="h-4 w-4" />
          <span>Feedback</span>
        </button>
        {user ? (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">{user.name || 'Logged In'}</span>
          </div>
        ) : (
          <Link href="/login">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-liquid-flow text-white min-h-screen relative overflow-hidden">
      {/* Animated Liquid Background Glowing Spots */}
      <div className="bg-glow-spot top-10 left-[10%] z-0"></div>
      <div className="bg-glow-spot-2 bottom-10 right-[15%] z-0"></div>
      
      <div className="flex relative z-10">
        <aside className="w-72 h-screen p-6 liquid-glass rounded-none border-t-0 border-l-0 border-b-0 hidden lg:block sticky top-0 backdrop-blur-xl z-20">
          <div className="flex items-center justify-center gap-3 mb-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 drop-shadow-lg">Girl.ai</h1>
          </div>
          <SidebarNav />
        </aside>

        <main className="flex-1 relative overflow-hidden">
          {/* Animated Background */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="bg-blob bg-pink-500/10 w-[500px] h-[500px] top-[-100px] left-[-100px] animate-float"></div>
            <div className="bg-blob bg-purple-600/10 w-[600px] h-[600px] bottom-[-100px] right-[-100px] animate-float-delayed"></div>
            <div className="bg-blob bg-blue-500/5 w-[400px] h-[400px] top-[40%] left-[30%] animate-float" style={{ animationDuration: '10s' }}></div>
          </div>

          <div className="relative z-10">
            <header className="sticky top-0 z-20 liquid-glass rounded-none border-t-0 border-l-0 border-r-0 backdrop-blur-xl p-2 px-3 sm:px-4 flex justify-between items-center shadow-lg shadow-black/20 pt-safe">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-white/80 hover:text-white shrink-0">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85vw] max-w-[320px] liquid-glass border-t-0 border-l-0 border-b-0 rounded-none p-5 backdrop-blur-xl">
                      <SheetHeader>
                        <div className="flex items-center justify-center gap-3 mb-8 p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 backdrop-blur-sm">
                          <SheetTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 drop-shadow-lg">Girl.ai</SheetTitle>
                        </div>
                        <SheetDescription className="sr-only">Main navigation menu and options.</SheetDescription>
                      </SheetHeader>
                      <SidebarNav />
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="flex items-center gap-1.5 lg:hidden">
                  <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500">Girl.ai</span>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-base font-semibold">
                  <Button variant="ghost" className="text-pink-400 border-b-2 border-pink-400 rounded-none px-3 py-2 h-auto hover:text-pink-300 hover:border-pink-300 bg-gradient-to-r from-pink-500/10 to-purple-600/10 transition-all duration-300">Girls</Button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                <Link href="/subscribe">
                  <Button className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 hover:from-yellow-500 hover:via-orange-600 hover:to-yellow-700 text-black font-extrabold h-8 sm:h-11 px-2.5 sm:px-5 rounded-xl shadow-lg shadow-yellow-500/20 border border-yellow-300/40 text-xs sm:text-base group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Crown className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Premium</span>
                  </Button>
                </Link>

                <Suspense fallback={null}>
                  <DonationDialog
                    open={isDonationDialogOpen}
                    onOpenChange={setIsDonationDialogOpen}
                  >
                    <Button className="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold h-8 sm:h-11 px-2 sm:px-4 rounded-xl shadow-lg shadow-pink-500/20 border border-pink-300/30 text-xs sm:text-base group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <Heart className="sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative z-10 hidden xs:inline">Donate</span>
                    </Button>
                  </DonationDialog>
                </Suspense>
                {!user ? (
                  <Link href="/login">
                    <Button variant="outline" className="h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm liquid-glass text-white border-white/20 hover:bg-white/20 rounded-xl">Login</Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowProfile(!showProfile)}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-xs"
                  >
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </Button>
                )}
              </div>
            </header>

            <div className="p-2 sm:p-4 md:p-6 max-w-full overflow-hidden">
              {/* Premium SEO Hero Section */}
              <div className="text-center mb-6 sm:mb-12 px-2 sm:px-4">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-6 premium-text drop-shadow-2xl tracking-tight leading-tight break-words">
                  Your Perfect AI Girlfriend Awaits
                </h1>
                <p className="text-sm sm:text-lg md:text-2xl text-gray-200 mb-5 sm:mb-8 max-w-4xl mx-auto font-medium leading-relaxed">
                  Experience the future of virtual relationships with Girl.ai. Chat with beautiful AI girlfriends, enjoy intimate conversations, and build meaningful connections with advanced companions.
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300 mb-6 sm:mb-10">
                  <span className="liquid-glass border border-pink-500/30 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full backdrop-blur-md font-semibold text-white">🤖 Advanced AI</span>
                  <span className="liquid-glass border border-purple-500/30 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full backdrop-blur-md font-semibold text-white">💕 Emotional Intelligence</span>
                  <span className="liquid-glass border border-yellow-500/30 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full backdrop-blur-md font-semibold text-white">🌟 Personalized</span>
                  <span className="liquid-glass border border-emerald-500/30 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full backdrop-blur-md font-semibold text-white">🔒 Private & Secure</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 mb-4 sm:mb-6">

                <Suspense fallback={<Button variant="outline" className="liquid-glass text-white border-white/20" disabled>Loading...</Button>}>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="liquid-glass text-white border-white/20 hover:bg-white/20 rounded-xl px-4 py-1.5 h-9 text-xs sm:text-sm">
                        <SlidersHorizontal className="mr-2 h-3.5 w-3.5 text-pink-400" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="liquid-glass-modal border-l border-white/20 p-5 backdrop-blur-2xl text-white w-[85vw] max-w-[340px]" side="right">
                      <SheetHeader>
                        <SheetTitle className="text-2xl font-bold text-white">Filters</SheetTitle>
                        <SheetDescription className="text-gray-300">
                          Select tags to refine the characters shown.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Button
                              key={tag}
                              variant="outline"
                              size="sm"
                              className="rounded-full liquid-glass border-white/20 hover:bg-pink-500/30 hover:border-pink-400 text-xs sm:text-sm text-white transition-all duration-300"
                            >
                              <PlusSquare className="h-3.5 w-3.5 mr-1.5 text-pink-400" /> {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <SheetFooter>
                        <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold h-11 rounded-xl border border-white/20 shadow-lg shadow-pink-500/25">
                          Apply Filters
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </Suspense>
              </div>

              <div className="character-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-6 p-1 sm:p-2 max-w-full">
                {displayedCharacters.map((character, index) => (
                  <Card
                    key={character.id}
                    className="relative liquid-glass rounded-2xl sm:rounded-3xl group cursor-pointer overflow-hidden premium-card-hover card-shine-effect border border-white/10"
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <CardContent className="p-0 overflow-hidden rounded-[calc(1rem-1px)] sm:rounded-[calc(1.5rem-1px)]">
                      <div className="relative h-[220px] xs:h-[260px] sm:h-[320px] w-full overflow-hidden">
                        <Image
                          src={character.image}
                          alt={character.name}
                          width={300}
                          height={400}
                          loading={index < 10 ? 'eager' : 'lazy'}
                          className="character-card-image absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/80"></div>
                        {character.tags?.includes('New') && <Badge className="absolute top-2 left-2 bg-primary border-none text-primary-foreground font-semibold text-[10px] px-1.5 py-0.5">New</Badge>}
                        <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5">
                          <Button size="icon" className="h-7 w-7 sm:h-8 sm:w-8 bg-black/50 hover:bg-primary backdrop-blur-sm transition-colors duration-300"><MessageSquare className="h-3.5 w-3.5" /></Button>
                          {character.online && <div className="h-2 w-2 rounded-full bg-green-400 ring-2 ring-offset-2 ring-offset-black/50 ring-green-400 animate-pulse"></div>}
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-white text-[10px] sm:text-xs font-bold">
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm py-0.5 px-1.5 rounded-md transition-colors duration-300 group-hover:bg-primary/80"><Heart className="h-2.5 w-2.5 text-red-400" /> {character.likes}</div>
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm py-0.5 px-1.5 rounded-md transition-colors duration-300 group-hover:bg-primary/80"><Eye className="h-2.5 w-2.5 text-blue-300" /> {character.views}</div>
                        </div>
                      </div>
                      <div className="p-2 sm:p-3 bg-black/30 backdrop-blur-md">
                        <h3 className="font-semibold text-white text-xs sm:text-base truncate transition-colors duration-300 group-hover:text-primary">{character.name}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
