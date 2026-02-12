import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface TagDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  bank: string;
  isDarkMode?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isOpenGlobally?: boolean;
}

const tagOptions = ['Current', 'Checking', 'Savings', 'Investments', 'Mortgage', 'Loan'];

export default function TagDropdown({
  value = 'Current',
  onChange,
  className = '',
  bank,
  isDarkMode = false,
  onOpenChange,
  isOpenGlobally = false
}: TagDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sync local state with global state
  useEffect(() => {
    if (isOpen !== isOpenGlobally) {
      setIsOpen(isOpenGlobally);
    }
  }, [isOpenGlobally, isOpen]);

  const isUKBank = bank.startsWith('uk:');
  const isUSBank = bank.startsWith('us:');

  const getAvailableOptions = () => {
    if (isUKBank) {
      return tagOptions.filter(option => option !== 'Checking');
    } else if (isUSBank) {
      return tagOptions.filter(option => option !== 'Current');
    }
    return tagOptions;
  };

  const getDefaultTag = () => {
    if (isUKBank) {
      return 'Current';
    } else if (isUSBank) {
      return 'Checking';
    }
    return 'Current';
  };

  const getCurrentValue = () => {
    if (!value || value === '') {
      return '';  // Return empty string for new cards
    }
    const availableOptions = getAvailableOptions();
    if (!availableOptions.includes(value)) {
      return getDefaultTag();
    }
    return value;
  };

  const currentValue = getCurrentValue();
  const availableOptions = getAvailableOptions();

  const handleTagSelect = (tag: string) => {
    if (onChange) {
      onChange(tag);
    }
    setIsOpen(false);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleToggleOpen = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggleOpen}
        className="flex items-center gap-1 h-6 px-2 rounded-full transition-colors text-xs font-medium"
        style={{
          backgroundColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)'
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span
          className="uppercase tracking-widest"
          style={{
            color: isDarkMode ? '#FFFFFF' : '#454745',
            minWidth: '3rem' // Maintain width even when empty
          }}
        >
          {currentValue || '\u00A0'} {/* Non-breaking space when empty */}
        </span>
        <ChevronDown
          className="h-3 w-3 transition-transform duration-200"
          style={{
            color: isDarkMode ? '#FFFFFF' : '#6A6C6A',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-32 rounded-[10px] shadow-lg z-[9999] max-h-48 overflow-y-auto"
          style={{
            backgroundColor: isDarkMode ? '#1A1C19' : '#FFFFFF',
            boxShadow: isDarkMode
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          {availableOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagSelect(tag)}
              className="w-full px-3 py-2 text-left text-xs font-medium transition-colors uppercase tracking-widest"
              style={{
                backgroundColor: currentValue === tag
                  ? (isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)')
                  : 'transparent',
                color: currentValue === tag
                  ? (isDarkMode ? '#F5F5F5' : '#0E0F0C')
                  : (isDarkMode ? '#B8B9B8' : '#454745')
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseEnter={(e) => {
                if (currentValue !== tag) {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(245, 245, 245, 0.06)' : 'rgba(14, 15, 12, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentValue !== tag) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => {
            setIsOpen(false);
            if (onOpenChange) {
              onOpenChange(false);
            }
          }}
        />
      )}
    </div>
  );
}