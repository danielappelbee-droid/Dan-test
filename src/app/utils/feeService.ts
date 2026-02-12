import { calculateDiscount, DiscountCalculation } from './discountService';
import { formatCurrencyAmount } from './currencyService';
import { getArrivalByText } from './dateService';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  fee: number;
  arrivalTime: string;
  description: string;
  disabled?: boolean;
}

export interface FeeCalculation {
  wiseFee: number;
  paymentMethodFee: number;
  totalFee: number;
  totalFeeAmount: number;
  feePercentage: number;
  availablePaymentMethods: PaymentMethod[];
  defaultPaymentMethod: PaymentMethod;
  discountCalculation: DiscountCalculation;
}

const CURRENCY_THRESHOLDS: Record<string, { tier1: number; tier2: number; tier3?: number }> = {
  USD: { tier1: 25000, tier2: 1250000 },
  GBP: { tier1: 20000, tier2: 1000000, tier3: 50000 },
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

function getThresholds(currency: string): { tier1: number; tier2: number; tier3?: number } {
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

export function calculateFees(
  amount: number,
  fromCurrency: string,
  paymentMethodId?: string
): FeeCalculation {
  const thresholds = getThresholds(fromCurrency);
  
  const isLargeAmount = amount > thresholds.tier1;
  const isVeryLargeAmount = amount > thresholds.tier2;
  const isUSD = fromCurrency === 'USD';

  let wiseFee: number;
  let availablePaymentMethods: PaymentMethod[];

  if (isUSD) {
    wiseFee = isLargeAmount ? 0.21 : 0.31;
    availablePaymentMethods = getUSDPaymentMethods(isLargeAmount, isVeryLargeAmount);
  } else {
    wiseFee = isLargeAmount ? 0.24 : 0.35;
    availablePaymentMethods = getOtherCurrencyPaymentMethods(isLargeAmount, isVeryLargeAmount);
  }

  const defaultPaymentMethod = getDefaultPaymentMethod(availablePaymentMethods, isVeryLargeAmount, isUSD);
  
  const selectedPaymentMethod = paymentMethodId 
    ? availablePaymentMethods.find(pm => pm.id === paymentMethodId && !pm.disabled) || defaultPaymentMethod
    : defaultPaymentMethod;

  const paymentMethodFee = selectedPaymentMethod.fee;
  const originalTotalFee = wiseFee + paymentMethodFee;
  
  const discountCalculation = calculateDiscount(amount, fromCurrency, originalTotalFee);
  const finalTotalFee = discountCalculation.finalFeePercentage;
  const totalFeeAmount = amount * (finalTotalFee / 100);
  
  return {
    wiseFee,
    paymentMethodFee,
    totalFee: finalTotalFee,
    totalFeeAmount,
    feePercentage: finalTotalFee,
    availablePaymentMethods,
    defaultPaymentMethod: selectedPaymentMethod,
    discountCalculation
  };
}

function getDefaultPaymentMethod(availablePaymentMethods: PaymentMethod[], isVeryLargeAmount: boolean, isUSD: boolean): PaymentMethod {
  if (isVeryLargeAmount) {
    return availablePaymentMethods.find(pm => pm.id === 'your_balance') || availablePaymentMethods[0];
  }

  if (isUSD) {
    return availablePaymentMethods.find(pm => pm.id === 'bank_ach' && !pm.disabled) || 
           availablePaymentMethods.find(pm => !pm.disabled) || 
           availablePaymentMethods[0];
  } else {
    return availablePaymentMethods.find(pm => pm.id === 'bank_swift' && !pm.disabled) || 
           availablePaymentMethods.find(pm => !pm.disabled) || 
           availablePaymentMethods[0];
  }
}

function getUSDPaymentMethods(isLargeAmount: boolean, isVeryLargeAmount: boolean): PaymentMethod[] {
  const bankAchFee = 0.42;
  const yourBalanceFee = bankAchFee * 0.8; // 20% cheaper

  const methods: PaymentMethod[] = [
    {
      id: 'bank_ach',
      name: 'Your balance (ACH)',
      icon: 'Landmark',
      fee: bankAchFee,
      arrivalTime: getArrivalByText(),
      description: 'Transfer from your bank account',
      disabled: isVeryLargeAmount
    },
    {
      id: 'wire',
      name: 'Wire transfer',
      icon: 'Landmark',
      fee: 0.64,
      arrivalTime: 'Tomorrow',
      description: 'Fast wire transfer',
      disabled: isVeryLargeAmount
    },
    {
      id: 'your_balance',
      name: 'Your balance',
      icon: 'Wise',
      fee: yourBalanceFee,
      arrivalTime: 'Tomorrow',
      description: 'Pay with your available balance'
    }
  ];

  if (!isLargeAmount && !isVeryLargeAmount) {
    methods.push(
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: 'ApplePay',
        fee: 0.86,
        arrivalTime: 'Today',
        description: 'Pay with Apple Pay'
      },
      {
        id: 'credit_card',
        name: 'Credit card',
        icon: 'CreditCard',
        fee: 1.08,
        arrivalTime: 'Today',
        description: 'Pay with your credit card'
      }
    );
  } else if (isLargeAmount && !isVeryLargeAmount) {
    methods.push(
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: 'ApplePay',
        fee: 0.86,
        arrivalTime: 'Today',
        description: 'Pay with Apple Pay',
        disabled: true
      },
      {
        id: 'credit_card',
        name: 'Credit card',
        icon: 'CreditCard',
        fee: 1.08,
        arrivalTime: 'Today',
        description: 'Pay with your credit card',
        disabled: true
      }
    );
  } else {
    methods.push(
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: 'ApplePay',
        fee: 0.86,
        arrivalTime: 'Today',
        description: 'Pay with Apple Pay',
        disabled: true
      },
      {
        id: 'credit_card',
        name: 'Credit card',
        icon: 'CreditCard',
        fee: 1.08,
        arrivalTime: 'Today',
        description: 'Pay with your credit card',
        disabled: true
      }
    );
  }

  return methods.sort((a, b) => {
    if (a.disabled && !b.disabled) return 1;
    if (!a.disabled && b.disabled) return -1;
    if (isVeryLargeAmount && a.id === 'your_balance') return -1;
    if (isVeryLargeAmount && b.id === 'your_balance') return 1;
    if (!isVeryLargeAmount && a.id === 'bank_ach' && !a.disabled) return -1;
    if (!isVeryLargeAmount && b.id === 'bank_ach' && !b.disabled) return 1;
    return a.fee - b.fee;
  });
}

function getOtherCurrencyPaymentMethods(isLargeAmount: boolean, isVeryLargeAmount: boolean): PaymentMethod[] {
  const bankSwiftFee = 0.42;
  const yourBalanceFee = bankSwiftFee * 0.8; // 20% cheaper

  const methods: PaymentMethod[] = [
    {
      id: 'bank_swift',
      name: 'Bank transfer',
      icon: 'Landmark',
      fee: bankSwiftFee,
      arrivalTime: getArrivalByText(),
      description: 'International bank transfer',
      disabled: isVeryLargeAmount
    },
    {
      id: 'your_balance',
      name: 'Your balance',
      icon: 'Wise',
      fee: yourBalanceFee,
      arrivalTime: 'Tomorrow',
      description: 'Pay with your available balance'
    }
  ];

  if (!isLargeAmount && !isVeryLargeAmount) {
    methods.push(
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: 'ApplePay',
        fee: 0.86,
        arrivalTime: 'Today',
        description: 'Pay with Apple Pay'
      },
      {
        id: 'debit_card',
        name: 'Debit card',
        icon: 'CreditCard',
        fee: 0.64,
        arrivalTime: 'Today',
        description: 'Pay with your debit card'
      },
      {
        id: 'credit_card',
        name: 'Credit card',
        icon: 'CreditCard',
        fee: 1.08,
        arrivalTime: 'Today',
        description: 'Pay with your credit card'
      }
    );
  } else if (isLargeAmount && !isVeryLargeAmount) {
    methods.push(
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: 'ApplePay',
        fee: 0.86,
        arrivalTime: 'Today',
        description: 'Pay with Apple Pay',
        disabled: true
      },
      {
        id: 'debit_card',
        name: 'Debit card',
        icon: 'CreditCard',
        fee: 0.64,
        arrivalTime: 'Today',
        description: 'Pay with your debit card',
        disabled: true
      },
      {
        id: 'credit_card',
        name: 'Credit card',
        icon: 'CreditCard',
        fee: 1.08,
        arrivalTime: 'Today',
        description: 'Pay with your credit card',
        disabled: true
      }
    );
  } else {
    methods.push(
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: 'ApplePay',
        fee: 0.86,
        arrivalTime: 'Today',
        description: 'Pay with Apple Pay',
        disabled: true
      },
      {
        id: 'debit_card',
        name: 'Debit card',
        icon: 'CreditCard',
        fee: 0.64,
        arrivalTime: 'Today',
        description: 'Pay with your debit card',
        disabled: true
      },
      {
        id: 'credit_card',
        name: 'Credit card',
        icon: 'CreditCard',
        fee: 1.08,
        arrivalTime: 'Today',
        description: 'Pay with your credit card',
        disabled: true
      }
    );
  }

  return methods.sort((a, b) => {
    if (a.disabled && !b.disabled) return 1;
    if (!a.disabled && b.disabled) return -1;
    if (isVeryLargeAmount && a.id === 'your_balance') return -1;
    if (isVeryLargeAmount && b.id === 'your_balance') return 1;
    if (!isVeryLargeAmount && a.id === 'bank_swift' && !a.disabled) return -1;
    if (!isVeryLargeAmount && b.id === 'bank_swift' && !b.disabled) return 1;
    return a.fee - b.fee;
  });
}

export function formatFeeDisplay(
  feeCalculation: FeeCalculation,
  fromCurrency: string
): {
  feeText: string;
  totalText: string;
  wiseFeeText: string;
  paymentFeeText: string;
  feePercentageText: string;
} {
  const { totalFeeAmount, wiseFee, paymentMethodFee, totalFee } = feeCalculation;
  
  const feeText = `Included`;
  const totalText = totalFeeAmount > 0 
    ? formatCurrencyAmount(totalFeeAmount, fromCurrency)
    : formatCurrencyAmount(0, fromCurrency);
  const wiseFeeText = `${wiseFee.toFixed(2)}% Wise fee`;
  const paymentFeeText = `${paymentMethodFee.toFixed(2)}% payment fee`;
  const feePercentageText = `${totalFee.toFixed(2)}%`;

  return {
    feeText,
    totalText,
    wiseFeeText,
    paymentFeeText,
    feePercentageText
  };
}