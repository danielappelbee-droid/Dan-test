import React from 'react';
import { ChevronRight } from 'lucide-react';
import Avatar from './Avatar';
import { RecipientProfile } from '../utils/recipientData';

interface RecipientCardProps {
  recipient: RecipientProfile;
  onClick?: () => void;
  showChevron?: boolean;
  variant?: 'recent' | 'list';
}

export default function RecipientCard({ 
  recipient, 
  onClick, 
  showChevron = false,
  variant = 'recent' 
}: RecipientCardProps) {
  const badges = recipient.badges?.map(badge => {
    if (badge.flag) {
      return { type: 'flag' as const, src: badge.flag, alt: 'Flag' };
    } else if (badge.type === 'image' && badge.src) {
      return { type: 'image' as const, src: badge.src, alt: 'Bank' };
    } else if (badge.icon && badge.iconVariant === 'wise') {
      return { type: 'icon' as const, iconVariant: 'wise' as const };
    } else if (badge.icon) {
      return { 
        type: 'icon' as const, 
        iconVariant: badge.iconVariant || 'todo' as const
      };
    }
    return null;
  }).filter((badge): badge is NonNullable<typeof badge> => badge !== null) || [];

  if (variant === 'recent') {
    return (
      <button 
        onClick={onClick}
        className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
          onClick ? 'cursor-pointer hover:bg-wise-background-neutral active:bg-wise-background-neutral' : 'cursor-default'
        }`}
      >
        <div className="mb-3">
          <Avatar
            size={72}
            type={recipient.avatar ? 'image' : 'initials'}
            src={recipient.avatar}
            content={recipient.initials}
            alt={recipient.name}
            badges={badges}
          />
        </div>
        <div className="text-center">
          <p className="font-semibold text-wise-content-primary text-sm mb-1">
            {recipient.name}
          </p>
          <p className="text-wise-content-tertiary text-xs">
            {recipient.handle || `•• ${recipient.accountNumber}`}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
        onClick ? 'cursor-pointer hover:bg-wise-background-neutral active:bg-wise-background-neutral' : 'cursor-default'
      }`}
    >
      <Avatar
        size={48}
        type={recipient.avatar ? 'image' : 'initials'}
        src={recipient.avatar}
        content={recipient.initials}
        alt={recipient.name}
        badges={badges}
      />
      
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-wise-content-primary text-sm truncate">
          {recipient.name}
        </p>
        <p className="text-wise-content-tertiary text-sm truncate">
          {recipient.handle || `•• ${recipient.accountNumber}`}
        </p>
      </div>
      
      {showChevron && (
        <ChevronRight className="h-5 w-5 text-wise-content-tertiary flex-shrink-0" />
      )}
    </button>
  );
}