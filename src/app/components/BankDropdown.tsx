import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Bank {
  name: string;
  image: string;
  displayName: string;
}

interface BankDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  showLabel?: boolean;
  currency?: string;
  isDarkMode?: boolean;
  tag?: string;
  onOpenChange?: (isOpen: boolean) => void;
  isOpenGlobally?: boolean;
}

// UK banks ordered by popularity (most to least popular)
const ukBanks: Bank[] = [
  { name: 'uk:lloyds', image: '/banks/uk/lloyds.webp', displayName: 'Lloyds' },
  { name: 'uk:barclays', image: '/banks/uk/barclays.webp', displayName: 'Barclays' },
  { name: 'uk:hsbc', image: '/banks/uk/hsbc.jpeg', displayName: 'HSBC' },
  { name: 'uk:natwest', image: '/banks/uk/natwest.webp', displayName: 'NatWest' },
  { name: 'uk:santandar', image: '/banks/uk/santandar.webp', displayName: 'Santander' },
  { name: 'uk:halifax', image: '/banks/uk/halifax.webp', displayName: 'Halifax' },
  { name: 'uk:tsb', image: '/banks/uk/tsb.webp', displayName: 'TSB' },
  { name: 'uk:monzo', image: '/banks/uk/monzo.webp', displayName: 'Monzo' },
  { name: 'uk:starling', image: '/banks/uk/starling.webp', displayName: 'Starling Bank' },
  { name: 'uk:revolut', image: '/banks/uk/revolut.webp', displayName: 'Revolut' },
  { name: 'uk:wise', image: '/banks/uk/wise.webp', displayName: 'Wise' },
  { name: 'uk:metro', image: '/banks/uk/metro.webp', displayName: 'Metro Bank' },
  { name: 'uk:virgin', image: '/banks/uk/virgin.webp', displayName: 'Virgin Money' },
  { name: 'uk:coop', image: '/banks/uk/coop.webp', displayName: 'Co-op Bank' },
  { name: 'uk:yorkshire', image: '/banks/uk/yorkshire.webp', displayName: 'Yorkshire Bank' }
];

// US banks ordered by popularity (most to least popular)
const usBanks: Bank[] = [
  { name: 'us:jpmorgan', image: '/banks/us/jpmorgan.webp', displayName: 'JP Morgan Chase' },
  { name: 'us:bankofamerica', image: '/banks/us/bankofamerica.webp', displayName: 'Bank of America' },
  { name: 'us:wellsfargo', image: '/banks/us/wellsfargo.webp', displayName: 'Wells Fargo' },
  { name: 'us:citigroup', image: '/banks/us/citigroup.webp', displayName: 'Citigroup' },
  { name: 'us:usbancorp', image: '/banks/us/usbancorp.webp', displayName: 'U.S. Bancorp' },
  { name: 'us:truist', image: '/banks/us/truist.webp', displayName: 'Truist' },
  { name: 'us:PNC', image: '/banks/us/PNC.webp', displayName: 'PNC Bank' },
  { name: 'us:capitalone', image: '/banks/us/capitalone.webp', displayName: 'Capital One' },
  { name: 'us:tdbank', image: '/banks/us/tdbank.webp', displayName: 'TD Bank' },
  { name: 'us:schwab', image: '/banks/us/schwab.webp', displayName: 'Charles Schwab' },
  { name: 'us:BMO', image: '/banks/us/BMO.webp', displayName: 'BMO' },
  { name: 'us:goldmansachs', image: '/banks/us/goldmansachs.jpeg', displayName: 'Goldman Sachs' },
  { name: 'us:statestreet', image: '/banks/us/statestreet.webp', displayName: 'State Street' },
  { name: 'us:bankofmellon', image: '/banks/us/bankofmellon.webp', displayName: 'Bank of New York Mellon' }
];

// US brokers ordered by popularity (most to least popular)
const usBrokers: Bank[] = [
  { name: 'us:fidelity', image: '/brokers/us/fidelity.webp', displayName: 'Fidelity US' },
  { name: 'us:schwab', image: '/brokers/us/schwab.webp', displayName: 'Charles Schwab' },
  { name: 'us:vanguard', image: '/brokers/us/vanguard.webp', displayName: 'Vanguard' },
  { name: 'us:etrade', image: '/brokers/us/e-trade.webp', displayName: 'E*Trade' },
  { name: 'us:ibkr', image: '/brokers/us/ibkr.webp', displayName: 'IBKR' },
  { name: 'us:robinhood', image: '/brokers/us/robinhood.webp', displayName: 'Robinhood' },
  { name: 'us:webull', image: '/brokers/us/we-bull.webp', displayName: 'We Bull' }
];

// UK brokers ordered by popularity (most to least popular)
const ukBrokers: Bank[] = [
  { name: 'uk:hargreaves', image: '/brokers/uk/hargreaves.webp', displayName: 'Hargreaves Lansdown' },
  { name: 'uk:ii', image: '/brokers/uk/ii.webp', displayName: 'Interactive Investor' },
  { name: 'uk:ajbell', image: '/brokers/uk/aj-bell.webp', displayName: 'AJ Bell' },
  { name: 'uk:vanguard', image: '/brokers/uk/vanguard.webp', displayName: 'Vanguard' },
  { name: 'uk:fidelity', image: '/brokers/uk/fidelity.webp', displayName: 'Fidelity International' },
  { name: 'uk:trading212', image: '/brokers/uk/trading-212.webp', displayName: 'Trading 212' },
  { name: 'uk:robinhood', image: '/brokers/uk/robinhood.webp', displayName: 'Robinhood' },
  { name: 'uk:etoro', image: '/brokers/uk/etoro.webp', displayName: 'eToro' }
];

const allBanks: Bank[] = [...ukBanks, ...usBanks];
const allBrokers: Bank[] = [...ukBrokers, ...usBrokers];

// Function to get filtered and ordered banks based on currency
const getBanksForCurrency = (currency?: string): Bank[] => {
  if (currency === 'USD') {
    return usBanks;
  } else if (currency === 'GBP') {
    return ukBanks;
  } else {
    // For other currencies, alternate US and UK banks
    const alternated: Bank[] = [];
    const maxLength = Math.max(usBanks.length, ukBanks.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < usBanks.length) {
        alternated.push(usBanks[i]);
      }
      if (i < ukBanks.length) {
        alternated.push(ukBanks[i]);
      }
    }

    return alternated;
  }
};

// Function to get filtered and ordered brokers based on currency
const getBrokersForCurrency = (currency?: string): Bank[] => {
  if (currency === 'USD') {
    return usBrokers;
  } else if (currency === 'GBP') {
    return ukBrokers;
  } else {
    // For other currencies, alternate US and UK brokers
    const alternated: Bank[] = [];
    const maxLength = Math.max(usBrokers.length, ukBrokers.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < usBrokers.length) {
        alternated.push(usBrokers[i]);
      }
      if (i < ukBrokers.length) {
        alternated.push(ukBrokers[i]);
      }
    }

    return alternated;
  }
};

export default function BankDropdown({
  value = 'uk:lloyds',
  onChange,
  className = '',
  showLabel = false,
  currency,
  isDarkMode = false,
  tag = '',
  onOpenChange,
  isOpenGlobally = false
}: BankDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sync local state with global state
  useEffect(() => {
    if (isOpen !== isOpenGlobally) {
      setIsOpen(isOpenGlobally);
    }
  }, [isOpenGlobally, isOpen]);

  // Determine if we should show brokers or banks
  const isInvestments = tag === 'Investments';
  const filteredOptions = isInvestments
    ? getBrokersForCurrency(currency)
    : getBanksForCurrency(currency);

  const getSelectedOption = () => {
    if (!value || value === '') {
      return null; // Return null for empty bank
    }
    // Search in the appropriate list (banks or brokers)
    const allOptions = isInvestments ? allBrokers : allBanks;
    return allOptions.find(option => option.name === value) || filteredOptions[0];
  };

  const selectedOption = getSelectedOption();

  const handleOptionSelect = (optionName: string) => {
    if (onChange) {
      onChange(optionName);
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
      <div className="flex items-center justify-between h-10">
        <button
          type="button"
          onClick={handleToggleOpen}
          className="flex items-center gap-2 h-10 px-3 rounded-full transition-colors w-fit"
          style={{
            backgroundColor: isDarkMode ? 'rgba(245, 245, 245, 0.12)' : 'rgba(14, 15, 12, 0.12)'
          }}
        >
          <div className="flex items-center min-w-0">
            <div
              className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: selectedOption ? '#FFFFFF' : 'rgba(245, 245, 245, 0.12)'
              }}
            >
              {selectedOption ? (
                <Image
                  src={selectedOption.image}
                  alt={selectedOption.displayName}
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-transparent" />
              )}
            </div>
          </div>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200 flex-shrink-0"
            style={{
              color: isDarkMode ? '#FFFFFF' : '#6A6C6A',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>
        {showLabel && (
          <span
            className="text-sm font-medium"
            style={{ color: isDarkMode ? '#F5F5F5' : '#0E0F0C' }}
          >
            {selectedOption ? selectedOption.displayName : '\u00A0'}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 rounded-[10px] shadow-lg z-[9999] max-h-64 overflow-y-auto"
          style={{
            backgroundColor: isDarkMode ? '#1A1C19' : '#FFFFFF',
            boxShadow: isDarkMode
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          {filteredOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => handleOptionSelect(option.name)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{
                backgroundColor: value === option.name
                  ? (isDarkMode ? 'rgba(159, 232, 112, 0.15)' : 'rgba(159, 232, 112, 0.10)')
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (value !== option.name) {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(245, 245, 245, 0.06)' : 'rgba(14, 15, 12, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.name) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white flex-shrink-0">
                <Image
                  src={option.image}
                  alt={option.displayName}
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium text-sm"
                  style={{ color: isDarkMode ? '#F5F5F5' : '#0E0F0C' }}
                >
                  {option.displayName}
                </div>
              </div>
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