import { Check, X } from 'lucide-react';

interface AlertBannerProps {
  variant: 'neutral' | 'positive' | 'warning' | 'negative';
  title?: string;
  description: string | React.ReactNode;
  action?: {
    type: 'button' | 'link';
    text: string;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'neutral' | 'neutral-grey' | 'outline';
  };
  onClose?: () => void;
  className?: string;
}

export default function AlertBanner({
  variant,
  title,
  description,
  action,
  onClose,
  className = ''
}: AlertBannerProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'neutral':
        return {
          badgeColor: 'var(--wise-content-secondary)',
          content: 'i',
          contentColor: 'white',
          isText: true
        };
      case 'positive':
        return {
          badgeColor: 'var(--wise-sentiment-positive-primary)',
          IconComponent: Check,
          iconColor: 'white',
          isText: false
        };
      case 'warning':
        return {
          badgeColor: 'var(--wise-sentiment-warning-primary)',
          content: '!',
          contentColor: 'black',
          isText: true
        };
      case 'negative':
        return {
          badgeColor: 'var(--wise-sentiment-negative-primary)',
          IconComponent: X,
          iconColor: 'white',
          isText: false
        };
    }
  };

  const config = getVariantConfig();

  const parseDescription = (text: string | React.ReactNode) => {
    if (typeof text !== 'string') return text;
    
    const lines = text.split(/\n+/);
    
    return lines.map((line, lineIndex) => {
      let processedLine = line;
      
      processedLine = processedLine.replace(/(\d+(?:,\d{3})*(?:\.\d{1,2})?) ([A-Z]{3})/g, (match, amount, currency) => {
        const numAmount = parseFloat(amount.replace(/,/g, ''));
        // Format with proper decimal handling
        let formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(numAmount);
        
        // Only remove .00 if it's a whole number
        if (formatted.endsWith('.00') && numAmount === Math.floor(numAmount)) {
          formatted = formatted.slice(0, -3);
        }
        
        return `${formatted} ${currency}`;
      });
      
      const parts = processedLine.split(/(\*\*.*?\*\*)/g);
      const parsedLine = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={index} className="font-semibold">
              {part.slice(2, -2)}
            </span>
          );
        }
        return part;
      });
      
      return (
        <span key={lineIndex}>
          {parsedLine}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div 
      className={`relative p-4 rounded-[10px] bg-wise-background-neutral ${className}`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-wise-background-neutral hover:bg-wise-background-neutral transition-colors flex items-center justify-center"
        >
          <X className="h-3 w-3 text-wise-link-content" strokeWidth={2.5} />
        </button>
      )}

      <div className="flex gap-4">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.badgeColor }}
        >
          {config.isText ? (
            <span 
              className="font-semibold text-lg leading-none"
              style={{ color: config.contentColor }}
            >
              {config.content}
            </span>
          ) : config.IconComponent ? (
            <config.IconComponent 
              className="h-4 w-4" 
              style={{ color: config.iconColor }}
            />
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-semibold text-wise-content-primary mb-1">
              {title}
            </h3>
          )}
          
          <div className="text-wise-content-secondary text-sm mb-3">
            {parseDescription(description)}
          </div>

          {action && (
            <div>
              {action.type === 'button' ? (
                <button
                  onClick={action.onClick}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                    action.variant === 'primary' 
                      ? 'btn-primary'
                      : 'bg-wise-background-neutral hover:bg-wise-background-neutral text-wise-interactive-primary'
                  }`}
                >
                  {action.text}
                </button>
              ) : (
                <a
                  href={action.href}
                  className="text-wise-link-content text-sm font-medium underline hover:text-wise-green-forest transition-colors"
                >
                  {action.text}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}