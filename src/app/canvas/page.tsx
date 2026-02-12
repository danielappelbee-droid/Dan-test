"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, PanInfo } from 'motion/react';
import { Plus, ArrowLeft, GripHorizontal, Moon, Sun, MoreHorizontal, ArrowUp, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Button from '../components/Button';
import CurrencyDropdown from '../components/CurrencyDropdown';
import BankDropdown from '../components/BankDropdown';
import TagDropdown from '../components/TagDropdown';
import { formatInputAmount } from '../utils/currencyService';
import { useRouter } from 'next/navigation';
import { calculateNetWorth, formatNetWorthRaw, convertFromUSD } from '../utils/canvasService';
import { useDarkMode } from './useDarkMode';
import { initialPortfolio } from './initialPortfolio';

const calculateCardWidth = (): number => {
  // Get viewport width for responsive design
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  // Mobile: full width minus padding
  if (viewportWidth < 768) {
    return Math.min(viewportWidth - 32, 400); // 16px padding on each side, max 400px
  }

  // Tablet: 2 columns
  if (viewportWidth < 1024) {
    return Math.floor((viewportWidth - 64) / 2); // 32px gap, 16px padding on sides
  }

  // Desktop: consistent width for masonry
  return 280; // Fixed width for consistent masonry layout
};

interface DotGridProps {
  dotSize?: number;
  spacing?: number;
}

export interface CardElement {
  id: string;
  x: number;
  y: number;
  value: string;
  currency: string;
  bank: string;
  isNegative: boolean;
  tag: string;
  manuallyPositioned?: boolean;
}

interface DraggableCardProps {
  element: CardElement;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CardElement>) => void;
  onReorder?: (cardId: string, newPosition: number) => void;
  calculateGridPosition?: (x: number, y: number) => number;
  shouldAutoFocus?: boolean;
  isDarkMode: boolean;
  position?: { x: number; y: number };
  isDraggable?: boolean;
  globalOpenDropdown: string | null;
  onDropdownChange: (cardId: string, dropdownType: string, isOpen: boolean) => void;
}

const DotGrid: React.FC<DotGridProps & { isDarkMode: boolean }> = ({ dotSize = 2, spacing = 20, isDarkMode }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Calculate how many dots we need based on viewport
  const dotsPerRow = Math.ceil(dimensions.width / spacing);
  const dotsPerColumn = Math.ceil(dimensions.height / spacing);
  
  const dots = [];
  
  for (let row = 0; row < dotsPerColumn; row++) {
    for (let col = 0; col < dotsPerRow; col++) {
      dots.push({
        id: `${row}-${col}`,
        x: col * spacing + spacing / 2,
        y: row * spacing + spacing / 2,
      });
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        {dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={dotSize}
            fill={isDarkMode ? '#444544' : '#6A6C6A'}
          />
        ))}
      </svg>
    </div>
  );
};

const DraggableCard: React.FC<DraggableCardProps> = ({
  element,
  onDelete,
  onUpdate,
  onReorder,
  calculateGridPosition,
  shouldAutoFocus = false,
  isDarkMode,
  position,
  isDraggable = false,
  globalOpenDropdown,
  onDropdownChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasOpenDropdown = globalOpenDropdown?.startsWith(element.id + '-') || false;

  // Sync ellipsis menu with global dropdown state
  const isMenuOpenGlobally = globalOpenDropdown === `${element.id}-menu`;
  useEffect(() => {
    if (isMenuOpen !== isMenuOpenGlobally) {
      setIsMenuOpen(isMenuOpenGlobally);
    }
  }, [isMenuOpenGlobally, isMenuOpen]);
  const [, setLocalValue] = useState(element.value);
  const [localCurrency, setLocalCurrency] = useState(element.currency);
  const [localBank, setLocalBank] = useState(element.bank);
  const [localIsNegative, setLocalIsNegative] = useState(element.isNegative);
  const [localTag, setLocalTag] = useState(element.tag);
  const [displayValue, setDisplayValue] = useState('');
  const [fontSize, setFontSize] = useState('2rem');
  const [cardWidth, setCardWidth] = useState(180);
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const bankNameRef = useRef<HTMLSpanElement>(null);


  const removeCommas = (num: string): string => {
    return num.replace(/,/g, '');
  };

  const removeLeadingZeros = (val: string): string => {
    if (!val || val === '' || val === '0' || val === '0.') return val;
    
    if (val.includes('.')) {
      const [integerPart, decimalPart] = val.split('.');
      const cleanInteger = integerPart.replace(/^0+/, '') || '0';
      return `${cleanInteger}.${decimalPart}`;
    }
    
    return val.replace(/^0+/, '') || '0';
  };

  const formatValue = useCallback((val: string): string => {
    if (!val || val === '' || val === '0') return '0';
    const cleanValue = removeCommas(val);
    const withoutLeadingZeros = removeLeadingZeros(cleanValue);
    const numericValue = parseFloat(withoutLeadingZeros);
    if (isNaN(numericValue)) return '0';
    return formatInputAmount(withoutLeadingZeros);
  }, []);

  const calculateLocalCardWidth = useCallback(() => {
    const calculatedWidth = calculateCardWidth();
    setCardWidth(calculatedWidth);
  }, []);

  const calculateFontSize = useCallback(() => {
    if (!measureRef.current) return;

    const baseFontSize = 28; // Slightly smaller for consistent layout
    const currentText = localIsNegative ? `− ${displayValue || '0'}` : (displayValue || '0');
    const maxWidth = cardWidth - 40; // Card width minus padding and margin

    measureRef.current.style.fontSize = `${baseFontSize}px`;
    measureRef.current.textContent = currentText;

    let currentFontSize = baseFontSize;
    let textWidth = measureRef.current.offsetWidth;

    while (textWidth > maxWidth && currentFontSize > 16) {
      currentFontSize -= 1;
      measureRef.current.style.fontSize = `${currentFontSize}px`;
      textWidth = measureRef.current.offsetWidth;
    }

    setFontSize(`${currentFontSize / 16}rem`);
  }, [displayValue, localIsNegative, cardWidth]);

  useEffect(() => {
    const formatted = formatValue(element.value);
    setDisplayValue(formatted);
    setLocalValue(element.value);
    setLocalCurrency(element.currency);
    setLocalBank(element.bank);
    setLocalIsNegative(element.isNegative);
    setLocalTag(element.tag);
  }, [element.value, element.currency, element.bank, element.isNegative, element.tag, formatValue]);

  useEffect(() => {
    calculateLocalCardWidth();
  }, [calculateLocalCardWidth]);

  useEffect(() => {
    calculateFontSize();
  }, [calculateFontSize]);

  // Autofocus effect for new cards
  useEffect(() => {
    if (shouldAutoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 300); // Delay to allow animation to complete
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoFocus]);


  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = () => {
    // During drag, we let framer-motion handle the visual dragging
    // but we don't try to snap until drag end
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    if (onReorder && calculateGridPosition) {
      // Calculate the final position after drag
      const currentPos = position || { x: element.x, y: element.y };
      const finalX = currentPos.x + info.offset.x;
      const finalY = currentPos.y + info.offset.y;

      // Calculate which grid position this maps to
      const newGridPosition = calculateGridPosition(finalX, finalY);

      // Reorder the cards
      onReorder(element.id, newGridPosition);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Check if user typed a minus sign at the beginning
    if (inputValue.startsWith('-') && !localIsNegative) {
      setLocalIsNegative(true);
      onUpdate(element.id, { isNegative: true });
      inputValue = inputValue.substring(1); // Remove the minus sign from the value
    }
    
    // Remove the minus sign and space prefix if present (since we're showing it visually)
    if (inputValue.startsWith('− ')) {
      inputValue = inputValue.substring(2);
    }
    
    if (inputValue === '') {
      setDisplayValue('0');
      setLocalValue('0');
      onUpdate(element.id, { value: '0' });
      return;
    }

    const cleanValue = removeCommas(inputValue);
    
    // Allow numbers and decimal points only (after we've handled the minus sign above)
    if (!/^[0-9]*\.?[0-9]*$/.test(cleanValue)) {
      return;
    }
    
    // Limit decimal places to 2
    if (cleanValue.includes('.')) {
      const parts = cleanValue.split('.');
      if (parts[1] && parts[1].length > 2) {
        return;
      }
    }
    
    const withoutLeadingZeros = removeLeadingZeros(cleanValue);
    const formattedValue = formatInputAmount(withoutLeadingZeros);
    setDisplayValue(formattedValue);
    setLocalValue(withoutLeadingZeros);
    
    onUpdate(element.id, { value: withoutLeadingZeros });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setLocalCurrency(newCurrency);
    
    // Auto-select appropriate bank based on currency
    const currentBankRegion = localBank.startsWith('uk:') ? 'uk' : 'us';
    let newBank = localBank;
    
    // Only switch bank if currency change makes current bank inappropriate
    if (newCurrency === 'USD' && currentBankRegion === 'uk') {
      newBank = 'us:jpmorgan'; // Switch to most popular US bank
    } else if (newCurrency === 'GBP' && currentBankRegion === 'us') {
      newBank = 'uk:lloyds'; // Switch to most popular UK bank
    }
    
    if (newBank !== localBank) {
      setLocalBank(newBank);
      // Update tag if switching between regions
      let newTag = localTag;
      if (newBank.startsWith('uk:') && localTag === 'Checking') {
        newTag = 'Current';
      } else if (newBank.startsWith('us:') && localTag === 'Current') {
        newTag = 'Checking';
      }
      setLocalTag(newTag);
      onUpdate(element.id, { currency: newCurrency, bank: newBank, tag: newTag });
    } else {
      onUpdate(element.id, { currency: newCurrency });
    }
  };

  const handleBankChange = (newBank: string) => {
    setLocalBank(newBank);
    const isUKBank = newBank.startsWith('uk:');
    const isUSBank = newBank.startsWith('us:');
    let newTag = localTag;
    
    if (isUKBank && localTag === 'Checking') {
      newTag = 'Current';
    } else if (isUSBank && localTag === 'Current') {
      newTag = 'Checking';
    }
    
    setLocalTag(newTag);
    onUpdate(element.id, { bank: newBank, tag: newTag });
  };

  const handleTagChange = (newTag: string) => {
    setLocalTag(newTag);

    // If switching to Investments, change to an appropriate broker
    if (newTag === 'Investments') {
      let newBank = localBank;

      // Switch to default broker based on currency
      if (localCurrency === 'USD') {
        newBank = 'us:fidelity'; // Default US broker
      } else if (localCurrency === 'GBP') {
        newBank = 'uk:hargreaves'; // Default UK broker
      } else {
        newBank = 'us:fidelity'; // Default to US broker for other currencies
      }

      setLocalBank(newBank);
      onUpdate(element.id, { tag: newTag, bank: newBank });
    } else if (localTag === 'Investments' && newTag !== 'Investments') {
      // If switching FROM Investments to another tag, change to an appropriate bank
      let newBank = localBank;

      // Switch to default bank based on currency
      if (localCurrency === 'USD') {
        newBank = 'us:jpmorgan'; // Default US bank
      } else if (localCurrency === 'GBP') {
        newBank = 'uk:lloyds'; // Default UK bank
      } else {
        newBank = 'us:jpmorgan'; // Default to US bank for other currencies
      }

      setLocalBank(newBank);
      onUpdate(element.id, { tag: newTag, bank: newBank });
    } else {
      onUpdate(element.id, { tag: newTag });
    }
  };

  const handleToggleSign = () => {
    const newIsNegative = !localIsNegative;
    setLocalIsNegative(newIsNegative);
    onUpdate(element.id, { isNegative: newIsNegative });
  };

  const handleDelete = () => {
    onDelete(element.id);
    onDropdownChange(element.id, 'menu', false);
  };

  const handleMoveMoney = () => {
    // Move money functionality to be implemented later
    onDropdownChange(element.id, 'menu', false);
  };

  const handleMenuToggle = () => {
    const newIsOpen = !isMenuOpen;
    onDropdownChange(element.id, 'menu', newIsOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle minus key specifically
    if (e.key === '-' && !localIsNegative && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
      setLocalIsNegative(true);
      onUpdate(element.id, { isNegative: true });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't focus if clicking on delete button, bank dropdown, or currency dropdown
    if (e.target !== e.currentTarget && !inputRef.current?.contains(e.target as Node)) {
      return;
    }
    
    if (inputRef.current && !isDragging) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  // Use masonry position - this will update automatically when reordering happens
  const cardPosition = position || { x: element.x, y: element.y };

  return (
    <motion.div
      ref={cardRef}
      drag={isDraggable}
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={false}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onDrag={isDraggable ? handleDrag : undefined}
      onDragEnd={isDraggable ? handleDragEnd : undefined}
      onClick={(e) => {
        e.stopPropagation();
        handleCardClick(e);
      }}
      initial={{
        x: cardPosition.x,
        y: cardPosition.y,
        scale: 0,
        opacity: 0
      }}
      animate={{
        x: cardPosition.x,
        y: cardPosition.y,
        scale: 1,
        opacity: 1
      }}
      whileDrag={isDraggable ? {
        scale: 1.05,
        zIndex: 15,
        rotate: 2,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        cursor: "grabbing"
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
        x: { type: "spring", stiffness: 400, damping: 40 },
        y: { type: "spring", stiffness: 400, damping: 40 },
        scale: { type: "spring", stiffness: 400, damping: 40 }
      }}
      className={`${isDraggable ? 'absolute' : 'relative'} rounded-xl ${isDraggable ? 'pt-2' : 'pt-4'} px-4 pb-3 border ${isDraggable ? 'cursor-grab' : 'cursor-auto'} ${!isDraggable ? 'w-full mb-4' : ''}`}
      style={{
        width: isDraggable ? `${cardWidth}px` : 'auto',
        minHeight: '240px',
        backgroundColor: isDarkMode ? '#1A1C19' : '#FFFFFF',
        borderColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)',
        borderWidth: '1px',
        zIndex: hasOpenDropdown ? 10000 : 'auto',
        boxShadow: isDarkMode
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Grip icon - only show on desktop when draggable */}
      {isDraggable && (
        <div className="flex justify-center mb-3">
          <GripHorizontal
            className="h-3 w-3"
            style={{ color: isDarkMode ? '#888988' : '#6A6C6A' }}
          />
        </div>
      )}

      {/* More options menu */}
      <div className="absolute -top-2 -right-2">
        <button
          onClick={handleMenuToggle}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors relative"
          style={{
            backgroundColor: isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#2A2B29' : 'rgba(14, 15, 12, 0.20)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)';
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MoreHorizontal
            className="h-3 w-3"
            style={{ color: isDarkMode ? '#FFFFFF' : '#454745' }}
          />
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <>
            <div
              className="absolute top-full right-0 mt-1 w-36 rounded-[10px] shadow-lg z-[9999]"
              style={{
                backgroundColor: isDarkMode ? '#1A1C19' : '#FFFFFF',
                boxShadow: isDarkMode
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <button
                onClick={handleMoveMoney}
                className="w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 transition-colors uppercase tracking-widest"
                style={{
                  color: isDarkMode ? '#FFFFFF' : '#454745'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(245, 245, 245, 0.06)' : 'rgba(14, 15, 12, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)'
                  }}
                >
                  <ArrowUp className="h-2.5 w-2.5" style={{ color: isDarkMode ? '#FFFFFF' : '#163300' }} />
                </div>
                Move money
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 transition-colors uppercase tracking-widest"
                style={{
                  color: isDarkMode ? '#FFFFFF' : '#454745'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(245, 245, 245, 0.06)' : 'rgba(14, 15, 12, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)'
                  }}
                >
                  <Trash2 className="h-2.5 w-2.5" style={{ color: isDarkMode ? '#FFFFFF' : '#163300' }} />
                </div>
                Delete
              </button>
            </div>

            {/* Overlay to close menu when clicking outside */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => onDropdownChange(element.id, 'menu', false)}
            />
          </>
        )}
      </div>

      {/* Tag dropdown */}
      <div className="mb-2">
        <TagDropdown
          value={localTag}
          onChange={handleTagChange}
          bank={localBank}
          isDarkMode={isDarkMode}
          onOpenChange={(isOpen) => onDropdownChange(element.id, 'tag', isOpen)}
          isOpenGlobally={globalOpenDropdown === `${element.id}-tag`}
        />
      </div>

      {/* Bank and Money input */}
      <div className="space-y-2">
        <BankDropdown
          value={localBank}
          onChange={handleBankChange}
          showLabel={false}
          currency={localCurrency}
          isDarkMode={isDarkMode}
          tag={localTag}
          onOpenChange={(isOpen) => onDropdownChange(element.id, 'bank', isOpen)}
          isOpenGlobally={globalOpenDropdown === `${element.id}-bank`}
        />
        
        <div
          className="text-3xl font-wise ml-2 mb-4"
          style={{
            lineHeight: '1.1',
            color: isDarkMode ? '#F5F5F5' : '#0E0F0C',
            minHeight: '2.5rem' // Preserve spacing even when empty
          }}
        >
          {(() => {
            if (!localBank || localBank === '') {
              return '\u00A0'; // Non-breaking space to maintain height
            }

            const allBanks = [
              { name: 'uk:barclays', displayName: 'Barclays' },
              { name: 'uk:coop', displayName: 'Co-op Bank' },
              { name: 'uk:halifax', displayName: 'Halifax' },
              { name: 'uk:hsbc', displayName: 'HSBC' },
              { name: 'uk:lloyds', displayName: 'Lloyds' },
              { name: 'uk:metro', displayName: 'Metro Bank' },
              { name: 'uk:monzo', displayName: 'Monzo' },
              { name: 'uk:natwest', displayName: 'NatWest' },
              { name: 'uk:revolut', displayName: 'Revolut' },
              { name: 'uk:santandar', displayName: 'Santander' },
              { name: 'uk:starling', displayName: 'Starling Bank' },
              { name: 'uk:tsb', displayName: 'TSB' },
              { name: 'uk:virgin', displayName: 'Virgin Money' },
              { name: 'uk:wise', displayName: 'Wise' },
              { name: 'uk:yorkshire', displayName: 'Yorkshire Bank' },
              { name: 'us:bankofamerica', displayName: 'Bank of America' },
              { name: 'us:bankofmellon', displayName: 'Bank of New York Mellon' },
              { name: 'us:BMO', displayName: 'BMO' },
              { name: 'us:capitalone', displayName: 'Capital One' },
              { name: 'us:citigroup', displayName: 'Citigroup' },
              { name: 'us:goldmansachs', displayName: 'Goldman Sachs' },
              { name: 'us:jpmorgan', displayName: 'JP Morgan Chase' },
              { name: 'us:PNC', displayName: 'PNC Bank' },
              { name: 'us:schwab', displayName: 'Charles Schwab' },
              { name: 'us:statestreet', displayName: 'State Street' },
              { name: 'us:tdbank', displayName: 'TD Bank' },
              { name: 'us:truist', displayName: 'Truist' },
              { name: 'us:usbancorp', displayName: 'U.S. Bancorp' },
              { name: 'us:wellsfargo', displayName: 'Wells Fargo' }
            ];

            const allBrokers = [
              { name: 'us:fidelity', displayName: 'Fidelity US' },
              { name: 'us:schwab', displayName: 'Charles Schwab' },
              { name: 'us:vanguard', displayName: 'Vanguard' },
              { name: 'us:etrade', displayName: 'E*Trade' },
              { name: 'us:ibkr', displayName: 'IBKR' },
              { name: 'us:robinhood', displayName: 'Robinhood' },
              { name: 'us:webull', displayName: 'We Bull' },
              { name: 'uk:hargreaves', displayName: 'Hargreaves Lansdown' },
              { name: 'uk:ii', displayName: 'Interactive Investor' },
              { name: 'uk:ajbell', displayName: 'AJ Bell' },
              { name: 'uk:vanguard', displayName: 'Vanguard' },
              { name: 'uk:fidelity', displayName: 'Fidelity International' },
              { name: 'uk:trading212', displayName: 'Trading 212' },
              { name: 'uk:robinhood', displayName: 'Robinhood' },
              { name: 'uk:etoro', displayName: 'eToro' }
            ];

            const allOptions = [...allBanks, ...allBrokers];
            const selectedOption = allOptions.find(option => option.name === localBank);
            return selectedOption ? selectedOption.displayName : localBank;
          })()}
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <CurrencyDropdown
            value={localCurrency}
            onChange={handleCurrencyChange}
            isDarkMode={isDarkMode}
            onOpenChange={(isOpen) => onDropdownChange(element.id, 'currency', isOpen)}
            isOpenGlobally={globalOpenDropdown === `${element.id}-currency`}
          />
          <button
            onClick={handleToggleSign}
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium transition-all duration-200 border"
            style={{
              backgroundColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)',
              color: isDarkMode ? '#FFFFFF' : '#454745',
              borderColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)'
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(245, 245, 245, 0.20)' : 'rgba(14, 15, 12, 0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)';
            }}
          >
            {localIsNegative ? '−' : '+'}
          </button>
        </div>
        
        <div className="relative mb-3">
          <span
            ref={measureRef}
            className="absolute invisible font-wise whitespace-nowrap pointer-events-none"
            style={{ fontSize: '2rem', left: '-9999px' }}
          >
            {localIsNegative ? `− ${displayValue}` : displayValue}
          </span>

          <span
            ref={bankNameRef}
            className="absolute invisible font-wise whitespace-nowrap pointer-events-none"
            style={{ fontSize: '24px', left: '-9999px' }}
          >
            Bank Name Measure
          </span>
          
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={localIsNegative ? `− ${displayValue}` : displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-left font-wise ml-2"
            style={{
              fontSize,
              lineHeight: '1.1',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              color: (displayValue === '0' || displayValue === '')
                ? (isDarkMode ? '#FFFFFF' : '#0E0F0C') // Neutral black/white for 0 values
                : isDarkMode
                ? (localIsNegative ? '#E8709F' : '#9FE870')
                : '#0E0F0C'
            }}
            placeholder="0"
            autoComplete="off"
            spellCheck="false"
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when interacting with input
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function CanvasPage() {
  const router = useRouter();
  const [elements, setElements] = useState<CardElement[]>(initialPortfolio);
  const [newCardId, setNewCardId] = useState<string | null>(null);
  const [netWorthCurrency, setNetWorthCurrency] = useState<string>('USD');
  const [masonryPositions, setMasonryPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [cardOrder, setCardOrder] = useState<string[]>(initialPortfolio.map(card => card.id));
  const [globalOpenDropdown, setGlobalOpenDropdown] = useState<string | null>(null);
  const { isDarkMode, toggleDarkMode, getBackgroundStyle, getTextStyle } = useDarkMode();

  const handleDropdownChange = (cardId: string, dropdownType: string, isOpen: boolean) => {
    const dropdownId = `${cardId}-${dropdownType}`;
    if (isOpen) {
      setGlobalOpenDropdown(dropdownId);
    } else {
      setGlobalOpenDropdown(null);
    }
  };

  // Calculate net worth in USD first, then convert to selected currency
  const netWorthUSD = calculateNetWorth(elements.map(el => ({
    id: el.id,
    value: el.value,
    currency: el.currency,
    bank: el.bank,
    isNegative: el.isNegative
  })));
  
  const netWorthInSelectedCurrency = convertFromUSD(netWorthUSD, netWorthCurrency);

  const calculateMasonryPositions = useCallback((): { [key: string]: { x: number; y: number } } => {
    if (typeof window === 'undefined') return {};

    const viewportWidth = window.innerWidth;
    const cardWidth = calculateCardWidth();
    const cardHeight = 240; // Fixed card height to accommodate content
    const gap = 32; // Increased gap for better spacing between cards
    const padding = 16;

    // Calculate layout parameters based on viewport
    let columns: number;
    let startX: number;

    if (viewportWidth < 768) {
      // Mobile: single column, centered
      columns = 1;
      startX = padding;
    } else if (viewportWidth < 1024) {
      // Tablet: 2 columns
      columns = 2;
      startX = padding;
    } else {
      // Desktop: align left with total balance card (80px from left)
      columns = Math.floor((viewportWidth - 80 - padding) / (cardWidth + gap));
      startX = 80; // Align with total balance card (md:left-20 = 80px)
    }

    // Start below header
    const headerHeight = viewportWidth < 768 ? 200 : 180; // More space between total balance and cards
    const positions: { [key: string]: { x: number; y: number } } = {};

    // Use card order to arrange all cards in the grid automatically
    // Remove the manual positioning concept - all cards follow the grid
    cardOrder.forEach((cardId, index) => {
      const columnIndex = index % columns;
      const rowIndex = Math.floor(index / columns);

      const x = startX + columnIndex * (cardWidth + gap);
      const y = headerHeight + rowIndex * (cardHeight + gap);

      positions[cardId] = { x, y };
    });

    return positions;
  }, [cardOrder]);

  // Update masonry positions when elements or card order changes, or window resizes
  useEffect(() => {
    const updatePositions = () => {
      const positions = calculateMasonryPositions();
      setMasonryPositions(positions);
    };

    updatePositions();

    const handleResize = () => {
      updatePositions();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [elements, cardOrder, calculateMasonryPositions]);

  // Get all valid grid positions
  const getAllGridPositions = useCallback((): Array<{ x: number; y: number; index: number }> => {
    if (typeof window === 'undefined') return [];

    const viewportWidth = window.innerWidth;
    const cardWidth = calculateCardWidth();
    const cardHeight = 240;
    const gap = 32; // Match the gap from calculateMasonryPositions
    const padding = 16;

    let columns: number;
    let startX: number;

    if (viewportWidth < 768) {
      columns = 1;
      startX = padding;
    } else if (viewportWidth < 1024) {
      columns = 2;
      startX = padding;
    } else {
      // Desktop: align left with total balance card (80px from left)
      columns = Math.floor((viewportWidth - 80 - padding) / (cardWidth + gap));
      startX = 80; // Align with total balance card (md:left-20 = 80px)
    }

    const headerHeight = viewportWidth < 768 ? 200 : 180;
    const positions: Array<{ x: number; y: number; index: number }> = [];

    // Generate positions for current cards plus one extra slot for insertion
    for (let i = 0; i <= cardOrder.length; i++) {
      const columnIndex = i % columns;
      const rowIndex = Math.floor(i / columns);

      const x = startX + columnIndex * (cardWidth + gap);
      const y = headerHeight + rowIndex * (cardHeight + gap);

      positions.push({ x, y, index: i });
    }

    return positions;
  }, [cardOrder.length]);

  // Calculate which grid position a card should be inserted at based on coordinates
  const calculateGridPosition = useCallback((x: number, y: number): number => {
    const positions = getAllGridPositions();

    let closestIndex = 0;
    let closestDistance = Infinity;

    positions.forEach((pos) => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = pos.index;
      }
    });

    return Math.min(cardOrder.length, closestIndex);
  }, [getAllGridPositions, cardOrder.length]);


  // Reorder cards based on drag and drop
  const reorderCards = useCallback((draggedCardId: string, newPosition: number) => {
    setCardOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const currentIndex = newOrder.indexOf(draggedCardId);

      if (currentIndex === -1) return newOrder;

      // Remove the dragged card from its current position
      newOrder.splice(currentIndex, 1);

      // Insert it at the new position
      const clampedPosition = Math.max(0, Math.min(newOrder.length, newPosition));
      newOrder.splice(clampedPosition, 0, draggedCardId);

      return newOrder;
    });
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const generateId = () => {
    return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };


  const handleAddElement = () => {
    const newCardId = generateId();

    const newCard: CardElement = {
      id: newCardId,
      x: 0, // Position will be determined by grid layout
      y: 0,
      value: '0',
      currency: '', // Empty currency
      bank: '', // Empty bank
      isNegative: false, // Neutral (neither positive nor negative)
      tag: '' // Empty tag
    };

    setNewCardId(newCardId);
    setElements(prev => [...prev, newCard]);
    setCardOrder(prev => [...prev, newCardId]); // Add to end of order

    // Scroll to new card on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const newCardElement = document.querySelector(`[data-card-id="${newCardId}"]`);
        if (newCardElement) {
          newCardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 300); // Wait for card animation
    }

    // Clear the newCardId after a delay to prevent future autofocus
    setTimeout(() => {
      setNewCardId(null);
    }, 1000);
  };

  const handleDeleteCard = (id: string) => {
    setElements(prev => prev.filter(element => element.id !== id));
    setCardOrder(prev => prev.filter(cardId => cardId !== id)); // Remove from order
  };

  const handleUpdateCard = (id: string, updates: Partial<CardElement>) => {
    setElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden relative"
      style={getBackgroundStyle('#FFFFFF', '#0E0F0C')}
      onClick={() => setGlobalOpenDropdown(null)}
    >
      {/* Back button */}
      <div className="absolute top-4 left-4 z-30 md:z-20">
        <button
          onClick={handleBack}
          className="p-3 rounded-full transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#2A2B29' : 'rgba(14, 15, 12, 0.20)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)';
          }}
        >
          <ArrowLeft
            className="h-5 w-5"
            style={{ color: isDarkMode ? '#FFFFFF' : '#163300' }}
          />
        </button>
      </div>

      {/* Folio manager text */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" style={{ top: 'calc(16px + 1.5rem)' }}>
        <div
          className="flex items-center gap-3 h-8 pl-2 pr-3 rounded-full text-xs font-medium"
          style={{
            backgroundColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)'
          }}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white flex-shrink-0">
            <Image
              src="/banks/uk/wise.webp"
              alt="Wise"
              width={24}
              height={24}
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="uppercase"
            style={{
              color: isDarkMode ? '#FFFFFF' : '#454745',
              letterSpacing: '0.2em'
            }}
          >
            Folio manager
          </span>
        </div>
      </div>

      {/* Net worth display */}
      <div className="absolute top-20 md:top-4 left-4 md:left-20 z-30 right-4 md:right-auto">
        <div
          className="rounded-xl px-3 py-2 md:px-4 md:py-3 border"
          style={{
            ...getBackgroundStyle('#FFFFFF', '#1A1C19'),
            borderColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)',
            boxShadow: isDarkMode
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center mb-2">
            <CurrencyDropdown
              value={netWorthCurrency}
              onChange={setNetWorthCurrency}
              isDarkMode={isDarkMode}
              onOpenChange={(isOpen) => handleDropdownChange('total-balance', 'currency', isOpen)}
              isOpenGlobally={globalOpenDropdown === 'total-balance-currency'}
            />
          </div>
          <div
            className="text-4xl md:text-6xl font-wise"
            style={getTextStyle('#0E0F0C', '#F5F5F5')}
          >
            {formatNetWorthRaw(netWorthInSelectedCurrency)}
          </div>
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4 z-20" style={{ display: 'none' }}>
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#2A2B29' : 'rgba(14, 15, 12, 0.20)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#3D3E3C' : 'rgba(14, 15, 12, 0.12)';
          }}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" style={{ color: '#FFFFFF' }} />
          ) : (
            <Moon className="h-5 w-5" style={{ color: '#163300' }} />
          )}
        </button>
      </div>

      {/* Dot Grid */}
      <DotGrid spacing={30} dotSize={1.5} isDarkMode={isDarkMode} />

      {/* Canvas content area */}
      <div className="relative z-10 h-full min-h-screen md:block">
        {/* Mobile layout - full width stacked cards */}
        <div className="md:hidden px-4 pt-56 pb-8">
          {cardOrder.map((cardId) => {
            const element = elements.find(el => el.id === cardId);
            if (!element) return null;

            return (
              <div key={`${element.id}-mobile-wrapper`} data-card-id={element.id}>
                <DraggableCard
                  key={`${element.id}-mobile`}
                  element={element}
                  onDelete={handleDeleteCard}
                  onUpdate={handleUpdateCard}
                  onReorder={reorderCards}
                  calculateGridPosition={calculateGridPosition}
                  shouldAutoFocus={element.id === newCardId}
                  isDarkMode={isDarkMode}
                  position={{ x: 0, y: 0 }}
                  isDraggable={false}
                  globalOpenDropdown={globalOpenDropdown}
                  onDropdownChange={handleDropdownChange}
                />
              </div>
            );
          })}
        </div>

        {/* Desktop layout - positioned cards */}
        <div className="hidden md:block">
          {cardOrder.map((cardId) => {
            const element = elements.find(el => el.id === cardId);
            if (!element) return null;

            return (
              <DraggableCard
                key={`${element.id}-desktop`}
                element={element}
                onDelete={handleDeleteCard}
                onUpdate={handleUpdateCard}
                onReorder={reorderCards}
                calculateGridPosition={calculateGridPosition}
                shouldAutoFocus={element.id === newCardId}
                isDarkMode={isDarkMode}
                position={masonryPositions[element.id]}
                isDraggable={true}
                globalOpenDropdown={globalOpenDropdown}
                onDropdownChange={handleDropdownChange}
              />
            );
          })}
        </div>
      </div>

      {/* Floating FAB button */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          variant="primary"
          size="large"
          iconOnly
          onClick={handleAddElement}
          className="w-16 h-16 rounded-full"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}