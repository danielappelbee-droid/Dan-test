export type TransactionType = 'sent' | 'received' | 'spent' | 'moved' | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: string;
  currency: string;
  convertedAmount?: string;
  convertedCurrency?: string;
  date: string;
  avatar?: {
    type: 'image' | 'initials' | 'icon';
    src?: string;
    initials?: string;
    icon?: string;
  };
  badges?: {
    flag?: string;
    icon?: string;
    iconVariant?: 'todo' | 'done' | 'attention' | 'pending';
  }[];
}

const getRelativeDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo <= 7) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  }
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
};

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'global-solutions-received',
    type: 'received',
    title: 'Global Solutions',
    subtitle: 'Received',
    amount: '275.64',
    currency: 'GBP',
    date: getRelativeDate(0),
    avatar: {
      type: 'initials',
      initials: 'GS'
    }
  },
  {
    id: 'coop-spent',
    type: 'spent',
    title: 'Coop',
    subtitle: 'Spent',
    amount: '8.90',
    currency: 'GBP',
    date: getRelativeDate(1),
    avatar: {
      type: 'initials',
      initials: 'CO'
    }
  },
  {
    id: 'printers-ltd-spent',
    type: 'spent',
    title: 'Printers Ltd.',
    subtitle: 'Spent',
    amount: '56.41',
    currency: 'EUR',
    convertedAmount: '51.08',
    convertedCurrency: 'GBP',
    date: getRelativeDate(1),
    avatar: {
      type: 'initials',
      initials: 'PL'
    }
  },
  {
    id: 'assets-fee-paid',
    type: 'paid',
    title: 'Assets fee',
    subtitle: 'Paid',
    amount: '0.02',
    currency: 'GBP',
    date: getRelativeDate(2),
    avatar: {
      type: 'icon',
      icon: 'ReceiptText'
    }
  },
  {
    id: 'eur-balance-moved',
    type: 'moved',
    title: 'To your EUR balance',
    subtitle: 'Moved',
    amount: '1,408.05',
    currency: 'EUR',
    convertedAmount: '1,250',
    convertedCurrency: 'GBP',
    date: getRelativeDate(3),
    avatar: {
      type: 'icon',
      icon: 'ArrowRightLeft'
    }
  },
  {
    id: 'darlene-robertson-sent',
    type: 'sent',
    title: 'Darlene Robertson',
    subtitle: 'Sent',
    amount: '200',
    currency: 'EUR',
    date: getRelativeDate(4),
    avatar: {
      type: 'image',
      src: '/user-avs/female/25.png'
    },
    badges: [
      { flag: '/flags/Euro.svg' }
    ]
  },
  {
    id: 'transport-london-spent',
    type: 'spent',
    title: 'Transport for London',
    subtitle: 'Spent',
    amount: '2.60',
    currency: 'GBP',
    date: getRelativeDate(5),
    avatar: {
      type: 'initials',
      initials: 'TL'
    }
  },
  {
    id: 'jenny-mcarthur-received',
    type: 'received',
    title: 'Jenny McArthur',
    subtitle: 'Received',
    amount: '200',
    currency: 'EUR',
    date: getRelativeDate(6),
    avatar: {
      type: 'image',
      src: '/user-avs/female/12.png'
    },
    badges: [
      { flag: '/flags/Euro.svg' }
    ]
  },
  {
    id: 'black-sheep-coffee-spent',
    type: 'spent',
    title: 'Black Sheep Coffee',
    subtitle: 'Spent',
    amount: '3.59',
    currency: 'GBP',
    date: getRelativeDate(7),
    avatar: {
      type: 'initials',
      initials: 'BC'
    }
  },
  {
    id: 'assets-fee-paid-2',
    type: 'paid',
    title: 'Assets fee',
    subtitle: 'Paid',
    amount: '0.02',
    currency: 'GBP',
    date: getRelativeDate(8),
    avatar: {
      type: 'icon',
      icon: 'ReceiptText'
    }
  },
  {
    id: 'spotify-subscription',
    type: 'spent',
    title: 'Spotify Premium',
    subtitle: 'Spent',
    amount: '10.99',
    currency: 'GBP',
    date: getRelativeDate(10),
    avatar: {
      type: 'initials',
      initials: 'SP'
    }
  },
  {
    id: 'marks-spencer-spent',
    type: 'spent',
    title: 'Marks & Spencer',
    subtitle: 'Spent',
    amount: '45.80',
    currency: 'GBP',
    date: getRelativeDate(12),
    avatar: {
      type: 'initials',
      initials: 'MS'
    }
  },
  {
    id: 'sarah-williams-received',
    type: 'received',
    title: 'Sarah Williams',
    subtitle: 'Received',
    amount: '125.00',
    currency: 'GBP',
    date: getRelativeDate(14),
    avatar: {
      type: 'image',
      src: '/user-avs/female/1.png'
    }
  },
  {
    id: 'uber-eats-spent',
    type: 'spent',
    title: 'Uber Eats',
    subtitle: 'Spent',
    amount: '18.45',
    currency: 'GBP',
    date: getRelativeDate(16),
    avatar: {
      type: 'initials',
      initials: 'UE'
    }
  },
  {
    id: 'amazon-spent',
    type: 'spent',
    title: 'Amazon',
    subtitle: 'Spent',
    amount: '89.99',
    currency: 'GBP',
    date: getRelativeDate(18),
    avatar: {
      type: 'initials',
      initials: 'AM'
    }
  },
  {
    id: 'michael-johnson-sent',
    type: 'sent',
    title: 'Michael Johnson',
    subtitle: 'Sent',
    amount: '75.00',
    currency: 'USD',
    convertedAmount: '55.50',
    convertedCurrency: 'GBP',
    date: getRelativeDate(20),
    avatar: {
      type: 'image',
      src: '/user-avs/male/5.png'
    },
    badges: [
      { flag: '/flags/United States.svg' }
    ]
  },
  {
    id: 'tesco-spent',
    type: 'spent',
    title: 'Tesco',
    subtitle: 'Spent',
    amount: '67.34',
    currency: 'GBP',
    date: getRelativeDate(22),
    avatar: {
      type: 'initials',
      initials: 'TE'
    }
  },
  {
    id: 'netflix-subscription',
    type: 'spent',
    title: 'Netflix',
    subtitle: 'Spent',
    amount: '15.99',
    currency: 'GBP',
    date: getRelativeDate(25),
    avatar: {
      type: 'initials',
      initials: 'NF'
    }
  },
  {
    id: 'john-smith-received',
    type: 'received',
    title: 'John Smith',
    subtitle: 'Received',
    amount: '300.00',
    currency: 'GBP',
    date: getRelativeDate(28),
    avatar: {
      type: 'image',
      src: '/user-avs/male/8.png'
    }
  },
  {
    id: 'starbucks-spent',
    type: 'spent',
    title: 'Starbucks',
    subtitle: 'Spent',
    amount: '4.75',
    currency: 'GBP',
    date: getRelativeDate(30),
    avatar: {
      type: 'initials',
      initials: 'SB'
    }
  },
  {
    id: 'payroll-received',
    type: 'received',
    title: 'Wise Ltd - Payroll',
    subtitle: 'Received',
    amount: '3,250.00',
    currency: 'GBP',
    date: getRelativeDate(32),
    avatar: {
      type: 'initials',
      initials: 'WL'
    }
  },
  {
    id: 'sainsburys-spent',
    type: 'spent',
    title: 'Sainsburys',
    subtitle: 'Spent',
    amount: '42.80',
    currency: 'GBP',
    date: getRelativeDate(35),
    avatar: {
      type: 'initials',
      initials: 'SA'
    }
  },
  {
    id: 'adobe-subscription',
    type: 'spent',
    title: 'Adobe Creative Cloud',
    subtitle: 'Spent',
    amount: '49.94',
    currency: 'GBP',
    date: getRelativeDate(38),
    avatar: {
      type: 'initials',
      initials: 'AD'
    }
  },
  {
    id: 'emma-thompson-sent',
    type: 'sent',
    title: 'Emma Thompson',
    subtitle: 'Sent',
    amount: '150.00',
    currency: 'EUR',
    convertedAmount: '127.50',
    convertedCurrency: 'GBP',
    date: getRelativeDate(40),
    avatar: {
      type: 'image',
      src: '/user-avs/female/12.png'
    },
    badges: [
      { flag: '/flags/Euro.svg' }
    ]
  },
  {
    id: 'costa-coffee-spent',
    type: 'spent',
    title: 'Costa Coffee',
    subtitle: 'Spent',
    amount: '3.20',
    currency: 'GBP',
    date: getRelativeDate(42),
    avatar: {
      type: 'initials',
      initials: 'CC'
    }
  }
];

export function getRecentTransactions(count: number = 3): Transaction[] {
  return TRANSACTIONS.slice(0, count);
}

export function getAllTransactions(): Transaction[] {
  return TRANSACTIONS;
}