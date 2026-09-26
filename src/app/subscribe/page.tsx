
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft, Check, Crown, Image as ImageIcon, MessageSquare, Mic, Star, Video, Zap, X, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const tiers = [
  {
    name: 'Starter',
    monthlyPrice: '₹49',
    yearlyPrice: '₹42',
    description: 'Basic access to AI companionship.',
    features: [
      { text: '100 Messages / Month', icon: <MessageSquare className="h-4 w-4 text-muted-foreground" /> },
      { text: 'Access to Standard Models', icon: <Check className="h-4 w-4 text-blue-500" /> },
      { text: 'Fast Response Time', icon: <Check className="h-4 w-4 text-blue-500" /> },
    ],
    buttonVariant: 'secondary',
    icon: <Star className="h-6 w-6 text-blue-400" />,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    iconBg: 'bg-blue-500/20',
    barColor: 'bg-blue-500',
    monthlyLink: 'https://upilinks.in/payment-link/upi151176627',
    yearlyLink: 'https://upilinks.in/payment-link/upi19979202'
  },
  {
    name: 'Visual',
    monthlyPrice: '₹99',
    yearlyPrice: '₹84',
    description: 'Experience the connection with photos.',
    features: [
      { text: 'Unlimited Messages', icon: <Star className="h-4 w-4 text-purple-400" /> },
      { text: 'Receive Photos', icon: <ImageIcon className="h-4 w-4 text-purple-400" /> },
      { text: 'Access to Premium Models', icon: <Crown className="h-4 w-4 text-purple-400" /> },
      { text: 'Unlock Intimate Chats', icon: <Heart className="h-4 w-4 text-purple-400" /> },
      { text: 'Priority Support', icon: <Check className="h-4 w-4 text-purple-400" /> },
    ],
    buttonVariant: 'primary',
    bestValue: true,
    icon: <ImageIcon className="h-6 w-6 text-purple-300" />,
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/50',
    iconBg: 'bg-purple-500/20',
    barColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    monthlyLink: 'https://upilinks.in/payment-link/upi301544689',
    yearlyLink: 'https://upilinks.in/payment-link/upi88052333'
  },
  {
    name: 'Elite',
    monthlyPrice: '₹300',
    yearlyPrice: '₹255',
    description: 'Full immersion with video & audio clips.',
    features: [
      { text: 'Everything in Visual', icon: <Check className="h-4 w-4 text-orange-500" /> },
      { text: 'Exclusive Video Content', icon: <Video className="h-4 w-4 text-orange-500" /> },
      { text: 'Audio Voice Notes', icon: <Mic className="h-4 w-4 text-orange-500" /> },
      { text: 'Early Access to New Features', icon: <Zap className="h-4 w-4 text-orange-500" /> },
    ],
    buttonVariant: 'secondary',
    icon: <Crown className="h-6 w-6 text-orange-400" />,
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    iconBg: 'bg-orange-500/20',
    barColor: 'bg-orange-500',
    monthlyLink: 'https://upilinks.in/payment-link/upi569533443',
    yearlyLink: 'https://upilinks.in/payment-link/upi1403802984'
  },
];

export default function SubscribePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const router = useRouter();

  return (
    <div className="bg-liquid-flow min-h-screen text-white p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient background glowing spots */}
      <div className="bg-glow-spot top-10 left-1/4 z-0"></div>
      <div className="bg-glow-spot-2 bottom-10 right-1/4 z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-8 inline-flex items-center gap-2 text-gray-300 hover:text-white liquid-glass rounded-full px-5 py-2 border border-white/10 hover:border-white/30 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Models
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 drop-shadow-xl tracking-tight">
            CHOOSE YOUR CONNECTION
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto font-medium">
            Unlock deeper levels of intimacy with photos, audio, and video content.
          </p>
        </div>

        <div className="flex justify-center items-center mb-12">
          <div className="liquid-glass p-1.5 rounded-full flex items-center gap-2 border border-white/15 backdrop-blur-xl shadow-xl">
            <Button
              onClick={() => setBillingCycle('monthly')}
              variant={billingCycle === 'monthly' ? 'secondary' : 'ghost'}
              className={cn(
                "rounded-full px-6 transition-all duration-300 font-semibold",
                billingCycle === 'monthly' ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-lg border border-white/20' : 'text-gray-300 hover:text-white'
              )}
            >
              Monthly
            </Button>
            <Button
              onClick={() => setBillingCycle('yearly')}
              variant={billingCycle === 'yearly' ? 'secondary' : 'ghost'}
              className={cn(
                "rounded-full px-6 transition-all duration-300 relative font-semibold",
                billingCycle === 'yearly' ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-lg border border-white/20' : 'text-gray-300 hover:text-white'
              )}
            >
              Yearly
              <span className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md animate-pulse">
                SAVE 15%
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'liquid-glass-card rounded-3xl flex flex-col relative overflow-hidden transition-all duration-500 transform hover:-translate-y-2',
                tier.borderColor,
                tier.bestValue ? 'border-pink-500/60 shadow-[0_0_40px_rgba(236,72,153,0.3)]' : 'border-white/10'
              )}
            >
              <div className={cn("h-1.5 w-full rounded-t-3xl", tier.barColor)}></div>
              {tier.bestValue && (
                <div className="absolute top-3 right-4">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-white/20">
                    Best Value
                  </div>
                </div>
              )}
              <CardHeader className="pt-8 px-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md", tier.iconBg)}>
                    {tier.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">{tier.name}</CardTitle>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                    {billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                  </span>
                  <span className="text-gray-400 font-medium">/mo</span>
                </div>
                <p className="text-sm text-gray-300 h-10 mt-1">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between px-6 pb-6">
                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">What's Included</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className={cn("flex items-center gap-3 text-gray-200 text-sm font-medium")}>
                        {feature.icon}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={billingCycle === 'monthly' ? tier.monthlyLink : tier.yearlyLink}
                  className="w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className={cn(
                      'w-full font-bold py-6 text-lg rounded-2xl transition-all duration-300 border border-white/20',
                      tier.buttonVariant === 'primary'
                        ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl shadow-pink-500/25'
                        : 'liquid-glass text-white hover:bg-white/20'
                    )}
                  >
                    {tier.buttonVariant === 'primary' && <Crown className="mr-2 h-5 w-5" />}
                    Subscribe Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
