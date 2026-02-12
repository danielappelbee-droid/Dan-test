import { TransferContext } from './aiService';

class ContextService {
  private static instance: ContextService;

  private constructor() {}

  static getInstance(): ContextService {
    if (!ContextService.instance) {
      ContextService.instance = new ContextService();
    }
    return ContextService.instance;
  }

  private getStorageData(key: string): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = window.sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Failed to parse ${key} from storage:`, error);
      return null;
    }
  }

  private getCurrencyFromCode(code: string): string {
    // Map common currency codes to country/region names
    const currencyMap: Record<string, string> = {
      'GBP': 'United Kingdom',
      'EUR': 'Europe',
      'USD': 'United States',
      'CAD': 'Canada',
      'AUD': 'Australia',
      'JPY': 'Japan',
      'CHF': 'Switzerland',
      'SEK': 'Sweden',
      'NOK': 'Norway',
      'DKK': 'Denmark',
      'PLN': 'Poland',
      'CZK': 'Czech Republic',
      'HUF': 'Hungary',
      'BGN': 'Bulgaria',
      'RON': 'Romania',
      'HRK': 'Croatia',
      'TRY': 'Turkey',
      'RUB': 'Russia',
      'INR': 'India',
      'CNY': 'China',
      'SGD': 'Singapore',
      'HKD': 'Hong Kong',
      'NZD': 'New Zealand',
      'ZAR': 'South Africa',
      'BRL': 'Brazil',
      'MXN': 'Mexico',
      'ARS': 'Argentina',
      'CLP': 'Chile',
      'COP': 'Colombia',
      'PEN': 'Peru'
    };
    
    return currencyMap[code] || code;
  }

  private getReasonLabel(reasonId: string): string {
    // Map reason IDs to human-readable labels
    const reasonMap: Record<string, string> = {
      'home': 'Property purchase',
      'gift': 'Gift',
      'investment': 'Investment',
      'plane': 'Travel',
      'coins': 'Savings',
      'other': 'Other personal expense',
      'business': 'Business expense',
      'education': 'Education',
      'family': 'Family support',
      'medical': 'Medical expenses'
    };
    
    return reasonMap[reasonId] || reasonId;
  }

  gatherTransferContext(): TransferContext {
    // Get calculator data
    const calculatorData = this.getStorageData('calculatorData');
    const reasonData = this.getStorageData('reasonData');
    const recipientData = this.getStorageData('selectedRecipient');
    const homeData = this.getStorageData('homeData');

    // Extract amount and currencies
    let amount = 1000; // Default fallback
    let fromCurrency = 'GBP';
    let toCurrency = 'EUR';

    if (calculatorData && typeof calculatorData === 'object') {
      const calc = calculatorData as { fromAmount?: string; fromCurrency?: string; toCurrency?: string };
      amount = parseFloat(calc.fromAmount || '0') || amount;
      fromCurrency = calc.fromCurrency || fromCurrency;
      toCurrency = calc.toCurrency || toCurrency;
    } else if (homeData && typeof homeData === 'object' && 'totalBalance' in homeData) {
      const home = homeData as { totalBalance?: number };
      amount = home.totalBalance || amount;
    }

    // Extract reason
    let reason: string | undefined;
    if (reasonData && typeof reasonData === 'object' && 'selectedReason' in reasonData) {
      const reasonObj = reasonData as { selectedReason?: string };
      if (reasonObj.selectedReason) {
        reason = this.getReasonLabel(reasonObj.selectedReason);
      }
    }

    // Extract recipient info
    let recipientName: string | undefined;
    let recipientCountry: string | undefined;

    if (recipientData && typeof recipientData === 'object') {
      const recipient = recipientData as { 
        name?: string; 
        country?: string; 
        badges?: Array<{ flag?: string }> 
      };
      
      recipientName = recipient.name;
      // Try to extract country from recipient data
      if (recipient.country) {
        recipientCountry = recipient.country;
      } else if (recipient.badges) {
        // Look for flag badges that might indicate country
        const flagBadge = recipient.badges.find((badge: { flag?: string }) => badge.flag);
        if (flagBadge?.flag) {
          // Extract country name from flag path
          const match = flagBadge.flag.match(/flags\/([^.]+)\./);
          if (match) {
            recipientCountry = match[1].replace(/-/g, ' ');
          }
        }
      }
    }

    // If no recipient country, try to infer from destination currency
    if (!recipientCountry && toCurrency) {
      recipientCountry = this.getCurrencyFromCode(toCurrency);
    }

    return {
      amount,
      fromCurrency,
      toCurrency,
      reason,
      recipientName,
      recipientCountry
    };
  }

  // Method to get a formatted context summary for display
  getContextSummary(): string {
    const context = this.gatherTransferContext();
    let summary = `Sending ${context.amount} ${context.fromCurrency} to ${context.toCurrency}`;
    
    if (context.recipientName) {
      summary += ` to ${context.recipientName}`;
    }
    
    if (context.recipientCountry && context.recipientCountry !== context.toCurrency) {
      summary += ` in ${context.recipientCountry}`;
    }
    
    if (context.reason) {
      summary += ` for ${context.reason.toLowerCase()}`;
    }
    
    return summary;
  }
}

export const contextService = ContextService.getInstance();