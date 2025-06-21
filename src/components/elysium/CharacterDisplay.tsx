import Image from 'next/image';

export function CharacterDisplay() {
  return (
    <div className="relative w-full h-full">
      <Image
        src="https://placehold.co/800x1200.png"
        alt="Raven AI Companion"
        data-ai-hint="beautiful dark hair woman"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
