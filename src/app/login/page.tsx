"use client";

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { sendOtp, verifyOtpAndLogin } from '@/app/auth-actions';

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

const OTP_LENGTH = 6;

export default function LoginPage() {
  // Step 1 state
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');

  // Step 2 state
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [devOtp, setDevOtp] = useState<string | null>(null); // mock: shown on screen
  const [resendTimer, setResendTimer] = useState(0);

  // UI state
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const fullMobileRaw = countryCode.replace('+', '') + mobileNumber;
  const mobileInt = parseInt(fullMobileRaw, 10);

  /* ── Step 1: Send OTP ─────────────────────────────── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Name required', description: 'Please enter your full name.' });
      return;
    }
    if (!mobileNumber || mobileNumber.length < 7) {
      toast({ variant: 'destructive', title: 'Invalid number', description: 'Please enter a valid mobile number.' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOtp(mobileInt);
      if (!result.success) {
        toast({ variant: 'destructive', title: 'Failed to send OTP', description: result.error });
        return;
      }

      setDevOtp(result.otp ?? null); // dev mode: show on screen
      setStep(2);
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);

      toast({
        title: '✅ OTP Sent',
        description: `A 6-digit code has been sent to ${countryCode} ${mobileNumber}`,
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Step 2: Verify OTP ───────────────────────────── */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otp = otpDigits.join('');
    if (otp.length < OTP_LENGTH) {
      toast({ variant: 'destructive', title: 'Incomplete OTP', description: 'Please enter all 6 digits.' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtpAndLogin(name.trim(), mobileInt, otp);

      if (!result.success) {
        toast({ variant: 'destructive', title: 'Verification Failed', description: result.error });
        setOtpDigits(Array(OTP_LENGTH).fill(''));
        otpRefs.current[0]?.focus();
        return;
      }

      // Save session
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
        title: result.isNewUser ? '🎉 Account Created & Logged In' : '✅ Login Successful',
        description: result.isNewUser
          ? `Welcome to Girl.ai, ${name}! Your account has been created.`
          : `Welcome back, ${result.user!.username || name}!`,
      });

      router.push('/');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Resend OTP ───────────────────────────────────── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      const result = await sendOtp(mobileInt);
      if (!result.success) {
        toast({ variant: 'destructive', title: 'Failed to resend OTP', description: result.error });
        return;
      }
      setDevOtp(result.otp ?? null);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setResendTimer(30);
      otpRefs.current[0]?.focus();
      toast({ title: '✅ OTP Resent', description: 'A new code has been sent.' });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── OTP Input Helpers ───────────────────────────── */
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length > 0) {
      e.preventDefault();
      const next = Array(OTP_LENGTH).fill('');
      pasted.split('').forEach((d, i) => { next[i] = d; });
      setOtpDigits(next);
      otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-liquid-flow relative overflow-hidden p-4">
      <div className="bg-glow-spot top-1/4 left-1/4 z-0"></div>
      <div className="bg-glow-spot-2 bottom-1/4 right-1/4 z-0"></div>
      <div className="absolute top-16 right-10 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-60 z-0"></div>
      <div className="absolute bottom-24 left-12 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-40 z-0" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-8 w-2 h-2 bg-pink-300 rounded-full animate-ping opacity-30 z-0" style={{ animationDelay: '1s' }}></div>

      <Card className="w-full max-w-sm liquid-glass-modal rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600"></div>

        <CardHeader className="text-center pb-2 pt-8 px-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-pink-700 flex items-center justify-center shadow-xl shadow-pink-500/40">
              {step === 1 ? (
                <Sparkles className="h-8 w-8 text-white" />
              ) : (
                <MessageSquare className="h-8 w-8 text-white" />
              )}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-30"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 drop-shadow-md">
            {step === 1 ? 'Welcome Back' : 'Enter OTP'}
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm mt-1">
            {step === 1
              ? 'Sign in with your mobile number'
              : `We sent a 6-digit code to ${countryCode} ${mobileNumber}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          {/* ───── STEP 1: Mobile Entry ───── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
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

              <div className="space-y-1.5">
                <Label htmlFor="mobile" className="text-gray-200 font-medium text-sm">Mobile Number *</Label>
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

              <Button
                id="send-otp-btn"
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
                <span className="relative z-10">{isLoading ? 'Sending OTP...' : 'Send OTP'}</span>
              </Button>
            </form>
          )}

          {/* ───── STEP 2: OTP Entry ───── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">

              {/* 🔧 DEV MODE BANNER — remove in production */}
              {devOtp && (
                <div className="rounded-2xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-center">
                  <p className="text-xs text-yellow-300/80 font-medium mb-1">🔧 Dev Mode — Your OTP</p>
                  <p className="text-2xl font-black tracking-[0.3em] text-yellow-300">{devOtp}</p>
                  <p className="text-xs text-yellow-400/60 mt-1">This banner is hidden in production</p>
                </div>
              )}

              {/* OTP Digit Inputs */}
              <div className="space-y-2">
                <Label className="text-gray-200 font-medium text-sm">Enter 6-digit OTP</Label>
                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`
                        w-11 h-13 text-center text-xl font-bold rounded-xl
                        border transition-all duration-200 outline-none
                        bg-white/5 text-white
                        ${digit
                          ? 'border-pink-500 shadow-md shadow-pink-500/30 bg-pink-500/10'
                          : 'border-white/20 focus:border-purple-400 focus:bg-white/10'
                        }
                      `}
                      style={{ height: '52px' }}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2">
                {otpDigits.map((d, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      d ? 'bg-pink-400 scale-125' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <Button
                id="verify-otp-btn"
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 border border-white/20 transition-all duration-300 group relative overflow-hidden"
                disabled={isLoading || otpDigits.join('').length < OTP_LENGTH}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin relative z-10" />
                ) : (
                  <ShieldCheck className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform relative z-10" />
                )}
                <span className="relative z-10">{isLoading ? 'Verifying...' : 'Verify & Login'}</span>
              </Button>

              {/* Resend + Back */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtpDigits(Array(OTP_LENGTH).fill('')); setDevOtp(null); }}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change number
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || isLoading}
                  className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resendTimer > 0 ? '' : 'hover:rotate-180 transition-transform duration-500'}`} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-pink-500' : 'w-4 bg-white/20'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-pink-500' : 'w-4 bg-white/20'}`} />
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span>Secured by Supabase</span>
          </div>

          <div className="mt-3 text-center text-sm text-gray-400">
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
