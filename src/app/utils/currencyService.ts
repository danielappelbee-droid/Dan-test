export interface Currency {
  code: string;
  flag: string;
  name: string;
  rate: number;
}

export const USD_RATES: Record<string, number> = {
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

export const CURRENCIES: Currency[] = [
  { code: "USD", flag: "/flags/United States.svg", name: "US Dollar", rate: USD_RATES.USD },
  { code: "EUR", flag: "/flags/Euro.svg", name: "Euro", rate: USD_RATES.EUR },
  { code: "GBP", flag: "/flags/United Kingdom.svg", name: "British Pound", rate: USD_RATES.GBP },
  { code: "JPY", flag: "/flags/Japan.svg", name: "Japanese Yen", rate: USD_RATES.JPY },
  { code: "AUD", flag: "/flags/Australia.svg", name: "Australian Dollar", rate: USD_RATES.AUD },
  { code: "CAD", flag: "/flags/Canada.svg", name: "Canadian Dollar", rate: USD_RATES.CAD },
  { code: "CHF", flag: "/flags/Switzerland.svg", name: "Swiss Franc", rate: USD_RATES.CHF },
  { code: "HKD", flag: "/flags/Hong Kong.svg", name: "Hong Kong Dollar", rate: USD_RATES.HKD },
  { code: "SGD", flag: "/flags/Singapore.svg", name: "Singapore Dollar", rate: USD_RATES.SGD },
  { code: "NZD", flag: "/flags/New Zealand.svg", name: "New Zealand Dollar", rate: USD_RATES.NZD },
  { code: "MXN", flag: "/flags/Mexico.svg", name: "Mexican Peso", rate: USD_RATES.MXN },
  { code: "INR", flag: "/flags/India.svg", name: "Indian Rupee", rate: USD_RATES.INR },
  { code: "BRL", flag: "/flags/Brazil.svg", name: "Brazilian Real", rate: USD_RATES.BRL },
  { code: "PHP", flag: "/flags/Philippines.svg", name: "Philippine Peso", rate: USD_RATES.PHP },
  { code: "HUF", flag: "/flags/Hungary.svg", name: "Hungarian Forint", rate: USD_RATES.HUF },
  { code: "MYR", flag: "/flags/Malaysia.svg", name: "Malaysian Ringgit", rate: USD_RATES.MYR }
];

export function formatCurrencyAmount(amount: number, currency: string, options?: { includeCode?: boolean }): string {
  const { includeCode = true } = options || {};
  
  let formattedNumber: string;
  
  // Always format with 2 decimal places first
  formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  // Only remove .00 if the amount is a whole number
  if (formattedNumber.endsWith('.00') && amount === Math.floor(amount)) {
    formattedNumber = formattedNumber.slice(0, -3);
  }
  
  return includeCode ? `${formattedNumber} ${currency}` : formattedNumber;
}

export function formatInputAmount(value: string): string {
  if (!value || value === '' || value === '0') return '0';
  
  const cleanValue = value.replace(/,/g, '');
  
  if (cleanValue.includes('.')) {
    const [integerPart, decimalPart] = cleanValue.split('.');
    const cleanInteger = integerPart.replace(/^0+/, '') || '0';
    const formattedInteger = cleanInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedInteger}.${decimalPart}`;
  }
  
  const cleanInteger = cleanValue.replace(/^0+/, '') || '0';
  return cleanInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = USD_RATES[fromCurrency];
  const toRate = USD_RATES[toCurrency];
  
  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency: ${!fromRate ? fromCurrency : toCurrency}`);
  }
  
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;
  
  return convertedAmount;
}

export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  const fromRate = USD_RATES[fromCurrency];
  const toRate = USD_RATES[toCurrency];
  
  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency: ${!fromRate ? fromCurrency : toCurrency}`);
  }
  
  return toRate / fromRate;
}

export function formatExchangeRate(fromCurrency: string, toCurrency: string): string {
  const rate = getExchangeRate(fromCurrency, toCurrency);
  const decimals = rate < 1 ? 4 : rate < 10 ? 3 : 2;
  return `1 ${fromCurrency} = ${rate.toFixed(decimals)} ${toCurrency}`;
}