import { ReactNode, CSSProperties } from 'react';
import Button from './Button';

interface FooterButton {
  id: string;
  variant?: 'primary' | 'neutral' | 'neutral-grey' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  label?: string;
  badge?: string | number;
  isActive?: boolean;
}

interface FooterProps {
  buttons?: FooterButton[];
  layout?: 'single' | 'stacked' | 'navigation';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function Footer({ 
  buttons = [], 
  layout = 'single',
  className = '',
  style,
  children 
}: FooterProps) {
  const renderButtons = () => {
    if (children) {
      return children;
    }

    if (buttons.length === 0) {
      return null;
    }

    switch (layout) {
      case 'single':
        return (
          <div className="w-full">
            {buttons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant || 'primary'}
                size={button.size || 'large'}
                onClick={button.onClick}
                disabled={button.disabled}
                className={`w-full ${button.className || ''}`}
              >
                {button.children}
              </Button>
            ))}
          </div>
        );

      case 'stacked':
        return (
          <div className="w-full space-y-3">
            {buttons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant || 'primary'}
                size={button.size || 'large'}
                onClick={button.onClick}
                disabled={button.disabled}
                className={`w-full ${button.className || ''}`}
              >
                {button.children}
              </Button>
            ))}
          </div>
        );

      case 'navigation':
        return (
          <div className="flex justify-between items-center w-full">
            {buttons.map((button) => (
              <button
                key={button.id}
                onClick={button.onClick}
                disabled={button.disabled}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 py-3 px-1 relative transition-colors ${
                  button.disabled 
                    ? 'cursor-not-allowed' 
                    : 'hover:bg-wise-background-neutral'
                } rounded-lg ${button.className || ''}`}
                style={button.disabled ? {
                  backgroundColor: 'var(--wise-disabled-background)',
                  color: 'var(--wise-disabled-text)'
                } : {}}
              >
                {button.badge && (
                  <div className="absolute -top-1 -right-1 bg-wise-sentiment-negative-primary text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {button.badge}
                  </div>
                )}
                {button.icon && (
                  <div 
                    className="mb-3"
                    style={{
                      color: button.disabled 
                        ? 'var(--wise-disabled-text)' 
                        : button.isActive 
                          ? 'var(--wise-interactive-primary)' 
                          : 'var(--wise-interactive-secondary)'
                    }}
                  >
                    {button.icon}
                  </div>
                )}
                {button.label && (
                  <span 
                    className="text-xs font-medium truncate max-w-full"
                    style={{
                      color: button.disabled 
                        ? 'var(--wise-disabled-text)' 
                        : button.isActive 
                          ? 'var(--wise-interactive-primary)' 
                          : 'var(--wise-content-tertiary)'
                    }}
                  >
                    {button.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-40
        bg-wise-background-screen 
        border-t border-wise-border-neutral
        px-4 pt-2 pb-4
        ${className}
      `}
      style={style}
    >
      <div className="w-full max-w-none mx-auto">
        {renderButtons()}
      </div>
    </div>
  );
}