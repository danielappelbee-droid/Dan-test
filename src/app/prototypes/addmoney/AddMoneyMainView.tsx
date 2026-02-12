import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Copy } from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Chips from '../../components/Chips';
import { OverlaySnippet } from '../../components/OverlaySnippet';
import { getPrioritizedChips } from '../../utils/chipsService';
import { getSnippetData, SnippetData } from '../../utils/snippetService';
import { taskService } from '../../utils/taskService';
import { PrototypeRoute } from '../../utils/navigationService';
import { metaResearchService } from '../../utils/metaResearchService';
import { navigationService } from '../../utils/navigationService';

interface AddMoneyMainViewProps {
  onBack?: () => void;
  onNavigateTo?: (route: PrototypeRoute) => void;
}

export const AddMoneyMainView = React.memo<AddMoneyMainViewProps>(function AddMoneyMainView({ onBack, onNavigateTo }) {
  const [copiedItem, setCopiedItem] = useState<string>('');
  const [showSnippet, setShowSnippet] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState<SnippetData | null>(null);
  
  const prioritizedChips = useMemo(() => getPrioritizedChips('addmoney', handleChipClick), []);
  const addMoneyConfig = metaResearchService.getAddMoneyConfiguration();

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

  const handleCopy = (itemId: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(''), 2000);
    }).catch(() => {
      console.log('Failed to copy');
    });
  };

  const handleMadeTransfer = () => {
    console.log('=== handleMadeTransfer called ===');
    
    // Check if we're coming from checklist by looking at navigation history
    const previousRoute = navigationService.getPreviousRoute();
    const isFromChecklist = previousRoute === '/prototypes/checklist';
    
    console.log('Previous route:', previousRoute);
    console.log('Is from checklist:', isFromChecklist);
    
    if (isFromChecklist) {
      // Coming from checklist - complete task and go back to checklist
      console.log('Path: Coming from checklist - going back');
      taskService.setAddMoneyLoading();
      if (onBack) {
        onBack();
      } else {
        console.log('Go back to checklist with completed task');
      }
    } else {
      // Check if this is the initial flow from home with no completed tasks
      const taskState = taskService.getTaskState();
      console.log('Current task state:', taskState);
      
      const hasAnyCompleted = taskState.addMoneyCompleted || 
                             taskState.recipientCompleted || 
                             (taskState.bankStatementsCompleted && taskState.financialStatementsCompleted);
      
      console.log('Has any completed:', hasAnyCompleted);
      
      if (!hasAnyCompleted) {
        console.log('Path: No tasks completed - updating balance');
        
        // Coming from home with no tasks completed - update balance based on research selection
        const researchData = typeof window !== 'undefined' ? 
          JSON.parse(window.sessionStorage.getItem('researchData') || '{}') : {};
        
        console.log('Research data:', researchData);
        
        if (researchData.country && researchData.accountType) {
          console.log('Research data valid - proceeding with balance update');
          
          // Get current home data
          const homeData = typeof window !== 'undefined' ? 
            JSON.parse(window.sessionStorage.getItem('homeData') || '{}') : {};
          
          console.log('Current home data:', homeData);
          
          // Get initial balance if not set in homeData
          const balanceConfig = metaResearchService.getBalanceConfiguration();
          console.log('Balance config:', balanceConfig);
          
          // Determine amount to add based on selection
          let amountToAdd = 0;
          const currency = researchData.country === 'US' ? 'USD' : 'GBP';
          
          if (researchData.accountType === 'Business') {
            amountToAdd = 950000; // Business: 950,000 USD or 950,000 GBP
          } else if (researchData.accountType === 'Personal') {
            amountToAdd = researchData.country === 'US' ? 600000 : 450000; // Personal: 600,000 USD or 450,000 GBP
          }
          
          console.log('Amount to add:', amountToAdd, currency);
          
          // Get current balances for logging
          const currentMainBalance = parseFloat(homeData.mainAccountBalance ||
            balanceConfig.amount.toString());
          const currentTotalBalance = parseFloat(homeData.totalBalance || balanceConfig.amount.toString());
          
          console.log('Balance calculations:');
          console.log('- Current main balance:', currentMainBalance);
          console.log('- Amount to add:', amountToAdd);
          console.log('- Current total balance:', currentTotalBalance);
          
          // Save simple pending update data - don't change existing balances yet
          const updatedHomeData = {
            ...homeData,
            // Keep current balances as they are
            pendingAddAmount: amountToAdd.toString(),
            pendingAddCurrency: currency
          };
          
          console.log('Updated home data to save:', updatedHomeData);
          
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('homeData', JSON.stringify(updatedHomeData));
            console.log('Home data saved to sessionStorage');
          }
          
          // Mark add money as completed and navigate to home
          taskService.setPendingAddMoneyCompletion();
          console.log('Navigating to home');
          if (onNavigateTo) {
            onNavigateTo('/prototypes/home');
          } else {
            console.log('Navigate to home with updated balance');
          }
        } else {
          console.log('No valid research data - creating simple balance update');
          
          // No research data - create a simple balance update for demo purposes
          const homeData = typeof window !== 'undefined' ? 
            JSON.parse(window.sessionStorage.getItem('homeData') || '{}') : {};
          
          console.log('Current home data for fallback:', homeData);
          
          // Get balance config for fallback values
          const balanceConfig = metaResearchService.getBalanceConfiguration();
          console.log('Balance config for fallback:', balanceConfig);
          
          // Use a reasonable amount to add for demo (100,000 in the primary currency)
          const amountToAdd = 100000;
          const currency = 'GBP'; // Default to GBP
          
          // Get current balances for logging
          const currentMainBalance = parseFloat(homeData.mainAccountBalance || balanceConfig.amount.toString());
          const currentTotalBalance = parseFloat(homeData.totalBalance || balanceConfig.amount.toString());
          
          console.log('Fallback balance calculations:');
          console.log('- Amount to add:', amountToAdd, currency);
          console.log('- Current main balance:', currentMainBalance);
          console.log('- Current total balance:', currentTotalBalance);
          
          // Save simple pending update data - don't change existing balances yet
          const updatedHomeData = {
            ...homeData,
            // Keep current balances as they are
            pendingAddAmount: amountToAdd.toString(),
            pendingAddCurrency: currency
          };
          
          console.log('Updated home data to save (fallback):', updatedHomeData);
          
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('homeData', JSON.stringify(updatedHomeData));
            console.log('Home data saved to sessionStorage (fallback)');
          }
          
          // Mark add money as completed and navigate to home
          taskService.setPendingAddMoneyCompletion();
          console.log('Navigating to home (fallback)');
          if (onNavigateTo) {
            onNavigateTo('/prototypes/home');
          } else {
            console.log('Navigate to home with updated balance (fallback)');
          }
        }
      } else {
        // Normal flow from other sources - start loading and go back
        taskService.setAddMoneyLoading();
        if (onBack) {
          onBack();
        } else {
          console.log('Made bank transfer clicked');
        }
      }
    }
  };

  const handleAddLater = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Add money later clicked');
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

  // Filter out hidden payment details based on research configuration
  const paymentDetails = addMoneyConfig.paymentDetails.filter(detail => !detail.hidden);

  return (
    <>
      <motion.div 
        key="addmoney-main"
        className="h-full bg-wise-background-screen flex flex-col pb-32"
        variants={slideVariants}
        initial="visible"
        animate="visible"
      >
        <div className="px-4 py-4 flex items-center">
          <Button
            variant="neutral-grey"
            size="large"
            iconOnly
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-6">
            <div className="text-left">
              <h3 className="text-wise-content-primary font-semibold mb-6" style={{ fontSize: '1.75rem', lineHeight: '1.75rem' }}>
                {addMoneyConfig.title}
              </h3>
              
              <div className="bg-white rounded-xl px-4 -mx-4 mb-6">
                <div className="-mx-4">
                  <Chips 
                    chips={prioritizedChips} 
                    variant="grey-on-white"
                    addFirstChipMargin={false}
                    onChipClick={handleChipClick}
                    className="[&>div>div>button:first-child]:ml-4 lg:[&>div>div>button:first-child]:ml-2"
                  />
                </div>
              </div>
              
              <p className="text-wise-content-secondary text-sm leading-relaxed mb-6">
                {addMoneyConfig.description}
              </p>
            </div>

            <div className="text-left">
              <h4 className="text-wise-content-primary font-semibold mb-6" style={{ fontSize: '1.125rem', lineHeight: '1.5rem' }}>
                Details you&apos;ll need to add money
              </h4>
            </div>

            <div className="space-y-2 pb-16">
              {paymentDetails.map((detail) => (
                <button
                  key={detail.id}
                  onClick={() => handleCopy(detail.id, detail.value)}
                  className="w-full bg-wise-interactive-neutral-grey rounded-xl p-4 hover:bg-wise-interactive-neutral-grey-hover active:bg-wise-interactive-neutral-grey-active transition-colors text-left"
                >
                  <div className="flex items-center justify-between min-h-0">
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                      <p className="text-wise-content-tertiary text-sm font-medium mb-1">
                        {detail.label}
                      </p>
                      <p className="text-wise-content-primary font-semibold text-base mb-2">
                        {detail.value}
                      </p>
                      {detail.description && (
                        <p className="text-wise-content-secondary text-sm leading-relaxed">
                          {detail.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-3 p-1 flex-shrink-0 flex items-center justify-center">
                      <Copy 
                        className={`h-5 w-5 ${
                          copiedItem === detail.id 
                            ? 'text-wise-sentiment-positive-primary' 
                            : 'text-wise-interactive-primary'
                        }`} 
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Footer className="px-4 pt-4 pb-8">
          <div className="space-y-3">
            <Button
              variant="primary"
              size="large"
              onClick={handleMadeTransfer}
              className="w-full"
            >
              I&apos;ve made my bank transfer
            </Button>
            
            <Button
              variant="neutral"
              size="large"
              onClick={handleAddLater}
              className="w-full"
            >
              I&apos;ll add my money later
            </Button>
          </div>
        </Footer>
      </motion.div>

      <AnimatePresence>
        {showSnippet && currentSnippet && (
          <OverlaySnippet
            snippetData={currentSnippet}
            onClose={handleCloseSnippet}
            onHelp={handleSnippetHelp}
          />
        )}
      </AnimatePresence>
    </>
  );
});