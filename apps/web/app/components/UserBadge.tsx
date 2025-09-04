'use client';
import React from 'react';

type Props = {
  name: string;
  email?: string;
  imageUrl?: string;
  emoji?: string;
  minimized?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  shape?: 'circle' | 'rounded';
  showAvatar?: boolean;
};

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function UserBadge({
  name,
  email,
  imageUrl,
  emoji = '🙂',
  minimized = false,
  size = 'md',
  className = '',
  shape = 'circle',
  showAvatar = true,
}: Props) {
  const avatarClass = `bg-yellow-500/80 text-white grid place-items-center ${
    sizes[size]
  } ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'} border border-yellow-600/40`;

  const Avatar = (
    <div className={avatarClass} aria-hidden>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={name}
          src={imageUrl}
          className={`${
            shape === 'circle' ? 'rounded-full' : 'rounded-xl'
          } w-full h-full object-cover`}
        />
      ) : (
        <span>{emoji}</span>
      )}
    </div>
  );

  if (minimized) {
    return <div className={className}>{Avatar}</div>;
  }

  return (
    <div
      className={`flex items-center ${showAvatar ? 'gap-3' : ''} ${className}`}
      aria-label="Current user"
    >
      {showAvatar ? Avatar : null}
      <div className="text-xs">
        <div className="font-medium">{name}</div>
        {email ? <div className="text-gray-400">{email}</div> : null}
      </div>
    </div>
  );
}
