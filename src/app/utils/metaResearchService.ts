import { taskService } from './taskService';

interface ResearchData {
  country: 'US' | 'UK';
  accountType: 'Personal' | 'Business';
  timestamp: number;
}

interface ResearchConfiguration {
  isFromResearch: boolean;
  country: 'US' | 'UK' | null;
  accountType: 'Personal' | 'Business' | null;
  primaryCurrency: 'USD' | 'GBP';
  secondaryCurrency: 'USD' | 'GBP';
  balanceAmount: number;
  balanceCurrency: string;
}

class MetaResearchService {
  private static instance: MetaResearchService;
  private configuration: ResearchConfiguration = {
    isFromResearch: false,
    country: null,
    accountType: null,
    primaryCurrency: 'GBP',
    secondaryCurrency: 'USD',
    balanceAmount: 10706,  // Low initial balance - using whole numbers
    balanceCurrency: 'GBP'
  };

  private constructor() {
    this.loadConfiguration();
  }

  static getInstance(): MetaResearchService {
    if (!MetaResearchService.instance) {
      MetaResearchService.instance = new MetaResearchService();
    }
    return MetaResearchService.instance;
  }

  private loadConfiguration(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const researchData = window.sessionStorage.getItem('researchData');
      if (researchData) {
        const parsed: ResearchData = JSON.parse(researchData);
        this.setResearchConfiguration(parsed);
      }
    } catch (e) {
      console.warn('Could not load research configuration:', e);
    }
  }

  private setResearchConfiguration(data: ResearchData): void {
    this.configuration = {
      isFromResearch: true,
      country: data.country,
      accountType: data.accountType,
      primaryCurrency: data.country === 'US' ? 'USD' : 'GBP',
      secondaryCurrency: data.country === 'US' ? 'GBP' : 'USD',
      balanceAmount: data.country === 'US' ? 12942 : 10706, // Low initial balance for both - using whole numbers
      balanceCurrency: data.country === 'US' ? 'USD' : 'GBP'
    };
  }

  initializeFromResearch(researchData: ResearchData): void {
    // Set research configuration
    this.setResearchConfiguration(researchData);

    // Store research data
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem('researchData', JSON.stringify(researchData));
        window.sessionStorage.setItem('metaResearchConfig', JSON.stringify(this.configuration));
      } catch (e) {
        console.warn('Could not save research configuration:', e);
      }
    }
  }

  clearAllStorage(): void {
    if (typeof window === 'undefined') return;
    
    // Clear localStorage completely
    window.localStorage.clear();
    
    // Clear sessionStorage except research data
    const keysToKeep = ['researchData', 'metaResearchConfig'];
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => window.sessionStorage.removeItem(key));
    
    // Also reset task service state
    taskService.resetTasks();
  }

  getConfiguration(): ResearchConfiguration {
    return { ...this.configuration };
  }

  isFromResearch(): boolean {
    return this.configuration.isFromResearch;
  }

  getPrimaryCurrency(): 'USD' | 'GBP' {
    return this.configuration.primaryCurrency;
  }

  getSecondaryCurrency(): 'USD' | 'GBP' {
    return this.configuration.secondaryCurrency;
  }

  getBalanceConfiguration(): { amount: number; currency: string } {
    return {
      amount: this.configuration.balanceAmount,
      currency: this.configuration.balanceCurrency
    };
  }

  // For Account Carousel - swap USD/GBP positions for US users
  getCurrencyDisplayOrder(): ('USD' | 'GBP')[] {
    if (this.configuration.country === 'US') {
      return ['USD', 'GBP'];
    }
    return ['GBP', 'USD'];
  }

  // Convert transaction amounts based on research configuration
  convertTransactionAmount(amount: string, fromCurrency: string): { amount: string; currency: string } {
    if (!this.configuration.isFromResearch || this.configuration.country !== 'US') {
      return { amount, currency: fromCurrency };
    }

    // Simple conversion logic for demo purposes
    if (fromCurrency === 'GBP' && this.configuration.country === 'US') {
      const numericAmount = parseFloat(amount.replace(/,/g, ''));
      const convertedAmount = Math.round(numericAmount * 1.27 * 100) / 100; // Approximate GBP to USD conversion
      return {
        amount: convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        currency: 'USD'
      };
    }

    return { amount, currency: fromCurrency };
  }

  // For Calculator - determines send/receive currency order
  getCalculatorCurrencyDefaults(): { 
    fromCurrency: 'USD' | 'GBP'; 
    toCurrency: 'USD' | 'GBP' 
  } {
    if (this.configuration.country === 'US') {
      return {
        fromCurrency: 'USD',
        toCurrency: 'GBP'
      };
    }
    return {
      fromCurrency: 'GBP',
      toCurrency: 'USD'
    };
  }

  // Get Reason options configuration based on research settings
  getReasonConfiguration(): {
    options: Array<{
      id: string;
      title: string;
      iconName: string;
    }>;
  } {
    const isBusiness = this.configuration.accountType === 'Business';
    
    if (isBusiness) {
      return {
        options: [
          { id: 'supplier', title: 'Paying a supplier', iconName: 'RefreshCcw' },
          { id: 'services', title: 'Paying for services', iconName: 'ShoppingBag' },
          { id: 'moving', title: 'Moving money', iconName: 'RotateCcw' },
          { id: 'profits', title: 'Moving profits', iconName: 'Banknote' },
          { id: 'funding', title: 'Funding my business', iconName: 'ArrowDownToLine' }
        ]
      };
    } else {
      // Default personal account options
      return {
        options: [
          { id: 'property', title: 'Buying a property', iconName: 'Home' },
          { id: 'gift', title: 'Sending a gift', iconName: 'Gift' },
          { id: 'investments', title: 'Investments', iconName: 'TrendingUp' },
          { id: 'moving', title: 'Moving country', iconName: 'Plane' },
          { id: 'inheritance', title: 'Inheritance', iconName: 'Coins' },
          { id: 'other', title: 'Other', iconName: 'MoreHorizontal' }
        ]
      };
    }
  }

  // Get Earn amount configuration based on research settings
  getEarnAmountConfiguration(): {
    amount: string;
    currency: string;
    display: string;
  } {
    const isUS = this.configuration.country === 'US';
    
    return {
      amount: isUS ? '100' : '75',
      currency: isUS ? 'USD' : 'GBP',
      display: isUS ? 'Earn $100' : 'Earn £75'
    };
  }

  // Get Add Money configuration based on research settings
  getAddMoneyConfiguration(): {
    title: string;
    description: string;
    paymentDetails: Array<{
      id: string;
      label: string;
      value: string;
      description?: string;
      hidden?: boolean;
    }>;
  } {
    const isUK = this.configuration.country === 'UK';
    
    return {
      title: `Use your bank to add money to Wise`,
      description: isUK 
        ? 'Make a local GBP payment — not an international one — using the details below'
        : 'Make a local USD payment — not an international one — using the details below',
      paymentDetails: [
        {
          id: 'payee',
          label: 'Payee name',
          value: isUK ? 'Wise UK Ltd' : 'Wise US Inc'
        },
        {
          id: 'reference',
          label: 'Reference code',
          value: 'P24029502',
          description: 'To ensure Wise is able to link this transfer to your account please enter P24029502 in the field in which you specify the transfer\'s reason.'
        },
        {
          id: 'sort',
          label: 'Sort code',
          value: '23-14-70',
          hidden: !isUK // Show only for UK users
        },
        {
          id: 'account',
          label: 'Account number',
          value: '13656474'
        },
        {
          id: 'wire',
          label: 'Wire route number',
          value: '020400042',
          hidden: isUK // Show only for US users
        },
        {
          id: 'type',
          label: 'Account type',
          value: 'Checking',
          hidden: isUK // Show only for US users
        },
        {
          id: 'bank-address',
          label: 'Our bank\'s address',
          value: 'JPMORGAN CHASE BANK 270 Park Avenue New York NY 10017',
          hidden: isUK // Show only for US users
        },
        {
          id: 'our-address',
          label: 'Our address',
          value: '30 W 26th Street, Floor 6, New York, NY 10010',
          hidden: isUK // Show only for US users
        }
      ].filter(detail => !detail.hidden) // Remove hidden fields
    };
  }

  // Get dynamic prompt content based on research configuration and current page
  getPromptConfiguration(pathname?: string): {
    title: string;
    content: string[];
  } {
    // If not from research, return default prompts for each prototype
    if (!this.configuration.isFromResearch && pathname) {
      return this.getDefaultPromptForPrototype(pathname);
    }

    const isUK = this.configuration.country === 'UK';
    const isBusiness = this.configuration.accountType === 'Business';
    
    if (isBusiness && isUK) {
      // Business, UK
      return {
        title: 'Scenario',
        content: [
          '*Who:* Your work for *Apex Global Ltd*, a business headquartered in *London*.',
          '*Action:* You need to send quarterly operational funds to your *Singapore* office.',
          '*Amount to send:* *$1,200,000.00 SGD*.',
          '*From:* Your corporate *Barclay\'s* account in *British Pounds (GBP)*.',
          '*To:* Your *Singapore* entity (*Apex Global Pte. Ltd.*) at their *OCBC* bank account.',
          '*Deadline:* This week.'
        ]
      };
    } else if (isBusiness && !isUK) {
      // Business, US
      return {
        title: 'Scenario',
        content: [
          '*Who:* Your work for *Apex Global Inc.*, a business headquartered in *New York*.',
          '*Action:* You need to send quarterly operational funds to your *Singapore* office.',
          '*Amount to send:* *$1,200,000.00 SGD*.',
          '*From:* Your corporate *Chase* account in *US Dollars (USD)*.',
          '*To:* Your *Singapore* entity (*Apex Global Pte. Ltd.*) at their *OCBC* bank account.',
          '*Deadline:* This week.'
        ]
      };
    } else if (!isBusiness && isUK) {
      // Personal, UK
      return {
        title: 'Scenario',
        content: [
          '*Who:* You are a *UK resident* buying a new home in *Italy*.',
          '*Action:* You need to make the final payment for the property purchase.',
          '*Amount to send:* *€486,500.00 EUR*',
          '*From:* Your personal *Barclay\'s* account in *British Pounds (GBP)*.',
          '*To:* Your legal team, *Studio Legale CG*, in Rome, *Italy*.',
          '*Deadline:* This week.'
        ]
      };
    } else {
      // Personal, US
      return {
        title: 'Scenario',
        content: [
          '*Who:* You are a *US resident* buying a new home in *Italy*',
          '*Action:* You need to make the final payment for the property purchase.',
          '*Amount to send:* *€486,500.00 EUR*',
          '*From:* Your personal *Chase* account in *US Dollars (USD)*.',
          '*To:* Your legal team, *Studio Legale CG*, in Rome, *Italy*.',
          '*Deadline:* This week.'
        ]
      };
    }
  }

  // Get default prompts for each prototype when not coming from research
  private getDefaultPromptForPrototype(pathname: string): {
    title: string;
    content: string[];
  } {
    const prototypeName = pathname.split('/').pop();
    
    switch (prototypeName) {
      case 'home':
        return {
          title: 'Prompt',
          content: [
            'Explore the multi-currency balance display and account overview',
            'Navigate through different currency accounts and transaction history',
            'Test the card management features and account switching functionality'
          ]
        };
      
      case 'calculator':
        return {
          title: 'Prompt',
          content: [
            'Try sending more than *£50,000* British pounds',
            'Try sending more than *$1,250,000* US dollars',
            'Try sending more than *7,000,000* Brazilian reals',
            'Try sending more than *200,000,000* Japanese yen',
            'Try sending more than *2,000,000* Australian dollars'
          ]
        };
      
      case 'recipient':
        return {
          title: 'Prompt',
          content: [
            'Search for recipients using the search functionality',
            'Browse through recent contacts and saved recipients',
            'Test adding new recipients and managing contact details'
          ]
        };
      
      case 'checklist':
        return {
          title: 'Prompt',
          content: [
            'Complete the transfer progress checklist step by step',
            'Test the interactive checkbox functionality',
            'Review task completion tracking and progress indicators'
          ]
        };
      
      case 'verification':
        return {
          title: 'Prompt',
          content: [
            'Review document verification requirements and compliance information',
            'Expand task details to see regulatory requirements',
            'Test the verification interface and document upload flow'
          ]
        };
      
      case 'reason':
        return {
          title: 'Prompt',
          content: [
            'Select different transfer reasons using radio buttons',
            'Explore the various purpose options available',
            'Test the form validation and selection functionality'
          ]
        };
      
      case 'addmoney':
        return {
          title: 'Prompt',
          content: [
            'Review bank payment details and account information',
            'Test the copy functionality for payment details',
            'Explore transfer confirmation options and instructions'
          ]
        };
      
      default:
        return {
          title: 'Prompt',
          content: [
            'Explore the prototype features and functionality',
            'Test different interactive elements and user flows',
            'Navigate through the interface and try various options'
          ]
        };
    }
  }

  reset(): void {
    this.configuration = {
      isFromResearch: false,
      country: null,
      accountType: null,
      primaryCurrency: 'GBP',
      secondaryCurrency: 'USD',
      balanceAmount: 10706,  // Low initial balance - using whole numbers
      balanceCurrency: 'GBP'
    };
    
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem('researchData');
        window.sessionStorage.removeItem('metaResearchConfig');
      } catch (e) {
        console.warn('Could not clear research configuration:', e);
      }
    }
  }
}

export const metaResearchService = MetaResearchService.getInstance();
export type { ResearchConfiguration, ResearchData };