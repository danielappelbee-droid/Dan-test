// Canvas service for exchange rates and net worth calculations

interface ExchangeRates {
  [currency: string]: number; // Rate to USD
}

// Dummy exchange rates (all rates are to USD)
const EXCHANGE_RATES: ExchangeRates = {
  USD: 1.0,
  EUR: 1.09,
  GBP: 1.27,
  SGD: 0.74,
  AUD: 0.65,
  CAD: 0.73,
  CHF: 1.11,
  HKD: 0.13,
  JPY: 0.0067,
  NZD: 0.60,
  MXN: 0.050,
  INR: 0.012,
  BRL: 0.18,
  PHP: 0.017,
  HUF: 0.0027,
  MYR: 0.22
};

export interface CardData {
  id: string;
  value: string;
  currency: string;
  bank: string;
  isNegative?: boolean;
  tag?: string;
}

/**
 * Converts any currency amount to USD
 */
export function convertToUSD(amount: string, fromCurrency: string): number {
  const numericAmount = parseFloat(amount) || 0;
  const rate = EXCHANGE_RATES[fromCurrency] || 1;
  return numericAmount * rate;
}

/**
 * Calculates total net worth in USD from all cards
 */
export function calculateNetWorth(cards: CardData[]): number {
  return cards.reduce((total, card) => {
    const usdValue = convertToUSD(card.value, card.currency);
    const signedValue = card.isNegative ? -usdValue : usdValue;
    return total + signedValue;
  }, 0);
}

/**
 * Gets currency symbol for display
 */
function getCurrencySymbol(currency: string): string {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    SGD: 'S$',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF ',
    HKD: 'HK$',
    JPY: '¥',
    NZD: 'NZ$',
    MXN: 'MX$',
    INR: '₹',
    BRL: 'R$',
    PHP: '₱',
    HUF: 'Ft',
    MYR: 'RM'
  };
  return symbols[currency] || currency + ' ';
}

/**
 * Converts USD amount to any currency
 */
export function convertFromUSD(usdAmount: number, toCurrency: string): number {
  if (toCurrency === 'USD') return usdAmount;
  const rate = EXCHANGE_RATES[toCurrency] || 1;
  return usdAmount / rate;
}

/**
 * Formats an amount for display in any currency
 */
export function formatNetWorth(amount: number, currency: string = 'USD'): string {
  const symbol = getCurrencySymbol(currency);
  
  if (amount === 0) return `${symbol}0`;
  
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  } else {
    return `${symbol}${amount.toFixed(0)}`;
  }
}

/**
 * Formats net worth as raw number without currency symbols or abbreviations
 */
export function formatNetWorthRaw(amount: number): string {
  if (amount === 0) return '0.00';

  // Format with commas for thousands separators and preserve 2 decimal places
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Gets the exchange rate for a currency to USD
 */
export function getExchangeRate(currency: string): number {
  return EXCHANGE_RATES[currency] || 1;
}