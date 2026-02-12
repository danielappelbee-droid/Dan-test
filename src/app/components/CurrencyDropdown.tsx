import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Currency {
  code: string;
  flag: string;
  name: string;
}

interface CurrencyDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  isDarkMode?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isOpenGlobally?: boolean;
  disableDropdown?: boolean;
  onButtonClick?: () => void;
}

const currencies: Currency[] = [
  { code: 'USD', flag: '/flags/United States.svg', name: 'US Dollar' },
  { code: 'EUR', flag: '/flags/Euro.svg', name: 'Euro' },
  { code: 'GBP', flag: '/flags/United Kingdom.svg', name: 'British Pound' },
  { code: 'SGD', flag: '/flags/Singapore.svg', name: 'Singapore Dollar' },
  { code: 'AUD', flag: '/flags/Australia.svg', name: 'Australian Dollar' },
  { code: 'CAD', flag: '/flags/Canada.svg', name: 'Canadian Dollar' },
  { code: 'CHF', flag: '/flags/Switzerland.svg', name: 'Swiss Franc' },
  { code: 'HKD', flag: '/flags/Hong Kong.svg', name: 'Hong Kong Dollar' },
  { code: 'JPY', flag: '/flags/Japan.svg', name: 'Japanese Yen' },
  { code: 'NZD', flag: '/flags/New Zealand.svg', name: 'New Zealand Dollar' },
  { code: 'MXN', flag: '/flags/Mexico.svg', name: 'Mexican Peso' },
  { code: 'INR', flag: '/flags/India.svg', name: 'Indian Rupee' },
  { code: 'BRL', flag: '/flags/Brazil.svg', name: 'Brazilian Real' },
  { code: 'PHP', flag: '/flags/Philippines.svg', name: 'Philippine Peso' },
  { code: 'HUF', flag: '/flags/Hungary.svg', name: 'Hungarian Forint' },
  { code: 'MYR', flag: '/flags/Malaysia.svg', name: 'Malaysian Ringgit' }
];

export default function CurrencyDropdown({
  value = 'USD',
  onChange,
  className = '',
  isDarkMode = false,
  onOpenChange,
  isOpenGlobally = false,
  disableDropdown = false,
  onButtonClick
}: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sync local state with global state
  useEffect(() => {
    if (isOpen !== isOpenGlobally) {
      setIsOpen(isOpenGlobally);
    }
  }, [isOpenGlobally, isOpen]);

  const selectedCurrency = value && value !== '' ? currencies.find(currency => currency.code === value) : null;

  const handleSelect = (currencyCode: string) => {
    if (onChange) {
      onChange(currencyCode);
    }
    setIsOpen(false);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleToggleOpen = () => {
    if (disableDropdown && onButtonClick) {
      // If dropdown is disabled, call the button click handler
      onButtonClick();
      return;
    }
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
        onPointerDown={(e) => e.stopPropagation()}
        className="flex items-center justify-between w-full max-w-[120px] h-10 px-3 rounded-full transition-colors"
        style={{
          backgroundColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)'
        }}
      >
        <div className="flex items-center gap-2">
          {selectedCurrency ? (
            <>
              <Image
                src={selectedCurrency.flag}
                alt={selectedCurrency.name}
                width={24}
                height={24}
                className="flex-shrink-0 rounded-sm"
              />
              <span
                className="font-medium text-sm"
                style={{ color: isDarkMode ? '#FFFFFF' : '#0E0F0C' }}
              >
                {selectedCurrency.code}
              </span>
            </>
          ) : (
            <>
              <div
                className="w-6 h-6 flex-shrink-0 rounded-full"
                style={{ backgroundColor: 'rgba(245, 245, 245, 0.12)' }}
              />
              <span
                className="font-medium text-sm truncate"
                style={{ color: isDarkMode ? '#FFFFFF' : '#0E0F0C' }}
              >
                {/* Empty - no text when no currency selected */}
              </span>
            </>
          )}
        </div>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2"
          style={{
            color: isDarkMode ? '#FFFFFF' : '#6A6C6A',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {!disableDropdown && isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 rounded-[10px] shadow-lg z-[9999] max-h-64 overflow-y-auto"
          style={{
            backgroundColor: isDarkMode ? '#1A1C19' : '#FFFFFF',
            boxShadow: isDarkMode
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {currencies.map((currency) => (
            <button
              key={currency.code}
              type="button"
              onClick={() => handleSelect(currency.code)}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{
                backgroundColor: currency.code === value
                  ? (isDarkMode ? 'rgba(159, 232, 112, 0.15)' : 'rgba(159, 232, 112, 0.10)')
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (currency.code !== value) {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(245, 245, 245, 0.06)' : 'rgba(14, 15, 12, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (currency.code !== value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Image
                src={currency.flag}
                alt={currency.name}
                width={24}
                height={24}
                className="flex-shrink-0 rounded-sm"
              />
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium text-sm"
                  style={{ color: isDarkMode ? '#F5F5F5' : '#0E0F0C' }}
                >
                  {currency.code}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: isDarkMode ? '#888988' : '#6A6C6A' }}
                >
                  {currency.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!disableDropdown && isOpen && (
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