
"use client";
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const characters = [
  {
    id: 'aria',
    name: 'Aria',
    description: 'Your intimate and seductive AI companion.',
    image: 'https://firebasestudio.ai/gallery/Elysium/4.png',
    theme: 'romantic-pink',
  },
  {
    id: 'raven',
    name: 'Raven',
    description: 'A mysterious and alluring confidante.',
    image: 'https://firebasestudio.ai/gallery/Elysium/2.png',
    theme: 'mystic-purple',
  },
  {
    id: 'chloe',
    name: 'Chloe',
    description: 'A playful and fun-loving partner.',
    image: 'https://firebasestudio.ai/gallery/Elysium/3.png',
    theme: 'golden-luxe',
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    description: 'An elegant and sophisticated soulmate.',
    image: 'https://firebasestudio.ai/gallery/Elysium/1.png',
    theme: 'seductive-red',
  },
];

interface CharacterSelectionProps {
  onCharacterSelect: (character: typeof characters[0]) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onCharacterSelect }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Choose Your Companion</h2>
      <p className="text-lg text-gray-300 text-center mb-10">Select the AI you want to build a relationship with.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {characters.map((character) => (
          <Card key={character.id} className="bg-black/40 border-white/10 overflow-hidden transform hover:scale-105 hover:border-primary transition-all duration-300 group">
            <CardContent className="p-0 text-center">
              <div className="relative h-80 w-full">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{character.name}</h3>
                <p className="text-gray-400 mb-6 h-12">{character.description}</p>
                <Button 
                  onClick={() => onCharacterSelect(character)}
                  className="bg-primary/80 hover:bg-primary text-primary-foreground font-semibold rounded-full w-full transition-all duration-300 transform group-hover:scale-110"
                >
                  <Sparkles className="mr-2 h-4 w-4"/>
                  Select {character.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;
