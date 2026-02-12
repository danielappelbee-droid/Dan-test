interface TransferData {
  fromAmount: string;
  fromCurrency: string;
  toCurrency: string;
  toAmount: string;
  exchangeRate: number;
  reason: string;
  totalBalance: number;
}

interface ChecklistData {
  recipientGetsAmount: string;
  recipientGetsCurrency: string;
  exchangeRateDisplay: string;
  transferReason: string;
  addMoneyAmount: string;
  addMoneyCurrency: string;
}

class ChecklistService {
  private static instance: ChecklistService;
  private transferData: TransferData | null = null;

  private constructor() {}

  static getInstance(): ChecklistService {
    if (!ChecklistService.instance) {
      ChecklistService.instance = new ChecklistService();
    }
    return ChecklistService.instance;
  }

  setTransferData(data: Partial<TransferData>): void {
    this.transferData = { ...this.transferData, ...data } as TransferData;
  }

  getTransferData(): TransferData | null {
    return this.transferData;
  }

  getChecklistData(): ChecklistData {
    if (!this.transferData) {
      return this.getDefaultChecklistData();
    }

    const {
      fromAmount,
      fromCurrency,
      toCurrency,
      toAmount,
      exchangeRate,
      reason,
      totalBalance
    } = this.transferData;

    const fromAmountNum = parseFloat(fromAmount) || 0;
    const addMoneyNeeded = Math.max(0, fromAmountNum - totalBalance);

    return {
      recipientGetsAmount: this.formatAmount(parseFloat(toAmount) || 0, toCurrency),
      recipientGetsCurrency: toCurrency,
      exchangeRateDisplay: this.formatExchangeRate(fromCurrency, toCurrency, exchangeRate),
      transferReason: this.getTransferReasonText(reason),
      addMoneyAmount: this.formatAmount(addMoneyNeeded, fromCurrency),
      addMoneyCurrency: fromCurrency
    };
  }

  private getDefaultChecklistData(): ChecklistData {
    return {
      recipientGetsAmount: '486,500 EUR',
      recipientGetsCurrency: 'EUR',
      exchangeRateDisplay: '1 GBP = 1.1531 EUR',
      transferReason: 'Your transfer',
      addMoneyAmount: '41,315.21 GBP',
      addMoneyCurrency: 'GBP'
    };
  }

  private formatAmount(amount: number, currency: string): string {
    if (amount === 0) {
      return `0 ${currency}`;
    }
    
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return formattedNumber.endsWith('.00') && amount === Math.floor(amount)
      ? `${formattedNumber.slice(0, -3)} ${currency}`
      : `${formattedNumber} ${currency}`;
  }

  private formatExchangeRate(fromCurrency: string, toCurrency: string, rate: number): string {
    if (!rate) {
      return `1 ${fromCurrency} = 1.1531 ${toCurrency}`;
    }
    
    const formattedRate = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(rate);
    
    return `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
  }

  private getTransferReasonText(reason: string): string {
    const reasonMap: Record<string, string> = {
      'property': 'Buying a property',
      'gift': 'Sending a gift',
      'investments': 'Investments',
      'moving': 'Moving country',
      'inheritance': 'Inheritance',
      'other': 'Other'
    };
    
    return reasonMap[reason] || 'Your transfer';
  }

  clearTransferData(): void {
    this.transferData = null;
  }
}

export const checklistService = ChecklistService.getInstance();
export type { TransferData, ChecklistData };