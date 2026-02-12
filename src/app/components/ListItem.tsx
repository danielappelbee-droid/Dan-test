import React from 'react';
import { ChevronRight } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';
import { Switch } from './Switch';

export interface ListItemProps {
  avatar?: {
    size?: 24 | 40 | 48 | 56 | 72;
    type: 'initials' | 'icon' | 'flag' | 'image';
    content?: string | React.ReactNode;
    src?: string;
    alt?: string;
    className?: string;
    badges?: Array<{
      type: 'flag' | 'image' | 'icon';
      content?: string | React.ReactNode;
      src?: string;
      alt?: string;
      iconVariant?: 'todo' | 'done' | 'attention' | 'pending' | 'wise';
    }>;
  };
  
  content?: {
    largeText?: string;
    smallText?: string;
    link?: {
      text: string;
      href?: string;
      onClick?: () => void;
    };
    order?: ('large' | 'small' | 'link')[];
  };
  
  currency?: {
    large?: string;
    small?: string;
    order?: ('large' | 'small')[];
    isPositive?: boolean;
  };
  
  rightElement?: {
    type: 'chevron' | 'button' | 'checkbox' | 'radio' | 'switch' | 'icon';
    
    button?: {
      text: string;
      onClick?: () => void;
      variant?: 'primary' | 'neutral' | 'neutral-grey' | 'outline';
    };
    
    checkbox?: {
      checked?: boolean;
      onChange?: (checked: boolean) => void;
      name?: string;
    };
    
    radio?: {
      checked?: boolean;
      onChange?: () => void;
      name: string;
      value: string;
    };
    
    switch?: {
      checked?: boolean;
      onChange?: (checked: boolean) => void;
      name?: string;
    };
    
    icon?: {
      icon: React.ReactNode;
      onClick?: () => void;
    };
  };
  
  container?: 'complete' | 'incomplete';
  onClick?: () => void;
  className?: string;
}

export default function ListItem({
  avatar = {
    size: 48,
    type: 'initials',
    content: 'UI'
  },
  content,
  currency,
  rightElement,
  container,
  onClick,
  className = ''
}: ListItemProps) {
  const isComplete = container === 'complete';
  const isIncomplete = container === 'incomplete';
  
  const containerClasses = isComplete 
    ? 'bg-wise-interactive-neutral-grey-mid border-none'
    : isIncomplete
    ? 'bg-wise-interactive-neutral-grey-light border border-dashed'
    : 'bg-transparent border-none';
    
  const borderColor = isIncomplete ? 'rgba(14,15,12,0.12)' : 'transparent';
  
  const avatarProps = isComplete && avatar 
    ? { 
        ...avatar,
        size: avatar.size || 48,
        className: `${avatar.className || ''} ${avatar.type === 'initials' || avatar.type === 'icon' ? 'list-item-complete-avatar' : ''}`
      }
    : {
        ...avatar,
        size: avatar?.size || 48
      };

  // Determine if the list item should be clickable
  const hasInteractiveElement = rightElement?.type === 'checkbox' || 
                                rightElement?.type === 'radio' || 
                                rightElement?.type === 'switch' ||
                                rightElement?.type === 'chevron' ||
                                onClick;

  const renderContent = () => {
    if (!content) return null;
    
    const { largeText, smallText, link, order = ['large', 'small', 'link'] } = content;
    
    return (
      <div className="flex-1 min-w-0">
        {order.map((item, index) => {
          switch (item) {
            case 'large':
              return largeText ? (
                <div key={index} className="font-semibold text-wise-content-primary text-base truncate">
                  {largeText}
                </div>
              ) : null;
            case 'small':
              return smallText ? (
                <div key={index} className="text-wise-content-secondary text-sm truncate">
                  {smallText}
                </div>
              ) : null;
            case 'link':
              return link ? (
                <div key={index} className="relative z-10">
                  {link.href ? (
                    <a 
                      href={link.href}
                      className="text-wise-link-content text-sm font-medium underline hover:text-wise-green-forest transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.text}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        link.onClick?.();
                      }}
                      className="text-wise-link-content text-sm font-medium underline hover:text-wise-green-forest transition-colors"
                    >
                      {link.text}
                    </button>
                  )}
                </div>
              ) : null;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const renderCurrency = () => {
    if (!currency) return null;
    
    const { large, small, order = ['large', 'small'], isPositive = false } = currency;
    
    return (
      <div className="text-right">
        {order.map((item, index) => {
          switch (item) {
            case 'large':
              return large ? (
                <div 
                  key={index} 
                  className={`font-semibold text-base ${
                    isPositive ? 'text-wise-sentiment-positive-primary' : 'text-wise-content-primary'
                  }`}
                >
                  {large}
                </div>
              ) : null;
            case 'small':
              return small ? (
                <div key={index} className="text-wise-content-secondary text-sm">
                  {small}
                </div>
              ) : null;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const renderRightElement = () => {
    if (!rightElement) return null;
    
    switch (rightElement.type) {
      case 'chevron':
        return (
          <ChevronRight className="h-5 w-5 text-wise-content-tertiary flex-shrink-0 ml-1" />
        );
        
      case 'button':
        const buttonProps = rightElement.button;
        if (!buttonProps) return null;
        
        const buttonVariant = isComplete && (buttonProps.variant === 'neutral-grey' || !buttonProps.variant)
          ? 'neutral-grey' 
          : buttonProps.variant || 'neutral-grey';
          
        const buttonClassName = isComplete && (buttonProps.variant === 'neutral-grey' || !buttonProps.variant)
          ? 'flex-shrink-0 list-item-complete-button relative z-10 ml-3'
          : 'flex-shrink-0 relative z-10 ml-3';
        
        return (
          <Button
            variant={buttonVariant}
            size="small"
            onClick={() => {
              buttonProps.onClick?.();
            }}
            className={buttonClassName}
          >
            {buttonProps.text}
          </Button>
        );
        
      case 'checkbox':
        const checkboxProps = rightElement.checkbox;
        if (!checkboxProps) return null;
        
        return (
          <div className="flex-shrink-0 relative z-10">
            <input
              type="checkbox"
              checked={checkboxProps.checked || false}
              onChange={(e) => {
                e.stopPropagation();
                checkboxProps.onChange?.(e.target.checked);
              }}
              name={checkboxProps.name}
              className="h-5 w-5 rounded checkbox-input pointer-events-auto"
              style={{ borderColor: 'var(--wise-interactive-secondary)' }}
            />
          </div>
        );
        
      case 'radio':
        const radioProps = rightElement.radio;
        if (!radioProps) return null;
        
        return (
          <div className="flex-shrink-0 relative z-10">
            <input
              type="radio"
              checked={radioProps.checked || false}
              onChange={() => {
                radioProps.onChange?.();
              }}
              name={radioProps.name}
              value={radioProps.value}
              className="h-5 w-5 radio-input pointer-events-auto"
              style={{ borderColor: 'var(--wise-interactive-secondary)' }}
            />
          </div>
        );
        
      case 'switch':
        const switchProps = rightElement.switch;
        if (!switchProps) return null;
        
        return (
          <div className="flex-shrink-0 relative z-10">
            <Switch
              checked={switchProps.checked}
              onChange={(checked) => switchProps.onChange?.(checked)}
              name={switchProps.name}
            />
          </div>
        );
        
      case 'icon':
        const iconProps = rightElement.icon;
        if (!iconProps) return null;
        
        return iconProps.onClick ? (
          <button
            onClick={() => {
              iconProps.onClick?.();
            }}
            className="flex-shrink-0 p-1 text-wise-content-secondary hover:text-wise-content-primary transition-colors relative z-10"
          >
            {iconProps.icon}
          </button>
        ) : (
          <div className="flex-shrink-0 text-wise-content-secondary">
            {iconProps.icon}
          </div>
        );
        
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (rightElement?.type === 'checkbox' && rightElement.checkbox) {
      rightElement.checkbox.onChange?.(!rightElement.checkbox.checked);
    } else if (rightElement?.type === 'radio' && rightElement.radio) {
      rightElement.radio.onChange?.();
    } else if (rightElement?.type === 'switch' && rightElement.switch) {
      rightElement.switch.onChange?.(!rightElement.switch.checked);
    } else if (onClick) {
      onClick();
    }
  };

  const ListItemContent = (
    <>
      <Avatar {...avatarProps} />
      
      {renderContent()}
      
      {currency && (
        <div className="flex items-center gap-1">
          {renderCurrency()}
          {renderRightElement()}
        </div>
      )}
      
      {!currency && renderRightElement()}
    </>
  );

  if (hasInteractiveElement) {
    return (
      <div
        className={`
          flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer
          hover:bg-wise-background-neutral active:bg-wise-background-neutral
          list-item-interactive-container
          ${containerClasses}
          ${className}
        `}
        style={{ borderColor, transition: 'background-color 200ms ease-in-out, border-color 200ms ease-in-out, border-style 200ms ease-in-out' }}
        onClick={handleClick}
      >
        {ListItemContent}
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ease-in-out
        ${containerClasses}
        ${className}
      `}
      style={{ borderColor, transition: 'background-color 200ms ease-in-out, border-color 200ms ease-in-out, border-style 200ms ease-in-out' }}
    >
      {ListItemContent}
    </div>
  );
}