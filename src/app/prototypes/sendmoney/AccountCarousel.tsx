import React, { useState, useRef, useEffect, useCallback } from 'react';
import AccountCard from './AccountCard';
import { metaResearchService } from '../../utils/metaResearchService';
import { motion } from 'motion/react';

interface CurrencyBalance {
  code: string;
  flag: string;
  name: string;
  amount: number;
}

interface Account {
  id: string;
  type: 'main' | 'savings' | 'investment';
  title: string;
  currencies: CurrencyBalance[];
}

const getBaseAccounts = (): Account[] => {
  const researchConfig = metaResearchService.getConfiguration();
  const balanceConfig = metaResearchService.getBalanceConfiguration();
  const currencyOrder = metaResearchService.getCurrencyDisplayOrder();

  const baseCurrencies = [
    { code: 'GBP', flag: '/flags/United Kingdom.svg', name: 'British pound' },
    { code: 'USD', flag: '/flags/United States.svg', name: 'US dollar' },
    { code: 'EUR', flag: '/flags/Euro.svg', name: 'Euro' }
  ];

  // Sort currencies based on research configuration
  const sortedCurrencies = baseCurrencies.sort((a, b) => {
    const aIndex = currencyOrder.includes(a.code as 'USD' | 'GBP') ? currencyOrder.indexOf(a.code as 'USD' | 'GBP') : 999;
    const bIndex = currencyOrder.includes(b.code as 'USD' | 'GBP') ? currencyOrder.indexOf(b.code as 'USD' | 'GBP') : 999;
    return aIndex - bIndex;
  });

  // Set amounts based on research configuration and stored data
  const getAmount = (currencyCode: string, accountType: string): number => {
    // Check for stored home data for main account
    if (accountType === 'main' && typeof window !== 'undefined') {
      const storedHomeData = window.sessionStorage.getItem('homeData');
      if (storedHomeData) {
        try {
          const homeData = JSON.parse(storedHomeData);
          const mainCurrency = homeData.mainAccountCurrency;
          const mainBalance = parseFloat(homeData.mainAccountBalance || '0');
          
          if (mainCurrency && currencyCode === mainCurrency && mainBalance > 0) {
            return mainBalance;
          }
        } catch (e) {
          console.warn('Could not parse home data:', e);
        }
      }
    }
    
    // For savings and investment accounts, always start at 0
    if (accountType === 'savings' || accountType === 'investment') {
      return 0;
    }
    
    // Default logic for main account if no stored data
    if (researchConfig.isFromResearch) {
      // For research participants, show full balance in their selected currency
      const configCurrency = balanceConfig.currency;
      if (currencyCode === configCurrency && accountType === 'main') {
        return balanceConfig.amount;
      }
      return 0; // Other currencies
    } else {
      // Default GBP balances - full amount in main account
      if (currencyCode === 'GBP' && accountType === 'main') {
        return 10706;
      }
      return 0; // Other currencies
    }
  };
  
  return [
    {
      id: 'main',
      type: 'main',
      title: 'Main account',
      currencies: sortedCurrencies.map(curr => ({
        ...curr,
        amount: getAmount(curr.code, 'main')
      }))
    },
    {
      id: 'savings',
      type: 'savings',
      title: 'Savings account',
      currencies: sortedCurrencies.map(curr => ({
        ...curr,
        amount: getAmount(curr.code, 'savings')
      }))
    },
    {
      id: 'investment',
      type: 'investment',
      title: 'Investment account',
      currencies: sortedCurrencies.map(curr => ({
        ...curr,
        amount: getAmount(curr.code, 'investment')
      }))
    }
  ];
};

const USD_RATES: Record<string, number> = {
  USD: 1.000,
  GBP: 0.730,
  EUR: 0.850
};

interface AccountCarouselProps {
  onTotalBalanceChange?: (total: number) => void;
  animationDirection?: 'left' | 'right';
}

export default function AccountCarousel({ onTotalBalanceChange, animationDirection }: AccountCarouselProps) {
  const [cardWidth, setCardWidth] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>(getBaseAccounts());
  const [isUpdating, setIsUpdating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const researchConfig = metaResearchService.getConfiguration();
  const balanceConfig = metaResearchService.getBalanceConfiguration();

  const calculateAccountTotal = useCallback((currencies: CurrencyBalance[]): number => {
    return currencies.reduce((total, currency) => {
      if (researchConfig.isFromResearch) {
        // For research participants, calculate in their configured currency
        const targetCurrency = balanceConfig.currency;
        if (currency.code === targetCurrency) {
          // Direct amount for the target currency
          return total + currency.amount;
        } else {
          // Convert other currencies to target currency
          const usdAmount = currency.amount / USD_RATES[currency.code];
          const targetAmount = usdAmount * USD_RATES[targetCurrency];
          return total + targetAmount;
        }
      } else {
        // Default behavior - calculate in GBP
        const usdAmount = currency.amount / USD_RATES[currency.code];
        const gbpAmount = usdAmount * USD_RATES.GBP;
        return total + gbpAmount;
      }
    }, 0);
  }, [researchConfig, balanceConfig]);

  const calculateGrandTotal = useCallback((): number => {
    return accounts.reduce((grandTotal, account) => {
      return grandTotal + calculateAccountTotal(account.currencies);
    }, 0);
  }, [calculateAccountTotal, accounts]);

  useEffect(() => {
    const grandTotal = calculateGrandTotal();
    if (onTotalBalanceChange) {
      // Call for all users - HomeMainView will decide whether to accept the update
      onTotalBalanceChange(grandTotal);
    }
  }, [onTotalBalanceChange, calculateGrandTotal]);

  // Check for pending balance additions to sync with HomeMainView
  useEffect(() => {
    const checkForPendingAddition = () => {
      if (typeof window !== 'undefined') {
        const storedHomeData = window.sessionStorage.getItem('homeData');
        if (storedHomeData) {
          try {
            const homeData = JSON.parse(storedHomeData);
            
            // Check if there's a pending amount to add
            if (homeData.pendingAddAmount) {
              console.log('AccountCarousel: Found pending addition, scheduling sync update...');
              // Wait exactly 2 seconds to sync with HomeMainView
              setTimeout(() => {
                console.log('AccountCarousel: Executing synchronized balance update');
                setIsUpdating(true);
                // Refresh accounts with updated data from storage
                const newAccounts = getBaseAccounts();
                setAccounts(newAccounts);
                // Clear updating flag after transition
                setTimeout(() => setIsUpdating(false), 300);
              }, 2000);
            }
          } catch (e) {
            console.warn('Could not parse home data:', e);
          }
        }
      }
    };

    // Listen for storage events from HomeMainView
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homeData' && e.newValue) {
        try {
          const homeData = JSON.parse(e.newValue);
          console.log('AccountCarousel: Storage event received', homeData);
          
          // If there's a carousel update trigger, update immediately
          if (homeData.carouselUpdateTrigger) {
            console.log('AccountCarousel: Updating from storage event');
            setIsUpdating(true);
            const newAccounts = getBaseAccounts();
            setAccounts(newAccounts);
            setTimeout(() => setIsUpdating(false), 300);
            
            // Clear the trigger to avoid repeated updates
            const cleanedData = { ...homeData };
            delete cleanedData.carouselUpdateTrigger;
            window.sessionStorage.setItem('homeData', JSON.stringify(cleanedData));
          }
        } catch (e) {
          console.warn('AccountCarousel: Could not parse storage event data:', e);
        }
      }
    };

    // Check on mount with small delay to ensure component is ready
    const timeoutId = setTimeout(checkForPendingAddition, 100);
    
    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [animationDirection]);

  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = containerWidth * 0.9;
        setCardWidth(cardWidth);
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full mb-6">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-2">
          {accounts.map((account, index) => {
            const accountTotal = calculateAccountTotal(account.currencies);
            const isFirst = index === 0;
            
            return (
              <motion.div
                key={`${account.id}-${accounts.length}`}
                ref={index === 0 ? cardRef : undefined}
                className="flex-shrink-0"
                style={{ 
                  width: `${cardWidth}px`,
                  marginLeft: isFirst ? '0' : undefined
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: isUpdating ? [1, 0.8, 1] : 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AccountCard
                  type={account.type}
                  title={account.title}
                  totalBalance={accountTotal}
                  currency={balanceConfig.currency}
                  currencies={account.currencies}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}