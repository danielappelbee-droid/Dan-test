import React from 'react';
import { formatCurrencyAmount } from './currencyService';

export interface ErrorState {
  type: 'none' | 'brazil_malaysia_limit' | 'tier2_overlay' | 'usd_market_hours';
  showAlert: boolean;
  showMessage: boolean;
  hideCalculatorDetails: boolean;
  showOverlay: boolean;
  overlayShown?: boolean;
  alertConfig?: {
    variant: 'neutral' | 'warning' | 'negative';
    title?: string;
    description: string | React.ReactNode;
    action?: {
      type: 'button';
      text: string;
      onClick: () => void;
      variant?: 'primary' | 'neutral' | 'neutral-grey' | 'outline';
    };
  };
  messageConfig?: {
    variant: 'neutral' | 'positive' | 'warning' | 'negative' | 'promotion';
    message: string;
    countryName?: string;
    formattedLimit?: string;
    currency?: string;
  };
  overlayConfig?: {
    variant: 'positive' | 'warning' | 'negative';
    title: string;
    description: string | React.ReactNode;
    illustration: string;
  };
  randomizedTime?: {
    display: string;
  };
}

const CURRENCY_THRESHOLDS: Record<string, { tier1: number; tier2: number }> = {
  USD: { tier1: 25000, tier2: 1250000 },
  GBP: { tier1: 20000, tier2: 1000000 },
  AUD: { tier1: 40000, tier2: 2000000 },
  CAD: { tier1: 35000, tier2: 1800000 },
  CHF: { tier1: 20000, tier2: 1000000 },
  EUR: { tier1: 22000, tier2: 1100000 },
  NZD: { tier1: 44000, tier2: 2200000 },
  SGD: { tier1: 30000, tier2: 1700000 },
  JPY: { tier1: 3600000, tier2: 180000000 },
  HKD: { tier1: 196000, tier2: 9800000 },
  INR: { tier1: 2142500, tier2: 107125000 },
  BRL: { tier1: 135750, tier2: 6787500 },
  PHP: { tier1: 1407750, tier2: 70387500 },
  HUF: { tier1: 8493500, tier2: 424675000 },
  MYR: { tier1: 105750, tier2: 5287500 },
  MXN: { tier1: 469750, tier2: 23487500 }
};

const CURRENCY_RATES: Record<string, number> = {
  USD: 1.000,
  EUR: 0.850,
  GBP: 0.730,
  JPY: 144.190,
  AUD: 1.520,
  CAD: 1.360,
  CHF: 0.790,
  HKD: 7.850,
  SGD: 1.270,
  NZD: 1.640,
  MXN: 18.790,
  INR: 85.700,
  BRL: 5.430,
  PHP: 56.310,
  HUF: 339.740,
  MYR: 4.230
};

function getThresholds(currency: string): { tier1: number; tier2: number } {
  if (CURRENCY_THRESHOLDS[currency]) {
    return CURRENCY_THRESHOLDS[currency];
  }
  
  const rate = CURRENCY_RATES[currency];
  if (!rate) {
    return CURRENCY_THRESHOLDS.USD;
  }
  
  const usdThresholds = CURRENCY_THRESHOLDS.USD;
  return {
    tier1: usdThresholds.tier1 * rate,
    tier2: usdThresholds.tier2 * rate
  };
}

function generateRandomizedTime(): { display: string } {
  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const periods = ['am', 'pm'];
  const days = ['today', 'tomorrow', 'Sunday', 'Monday', 'Tuesday'];
  
  const randomHour = hours[Math.floor(Math.random() * hours.length)];
  const randomPeriod = periods[Math.floor(Math.random() * periods.length)];
  const randomDay = days[Math.floor(Math.random() * days.length)];
  
  const timeString = `${randomHour}${randomPeriod} ${randomDay}`;
  
  return {
    display: timeString
  };
}

function createMarketHoursDescription(timeDisplay: string): React.ReactNode {
  return React.createElement(
    React.Fragment,
    null,
    'For amounts over ',
    React.createElement('span', { className: 'font-semibold' }, formatCurrencyAmount(1250000, 'USD')),
    ' and ',
    React.createElement('span', { className: 'font-semibold' }, 'fees as low as 0.1%'),
    ', you\'ll need to wait until ',
    React.createElement('span', { className: 'font-semibold' }, timeDisplay),
    '. If you\'re in a hurry, our expert team is here to help.'
  );
}

function createTier2Description(currency: string): React.ReactNode {
  const thresholds = getThresholds(currency);
  const formattedAmount = formatCurrencyAmount(thresholds.tier2, currency);
  
  return React.createElement(
    React.Fragment,
    null,
    'For amounts over ',
    React.createElement('span', { className: 'font-semibold' }, formattedAmount),
    ' and ',
    React.createElement('span', { className: 'font-semibold' }, 'fees as low as 0.1%'),
    ', our dedicated support team is here to help 24/7.'
  );
}

function createBrazilMalaysiaMessage(currency: string): string {
  const thresholds = getThresholds(currency);
  const formattedAmount = formatCurrencyAmount(thresholds.tier2, currency);
  const countryName = currency === 'BRL' ? 'Brazil' : 'Malaysia';
  
  return `Moving single amounts over **${formattedAmount}** from **${countryName}** is currently unavailable.`;
}

export function getErrorState(
  amount: number, 
  currency: string,
  existingTime?: { display: string },
  previousErrorState?: ErrorState,
  onShowOverlay?: () => void
): ErrorState {
  const thresholds = getThresholds(currency);
  
  if (amount <= thresholds.tier2) {
    return {
      type: 'none',
      showAlert: false,
      showMessage: false,
      hideCalculatorDetails: false,
      showOverlay: false,
      overlayShown: false
    };
  }

  if (currency === 'BRL' || currency === 'MYR') {
    return {
      type: 'brazil_malaysia_limit',
      showAlert: false,
      showMessage: true,
      hideCalculatorDetails: true,
      showOverlay: false,
      overlayShown: false,
      messageConfig: {
        variant: 'warning',
        message: createBrazilMalaysiaMessage(currency)
      }
    };
  }

  if (currency === 'USD') {
    const randomizedTime = existingTime || generateRandomizedTime();
    const hasShownOverlay = previousErrorState?.overlayShown === true;
    const shouldShowOverlay = !hasShownOverlay;
    
    return {
      type: 'usd_market_hours',
      showAlert: true,
      showMessage: false,
      hideCalculatorDetails: true,
      showOverlay: shouldShowOverlay,
      overlayShown: hasShownOverlay,
      randomizedTime,
      alertConfig: {
        variant: 'neutral',
        title: 'Get expert advice',
        description: createMarketHoursDescription(randomizedTime.display),
        action: {
          type: 'button',
          text: 'Contact us',
          onClick: onShowOverlay || (() => console.log('Contact us clicked from alert')),
          variant: 'primary'
        }
      },
      overlayConfig: {
        variant: 'positive',
        title: 'Need this quickly?',
        description: createMarketHoursDescription(randomizedTime.display),
        illustration: '/illos/Skip authentication.png'
      }
    };
  }

  if (['AUD', 'JPY', 'SGD', 'PHP'].includes(currency)) {
    const hasShownOverlay = previousErrorState?.overlayShown === true;
    const shouldShowOverlay = !hasShownOverlay;
    
    return {
      type: 'tier2_overlay',
      showAlert: true,
      showMessage: false,
      hideCalculatorDetails: true,
      showOverlay: shouldShowOverlay,
      overlayShown: hasShownOverlay,
      alertConfig: {
        variant: 'neutral',
        title: 'Get expert advice',
        description: createTier2Description(currency),
        action: {
          type: 'button',
          text: 'Contact us',
          onClick: onShowOverlay || (() => console.log('Contact us clicked from alert')),
          variant: 'primary'
        }
      },
      overlayConfig: {
        variant: 'positive',
        title: 'Speak to an expert',
        description: createTier2Description(currency),
        illustration: '/illos/Plane 2.png'
      }
    };
  }

  return {
    type: 'none',
    showAlert: false,
    showMessage: false,
    hideCalculatorDetails: false,
    showOverlay: false,
    overlayShown: false
  };
}