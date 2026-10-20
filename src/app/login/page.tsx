"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, ShieldCheck, Sparkles, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { loginUser } from '@/app/auth-actions';

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
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !mobileNumber || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in your name, mobile number and password.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const fullMobileRaw = countryCode.replace('+', '') + mobileNumber;
      const mobileInt = parseInt(fullMobileRaw, 10);

      const result = await loginUser(
        name.trim(),
        password,
        mobileInt,
        email.trim() || undefined
      );

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: result.error || 'Something went wrong. Please try again.',
        });
        return;
      }

      // Save session to localStorage
      const sessionUser = {
        id: result.user!.id,
        name: result.user!.username || name,
        mobile: fullMobileRaw,
        email: result.user!.email || email.trim() || null,
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
        title: result.isNewUser ? '🎉 Account Created & Logged In' : '✅ Login Successful',
        description: result.isNewUser
          ? `Welcome to Girl.ai, ${name}! Your account has been created.`
          : `Welcome back, ${result.user!.username || name}!`,
      });

      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: error?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-h-[100dvh] bg-liquid-flow relative overflow-hidden p-3 sm:p-4 pt-safe pb-safe">
      <div className="bg-glow-spot top-1/4 left-1/4 z-0"></div>
      <div className="bg-glow-spot-2 bottom-1/4 right-1/4 z-0"></div>
      <div className="absolute top-16 right-10 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-60 z-0"></div>
      <div className="absolute bottom-24 left-12 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-40 z-0" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-8 w-2 h-2 bg-pink-300 rounded-full animate-ping opacity-30 z-0" style={{ animationDelay: '1s' }}></div>

      <Card className="w-full max-w-sm liquid-glass-modal rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600"></div>

        <CardHeader className="text-center pb-2 pt-6 sm:pt-8 px-5 sm:px-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-pink-700 flex items-center justify-center shadow-xl shadow-pink-500/40">
              <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-30"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 drop-shadow-md">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs sm:text-sm mt-1">
            Sign in with your mobile &amp; password
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 sm:pt-4">
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-gray-200 font-medium text-sm">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-500 transition-all duration-300"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-gray-200 font-medium text-sm">Mobile Number *</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-32 liquid-glass-input rounded-xl h-11 text-white border-white/20">
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
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-500 transition-all duration-300"
                  maxLength={15}
                />
              </div>
              {mobileNumber && (
                <p className="text-xs text-pink-300/70 font-mono pl-1">📱 {countryCode} {mobileNumber}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-200 font-medium text-sm">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="liquid-glass-input rounded-xl h-11 px-4 pr-11 text-white placeholder:text-gray-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-200 font-medium text-sm flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-purple-400" />
                Email
                <span className="text-xs text-gray-500 font-normal">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-500 transition-all duration-300"
              />
            </div>

            {/* Submit */}
            <Button
              id="login-submit-btn"
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 border border-white/20 transition-all duration-300 group relative overflow-hidden mt-2"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin relative z-10" />
              ) : (
                <Phone className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform relative z-10" />
              )}
              <span className="relative z-10">{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </Button>
          </form>

          <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span>Secured by Supabase</span>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-pink-400 hover:text-pink-300 font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
