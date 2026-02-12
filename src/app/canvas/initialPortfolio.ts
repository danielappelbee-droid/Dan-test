import { CardElement } from './page';

export const initialPortfolio: CardElement[] = [
  // Bank of America Checking - USD (needs ~280px width)
  {
    id: 'boa-checking-1',
    x: 240,
    y: 150,
    value: '9247.83',
    currency: 'USD',
    bank: 'us:bankofamerica',
    isNegative: false,
    tag: 'Checking'
  },
  // HSBC Current - GBP (needs ~180px width)
  {
    id: 'hsbc-current-1',
    x: 540, // Spaced after Bank of America
    y: 150,
    value: '2156.47',
    currency: 'GBP',
    bank: 'uk:hsbc',
    isNegative: false,
    tag: 'Current'
  },
  // Wise Savings - EUR (needs ~180px width)
  {
    id: 'wise-savings-1',
    x: 750, // Spaced after HSBC Current
    y: 150,
    value: '4823.91',
    currency: 'EUR',
    bank: 'uk:wise',
    isNegative: false,
    tag: 'Savings'
  },
  // Barclays Mortgage - GBP (negative, needs ~200px width)
  {
    id: 'barclays-mortgage-1',
    x: 960, // Spaced after HSBC Savings
    y: 150,
    value: '142387.56',
    currency: 'GBP',
    bank: 'uk:barclays',
    isNegative: true,
    tag: 'Mortgage'
  },
  // Chase Loan - USD (negative, needs ~280px width)
  {
    id: 'chase-loan-1',
    x: 1190, // Spaced after Barclays
    y: 150,
    value: '319742.29',
    currency: 'USD',
    bank: 'us:jpmorgan',
    isNegative: true,
    tag: 'Loan'
  },
  // Vanguard Investments - USD (needs ~200px width)
  {
    id: 'vanguard-investments-1',
    x: 240,
    y: 360,
    value: '741832.67',
    currency: 'USD',
    bank: 'us:vanguard',
    isNegative: false,
    tag: 'Investments'
  },
  // Robinhood Investments - GBP (needs ~220px width)
  {
    id: 'robinhood-investments-1',
    x: 470, // Spaced after Vanguard
    y: 360,
    value: '42193.85',
    currency: 'GBP',
    bank: 'uk:robinhood',
    isNegative: false,
    tag: 'Investments'
  }
];