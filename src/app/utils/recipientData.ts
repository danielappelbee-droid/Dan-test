export interface RecipientProfile {
  id: string;
  type: 'user' | 'business';
  name: string;
  avatar?: string;
  initials?: string;
  handle?: string;
  accountNumber?: string;
  badges?: {
    flag?: string;
    icon?: string;
    iconVariant?: 'todo' | 'done' | 'attention' | 'pending' | 'wise';
    src?: string;
    type?: 'flag' | 'image' | 'icon';
  }[];
  email?: string;
  phone?: string;
  address?: string;
  lastUsed?: string;
  notes?: string;
}

export const RECIPIENT_PROFILES: RecipientProfile[] = [
  {
    id: 'joanne-d',
    type: 'user',
    name: 'Joanne D.',
    avatar: '/user-avs/female/1.png',
    handle: '@joanned74',
    badges: [
      { icon: 'wise', iconVariant: 'wise' }
    ],
    email: 'joanne.davis@email.com',
    phone: '+44 7700 900123',
    lastUsed: '2025-07-20'
  },
  {
    id: 'clara-s',
    type: 'user',
    name: 'Clara S.',
    avatar: '/user-avs/female/12.png',
    accountNumber: '23456',
    badges: [
      { type: 'image', src: '/banks/uk/monzo.webp' },
      { flag: '/flags/United Kingdom.svg' }
    ],
    email: 'clara.smith@email.com',
    phone: '+44 7700 900456',
    lastUsed: '2025-07-18'
  },
  {
    id: 'studio-legale-cg',
    type: 'business',
    name: 'Studio Legale CG',
    accountNumber: '9931',
    initials: 'SL',
    badges: [
      { type: 'image', src: '/banks/it/Intesa-Sanpaolo.webp' },
      { flag: '/flags/Italy.svg' }
    ],
    email: 'info@studiolegalecg.it',
    phone: '+39 06 1234 5678',
    address: 'Via Roma 123, 00100 Roma, Italia',
    lastUsed: '2025-07-15'
  },
  {
    id: 'apex-global-singapore',
    type: 'business',
    name: 'Apex Global Pte. Ltd.',
    accountNumber: '10021',
    initials: 'AG',
    badges: [
      { type: 'image', src: '/banks/sg/ocbc.png' },
      { flag: '/flags/Singapore.svg' }
    ],
    email: 'contact@apexglobal.com.sg',
    phone: '+65 6123 4567',
    address: '1 Marina Bay, Singapore 018989',
    lastUsed: '2025-07-12'
  },
  {
    id: 'sarah-w',
    type: 'user',
    name: 'Sarah W.',
    avatar: '/user-avs/female/25.png',
    accountNumber: '47986',
    badges: [
      { type: 'image', src: '/banks/us/jpmorgan.webp' },
      { flag: '/flags/United States.svg' }
    ],
    email: 'sarah.wilson@email.com',
    phone: '+1 555 123 4567',
    lastUsed: '2025-07-10'
  },
  {
    id: 'mohammed-2',
    type: 'business',
    name: 'Mohammed...',
    initials: 'MU',
    accountNumber: '58798',
    badges: [
      { type: 'image', src: '/banks/uk/natwest.webp' },
      { flag: '/flags/United Kingdom.svg' }
    ],
    email: 'mohammed2@business.com',
    phone: '+44 7700 900567',
    lastUsed: '2025-07-08'
  },
  {
    id: 'clara-smith',
    type: 'user',
    name: 'Clara Smith',
    avatar: '/user-avs/female/12.png',
    accountNumber: '23456',
    handle: 'Monzo',
    badges: [
      { flag: '/flags/United Kingdom.svg' }
    ],
    email: 'clara.smith@monzo.com',
    phone: '+44 7700 900456',
    lastUsed: '2025-07-22'
  },
  {
    id: 'joanne-davis',
    type: 'user',
    name: 'Joanne Davis',
    avatar: '/user-avs/female/1.png',
    handle: '@joanned74',
    badges: [
      { flag: '/flags/United States.svg' }
    ],
    email: 'joanne.davis@email.com',
    phone: '+44 7700 900123',
    lastUsed: '2025-07-21'
  },
  {
    id: 'alex-taylor',
    type: 'user',
    name: 'Alex Taylor',
    avatar: '/user-avs/male/8.png',
    handle: '@alextaylor',
    badges: [
      { flag: '/flags/Switzerland.svg' }
    ],
    email: 'alex.taylor@email.com',
    phone: '+41 76 123 4567',
    lastUsed: '2025-07-19'
  },
  {
    id: 'lisa-chen',
    type: 'user',
    name: 'Lisa Chen',
    avatar: '/user-avs/female/15.png',
    accountNumber: '78945',
    badges: [
      { flag: '/flags/Hong Kong.svg' }
    ],
    email: 'lisa.chen@email.com',
    phone: '+852 9876 5432',
    lastUsed: '2025-07-17'
  },
  {
    id: 'tech-solutions',
    type: 'business',
    name: 'Tech Solutions Ltd',
    initials: 'TS',
    accountNumber: '12389',
    badges: [
      { flag: '/flags/Ireland.svg' }
    ],
    email: 'info@techsolutions.com',
    phone: '+353 1 234 5678',
    lastUsed: '2025-07-16'
  },
  {
    id: 'maria-gonzalez',
    type: 'user',
    name: 'Maria Gonzalez',
    avatar: '/user-avs/female/20.png',
    handle: '@mariag',
    badges: [
      { flag: '/flags/Spain.svg' }
    ],
    email: 'maria.gonzalez@email.com',
    phone: '+34 612 345 678',
    lastUsed: '2025-07-14'
  }
];

export function getRecentRecipients(): RecipientProfile[] {
  return RECIPIENT_PROFILES.slice(0, 6);
}

export function getAllRecipients(): RecipientProfile[] {
  return RECIPIENT_PROFILES;
}

export function searchRecipients(query: string): RecipientProfile[] {
  const lowercaseQuery = query.toLowerCase();
  return RECIPIENT_PROFILES.filter(recipient => 
    recipient.name.toLowerCase().includes(lowercaseQuery) ||
    recipient.handle?.toLowerCase().includes(lowercaseQuery) ||
    recipient.email?.toLowerCase().includes(lowercaseQuery) ||
    recipient.accountNumber?.includes(query)
  );
}