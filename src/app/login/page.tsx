
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
    <div className="flex items-center justify-center min-h-screen bg-[#111111]">
      <Card className="w-full max-w-sm bg-[#1C1C1E] border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            Welcome Back
          </CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900 border-zinc-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="hover:bg-zinc-800">
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
                  className="flex-1 bg-zinc-900 border-zinc-700"
                  maxLength={15}
                />
              </div>
              <p className="text-xs text-gray-400">Selected: {countryCode} {mobileNumber}</p>
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
                className="bg-zinc-900 border-zinc-700"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Phone className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In with Mobile'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
