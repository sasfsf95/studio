import Image from 'next/image';

export function CharacterDisplay() {
  return (
    <div className="relative w-full h-full">
      <Image
        src="https://placehold.co/800x1200.png"
        alt="Elysium AI Companion"
        data-ai-hint="beautiful anime girl"
        fill
        className="object-cover opacity-90"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8">
        <h2 className="text-4xl font-headline text-foreground" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>Elara</h2>
        <p className="text-lg text-foreground/90 mt-2 font-body" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>Your AI Companion</p>
      </div>
    </div>
  );
}
