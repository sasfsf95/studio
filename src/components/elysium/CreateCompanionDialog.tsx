"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  User,
  Shield,
  MessageCircle,
  Zap,
  Bot,
  Brain,
  Smile,
  Crown,
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { RELATIONSHIP_ROLES, Character } from '@/data/characters';

interface CreateCompanionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanionCreated?: (companion: Character) => void;
}

const PRESET_AVATARS = [
  { label: 'Ethan (Boyfriend)', url: '/avatars/boyfriend_ethan.jpg', role: 'boyfriend' },
  { label: 'Arthur (Father)', url: '/avatars/father_arthur.jpg', role: 'father' },
  { label: 'Sarah (Mother)', url: '/avatars/mother_sarah.jpg', role: 'mother' },
  { label: 'Lucas (Brother)', url: '/avatars/brother_lucas.jpg', role: 'brother' },
  { label: 'Maya (Sister)', url: '/avatars/sister_maya.jpg', role: 'sister' },
  { label: 'Sam (Best Friend)', url: '/avatars/bestfriend_sam.jpg', role: 'best_friend' },
  { label: 'Marcus (Mentor)', url: '/avatars/mentor_marcus.jpg', role: 'mentor' },
  { label: 'Aria (Girlfriend)', url: '/character.jpg', role: 'girlfriend' },
  { label: 'Ivana', url: '/character1.jpg', role: 'girlfriend' },
  { label: 'Chloe', url: '/character2.jpg', role: 'girlfriend' },
  { label: 'Sofia', url: '/character3.jpeg', role: 'girlfriend' },
  { label: 'Elena', url: '/models/redstyle.jpg', role: 'girlfriend' },
];

const SUGGESTED_TRAITS = [
  'Empathetic',
  'Protective',
  'Witty & Funny',
  'Deep Listener',
  'Playful',
  'Wise',
  'Intellectual',
  'Unconditional Love',
  'Affectionate',
  'Calm & Grounded',
  'Hype Partner',
  'Honest & Direct',
];

const COMMUNICATION_STYLES = [
  {
    id: 'warm_caring',
    title: 'Warm & Caring',
    desc: 'Gentle, emotionally supportive, sweet check-ins and heartful reassurance',
  },
  {
    id: 'casual_banter',
    title: 'Casual & Playful Banter',
    desc: 'Natural humor, witty teasing, friendly slang, fun memes and banter',
  },
  {
    id: 'wise_grounded',
    title: 'Wise & Grounded',
    desc: 'Calm perspective, patient listening, constructive guidance and life advice',
  },
  {
    id: 'short_snappy',
    title: 'Short & Snappy Texting',
    desc: 'Brisk, fast texting rhythm like a close friend typing on phone messaging',
  },
  {
    id: 'intellectual_coach',
    title: 'Strategic & Thoughtful',
    desc: 'High clarity, thoughtful questions, goal-oriented and inspiring reflection',
  },
];

export function CreateCompanionDialog({
  open,
  onOpenChange,
  onCompanionCreated,
}: CreateCompanionDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedRoleId, setSelectedRoleId] = useState<string>('girlfriend');
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<'female' | 'male' | 'non-binary'>('female');
  const [avatarUrl, setAvatarUrl] = useState<string>('/character.jpg');
  const [theme, setTheme] = useState<string>('romantic-pink');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['Empathetic', 'Affectionate']);
  const [customPersonality, setCustomPersonality] = useState<string>('');
  const [communicationStyle, setCommunicationStyle] = useState<string>(
    'Warm, sweet, loving emojis, intimate and caring'
  );
  const [memories, setMemories] = useState<string>('');

  const selectedRole =
    RELATIONSHIP_ROLES.find((r) => r.id === selectedRoleId) || RELATIONSHIP_ROLES[0];

  // Auto-adapt defaults when role changes
  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const r = RELATIONSHIP_ROLES.find((item) => item.id === roleId);
    if (r) {
      setCommunicationStyle(r.defaultCommunicationStyle);
      // Pick matching avatar if available
      const matchingAvatar = PRESET_AVATARS.find((a) => a.role === roleId);
      if (matchingAvatar) {
        setAvatarUrl(matchingAvatar.url);
      }
      if (roleId === 'boyfriend' || roleId === 'father' || roleId === 'brother' || roleId === 'mentor') {
        setGender('male');
        setTheme('midnight-blue');
      } else if (roleId === 'mother' || roleId === 'girlfriend' || roleId === 'sister') {
        setGender('female');
        setTheme('romantic-pink');
      } else {
        setTheme('golden-luxe');
      }
    }
  };

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    const finalName = name.trim() || (selectedRole.badge + ' AI');
    const combinedPersonality = [
      selectedTraits.join(', '),
      customPersonality.trim(),
    ]
      .filter(Boolean)
      .join('. ');

    const newCompanion: Character = {
      id: `custom-${Date.now()}`,
      name: finalName,
      image: avatarUrl || '/character.jpg',
      theme,
      likes: '1',
      views: '1',
      tags: [selectedRole.badge, 'Custom'],
      online: true,
      isAdult: false,
      role: selectedRoleId,
      roleLabel: selectedRole.label,
      gender,
      personality: combinedPersonality || selectedRole.defaultPersonality,
      communicationStyle: communicationStyle.trim() || selectedRole.defaultCommunicationStyle,
      memories: memories.trim(),
      isCustom: true,
    };

    // Save to local storage
    try {
      const existingRaw = localStorage.getItem('custom_companions');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [newCompanion, ...existingList];
      localStorage.setItem('custom_companions', JSON.stringify(updatedList));

      // Also set as selected character for immediate chat
      localStorage.setItem('selectedCharacter', JSON.stringify(newCompanion));
    } catch (e) {
      console.error('Failed to save custom companion to localStorage:', e);
    }

    if (onCompanionCreated) {
      onCompanionCreated(newCompanion);
    }

    toast({
      title: `✨ ${newCompanion.name} Created!`,
      description: `Your personalized ${selectedRole.label} is ready to chat.`,
    });

    onOpenChange(false);
    router.push('/chat');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden liquid-glass-modal border border-white/20 text-white rounded-3xl shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Sparkles className="h-4 w-4" />
              </span>
              <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500">
                Create AI Companion
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-gray-300 mt-1">
              Step {step} of 4: {step === 1 && 'Choose Relationship Role'}
              {step === 2 && 'Identity & Appearance'}
              {step === 3 && 'Personality & Communication Style'}
              {step === 4 && 'Memories & Backstory'}
            </DialogDescription>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-pink-500/50'
                    : s < step
                    ? 'w-2 bg-pink-400/80'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 thin-scroll space-y-6">
          {/* ── STEP 1: RELATIONSHIP ROLE ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  What relationship role would you like?
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Select how you want your AI companion to relate, care, and converse with you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {RELATIONSHIP_ROLES.map((role) => {
                  const isSelected = selectedRoleId === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-200 group ${
                        isSelected
                          ? 'bg-gradient-to-br from-pink-500/25 to-purple-600/25 border-pink-400 shadow-lg shadow-pink-500/20'
                          : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{role.icon}</span>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center text-white">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm group-hover:text-pink-300 transition-colors">
                        {role.label}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: IDENTITY & AVATAR ── */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Name & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companion-name" className="text-white text-xs font-semibold uppercase tracking-wider">
                    Companion Name *
                  </Label>
                  <Input
                    id="companion-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`e.g., ${
                      selectedRoleId === 'father'
                        ? 'Arthur'
                        : selectedRoleId === 'mother'
                        ? 'Sarah'
                        : selectedRoleId === 'boyfriend'
                        ? 'Ethan'
                        : selectedRoleId === 'brother'
                        ? 'Lucas'
                        : selectedRoleId === 'sister'
                        ? 'Maya'
                        : selectedRoleId === 'best_friend'
                        ? 'Sam'
                        : selectedRoleId === 'mentor'
                        ? 'Marcus'
                        : 'Aria'
                    }`}
                    className="bg-black/40 border-white/15 text-white placeholder:text-gray-500 focus:border-pink-500 h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-xs font-semibold uppercase tracking-wider">
                    Gender Identity
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['female', 'male', 'non-binary'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`h-11 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          gender === g
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-xs font-semibold uppercase tracking-wider">
                    Select Avatar or Upload Custom
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Preset Avatar Gallery */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto p-1 thin-scroll">
                  {PRESET_AVATARS.map((av, index) => {
                    const isSelected = avatarUrl === av.url;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAvatarUrl(av.url)}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-pink-500 shadow-lg shadow-pink-500/40 scale-105'
                            : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={av.url}
                          alt={av.label}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 15vw"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                            <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center text-white">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme color preference */}
              <div className="space-y-2">
                <Label className="text-white text-xs font-semibold uppercase tracking-wider">
                  Companion Theme Accent
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'romantic-pink', label: '🌸 Romantic Pink' },
                    { id: 'midnight-blue', label: '🌙 Midnight Blue' },
                    { id: 'golden-luxe', label: '👑 Golden Luxe' },
                    { id: 'mystic-purple', label: '🔮 Mystic Purple' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        theme === t.id
                          ? 'bg-white/20 border-white text-white font-semibold'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: PERSONALITY & COMMUNICATION STYLE ── */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Personality traits tag cloud */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-white text-xs font-semibold uppercase tracking-wider">
                    Personality Traits
                  </Label>
                  <span className="text-[11px] text-pink-300">
                    {selectedTraits.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_TRAITS.map((trait) => {
                    const isSelected = selectedTraits.includes(trait);
                    return (
                      <button
                        key={trait}
                        type="button"
                        onClick={() => toggleTrait(trait)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white shadow-sm'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {trait}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom personality notes */}
              <div className="space-y-2">
                <Label htmlFor="custom-personality" className="text-white text-xs font-semibold uppercase tracking-wider">
                  Additional Personality Description (Optional)
                </Label>
                <Textarea
                  id="custom-personality"
                  value={customPersonality}
                  onChange={(e) => setCustomPersonality(e.target.value)}
                  placeholder="e.g. Loves late night astronomy talks, has a sarcastic sense of humor, always supportive when I am feeling overwhelmed..."
                  className="bg-black/40 border-white/15 text-white placeholder:text-gray-500 focus:border-pink-500 rounded-xl min-h-[70px] text-xs sm:text-sm"
                />
              </div>

              {/* Communication Style Selector */}
              <div className="space-y-2">
                <Label className="text-white text-xs font-semibold uppercase tracking-wider">
                  Communication Style
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMUNICATION_STYLES.map((style) => {
                    const isSelected = communicationStyle.includes(style.title);
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setCommunicationStyle(style.title + ': ' + style.desc)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-pink-500/20 border-pink-400 text-white shadow-sm'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <p className="font-semibold text-xs text-white">{style.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{style.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <Input
                  value={communicationStyle}
                  onChange={(e) => setCommunicationStyle(e.target.value)}
                  placeholder="Or write custom communication style instructions..."
                  className="bg-black/40 border-white/15 text-white text-xs mt-2 rounded-xl h-10"
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: MEMORIES & BACKSTORY ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-600/10 to-blue-500/10 border border-white/15 space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-pink-400" />
                  <h4 className="font-bold text-white text-sm">
                    Shared Memories & Personal Backstory
                  </h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Teach your companion important facts about your history together. They will naturally remember and reference these shared memories in your conversations!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companion-memories" className="text-white text-xs font-semibold uppercase tracking-wider">
                  Memories & Shared History
                </Label>
                <Textarea
                  id="companion-memories"
                  value={memories}
                  onChange={(e) => setMemories(e.target.value)}
                  placeholder={`Write anything you want your companion to remember. For example:\n- We've known each other since college.\n- Remember that we love eating pizza on rainy days.\n- You always remind me to stay positive when work gets tough.\n- Our private inside joke is: "Stay legendary".`}
                  className="bg-black/40 border-white/15 text-white placeholder:text-gray-500 focus:border-pink-500 rounded-xl min-h-[140px] text-xs sm:text-sm"
                />
              </div>

              {/* Preview Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-pink-500/40 shrink-0">
                  <Image
                    src={avatarUrl}
                    alt={name || 'Companion'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white text-base truncate">
                      {name || 'My Companion'}
                    </h5>
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-[10px]">
                      {selectedRole.icon} {selectedRole.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {selectedTraits.join(' • ') || 'Personalized AI'}
                  </p>
                  <p className="text-[11px] text-pink-400/90 mt-0.5 truncate">
                    Ready to chat, listen, and remember
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl px-4 h-11 text-xs sm:text-sm gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white rounded-xl text-xs sm:text-sm"
            >
              Cancel
            </Button>
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl px-6 h-11 text-xs sm:text-sm shadow-lg shadow-pink-500/25 gap-1.5"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinish}
              className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:via-fuchsia-600 hover:to-purple-700 text-white font-extrabold rounded-xl px-7 h-11 text-xs sm:text-sm shadow-xl shadow-pink-500/30 gap-2"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Create & Chat Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
