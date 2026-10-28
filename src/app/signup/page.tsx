"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { signupUser } from '@/app/auth-actions';

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

export default function SignupPage() {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !mobileNumber || !password || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords Don\'t Match',
        description: 'Please make sure both passwords match.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullMobileRaw = countryCode.replace('+', '') + mobileNumber;
      const mobileInt = parseInt(fullMobileRaw, 10);

      // Call the server action (uses secret key — bypasses RLS and creates user_plan)
      const result = await signupUser(name, password, mobileInt);

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: result.error || 'Something went wrong. Please try again.',
        });
        return;
      }

      // Save session in localStorage
      const sessionUser = {
        id: result.user!.id,
        name: result.user!.username || name,
        mobile: fullMobileRaw,
        countryCode,
        mobileNumber,
        plan: result.plan,
      };
      localStorage.setItem('user', JSON.stringify(sessionUser));

      if (result.plan) {
        localStorage.setItem('user_plan', JSON.stringify(result.plan));
        const isPremiumUser = Boolean(
          Number(result.plan.premium_plan) > 0 &&
          (!result.plan.premium_expires_at || new Date(result.plan.premium_expires_at).getTime() > Date.now())
        );
        localStorage.setItem('isPremium', isPremiumUser ? 'true' : 'false');
      } else {
        localStorage.setItem('isPremium', 'false');
      }

      toast({
        title: '🎉 Account Created!',
        description: `Welcome to Evermate, ${name}! You're now logged in.`,
      });
      router.push('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Error',
        description: error?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-h-[100dvh] bg-liquid-flow relative overflow-hidden p-3 sm:p-4 pt-safe pb-safe">
      {/* Ambient background */}
      <div className="bg-glow-spot top-1/4 right-1/4 z-0"></div>
      <div className="bg-glow-spot-2 bottom-1/4 left-1/4 z-0"></div>

      {/* Floating sparkle orbs */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60 z-0"></div>
      <div className="absolute bottom-28 right-14 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40 z-0" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute top-1/2 right-6 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-30 z-0" style={{ animationDelay: '1.2s' }}></div>

      <Card className="w-full max-w-sm liquid-glass-modal rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>

        <CardHeader className="text-center pb-2 pt-6 sm:pt-8 px-5 sm:px-8">
          {/* Logo icon */}
          <div className="flex justify-center mb-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-600 to-purple-700 flex items-center justify-center shadow-xl shadow-purple-500/40">
              <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-30"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 drop-shadow-md">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs sm:text-sm mt-1">
            Join Evermate and find your perfect companion
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 sm:pt-4">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-gray-200 font-medium text-sm">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-500 focus:border-purple-500/60 transition-all duration-300"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-gray-200 font-medium text-sm">Mobile Number *</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-32 liquid-glass-input rounded-xl h-11 text-white border-white/20 focus:border-purple-500/60 transition-all duration-300">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent className="liquid-glass-modal border border-white/20 text-white rounded-xl">
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.code}
                        className="hover:bg-white/10 focus:bg-white/15 cursor-pointer rounded-lg text-white"
                      >
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
                  placeholder="Mobile number"
                  required
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setMobileNumber(value);
                  }}
                  className="flex-1 liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-500 focus:border-purple-500/60 transition-all duration-300"
                  maxLength={15}
                />
              </div>
              {mobileNumber && (
                <p className="text-xs text-purple-300/70 font-mono pl-1">
                  📱 {countryCode} {mobileNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-200 font-medium text-sm">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-500 focus:border-purple-500/60 transition-all duration-300"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-gray-200 font-medium text-sm">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-500 transition-all duration-300 ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-red-500/60'
                    : confirmPassword && confirmPassword === password
                    ? 'border-green-500/60'
                    : ''
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-400 pl-1">Passwords don&apos;t match</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p className="text-xs text-green-400 pl-1">✓ Passwords match</p>
              )}
            </div>

            {/* Submit */}
            <Button
              id="signup-submit-btn"
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-500 via-pink-600 to-purple-600 hover:from-purple-600 hover:via-pink-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 border border-white/20 transition-all duration-300 group relative overflow-hidden mt-1"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin relative z-10" />
              ) : (
                <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform relative z-10" />
              )}
              <span className="relative z-10">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </span>
            </Button>
          </form>

          {/* Supabase badge */}
          <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span>Secured by Supabase</span>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="underline text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
