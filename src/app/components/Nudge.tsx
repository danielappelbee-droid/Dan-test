import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface NudgeProps {
  text: string | React.ReactNode;
  linkText?: string;
  illustration?: string;
  onLinkClick?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function Nudge({
  text,
  linkText = 'Learn more',
  illustration = '/illos/Globe.png',
  onLinkClick,
  onClose,
  className = ''
}: NudgeProps) {
  // Truncate text to 6 words without ellipsis - only for string text
  const truncateText = (str: string, wordCount: number = 6): string => {
    const words = str.trim().split(/\s+/);
    if (words.length <= wordCount) return str;
    return words.slice(0, wordCount).join(' ');
  };

  const displayText = typeof text === 'string' ? truncateText(text) : text;

  return (
    <div
      className={`relative rounded-[20px] overflow-hidden ${className}`}
      style={{
        border: '1px solid var(--wise-interactive-neutral-grey)',
        backgroundColor: 'var(--wise-interactive-neutral-grey)',
        minHeight: '90px'
      }}
    >
      {/* Close button in top right */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-wise-background-neutral hover:bg-wise-background-neutral transition-colors flex items-center justify-center z-20"
        >
          <X className="h-3 w-3 text-wise-link-content" strokeWidth={2.5} />
        </button>
      )}

      {/* Illustration on the left - overflowing towards bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-35px',
          bottom: '-35px',
          width: '110px',
          height: '110px',
        }}
      >
        <Image
          src={illustration}
          alt=""
          width={110}
          height={110}
          className="w-full h-full object-contain"
          style={{
            transform: 'scale(1.1)',
            transformOrigin: 'bottom left'
          }}
        />
      </div>

      {/* Content on the right - vertically centered */}
      <div className="relative z-10 flex flex-col justify-center h-full pl-24 pr-16 py-4 min-h-[90px]">
        <div className="text-wise-content-secondary text-sm mb-2">
          {displayText}
        </div>
        <button
          onClick={onLinkClick}
          className="text-wise-link-content font-semibold text-sm underline text-left w-fit"
        >
          {linkText}
        </button>
      </div>
    </div>
  );
}
