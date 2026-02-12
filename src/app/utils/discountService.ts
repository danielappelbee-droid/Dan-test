export interface DiscountCalculation {
  tier: 'none' | 'tier1' | 'tier2';
  originalFeePercentage: number;
  finalFeePercentage: number;
  discountAmount: number;
  hasDiscount: boolean;
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

function getTier(amount: number, currency: string): 'none' | 'tier1' | 'tier2' {
  const thresholds = getThresholds(currency);
  
  if (amount > thresholds.tier2) {
    return 'tier2';
  } else if (amount > thresholds.tier1) {
    return 'tier1';
  } else {
    return 'none';
  }
}

export function calculateDiscount(
  amount: number,
  currency: string,
  originalFeePercentage: number
): DiscountCalculation {
  const tier = getTier(amount, currency);
  
  let finalFeePercentage = originalFeePercentage;
  let discountAmount = 0;
  let hasDiscount = false;
  
  switch (tier) {
    case 'tier1':
      finalFeePercentage = Math.max(0, originalFeePercentage - 0.2);
      hasDiscount = true;
      break;
    case 'tier2':
      finalFeePercentage = 0.1;
      hasDiscount = true;
      break;
    case 'none':
    default:
      finalFeePercentage = originalFeePercentage;
      hasDiscount = false;
      break;
  }
  
  if (hasDiscount) {
    const originalFeeAmount = amount * (originalFeePercentage / 100);
    const finalFeeAmount = amount * (finalFeePercentage / 100);
    discountAmount = originalFeeAmount - finalFeeAmount;
  }
  
  return {
    tier,
    originalFeePercentage,
    finalFeePercentage,
    discountAmount,
    hasDiscount
  };
}