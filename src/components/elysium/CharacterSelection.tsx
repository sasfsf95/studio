
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
    image: 'https://placehold.co/600x800.png',
    hint: 'beautiful woman',
    theme: 'romantic-pink',
  },
  {
    id: 'raven',
    name: 'Raven',
    description: 'A mysterious and alluring confidante.',
    image: 'https://placehold.co/600x800.png',
    hint: 'mysterious woman',
    theme: 'mystic-purple',
  },
  {
    id: 'chloe',
    name: 'Chloe',
    description: 'A playful and fun-loving partner.',
    image: 'https://placehold.co/600x800.png',
    hint: 'playful woman',
    theme: 'golden-luxe',
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    description: 'An elegant and sophisticated soulmate.',
    image: 'https://placehold.co/600x800.png',
    hint: 'elegant woman',
    theme: 'seductive-red',
  },
];

interface CharacterSelectionProps {
  onCharacterSelect: (character: typeof characters[0]) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onCharacterSelect }) => {
  return (
    <div className="w-full max-w-7xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Choose Your Companion</h2>
      <p className="text-lg text-muted-foreground mb-12">Each one has a unique personality. Who will you connect with?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {characters.map((character) => (
          <Card 
            key={character.id} 
            className="bg-card/50 backdrop-blur-sm border-border overflow-hidden rounded-2xl transition-all duration-300 group hover:!border-primary/80 hover:shadow-2xl hover:shadow-primary/20"
          >
            <CardContent className="p-0">
              <div className="relative h-[400px] w-full">
                <Image
                  src={character.image}
                  alt={character.name}
                  data-ai-hint={character.hint}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-left">
                  <h3 className="text-3xl font-bold text-white">{character.name}</h3>
                  <p className="text-gray-300 mt-1">{character.description}</p>
                </div>
              </div>
              <div className="p-6 pt-4">
                <Button 
                  onClick={() => onCharacterSelect(character)}
                  className="w-full bg-primary/80 hover:bg-primary text-primary-foreground font-semibold rounded-full py-6 text-base transition-all duration-300"
                >
                  <Sparkles className="mr-2 h-5 w-5"/>
                  Start with {character.name}
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
