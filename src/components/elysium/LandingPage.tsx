
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Apple, Heart, Sparkles } from 'lucide-react';
import CharacterSelection from './CharacterSelection';
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    setShowCharacterSelection(true);
  };

  const handleCharacterSelect = (character: any) => {
    // Store character selection in localStorage for the chat component
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCharacter', JSON.stringify(character));
    }
    router.push('/chat');
  };

  const handleBackToMain = () => {
    setShowCharacterSelection(false);
  };

  if (showCharacterSelection) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background with neon streaks */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20"></div>
          <div className="absolute top-20 left-20 w-96 h-2 bg-gradient-to-r from-pink-500 to-red-500 transform -rotate-12 blur-sm"></div>
          <div className="absolute top-40 right-32 w-80 h-2 bg-gradient-to-r from-purple-500 to-pink-500 transform rotate-12 blur-sm"></div>
          <div className="absolute bottom-40 left-16 w-72 h-2 bg-gradient-to-r from-blue-500 to-purple-500 transform -rotate-6 blur-sm"></div>
          <div className="absolute bottom-20 right-20 w-64 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 transform rotate-6 blur-sm"></div>
        </div>

        <header className="relative z-10 flex justify-between items-center p-6">
          <div className="text-xl font-bold">yuki.ai</div>
          <Button 
            variant="outline" 
            className="bg-black/50 border-white/20 text-white hover:bg-white/10"
            onClick={handleBackToMain}
          >
            Back
          </Button>
        </header>

        <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 py-10">
          <CharacterSelection onCharacterSelect={handleCharacterSelect} />
        </main>

        <footer className="relative z-10 flex flex-wrap justify-center sm:justify-between items-center gap-4 p-6 text-sm text-gray-400">
          <div>© 2025 Labane Corp. Ltd. All Rights Reserved</div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            <a href="#" className="hover:text-white transition-colors">Terms and Policies</a>
            <a href="#" className="hover:text-white transition-colors">Complaint Policy</a>
            <a href="#" className="hover:text-white transition-colors">Content Removal Policy</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10"></div>
        <div className="absolute top-20 left-20 w-96 h-2 bg-gradient-to-r from-pink-500/30 to-red-500/30 transform -rotate-12 blur-sm"></div>
        <div className="absolute top-40 right-32 w-80 h-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 transform rotate-12 blur-sm"></div>
        <div className="absolute bottom-40 left-16 w-72 h-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transform -rotate-6 blur-sm"></div>
        <div className="absolute bottom-20 right-20 w-64 h-2 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 transform rotate-6 blur-sm"></div>
      </div>

      <header className="relative z-50 flex justify-between items-center p-6 animate-fade-in">
        <div className="text-xl font-bold animate-bounce-gentle">yuki.ai</div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-black/50 border-white/20 text-white hover:bg-white/10 flex items-center gap-2 transition-all duration-300 hover:scale-105 animate-slide-in-right">
            <Smartphone className="w-4 h-4" />
            Android
          </Button>
          <Button variant="outline" className="bg-black/50 border-white/20 text-white hover:bg-white/10 flex items-center gap-2 transition-all duration-300 hover:scale-105 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            <Apple className="w-4 h-4" />
            iOS
          </Button>
        </div>
      </header>

      <main className="relative z-40 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 relative z-10">
            <div className="relative mx-auto w-80 h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse-gentle"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-lg animate-float-gentle"></div>
              
              <div className="relative z-10 w-72 h-72 animate-fade-in">
                <img 
                  src="https://firebasestudio.ai/gallery/Elysium/1.png"
                  alt="AI Girlfriend"
                  data-ai-hint="beautiful woman"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(255, 107, 157, 0.2)) drop-shadow(0 0 30px rgba(196, 75, 212, 0.1))'
                  }}
                />
              </div>
              
              <div className="absolute top-8 right-8 text-pink-400/40 animate-twinkle z-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="absolute bottom-12 left-8 text-purple-400/40 animate-twinkle z-5" style={{ animationDelay: '1s' }}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="absolute top-16 left-12 text-blue-400/40 animate-twinkle z-5" style={{ animationDelay: '2s' }}>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="relative z-50">
            <div className="relative animate-fade-in-up">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg -z-10 transform scale-110"></div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent animate-glow p-4">
                <span className="relative">Yuki: Virtual AI Companion</span>
              </h1>
            </div>

            <div className="relative text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg -z-10 transform scale-105"></div>
              <div className="relative p-6">
                <p className="mb-2 hover:text-pink-200 transition-all duration-500 transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  The most advanced romance chatbot you've ever talked to.
                </p>
                <p className="mb-2 hover:text-purple-200 transition-all duration-500 transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  Fun and flirty dating simulator with no strings attached.
                </p>
                <p className="hover:text-blue-200 transition-all duration-500 transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  Engage in a friendly chat, roleplay, grow your love & relationship skills.
                </p>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <Button 
                onClick={handleContinue}
                size="lg"
                className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 px-12 py-7 text-lg font-semibold rounded-full transition-all duration-500 transform hover:scale-110 animate-heartbeat shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-blue-500/50 rounded-full blur-lg -z-10 animate-pulse-gentle"></div>
                <Heart className="w-5 h-5 mr-2 animate-bounce-gentle" />
                Continue
                <Sparkles className="w-5 h-5 ml-2 animate-twinkle" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-50 flex flex-wrap justify-center sm:justify-between items-center gap-4 p-6 text-sm text-gray-400 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div>© 2025 Labane Corp. Ltd. All Rights Reserved</div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#" className="hover:text-pink-300 transition-all duration-300 hover:scale-105">Contact Us</a>
          <a href="#" className="hover:text-purple-300 transition-all duration-300 hover:scale-105">Terms and Policies</a>
          <a href="#" className="hover:text-blue-300 transition-all duration-300 hover:scale-105">Complaint Policy</a>
          <a href="#" className="hover:text-pink-300 transition-all duration-300 hover:scale-105">Content Removal Policy</a>
        </div>
      </footer>
    </div>
  );
}
