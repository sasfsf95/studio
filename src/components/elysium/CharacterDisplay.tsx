
import Image from 'next/image';

export function CharacterDisplay() {
  return (
    <div className="relative w-full h-full">
      <Image
        src="https://storage.googleapis.com/project-spark-b2952.appspot.com/yuki-ai--yuki-ai/generated/7a274533-3d92-4914-b6c8-a92af35d3d44.png"
        alt="Raven AI Companion"
        data-ai-hint="beautiful woman pink hair"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
