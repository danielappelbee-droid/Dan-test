export interface ChipData {
  id: string;
  label: string;
  onClick?: () => void;
  snippetId?: string;
}

export interface ChipsProps {
  chips: ChipData[];
  variant?: 'white-on-grey' | 'grey-on-white';
  className?: string;
  addFirstChipMargin?: boolean;
  onChipClick?: (snippetId: string) => void;
}

export type PrototypeView = 'addmoney' | 'checklist' | 'verification';

const BASE_CHIPS: Omit<ChipData, 'onClick'>[] = [
  { id: 'timing', label: 'How long transfers take', snippetId: 'timing' },
  { id: 'limits', label: 'Bank limits', snippetId: 'limits' },
  { id: 'documents', label: 'Documents you\'ll need', snippetId: 'documents' },
  { id: 'adding-money', label: 'Adding money to Wise', snippetId: 'adding-money' },
  { id: 'protection', label: 'How Wise protects your money', snippetId: 'protection' }
];

// Priority chips configuration for specific prototype views
const PRIORITY_CHIPS: Record<PrototypeView, string[]> = {
  'addmoney': ['limits', 'adding-money'],
  'checklist': ['timing', 'protection'],
  'verification': ['documents']
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomizedChips(onChipClick?: (snippetId: string) => void): ChipData[] {
  const shuffledChips = shuffleArray(BASE_CHIPS);
  return shuffledChips.map(chip => ({
    ...chip,
    onClick: () => {
      if (chip.snippetId && onChipClick) {
        onChipClick(chip.snippetId);
      } else {
        console.log(`${chip.label} clicked`);
      }
    }
  }));
}

export function getPrioritizedChips(
  prototypeView: PrototypeView, 
  onChipClick?: (snippetId: string) => void
): ChipData[] {
  const priorityIds = PRIORITY_CHIPS[prototypeView] || [];
  
  // Separate priority and non-priority chips
  const priorityChips = BASE_CHIPS.filter(chip => priorityIds.includes(chip.id));
  const nonPriorityChips = BASE_CHIPS.filter(chip => !priorityIds.includes(chip.id));
  
  // Randomize both groups independently
  const shuffledPriorityChips = shuffleArray(priorityChips);
  const shuffledNonPriorityChips = shuffleArray(nonPriorityChips);
  
  // Combine with priority chips first
  const orderedChips = [...shuffledPriorityChips, ...shuffledNonPriorityChips];
  
  return orderedChips.map(chip => ({
    ...chip,
    onClick: () => {
      if (chip.snippetId && onChipClick) {
        onChipClick(chip.snippetId);
      } else {
        console.log(`${chip.label} clicked`);
      }
    }
  }));
}