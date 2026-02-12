import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowLeft, Landmark, UserRound, CircleCheck, HelpCircle, Pencil, Check } from 'lucide-react';
import Button from '../../components/Button';
import ListItem from '../../components/ListItem';
import Chips from '../../components/Chips';
import { OverlaySnippet } from '../../components/OverlaySnippet';
import { OverlaySuccess } from '../../components/OverlaySuccess';
import { getPrioritizedChips } from '../../utils/chipsService';
import { getSnippetData, SnippetData } from '../../utils/snippetService';
import { taskService, TaskData } from '../../utils/taskService';
import { metaResearchService } from '../../utils/metaResearchService';

interface ChecklistMainViewProps {
  onBack?: () => void;
  onNavigateTo?: (route: string) => void;
}

interface ChecklistData {
  recipientGetsAmount: string;
  exchangeRateDisplay: string;
  transferReason: string;
  addMoneyAmount: string;
}

const getChecklistDataFromStorage = (): ChecklistData => {
  if (typeof window === 'undefined') {
    return {
      recipientGetsAmount: '486,500 EUR',
      exchangeRateDisplay: 'Exchange rate 1 GBP = 1.1531 EUR',
      transferReason: 'Your transfer',
      addMoneyAmount: '41,315.21 GBP'
    };
  }

  const calculatorData = window.sessionStorage?.getItem('calculatorData');
  const reasonData = window.sessionStorage?.getItem('reasonData');
  const homeData = window.sessionStorage?.getItem('homeData');

  let parsedCalculator, parsedReason, parsedHome;
  
  try {
    parsedCalculator = calculatorData ? JSON.parse(calculatorData) : null;
    parsedReason = reasonData ? JSON.parse(reasonData) : null;
    parsedHome = homeData ? JSON.parse(homeData) : null;
  } catch (e) {
    console.warn('Error parsing stored data:', e);
  }

  const formatAmount = (amount: number, currency: string): string => {
    if (!amount || amount === 0) {
      return `0 ${currency}`;
    }
    
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return formattedNumber.endsWith('.00') && amount === Math.floor(amount)
      ? `${formattedNumber.slice(0, -3)} ${currency}`
      : `${formattedNumber} ${currency}`;
  };

  const formatExchangeRate = (fromCurrency: string, toCurrency: string, rate?: number): string => {
    if (!rate) {
      return `Exchange rate 1 ${fromCurrency} = 1.1531 ${toCurrency}`;
    }
    
    const formattedRate = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(rate);
    
    return `Exchange rate 1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
  };

  const getTransferReasonText = (reasonId?: string): string => {
    // Get all available reason options (personal + business) from meta research service
    const reasonConfig = metaResearchService.getReasonConfiguration();
    const reasonOption = reasonConfig.options.find(option => option.id === reasonId);
    
    if (reasonOption) {
      return reasonOption.title;
    }
    
    // Fallback mapping for backwards compatibility
    const reasonMap: Record<string, string> = {
      'property': 'Buying a property',
      'gift': 'Sending a gift',
      'investments': 'Investments',
      'moving': 'Moving country',
      'inheritance': 'Inheritance',
      'other': 'Other',
      // Business reasons
      'supplier': 'Paying a supplier',
      'services': 'Paying for services',
      'profits': 'Moving profits',
      'funding': 'Funding my business'
    };
    
    return reasonMap[reasonId || ''] || 'Your transfer';
  };

  if (parsedCalculator && parsedReason) {
    const toAmount = parseFloat(parsedCalculator.toAmount) || 0;
    const fromAmount = parseFloat(parsedCalculator.fromAmount) || 0;
    const totalBalance = parseFloat(parsedHome?.totalBalance || parsedCalculator.totalBalance) || 0;
    const addMoneyNeeded = Math.max(0, fromAmount - totalBalance);

    return {
      recipientGetsAmount: formatAmount(toAmount, parsedCalculator.toCurrency || 'EUR'),
      exchangeRateDisplay: formatExchangeRate(
        parsedCalculator.fromCurrency || 'GBP', 
        parsedCalculator.toCurrency || 'EUR', 
        parseFloat(parsedCalculator.exchangeRate)
      ),
      transferReason: getTransferReasonText(parsedReason.selectedReason),
      addMoneyAmount: formatAmount(addMoneyNeeded, parsedCalculator.fromCurrency || 'GBP')
    };
  }

  return {
    recipientGetsAmount: '486,500 EUR',
    exchangeRateDisplay: 'Exchange rate 1 GBP = 1.1531 EUR',
    transferReason: 'Your transfer',
    addMoneyAmount: '41,315.21 GBP'
  };
};

export const ChecklistMainView = React.memo<ChecklistMainViewProps>(function ChecklistMainView({ onBack, onNavigateTo }) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    balance: false,
    recipient: false,
    verification: false,
    send: false
  });
  const [showSnippet, setShowSnippet] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState<SnippetData | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [checklistData, setChecklistData] = useState<ChecklistData>(() => getChecklistDataFromStorage());
  const [taskData, setTaskData] = useState<TaskData>(() => taskService.getTaskData());
  
  const prioritizedChips = useMemo(() => getPrioritizedChips('checklist', handleChipClick), []);

  useEffect(() => {
    const data = getChecklistDataFromStorage();
    setChecklistData(data);
  }, []);

  useEffect(() => {
    // Check for pending task completions when component mounts
    taskService.checkAndCompletePendingTasks();
    
    // Update task data immediately after checking pending tasks
    setTaskData(taskService.getTaskData());
    
    const unsubscribe = taskService.subscribe(() => {
      setTaskData(taskService.getTaskData());
    });

    return unsubscribe;
  }, []);

  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8
  };

  const slideVariants = {
    visible: { 
      x: 0,
      transition: springTransition
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Back button clicked');
    }
  };

  const handleHelp = () => {
    console.log('Help button clicked');
  };

  const handlePencilClick = () => {
    if (onNavigateTo) {
      onNavigateTo('/prototypes/calculator');
    }
  };

  const handleCheckboxChange = (itemId: string) => (checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const handleCancelTransfer = () => {
    console.log('Cancel transfer clicked');
  };

  const handleNavigate = (route: string) => {
    if (onNavigateTo) {
      onNavigateTo(route);
    } else {
      console.log(`Navigate to ${route}`);
    }
  };

  function handleChipClick(snippetId: string) {
    const snippetData = getSnippetData(snippetId);
    if (snippetData) {
      setCurrentSnippet(snippetData);
      setShowSnippet(true);
    }
  }

  const handleCloseSnippet = () => {
    setShowSnippet(false);
    setCurrentSnippet(null);
  };

  const handleSnippetHelp = () => {
    console.log('Snippet help clicked');
  };

  const handleSendTransfer = () => {
    setShowSuccessOverlay(true);
  };

  const handleCloseSuccessOverlay = () => {
    setShowSuccessOverlay(false);
  };

  const baseChecklistItems = [
    {
      id: 'balance',
      icon: taskData.addMoneyIcon === 'check' ? Check : Landmark,
      title: taskData.addMoneyTitle,
      subtitle: `${taskData.addMoneyValue}`,
      checked: checkedItems.balance,
      onChange: handleCheckboxChange('balance'),
      containerType: taskData.addMoneyContainerType,
      showCheckbox: false,
      badgeVariant: taskData.addMoneyBadgeVariant,
      showChevron: taskData.addMoneyShowChevron,
      onClick: taskData.addMoneyShowChevron ? () => handleNavigate('/prototypes/addmoney') : undefined
    },
    {
      id: 'recipient',
      icon: UserRound,
      title: taskData.recipientTitle,
      subtitle: taskData.recipientSubtitle,
      checked: checkedItems.recipient,
      onChange: handleCheckboxChange('recipient'),
      containerType: taskData.recipientContainerType,
      showCheckbox: false,
      badgeVariant: taskData.recipientBadgeVariant,
      showChevron: taskData.recipientShowChevron,
      onClick: taskData.recipientShowChevron ? () => handleNavigate('/prototypes/recipient') : undefined,
      useRecipientAvatar: taskData.recipientAvatar ? true : false,
      recipientAvatar: taskData.recipientAvatar
    },
    {
      id: 'verification',
      icon: taskData.verificationIcon === 'check' ? Check : CircleCheck,
      title: taskData.verificationTitle,
      subtitle: taskData.verificationSubtitle,
      checked: checkedItems.verification,
      onChange: handleCheckboxChange('verification'),
      containerType: taskData.verificationContainerType,
      showCheckbox: false,
      badgeVariant: taskData.verificationBadgeVariant,
      showChevron: taskData.verificationShowChevron,
      onClick: taskData.verificationShowChevron ? () => handleNavigate('/prototypes/verification') : undefined
    }
  ];

  const sendItem = {
    id: 'send',
    icon: ArrowUp,
    title: 'Send',
    subtitle: 'Transfer your money securely.',
    checked: checkedItems.send,
    onChange: handleCheckboxChange('send'),
    containerType: 'incomplete' as const,
    showCheckbox: false,
    badgeVariant: null,
    isLast: true,
    showChevron: false,
    onClick: undefined
  };

  const checklistItems = taskData.allTasksComplete ? baseChecklistItems : [...baseChecklistItems, sendItem];

  return (
    <>
      <motion.div 
        key="checklist-main"
        className="h-full flex flex-col"
        style={{ backgroundColor: 'var(--wise-interactive-neutral-grey-mid)' }}
        variants={slideVariants}
        initial="visible"
        animate="visible"
      >
        <div className="px-4 pt-16 pb-4 flex justify-between items-center flex-shrink-0">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'var(--wise-background-overlay)' }}
          >
            <ArrowLeft className="h-5 w-5 text-wise-content-primary" />
          </button>
          
          <button
            onClick={handleHelp}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'var(--wise-background-overlay)' }}
          >
            <HelpCircle className="h-5 w-5 text-wise-content-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="mb-6">
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--wise-background-overlay)' }}>
                <ArrowUp className="h-8 w-8 text-wise-content-primary" />
              </div>
              
              <div className="text-wise-content-secondary text-sm mb-4">
                {checklistData.transferReason}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-wise-content-primary font-semibold" style={{ fontSize: '1.75rem', lineHeight: '1.75rem' }}>
                  {checklistData.recipientGetsAmount}
                </h3>
                <button onClick={handlePencilClick} className="transition-colors hover:scale-110">
                  <Pencil className="h-6 w-6 text-wise-content-tertiary" />
                </button>
              </div>
              
              <div className="text-wise-content-secondary text-sm">
                {checklistData.exchangeRateDisplay}
              </div>
            </div>

            <div className="-mx-4">
              <Chips 
                chips={prioritizedChips} 
                variant="white-on-grey"
                addFirstChipMargin={true}
                onChipClick={handleChipClick}
              />
            </div>
          </div>

          <div className="bg-white rounded-t-[24px] -mx-4">
            <div className="px-4 pt-8 pb-8">
              <h3 className="text-sm font-semibold text-wise-content-primary mb-4 ml-4">
                Tasks
              </h3>
              
              <div className="space-y-2">
                {checklistItems.map((item, index) => {
                  const IconComponent = item.icon;
                  let badges;
                  
                  if (item.id === 'balance' && taskData.addMoneyIcon === 'check') {
                    badges = undefined;
                  } else if (item.id === 'recipient' && taskData.recipientContainerType === 'complete') {
                    badges = undefined;
                  } else if (item.id === 'verification' && taskData.verificationIcon === 'check') {
                    badges = undefined;
                  } else if (item.badgeVariant) {
                    badges = [{ type: 'icon' as const, iconVariant: item.badgeVariant }];
                  }
                  
                  const isLast = index === checklistItems.length - 1;
                  
                  return (
                    <div key={item.id} onClick={item.onClick}>
                      <ListItem
                        avatar={('useRecipientAvatar' in item && item.useRecipientAvatar && item.recipientAvatar) ? {
                          size: 48,
                          type: item.recipientAvatar.type,
                          content: item.recipientAvatar.content,
                          src: item.recipientAvatar.src,
                          alt: item.recipientAvatar.alt,
                          badges: badges
                        } : {
                          size: 48,
                          type: 'icon',
                          content: <IconComponent 
                            className="h-5 w-5" 
                            style={item.id === 'send' ? { color: 'var(--wise-content-tertiary)' } : {}}
                          />,
                          badges: badges
                        }}
                        content={{
                          largeText: item.title,
                          smallText: item.subtitle
                        }}
                        rightElement={item.showChevron ? {
                          type: 'chevron'
                        } : item.showCheckbox ? {
                          type: 'checkbox',
                          checkbox: {
                            checked: item.checked,
                            onChange: item.onChange,
                            name: item.id
                          }
                        } : undefined}
                        container={item.containerType}
                        className={isLast ? '!border-white' : ''}
                        onClick={item.onClick}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="text-center pt-6 pb-20">
                <button
                  onClick={handleCancelTransfer}
                  className="text-sm font-semibold underline transition-colors"
                  style={{ color: 'var(--wise-sentiment-negative-primary)' }}
                >
                  Cancel transfer
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {taskData.allTasksComplete && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-wise-border-neutral px-4 py-4">
            <Button 
              variant="primary" 
              size="large" 
              className="w-full"
              onClick={handleSendTransfer}
            >
              Send
            </Button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showSnippet && currentSnippet && (
          <OverlaySnippet
            snippetData={currentSnippet}
            onClose={handleCloseSnippet}
            onHelp={handleSnippetHelp}
          />
        )}
        {showSuccessOverlay && (
          <OverlaySuccess
            onClose={handleCloseSuccessOverlay}
          />
        )}
      </AnimatePresence>
    </>
  );
});