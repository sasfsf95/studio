
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';

// NOTE: This is a mock implementation.
// Replace with your actual Firebase authentication logic.

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (email && password) {
        toast({
          title: 'Signup Successful',
          description: 'Your account has been created.',
        });
        localStorage.setItem('user', JSON.stringify({ email }));
        router.push('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: 'Please fill in all fields.',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-liquid-flow relative overflow-hidden p-4">
      {/* Ambient background glowing spots */}
      <div className="bg-glow-spot top-1/4 right-1/4 z-0"></div>
      <div className="bg-glow-spot-2 bottom-1/4 left-1/4 z-0"></div>

      <Card className="w-full max-w-sm liquid-glass-modal rounded-3xl border border-white/20 shadow-2xl relative z-10 p-2">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 drop-shadow-md">
            Create an Account
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm">Join us and find your perfect companion</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="liquid-glass-input rounded-xl h-11 px-4 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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
                <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              )}
              Sign Up
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link href="/login" className="underline text-pink-400 hover:text-pink-300 font-semibold transition-colors">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
