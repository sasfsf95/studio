
import Image from 'next/image';

export function CharacterDisplay() {
  return (
    <div className="relative w-full h-full">
      <Image
        src="https://firebasestudio.ai/yuki-ai--yuki-ai/1hF9aY.png"
        alt="Raven AI Companion"
        data-ai-hint="beautiful woman"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
