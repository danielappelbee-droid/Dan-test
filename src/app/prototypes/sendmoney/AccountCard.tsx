import React from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface CurrencyBalance {
  code: string;
  flag: string;
  name: string;
  amount: number;
}

interface AccountCardProps {
  type: 'main' | 'savings' | 'investment';
  title: string;
  totalBalance: number;
  currency: string;
  currencies: CurrencyBalance[];
  className?: string;
}

export default function AccountCard({
  type,
  title,
  totalBalance,
  currency,
  currencies,
  className = ''
}: AccountCardProps) {
  const isMainAccount = type === 'main';
  
  const formatAmount = (amount: number, currencyCode: string) => {
    if (amount === 0) {
      return `0 ${currencyCode}`;
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ` ${currencyCode}`;
  };

  const getBackgroundStyle = () => {
    if (isMainAccount) {
      return {
        background: 'linear-gradient(135deg, #B6F18E 0%, #A4EE76 100%)',
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
        height: '80px'
      };
    }
    return {
      backgroundColor: '#EDEFEC',
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0',
      height: '80px'
    };
  };

  const getChevronBackgroundColor = () => {
    return isMainAccount ? '#94DA67' : 'var(--wise-interactive-neutral-grey)';
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="rounded-[20px] p-4 mb-2 flex items-start justify-between"
        style={getBackgroundStyle()}
      >
        {isMainAccount && (
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: getChevronBackgroundColor() }}
          >
            <span className="text-wise-interactive-primary font-semibold text-sm">1 card</span>
            <ChevronRight className="h-4 w-4 text-wise-interactive-primary" />
          </div>
        )}
        {!isMainAccount && <div />}
        <Image
          src="/wise.svg"
          alt="Wise"
          width={24}
          height={24}
          className="object-contain"
        />
      </div>

      <div className="bg-white rounded-[20px] p-4 border border-wise-border-neutral relative -mt-6 pt-6">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-wise-content-primary font-semibold" style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}>
              {title}
            </h3>
            <p className="text-wise-content-tertiary font-normal text-base mt-1">
              {formatAmount(totalBalance, currency)}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-wise-content-tertiary mt-1 flex-shrink-0" />
        </div>

        <div className="space-y-0">
          {currencies.map((currencyItem, index) => (
            <div key={currencyItem.code}>
              <div className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Image
                    src={currencyItem.flag}
                    alt={currencyItem.name}
                    width={32}
                    height={32}
                    className="rounded-sm flex-shrink-0"
                  />
                  <span className="text-wise-content-tertiary font-normal truncate">{currencyItem.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-wise-content-primary font-semibold text-right">
                    {formatAmount(currencyItem.amount, currencyItem.code)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-wise-content-tertiary flex-shrink-0" />
                </div>
              </div>
              {index < currencies.length - 1 && (
                <div className="border-t border-wise-border-neutral" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}