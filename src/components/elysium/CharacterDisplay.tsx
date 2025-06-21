import Image from 'next/image';

export function CharacterDisplay() {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Image
        src="https://placehold.co/800x1200.png"
        alt="Raven AI Companion"
        data-ai-hint="beautiful dark hair woman"
        fill
        className="object-cover opacity-30"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_100px_40px_hsl(var(--background))]" />
      <div className="absolute inset-0 shadow-[inset_0_0_40px_15px_hsl(var(--primary)/0.2)]" />
    </div>
  );
}
