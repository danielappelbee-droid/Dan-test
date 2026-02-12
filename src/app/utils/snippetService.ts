import { metaResearchService } from './metaResearchService';

export interface SnippetTheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export interface SnippetContent {
  id: string;
  title: string;
  intro: string;
  bullets: string[];
}

export interface SnippetData {
  content: SnippetContent;
  theme: SnippetTheme;
}

const SNIPPET_THEMES: SnippetTheme[] = [
  {
    id: 'green',
    name: 'Green',
    backgroundColor: '#163300',
    textColor: '#9FE870',
    borderColor: '#9FE870'
  },
  {
    id: 'orange',
    name: 'Orange',
    backgroundColor: '#260A2F',
    textColor: '#FFC091',
    borderColor: '#FFC091'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    backgroundColor: '#3A341C',
    textColor: '#FFEB69',
    borderColor: '#FFEB69'
  },
  {
    id: 'pink',
    name: 'Pink',
    backgroundColor: '#320707',
    textColor: '#FFD7EF',
    borderColor: '#FFD7EF'
  },
  {
    id: 'blue',
    name: 'Blue',
    backgroundColor: '#21231D',
    textColor: '#A0E1E1',
    borderColor: '#A0E1E1'
  }
];

const getSnippetContents = (): Record<string, SnippetContent> => {
  const config = metaResearchService.getConfiguration();
  const isUS = config.country === 'US';
  
  return {
    'timing': {
      id: 'timing',
      title: 'How long transfers take',
      intro: 'Large transfers often take longer than regular transfers due to extra security checks that help keep everyone safe.',
      bullets: [
        'Most transfers complete within 1-6 working days once we receive funds',
        isUS 
          ? 'ACH payments can take longer due to multiple banks being involved'
          : 'Swift payments can take longer due to multiple banks being involved',
        'Large transfers may need extra verification adding 1-10 working days'
      ]
    },
    'limits': {
      id: 'limits',
      title: 'Bank limits',
      intro: 'Banks typically set their own limits on how much you can send online, by phone, or in-branch to fund your Wise transfers.',
      bullets: [
        'Online banking usually has lower daily limits than in-person visits',
        isUS
          ? 'Limits vary by bank but often range from $5,000 to $50,000'
          : 'Limits vary by bank but often range from £5,000 to £50,000',
        'You can visit your branch in person for higher transfer amounts'
      ]
    },
    'documents': {
      id: 'documents',
      title: 'Documents you\'ll need',
      intro: 'The documents you need depend on your transfer amount and where your money comes from.',
      bullets: [
        'You\'ll need to show your full name, transfer amount, and date received',
        'Bank statements alone usually aren\'t enough on their own',
        'Have documents ready before starting to speed up the process'
      ]
    },
    'adding-money': {
      id: 'adding-money',
      title: 'Adding money to Wise',
      intro: 'You can add money to your Wise balance in several different ways depending on your region and preferred payment method.',
      bullets: [
        'Select "Add Money" from your balance and choose bank transfer or card',
        'Send money directly from your bank using your Wise account details',
        'Your bank may limit how much you can send to Wise at a time'
      ]
    },
    'protection': {
      id: 'protection',
      title: 'How Wise protects your money',
      intro: 'Wise uses multiple layers of security to keep your large transfers safe and protected at all times.',
      bullets: [
        'We\'re regulated by financial authorities in every country we operate',
        'Your money is safeguarded in separate accounts with equal-value assets',
        'We use 2-step verification and have dedicated anti-fraud teams'
      ]
    }
  };
};

function getRandomTheme(): SnippetTheme {
  const randomIndex = Math.floor(Math.random() * SNIPPET_THEMES.length);
  return SNIPPET_THEMES[randomIndex];
}

export function getSnippetData(contentId: string): SnippetData | null {
  const snippetContents = getSnippetContents();
  const content = snippetContents[contentId];
  if (!content) {
    return null;
  }
  
  return {
    content,
    theme: getRandomTheme()
  };
}