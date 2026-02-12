import { Check, X, Tags } from 'lucide-react';

interface AlertMessageProps {
  variant: 'neutral' | 'positive' | 'warning' | 'negative' | 'promotion';
  message: string | React.ReactNode;
  className?: string;
}

export default function AlertMessage({
  variant,
  message,
  className = ''
}: AlertMessageProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'neutral':
        return {
          badgeColor: 'var(--wise-content-secondary)',
          backgroundColor: 'var(--wise-background-neutral)',
          textColor: 'var(--wise-content-primary)',
          content: 'i',
          contentColor: 'white',
          isText: true,
          containerClass: 'px-3 py-2'
        };
      case 'positive':
        return {
          badgeColor: 'var(--wise-sentiment-positive-primary)',
          backgroundColor: 'var(--wise-background-neutral)',
          textColor: 'var(--wise-content-primary)',
          IconComponent: Check,
          iconColor: 'white',
          isText: false,
          containerClass: 'px-3 py-2'
        };
      case 'warning':
        return {
          badgeColor: 'var(--wise-sentiment-warning-primary)',
          backgroundColor: 'var(--wise-sentiment-warning-secondary)',
          textColor: 'var(--wise-content-primary)',
          content: '!',
          contentColor: 'black',
          isText: true,
          containerClass: 'px-3 py-2'
        };
      case 'negative':
        return {
          badgeColor: 'var(--wise-sentiment-negative-primary)',
          backgroundColor: 'var(--wise-sentiment-negative-secondary)',
          textColor: 'var(--wise-sentiment-negative-primary)',
          IconComponent: X,
          iconColor: 'white',
          isText: false,
          containerClass: 'px-3 py-2'
        };
      case 'promotion':
        return {
          backgroundColor: 'var(--wise-interactive-neutral)',
          textColor: 'var(--wise-sentiment-positive-primary)',
          IconComponent: Tags,
          iconColor: 'var(--wise-sentiment-positive-primary)',
          isText: false,
          useInvisibleContainer: true,
          containerClass: 'px-3 py-2 w-fit'
        };
    }
  };

  const parseMessage = (text: string | React.ReactNode) => {
    if (typeof text !== 'string') return text;
    
    let processedText = text;
    
    processedText = processedText.replace(/(\d+(?:,\d{3})*(?:\.\d{1,2})?) ([A-Z]{3})/g, (match, amount, currency) => {
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
    
    const parts = processedText.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="font-semibold">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  const config = getVariantConfig();

  return (
    <div 
      className={`flex items-start gap-2 rounded-lg ${config.containerClass} ${className}`}
      style={{ backgroundColor: config.backgroundColor }}
    >
      {config.isText ? (
        <div 
          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: config.badgeColor }}
        >
          <span 
            className="font-semibold text-xs leading-none"
            style={{ color: config.contentColor }}
          >
            {config.content}
          </span>
        </div>
      ) : config.IconComponent ? (
        config.badgeColor ? (
          <div 
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: config.badgeColor }}
          >
            <config.IconComponent 
              className="h-2.5 w-2.5" 
              style={{ color: config.iconColor }}
            />
          </div>
        ) : config.useInvisibleContainer ? (
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
            <config.IconComponent 
              className={`${variant === 'promotion' ? 'h-4 w-4' : 'h-3 w-3'}`}
              style={{ color: config.iconColor }}
            />
          </div>
        ) : (
          <config.IconComponent 
            className="h-3 w-3 flex-shrink-0 mt-0.5" 
            style={{ color: config.iconColor }}
          />
        )
      ) : null}

      <div 
        className="text-sm font-normal flex-1"
        style={{ color: config.textColor }}
      >
        {parseMessage(message)}
      </div>
    </div>
  );
}