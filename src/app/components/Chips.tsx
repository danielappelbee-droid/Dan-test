import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ChipData {
  id: string;
  label: string;
  onClick?: () => void;
  snippetId?: string;
}

interface ChipsProps {
  chips: ChipData[];
  variant?: 'white-on-grey' | 'grey-on-white';
  className?: string;
  addFirstChipMargin?: boolean;
  onChipClick?: (snippetId: string) => void;
}

export default function Chips({ 
  chips, 
  variant = 'white-on-grey',
  className = '',
  addFirstChipMargin = false,
  onChipClick
}: ChipsProps) {
  const isWhiteOnGrey = variant === 'white-on-grey';
  
  const railClasses = isWhiteOnGrey 
    ? 'bg-wise-interactive-neutral-grey-mid' 
    : 'bg-white';
    
  const chipClasses = isWhiteOnGrey
    ? 'bg-white text-wise-content-primary hover:bg-gray-50 active:bg-gray-100'
    : 'bg-wise-interactive-neutral-grey text-wise-content-primary hover:bg-wise-interactive-neutral-grey-hover active:bg-wise-interactive-neutral-grey-active';

  const handleChipClick = (chip: ChipData) => {
    if (chip.snippetId && onChipClick) {
      onChipClick(chip.snippetId);
    } else if (chip.onClick) {
      chip.onClick();
    }
  };

  return (
    <div className={`w-full ${railClasses} ${className}`}>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 py-2 pl-0 pr-4 w-max min-w-full">
          {chips.map((chip, index) => (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full 
                text-sm font-medium transition-colors duration-200 
                whitespace-nowrap flex-shrink-0
                ${chipClasses}
                ${index === 0 && addFirstChipMargin ? 'ml-4' : index === 0 ? 'ml-0' : ''}
              `}
            >
              <span>{chip.label}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}