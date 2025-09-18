import Image from 'next/image';

export default function CollabLogo({
  className = 'w-8 h-8',
  title = 'Dispatchar',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/dispatchar-logo.svg"
        alt={title}
        width={40}
        height={40}
        priority
      />
    </div>
  );
}
