
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, Phone, User } from 'lucide-react';
import Link from 'next/link';

// NOTE: This is a mock implementation.
// Replace with your actual Firebase authentication logic.

// Popular country codes with flags
const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
];

export default function LoginPage() {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (name && mobileNumber && password) {
        const fullMobile = countryCode + mobileNumber;
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${name}!`,
        });
        localStorage.setItem('user', JSON.stringify({ 
          name, 
          mobile: fullMobile,
          countryCode,
          mobileNumber 
        }));
        router.push('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Please fill in all required fields.',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-liquid-flow relative overflow-hidden p-4">
      {/* Ambient background glowing spots */}
      <div className="bg-glow-spot top-1/4 left-1/4 z-0"></div>
      <div className="bg-glow-spot-2 bottom-1/4 right-1/4 z-0"></div>

      <Card className="w-full max-w-sm liquid-glass-modal rounded-3xl border border-white/20 shadow-2xl relative z-10 p-2">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 drop-shadow-md">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm">Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200 font-medium">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-gray-200 font-medium">Mobile Number *</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-32 liquid-glass-input rounded-xl h-11 text-white border-white/20">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent className="liquid-glass-modal border border-white/20 text-white rounded-xl">
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="hover:bg-white/10 focus:bg-white/15 cursor-pointer rounded-lg text-white">
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  required
                  value={mobileNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    setMobileNumber(value);
                  }}
                  className="flex-1 liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-400"
                  maxLength={15}
                />
              </div>
              <p className="text-xs text-pink-300/80 font-mono">Selected: {countryCode} {mobileNumber}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 border border-white/20 transition-all duration-300 group" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Phone className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In with Mobile'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-pink-400 hover:text-pink-300 font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
