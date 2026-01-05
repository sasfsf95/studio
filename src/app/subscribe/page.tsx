
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
    monthlyPrice: '₹19',
    yearlyPrice: '₹15',
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
    barColor: 'bg-blue-500'
  },
  {
    name: 'Visual',
    monthlyPrice: '₹49',
    yearlyPrice: '₹39',
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
    barColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    name: 'Elite',
    monthlyPrice: '₹99',
    yearlyPrice: '₹79',
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
    barColor: 'bg-orange-500'
  },
];

export default function SubscribePage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const router = useRouter();

    return (
    <div className="bg-[#111111] min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors rounded-full"
        >
            <ArrowLeft className="h-4 w-4" />
            Back to Models
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={{ fontFamily: 'serif' }}>
            CHOOSE YOUR CONNECTION
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Unlock deeper levels of intimacy with photos, audio, and video content.
          </p>
        </div>

        <div className="flex justify-center items-center mb-12">
            <div className="bg-[#1C1C1E] p-1 rounded-full flex items-center gap-2">
                <Button 
                    onClick={() => setBillingCycle('monthly')}
                    variant={billingCycle === 'monthly' ? 'secondary' : 'ghost'}
                    className={cn(
                        "rounded-full px-6 transition-colors",
                        billingCycle === 'monthly' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                    )}
                >
                    Monthly
                </Button>
                <Button
                    onClick={() => setBillingCycle('yearly')}
                    variant={billingCycle === 'yearly' ? 'secondary' : 'ghost'}
                    className={cn(
                        "rounded-full px-6 transition-colors relative",
                        billingCycle === 'yearly' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                    )}
                >
                    Yearly
                    <span className="absolute -top-2 -right-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
                'bg-[#16161C] border rounded-2xl flex flex-col shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl',
                tier.borderColor,
                tier.bestValue ? 'shadow-purple-500/20' : 'shadow-black/20'
              )}
            >
              <div className={cn("h-1.5 w-full rounded-t-2xl", tier.barColor)}></div>
              {tier.bestValue && (
                  <div className="absolute top-0 right-4 -mt-3">
                      <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Best Value
                      </div>
                  </div>
              )}
              <CardHeader className="pt-8 px-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", tier.iconBg)}>
                    {tier.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold">
                      {billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                 <p className="text-sm text-gray-400 h-10">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between px-6 pb-6">
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">What's Included</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className={cn("flex items-center gap-3 text-gray-300", feature.disabled && "text-gray-500 line-through")}>
                        {feature.icon}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/chat" className="w-full">
                  <Button
                    className={cn(
                      'w-full font-bold py-6 text-lg rounded-xl',
                      tier.buttonVariant === 'primary' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:opacity-90' 
                        : 'bg-white text-black hover:bg-gray-200'
                    )}
                  >
                    {tier.buttonVariant === 'primary' && <Crown className="mr-2 h-5 w-5"/>}
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
