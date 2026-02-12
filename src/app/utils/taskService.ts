import { RecipientProfile } from './recipientData';
import { Landmark, CircleCheck, User } from 'lucide-react';
import { PrototypeRoute } from './navigationService';

interface TaskState {
  addMoneyCompleted: boolean;
  addMoneyLoading: boolean;
  addMoneyStartTime?: number;
  sendAmount?: string;
  recipientCompleted: boolean;
  recipientLoading: boolean;
  recipientStartTime?: number;
  selectedRecipient?: RecipientProfile;
  bankStatementsCompleted: boolean;
  bankStatementsLoading: boolean;
  bankStatementsStartTime?: number;
  financialStatementsCompleted: boolean;
  financialStatementsLoading: boolean;
  financialStatementsStartTime?: number;
  pendingAddMoneyCompletion: boolean;
  pendingRecipientCompletion?: RecipientProfile;
}

interface TaskData {
  addMoneyTitle: string;
  addMoneyIcon: 'plus' | 'check';
  addMoneyBadgeVariant: 'todo' | 'pending' | null;
  addMoneyContainerType: 'incomplete' | 'complete';
  addMoneyValue: string;
  addMoneyShowChevron: boolean;
  recipientTitle: string;
  recipientIcon: 'user' | 'check';
  recipientBadgeVariant: 'todo' | 'pending' | null;
  recipientContainerType: 'incomplete' | 'complete';
  recipientSubtitle: string;
  recipientShowChevron: boolean;
  recipientAvatar?: {
    type: 'initials' | 'image';
    content?: string;
    src?: string;
    alt?: string;
  };
  verificationTitle: string;
  verificationIcon: 'circlecheck' | 'check';
  verificationSubtitle: string;
  verificationBadgeVariant: 'todo' | 'pending' | null;
  verificationContainerType: 'incomplete' | 'complete';
  verificationShowChevron: boolean;
  allTasksComplete: boolean;
}

interface HomeTaskData {
  showTasks: boolean;
  tasks: {
    id: string;
    title: string;
    subtitle: string;
    buttonText: string;
    avatar: {
      type: 'icon' | 'initials' | 'image';
      icon?: React.ComponentType<{ className?: string }>;
      content?: string;
      src?: string;
      alt?: string;
    };
    onTaskClick: () => void;
    onButtonClick: () => void;
  }[];
}

class TaskService {
  private static instance: TaskService;
  private taskState: TaskState = {
    addMoneyCompleted: false,
    addMoneyLoading: false,
    recipientCompleted: false,
    recipientLoading: false,
    bankStatementsCompleted: false,
    bankStatementsLoading: false,
    financialStatementsCompleted: false,
    financialStatementsLoading: false,
    pendingAddMoneyCompletion: false,
    pendingRecipientCompletion: undefined
  };
  private listeners: (() => void)[] = [];

  private constructor() {
    this.loadState();
  }

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
    this.saveState();
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const savedState = window.sessionStorage.getItem('taskServiceState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        this.taskState = { ...this.taskState, ...parsed };
        
        // Resume any incomplete loading states that might have been interrupted
        this.resumeIncompleteLoadingStates();
      }
    } catch (e) {
      console.warn('Could not load task state:', e);
    }
  }

  private resumeIncompleteLoadingStates(): void {
    const now = Date.now();
    
    // Resume add money loading if it was interrupted
    if (this.taskState.addMoneyLoading && this.taskState.addMoneyStartTime) {
      const elapsed = now - this.taskState.addMoneyStartTime;
      const remaining = Math.max(0, 3000 - elapsed);
      
      setTimeout(() => {
        const checklistData = this.getChecklistDataFromService();
        this.setAddMoneyCompleted(checklistData.addMoneyCurrency 
          ? `${checklistData.addMoneyAmount}` 
          : '41,315.21 GBP');
      }, remaining);
    }
    
    // Resume recipient loading if it was interrupted
    if (this.taskState.recipientLoading && this.taskState.recipientStartTime && this.taskState.selectedRecipient) {
      const elapsed = now - this.taskState.recipientStartTime;
      const remaining = Math.max(0, 2000 - elapsed);
      
      setTimeout(() => {
        this.setRecipientCompleted(this.taskState.selectedRecipient!);
      }, remaining);
    }
    
    // Resume bank statements loading if it was interrupted
    if (this.taskState.bankStatementsLoading && this.taskState.bankStatementsStartTime) {
      const elapsed = now - this.taskState.bankStatementsStartTime;
      const remaining = Math.max(0, 5000 - elapsed);
      
      setTimeout(() => {
        this.setBankStatementsCompleted();
      }, remaining);
    }
    
    // Resume financial statements loading if it was interrupted
    if (this.taskState.financialStatementsLoading && this.taskState.financialStatementsStartTime) {
      const elapsed = now - this.taskState.financialStatementsStartTime;
      const remaining = Math.max(0, 5000 - elapsed);
      
      setTimeout(() => {
        this.setFinancialStatementsCompleted();
      }, remaining);
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    
    try {
      window.sessionStorage.setItem('taskServiceState', JSON.stringify(this.taskState));
    } catch (e) {
      console.warn('Could not save task state:', e);
    }
  }

  setAddMoneyCompleted(sendAmount: string): void {
    if (this.taskState.addMoneyLoading) {
      this.taskState = {
        ...this.taskState,
        addMoneyCompleted: true,
        addMoneyLoading: false,
        sendAmount
      };
      this.notify();
    }
  }

  setAddMoneyLoading(): void {
    this.taskState = {
      ...this.taskState,
      addMoneyLoading: true,
      addMoneyStartTime: Date.now()
    };
    this.notify();

    setTimeout(() => {
      const checklistData = this.getChecklistDataFromService();
      this.setAddMoneyCompleted(checklistData.addMoneyCurrency 
        ? `${checklistData.addMoneyAmount}` 
        : '41,315.21 GBP');
    }, 3000);
  }

  setRecipientCompleted(recipient: RecipientProfile): void {
    if (this.taskState.recipientLoading) {
      this.taskState = {
        ...this.taskState,
        recipientCompleted: true,
        recipientLoading: false,
        selectedRecipient: recipient
      };
      this.notify();
    }
  }

  setRecipientLoading(): void {
    this.taskState = {
      ...this.taskState,
      recipientLoading: true,
      recipientStartTime: Date.now()
    };
    this.notify();
  }

  setRecipientSelected(recipient: RecipientProfile): void {
    // Store the recipient immediately so it can be resumed if interrupted
    this.taskState = {
      ...this.taskState,
      recipientLoading: true,
      recipientStartTime: Date.now(),
      selectedRecipient: recipient
    };
    this.notify();
    
    setTimeout(() => {
      this.setRecipientCompleted(recipient);
    }, 2000);
  }

  setBankStatementsCompleted(): void {
    if (this.taskState.bankStatementsLoading) {
      this.taskState = {
        ...this.taskState,
        bankStatementsCompleted: true,
        bankStatementsLoading: false
      };
      this.notify();
    }
  }

  setBankStatementsLoading(): void {
    this.taskState = {
      ...this.taskState,
      bankStatementsLoading: true,
      bankStatementsStartTime: Date.now()
    };
    this.notify();

    setTimeout(() => {
      this.setBankStatementsCompleted();
    }, 5000);
  }

  setBankStatementsStarted(): void {
    this.setBankStatementsLoading();
  }

  setFinancialStatementsCompleted(): void {
    if (this.taskState.financialStatementsLoading) {
      this.taskState = {
        ...this.taskState,
        financialStatementsCompleted: true,
        financialStatementsLoading: false
      };
      this.notify();
    }
  }

  setFinancialStatementsLoading(): void {
    this.taskState = {
      ...this.taskState,
      financialStatementsLoading: true,
      financialStatementsStartTime: Date.now()
    };
    this.notify();

    setTimeout(() => {
      this.setFinancialStatementsCompleted();
    }, 5000);
  }

  setFinancialStatementsStarted(): void {
    this.setFinancialStatementsLoading();
  }

  setPendingAddMoneyCompletion(): void {
    this.taskState = {
      ...this.taskState,
      pendingAddMoneyCompletion: true
    };
    this.saveState(); // Immediately save to ensure persistence
    this.notify();
  }

  setPendingRecipientCompletion(recipient: RecipientProfile): void {
    this.taskState = {
      ...this.taskState,
      pendingRecipientCompletion: recipient
    };
    this.saveState(); // Immediately save to ensure persistence
    this.notify();
  }

  checkAndCompletePendingTasks(): void {
    let hasChanges = false;
    
    if (this.taskState.pendingAddMoneyCompletion && !this.taskState.addMoneyCompleted) {
      const checklistData = this.getChecklistDataFromService();
      this.taskState = {
        ...this.taskState,
        addMoneyCompleted: true,
        addMoneyLoading: false,
        sendAmount: checklistData.addMoneyAmount,
        pendingAddMoneyCompletion: false
      };
      hasChanges = true;
    }
    
    if (this.taskState.pendingRecipientCompletion && !this.taskState.recipientCompleted) {
      this.taskState = {
        ...this.taskState,
        recipientCompleted: true,
        recipientLoading: false,
        selectedRecipient: this.taskState.pendingRecipientCompletion,
        pendingRecipientCompletion: undefined
      };
      hasChanges = true;
    }
    
    if (hasChanges) {
      this.saveState(); // Explicitly save after completing pending tasks
      this.notify();
    }
  }

  private getChecklistDataFromService(): { addMoneyAmount: string; addMoneyCurrency: string } {
    try {
      if (typeof window === 'undefined') {
        return { addMoneyAmount: '41,315.21 GBP', addMoneyCurrency: 'GBP' };
      }

      const calculatorData = window.sessionStorage?.getItem('calculatorData');
      if (calculatorData) {
        const parsed = JSON.parse(calculatorData);
        const fromAmount = parseFloat(parsed.fromAmount) || 0;
        const totalBalance = parseFloat(parsed.totalBalance) || 0;
        const addMoneyNeeded = Math.max(0, fromAmount - totalBalance);
        
        const formatAmount = (amount: number, currency: string): string => {
          if (!amount || amount === 0) return `0 ${currency}`;
          
          const formattedNumber = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
          
          return formattedNumber.endsWith('.00') && amount === Math.floor(amount)
            ? `${formattedNumber.slice(0, -3)} ${currency}`
            : `${formattedNumber} ${currency}`;
        };

        return {
          addMoneyAmount: formatAmount(addMoneyNeeded, parsed.fromCurrency || 'GBP'),
          addMoneyCurrency: parsed.fromCurrency || 'GBP'
        };
      }
      
      return { addMoneyAmount: '41,315.21 GBP', addMoneyCurrency: 'GBP' };
    } catch {
      return { addMoneyAmount: '41,315.21 GBP', addMoneyCurrency: 'GBP' };
    }
  }

  private censorAccountNumber(accountNumber?: string): string {
    if (!accountNumber) return '•• ••••';
    if (accountNumber.length <= 4) return `•• ${accountNumber}`;
    return `•• ${accountNumber.slice(-4)}`;
  }

  getTaskData(): TaskData {
    const checklistData = this.getChecklistDataFromService();
    
    const addMoneyData = this.getAddMoneyTaskData(checklistData);
    const recipientData = this.getRecipientTaskData();
    const verificationData = this.getVerificationTaskData();
    
    const allTasksComplete = this.taskState.addMoneyCompleted && 
                            this.taskState.recipientCompleted && 
                            this.taskState.bankStatementsCompleted && 
                            this.taskState.financialStatementsCompleted;

    return {
      ...addMoneyData,
      ...recipientData,
      ...verificationData,
      allTasksComplete
    };
  }

  getHomeTaskData(onNavigateTo?: (route: PrototypeRoute) => void): HomeTaskData {
    const hasAnyCompleted = this.taskState.addMoneyCompleted || 
                           this.taskState.recipientCompleted || 
                           (this.taskState.bankStatementsCompleted && this.taskState.financialStatementsCompleted);
    
    if (!hasAnyCompleted) {
      return {
        showTasks: false,
        tasks: []
      };
    }

    const tasks = [];
    const checklistData = this.getChecklistDataFromService();
    
    // Show next incomplete task, not completed ones
    if (!this.taskState.addMoneyCompleted && !this.taskState.addMoneyLoading) {
      tasks.push({
        id: 'add-money',
        title: 'Add money',
        subtitle: checklistData.addMoneyAmount,
        buttonText: 'Add money',
        avatar: {
          type: 'icon' as const,
          icon: Landmark
        },
        onTaskClick: () => onNavigateTo?.('/prototypes/addmoney'),
        onButtonClick: () => onNavigateTo?.('/prototypes/addmoney')
      });
    }
    
    if (!this.taskState.recipientCompleted && !this.taskState.recipientLoading) {
      tasks.push({
        id: 'add-recipient',
        title: 'Add a recipient',
        subtitle: 'Tell us who you\'re sending to',
        buttonText: 'Add recipient',
        avatar: {
          type: 'icon' as const,
          icon: User
        },
        onTaskClick: () => onNavigateTo?.('/prototypes/recipient'),
        onButtonClick: () => onNavigateTo?.('/prototypes/recipient')
      });
    }
    
    const verificationCompleted = this.taskState.bankStatementsCompleted && this.taskState.financialStatementsCompleted;
    const verificationLoading = this.taskState.bankStatementsLoading || this.taskState.financialStatementsLoading;
    
    if (!verificationCompleted && !verificationLoading) {
      tasks.push({
        id: 'verification',
        title: 'Verify your transfer',
        subtitle: 'Upload necessary information.',
        buttonText: 'Verify',
        avatar: {
          type: 'icon' as const,
          icon: CircleCheck
        },
        onTaskClick: () => onNavigateTo?.('/prototypes/verification'),
        onButtonClick: () => onNavigateTo?.('/prototypes/verification')
      });
    }

    return {
      showTasks: tasks.length > 0,
      tasks: tasks.slice(0, 2)
    };
  }

  private getAddMoneyTaskData(checklistData: { addMoneyAmount: string; addMoneyCurrency: string }) {
    if (this.taskState.addMoneyCompleted) {
      return {
        addMoneyTitle: 'Ready to convert',
        addMoneyIcon: 'check' as const,
        addMoneyBadgeVariant: null,
        addMoneyContainerType: 'complete' as const,
        addMoneyValue: this.taskState.sendAmount || checklistData.addMoneyAmount,
        addMoneyShowChevron: false
      };
    }

    if (this.taskState.addMoneyLoading) {
      return {
        addMoneyTitle: 'Add money',
        addMoneyIcon: 'plus' as const,
        addMoneyBadgeVariant: 'pending' as const,
        addMoneyContainerType: 'incomplete' as const,
        addMoneyValue: checklistData.addMoneyAmount,
        addMoneyShowChevron: false
      };
    }

    return {
      addMoneyTitle: 'Add money',
      addMoneyIcon: 'plus' as const,
      addMoneyBadgeVariant: 'todo' as const,
      addMoneyContainerType: 'incomplete' as const,
      addMoneyValue: checklistData.addMoneyAmount,
      addMoneyShowChevron: true
    };
  }

  private getRecipientTaskData() {
    if (this.taskState.recipientCompleted && this.taskState.selectedRecipient) {
      const recipient = this.taskState.selectedRecipient;
      return {
        recipientTitle: recipient.name,
        recipientIcon: 'user' as const,
        recipientBadgeVariant: null,
        recipientContainerType: 'complete' as const,
        recipientSubtitle: this.censorAccountNumber(recipient.accountNumber),
        recipientShowChevron: true,
        recipientAvatar: {
          type: recipient.avatar ? 'image' as const : 'initials' as const,
          content: recipient.initials,
          src: recipient.avatar,
          alt: recipient.name
        }
      };
    }

    if (this.taskState.recipientLoading) {
      return {
        recipientTitle: 'Add recipient',
        recipientIcon: 'user' as const,
        recipientBadgeVariant: 'pending' as const,
        recipientContainerType: 'incomplete' as const,
        recipientSubtitle: 'Tell us who you\'re sending to',
        recipientShowChevron: false
      };
    }

    return {
      recipientTitle: 'Add recipient',
      recipientIcon: 'user' as const,
      recipientBadgeVariant: 'todo' as const,
      recipientContainerType: 'incomplete' as const,
      recipientSubtitle: 'Tell us who you\'re sending to',
      recipientShowChevron: true
    };
  }

  private getVerificationTaskData() {
    const bothCompleted = this.taskState.bankStatementsCompleted && this.taskState.financialStatementsCompleted;
    const anyLoading = this.taskState.bankStatementsLoading || this.taskState.financialStatementsLoading;
    
    if (bothCompleted) {
      return {
        verificationTitle: 'Verified',
        verificationIcon: 'check' as const,
        verificationSubtitle: 'Documents approved',
        verificationBadgeVariant: null,
        verificationContainerType: 'complete' as const,
        verificationShowChevron: false
      };
    }

    if (anyLoading) {
      return {
        verificationTitle: 'Verify your transfer',
        verificationIcon: 'circlecheck' as const,
        verificationSubtitle: 'In review',
        verificationBadgeVariant: 'pending' as const,
        verificationContainerType: 'incomplete' as const,
        verificationShowChevron: false
      };
    }

    return {
      verificationTitle: 'Verify your transfer',
      verificationIcon: 'circlecheck' as const,
      verificationSubtitle: 'Upload necessary information.',
      verificationBadgeVariant: 'todo' as const,
      verificationContainerType: 'incomplete' as const,
      verificationShowChevron: true
    };
  }

  getTaskState(): TaskState {
    return { ...this.taskState };
  }

  resetTasks(): void {
    this.taskState = {
      addMoneyCompleted: false,
      addMoneyLoading: false,
      recipientCompleted: false,
      recipientLoading: false,
      bankStatementsCompleted: false,
      bankStatementsLoading: false,
      financialStatementsCompleted: false,
      financialStatementsLoading: false,
      pendingAddMoneyCompletion: false,
      pendingRecipientCompletion: undefined
    };
    
    // Clear saved state from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem('taskServiceState');
      } catch (e) {
        console.warn('Could not clear task service state:', e);
      }
    }
    
    this.notify();
  }
}

export const taskService = TaskService.getInstance();
export type { TaskState, TaskData, HomeTaskData };