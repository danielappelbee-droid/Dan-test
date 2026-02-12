import React from 'react';
import Image from 'next/image';
import { Plus, Check, Clock } from 'lucide-react';

interface Badge {
  type: 'flag' | 'image' | 'icon' | 'wise';
  content?: string | React.ReactNode;
  src?: string;
  alt?: string;
  iconVariant?: 'todo' | 'done' | 'attention' | 'pending' | 'wise';
}

interface AvatarProps {
  size: 24 | 40 | 48 | 56 | 72;
  type: 'initials' | 'icon' | 'flag' | 'image';
  content?: string | React.ReactNode;
  src?: string;
  alt?: string;
  className?: string;
  badges?: Badge[];
}

export default function Avatar({
  size,
  type,
  content,
  src,
  alt = 'Avatar',
  className = '',
  badges = []
}: AvatarProps) {
  const sizeClasses = {
    24: 'w-6 h-6',
    40: 'w-10 h-10',
    48: 'w-12 h-12',
    56: 'w-14 h-14',
    72: 'w-[72px] h-[72px]'
  };

  const fontSizes = {
    24: 'text-[9px]',
    40: 'text-sm',
    48: 'text-base',
    56: 'text-xl',
    72: 'text-2xl'
  };

  const iconSizes = {
    24: 'h-3 w-3',
    40: 'h-5 w-5',
    48: 'h-6 w-6',
    56: 'h-7 w-7',
    72: 'h-9 w-9'
  };

  const badgeSizes = {
    48: { size: 18, iconSize: 'h-2.5 w-2.5', fontSize: 'text-[8px]' },
    56: { size: 20, iconSize: 'h-3 w-3', fontSize: 'text-[9px]' },
    72: { size: 24, iconSize: 'h-3.5 w-3.5', fontSize: 'text-[10px]' }
  };

  const getBadgePositions = (badgeCount: number) => {
    if (badgeCount === 1) {
      return [{ right: '-2px', bottom: '-2px' }];
    } else if (badgeCount === 2) {
      return [
        { right: '-12px', bottom: '-2px' },
        { right: '6px', bottom: '-2px' }
      ];
    }
    return [];
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    border 
    border-wise-border-neutral 
    flex 
    items-center 
    justify-center 
    overflow-visible
    ${className}
  `;

  const renderContent = () => {
    switch (type) {
      case 'initials':
        return (
          <div 
            className={`${fontSizes[size]} font-semibold text-wise-content-primary font-header select-none`}
          >
            {content}
          </div>
        );

      case 'icon':
        if (React.isValidElement(content)) {
          return (
            <div 
              className="w-full h-full flex items-center justify-center"
            >
              {React.cloneElement(content as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
                className: `${iconSizes[size]} text-wise-content-primary`
              })}
            </div>
          );
        }
        return null;

      case 'flag':
        return src ? (
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        ) : null;

      case 'image':
        return src ? (
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        ) : null;

      default:
        return null;
    }
  };

  const renderBadge = (badge: Badge, position: { right: string; bottom: string }, index: number) => {
    if (size < 48 || !badgeSizes[size as 48 | 56 | 72]) return null;
    
    const badgeConfig = badgeSizes[size as 48 | 56 | 72];
    const maskSize = badgeConfig.size + 4;
    
    const getBadgeStyle = () => {
      switch (badge.type) {
        case 'wise':
          return { backgroundColor: 'var(--wise-green-bright)' };
        case 'icon':
          if (badge.iconVariant) {
            switch (badge.iconVariant) {
              case 'todo':
                return { backgroundColor: 'var(--wise-interactive-contrast)' };
              case 'done':
                return { backgroundColor: 'var(--wise-interactive-contrast)' };
              case 'attention':
                return { backgroundColor: 'var(--wise-sentiment-warning-primary)' };
              case 'pending':
                return { backgroundColor: 'var(--wise-interactive-neutral-grey)' };
              case 'wise':
                return { backgroundColor: 'var(--wise-green-bright)' };
              default:
                return { backgroundColor: 'var(--wise-interactive-neutral-grey)' };
            }
          }
          return { backgroundColor: 'var(--wise-interactive-neutral-grey)' };
        default:
          return {};
      }
    };

    const getTextColor = () => {
      switch (badge.type) {
        case 'wise':
          return 'var(--wise-interactive-primary)';
        case 'icon':
          if (badge.iconVariant) {
            switch (badge.iconVariant) {
              case 'todo':
              case 'done':
                return 'var(--wise-interactive-primary)';
              case 'attention':
                return 'black';
              case 'pending':
                return 'var(--wise-content-primary)';
              case 'wise':
                return 'var(--wise-interactive-primary)';
              default:
                return 'var(--wise-content-primary)';
            }
          }
          return 'var(--wise-content-primary)';
        default:
          return 'var(--wise-content-primary)';
      }
    };

    const renderBadgeContent = () => {
      switch (badge.type) {
        case 'flag':
          return badge.src ? (
            <Image
              src={badge.src}
              alt={badge.alt || 'Flag'}
              width={badgeConfig.size}
              height={badgeConfig.size}
              className="object-cover w-full h-full rounded-full"
            />
          ) : null;

        case 'image':
          return badge.src ? (
            <Image
              src={badge.src}
              alt={badge.alt || 'Badge'}
              width={badgeConfig.size}
              height={badgeConfig.size}
              className="object-cover w-full h-full rounded-full"
            />
          ) : null;

        case 'wise':
          return (
            <Image
              src="/wise.svg"
              alt="Wise"
              width={badgeConfig.size === 24 ? 14 : badgeConfig.size === 20 ? 12 : 10}
              height={badgeConfig.size === 24 ? 14 : badgeConfig.size === 20 ? 12 : 10}
              className="object-contain"
            />
          );

        case 'icon':
          if (badge.iconVariant === 'todo') {
            return <Plus className={badgeConfig.iconSize} style={{ color: getTextColor() }} />;
          } else if (badge.iconVariant === 'done') {
            return <Check className={badgeConfig.iconSize} style={{ color: getTextColor() }} />;
          } else if (badge.iconVariant === 'attention') {
            return (
              <span 
                className={`font-semibold ${badgeConfig.fontSize} leading-none`}
                style={{ color: getTextColor() }}
              >
                !
              </span>
            );
          } else if (badge.iconVariant === 'pending') {
            return <Clock className={badgeConfig.iconSize} style={{ color: getTextColor() }} />;
          } else if (badge.iconVariant === 'wise') {
            return (
              <Image
                src="/wise.svg"
                alt="Wise"
                width={badgeConfig.size === 24 ? 14 : badgeConfig.size === 20 ? 12 : 10}
                height={badgeConfig.size === 24 ? 14 : badgeConfig.size === 20 ? 12 : 10}
                className="object-contain"
              />
            );
          }
          return null;

        default:
          return null;
      }
    };

    const zIndex = index === 0 ? 10 : 5;

    return (
      <div 
        key={index} 
        className="absolute" 
        style={{ 
          right: position.right, 
          bottom: position.bottom,
          zIndex: zIndex
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: `${maskSize}px`,
            height: `${maskSize}px`,
            backgroundColor: 'var(--wise-background-screen)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}
        />
        
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: `${badgeConfig.size}px`,
            height: `${badgeConfig.size}px`,
            zIndex: 2,
            ...getBadgeStyle()
          }}
        >
          {renderBadgeContent()}
        </div>
      </div>
    );
  };

  const shouldShowBadges = size >= 48 && badges.length > 0;
  const badgePositions = shouldShowBadges ? getBadgePositions(Math.min(badges.length, 2)) : [];

  const getBackgroundStyle = () => {
    if (type === 'initials' || type === 'icon') {
      return { 
        backgroundColor: 'var(--wise-interactive-neutral-grey)' 
      };
    }
    return {};
  };

  return (
    <div className="relative inline-block">
      <div 
        className={baseClasses}
        style={getBackgroundStyle()}
      >
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
      {shouldShowBadges && badges.slice(0, 2).map((badge, index) => 
        renderBadge(badge, badgePositions[index], index)
      )}
    </div>
  );
}