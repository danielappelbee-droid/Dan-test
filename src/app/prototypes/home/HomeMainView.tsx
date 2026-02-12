import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserRound, Eye, ChartColumnIncreasing, Home, CreditCard, Users, Repeat, ArrowRightLeft, ReceiptText } from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import ListItem from '../../components/ListItem';
import Tasks from '../../components/Tasks';
import AccountCarousel from './AccountCarousel';
import { getRecentTransactions } from '../../utils/transactionData';
import { taskService, HomeTaskData } from '../../utils/taskService';
import { metaResearchService } from '../../utils/metaResearchService';

interface HomeMainViewProps {
  onShowTransactions?: () => void;
  onNavigateTo?: (route: string) => void;
  animationDirection: 'left' | 'right';
  isExiting?: boolean;
}

const getTransactionIcon = (iconName: string) => {
  switch (iconName) {
    case 'ArrowRightLeft':
      return ArrowRightLeft;
    case 'ReceiptText':
      return ReceiptText;
    default:
      return ReceiptText;
  }
};

const getAmountPrefix = (type: string): string => {
  switch (type) {
    case 'received':
    case 'moved':
      return '+ ';
    case 'sent':
    case 'spent':
    case 'paid':
      return '';
    default:
      return '';
  }
};

export const HomeMainView = React.memo(function HomeMainView({ 
  onShowTransactions, 
  onNavigateTo, 
  animationDirection,
  isExiting = false
}: HomeMainViewProps) {
  const researchConfig = metaResearchService.getConfiguration();
  const balanceConfig = metaResearchService.getBalanceConfiguration();
  const earnConfig = metaResearchService.getEarnAmountConfiguration();
  
  // Initialize balances from current stored data or config
  const getInitialBalance = () => {
    if (typeof window !== 'undefined') {
      const storedHomeData = window.sessionStorage.getItem('homeData');
      if (storedHomeData) {
        try {
          const homeData = JSON.parse(storedHomeData);
          const storedBalance = parseFloat(homeData.totalBalance || '0');
          if (storedBalance > 0) {
            return storedBalance;
          }
        } catch (e) {
          console.warn('Could not parse home data:', e);
        }
      }
    }
    // For research participants, set initial balance to the configuration amount
    // For non-research users, use the default from metaResearchService (10706 GBP)
    return researchConfig.isFromResearch ? balanceConfig.amount : 10706;
  };
  
  const [totalBalance, setTotalBalance] = useState(getInitialBalance());
  const [displayBalance, setDisplayBalance] = useState(getInitialBalance());
  const [mainCurrency, setMainCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedHomeData = window.sessionStorage.getItem('homeData');
      if (storedHomeData) {
        try {
          const homeData = JSON.parse(storedHomeData);
          // If we have stored currency and it matches research config, use it
          if (homeData.mainAccountCurrency) {
            return homeData.mainAccountCurrency;
          }
        } catch (e) {
          console.warn('Could not parse home data:', e);
        }
      }
    }
    // Default to research configuration currency or GBP
    return researchConfig.isFromResearch ? balanceConfig.currency : 'GBP';
  });
  const [homeTaskData, setHomeTaskData] = useState<HomeTaskData>(() => taskService.getHomeTaskData(onNavigateTo));
  const recentTransactions = getRecentTransactions(3);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get existing home data to preserve added amounts
      const existingHomeData = window.sessionStorage.getItem('homeData');
      let existingData: {
        mainAccountBalance?: string;
        mainAccountCurrency?: string;
        lastAddedAmount?: string;
        lastAddedCurrency?: string;
      } = {};
      if (existingHomeData) {
        try {
          existingData = JSON.parse(existingHomeData);
        } catch (e) {
          console.warn('Could not parse existing home data:', e);
        }
      }
      
      // Only update if not already set or if totalBalance changed
      const homeData = {
        ...existingData,
        totalBalance: totalBalance.toString(),
        // Set main account balance if not already set - use config for research participants
        mainAccountBalance: existingData.mainAccountBalance ||
          (researchConfig.isFromResearch ? balanceConfig.amount.toString() :
           '10706'),
        mainAccountCurrency: existingData.mainAccountCurrency || mainCurrency
      };
      
      try {
        window.sessionStorage.setItem('homeData', JSON.stringify(homeData));
      } catch (e) {
        console.warn('Could not save home data:', e);
      }
    }
  }, [totalBalance, mainCurrency]);

  useEffect(() => {
    const unsubscribe = taskService.subscribe(() => {
      setHomeTaskData(taskService.getHomeTaskData(onNavigateTo));
    });

    return unsubscribe;
  }, [onNavigateTo]);

  // Check for pending balance additions when navigating to home
  useEffect(() => {
    console.log('HomeMainView checking for pending balance additions...');
    
    const checkForPendingAddition = () => {
      if (typeof window !== 'undefined') {
        const storedHomeData = window.sessionStorage.getItem('homeData');
        if (storedHomeData) {
          try {
            const homeData = JSON.parse(storedHomeData);
            
            // Check if there's a pending amount to add
            if (homeData.pendingAddAmount && homeData.pendingAddCurrency) {
              const amountToAdd = parseFloat(homeData.pendingAddAmount);
              const currency = homeData.pendingAddCurrency;
              
              console.log('Found pending addition:', amountToAdd, currency);
              console.log('Current display balance:', displayBalance);
              
              // After 2 seconds, add the amount to current balances
              setTimeout(() => {
                console.log('Adding amount to balances...');
                const newTotalBalance = displayBalance + amountToAdd;
                const newMainAccountBalance = parseFloat(homeData.mainAccountBalance ||
                  (researchConfig.isFromResearch ? balanceConfig.amount.toString() : '10706')) + amountToAdd;
                
                console.log('New total balance:', newTotalBalance);
                console.log('New main account balance:', newMainAccountBalance);
                
                // Update the display
                setDisplayBalance(newTotalBalance);
                setTotalBalance(newTotalBalance);
                setMainCurrency(currency);
                
                // Save the updated balances to storage
                const updatedHomeData = {
                  ...homeData,
                  totalBalance: newTotalBalance.toString(),
                  mainAccountBalance: newMainAccountBalance.toString(),
                  mainAccountCurrency: currency,
                  // Add a flag to trigger carousel update
                  carouselUpdateTrigger: Date.now().toString()
                };
                
                // Clear the pending addition
                delete updatedHomeData.pendingAddAmount;
                delete updatedHomeData.pendingAddCurrency;
                
                window.sessionStorage.setItem('homeData', JSON.stringify(updatedHomeData));
                console.log('Updated home data saved:', updatedHomeData);
                
                // Trigger a storage event manually to notify AccountCarousel
                window.dispatchEvent(new StorageEvent('storage', {
                  key: 'homeData',
                  newValue: JSON.stringify(updatedHomeData),
                  storageArea: window.sessionStorage
                }));
              }, 2000);
            }
          } catch (e) {
            console.warn('Could not parse home data:', e);
          }
        }
      }
    };

    // Small delay to ensure the component has fully loaded
    const timeoutId = setTimeout(checkForPendingAddition, 100);
    
    return () => clearTimeout(timeoutId);
  }, [animationDirection, displayBalance]); // Run when navigating


  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8
  };

  const slideVariants = {
    hiddenRight: { 
      x: "100%",
      transition: springTransition
    },
    hiddenLeft: { 
      x: "-100%",
      transition: springTransition
    },
    visible: { 
      x: 0,
      transition: springTransition
    },
    exitRight: { 
      x: "100%",
      transition: springTransition
    },
    exitLeft: { 
      x: "-100%",
      transition: springTransition
    }
  };

  const getInitialVariant = () => {
    if (isExiting) return 'visible';
    return animationDirection === 'left' ? 'hiddenLeft' : 'hiddenRight';
  };

  const getExitVariant = () => {
    return animationDirection === 'left' ? 'exitLeft' : 'exitRight';
  };

  const formatBalance = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatTransactionAmount = (transaction: typeof recentTransactions[0]): { large: string; small?: string } => {
    const prefix = getAmountPrefix(transaction.type);
    
    // Convert amounts based on research configuration
    const convertedAmount = metaResearchService.convertTransactionAmount(transaction.amount, transaction.currency);
    const large = `${prefix}${convertedAmount.amount} ${convertedAmount.currency}`;
    
    if (transaction.convertedAmount && transaction.convertedCurrency) {
      const convertedSecondary = metaResearchService.convertTransactionAmount(transaction.convertedAmount, transaction.convertedCurrency);
      const small = `${convertedSecondary.amount} ${convertedSecondary.currency}`;
      return { large, small };
    }
    
    return { large };
  };

  const isPositiveTransaction = (type: string): boolean => {
    return type === 'received' || type === 'moved';
  };

  const handleSend = () => {
    if (onNavigateTo) {
      onNavigateTo('/prototypes/calculator');
    }
  };

  const handleAddMoney = () => {
    if (onNavigateTo) {
      onNavigateTo('/prototypes/addmoney');
    }
  };

  const handleRecipients = () => {
    if (onNavigateTo) {
      onNavigateTo('/prototypes/recipient');
    }
  };


  const handleSeeAllTasks = () => {
    if (onNavigateTo) {
      onNavigateTo('/prototypes/checklist');
    }
  };


  return (
    <motion.div 
      key="home-main"
      className="h-full bg-wise-background-screen flex flex-col pb-20"
      variants={slideVariants}
      initial={getInitialVariant()}
      animate="visible"
      exit={getExitVariant()}
    >
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="neutral-grey"
            size="medium"
            iconOnly
          >
            <UserRound className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="primary" size="small">
            {earnConfig.display}
          </Button>
          <Button
            variant="neutral-grey"
            size="small"
            iconOnly
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-6">
          <div className="mb-6">
            <h6 className="text-base font-normal">Total balance</h6>
            <div className="flex items-center gap-3 mt-2">
              <motion.h3 
                key={displayBalance}
                className="text-wise-content-primary font-semibold" 
                style={{ fontSize: '1.75rem', lineHeight: '1.75rem' }}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {formatBalance(displayBalance)} {mainCurrency}
              </motion.h3>
              <Button
                variant="neutral-grey"
                size="small"
                iconOnly
              >
                <ChartColumnIncreasing className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button variant="primary" size="small" onClick={handleSend}>
              Send
            </Button>
            <Button variant="neutral" size="small" onClick={handleAddMoney}>
              Add money
            </Button>
            <Button variant="neutral" size="small">
              Request
            </Button>
          </div>

          <AccountCarousel
            onTotalBalanceChange={(total) => {
              // For research users, allow carousel to set the initial total balance
              // but only if we don't have a stored balance from transactions
              if (researchConfig.isFromResearch) {
                if (typeof window !== 'undefined') {
                  const storedHomeData = window.sessionStorage.getItem('homeData');
                  if (storedHomeData) {
                    try {
                      const homeData = JSON.parse(storedHomeData);
                      // If we have pending additions or a modified balance, don't override
                      if (homeData.pendingAddAmount || (homeData.totalBalance && parseFloat(homeData.totalBalance) !== balanceConfig.amount)) {
                        console.log('Ignoring carousel total balance update - has pending updates or modified balance');
                        return;
                      }
                    } catch (e) {
                      console.warn('Could not parse home data for balance check:', e);
                    }
                  }
                }
                // Allow carousel to set the correct total for research users
                console.log('Allowing carousel total balance update for research user:', total);
                setTotalBalance(total);
                setDisplayBalance(total);
                // Also ensure currency matches research config
                if (balanceConfig.currency !== mainCurrency) {
                  console.log('Updating main currency to match research config:', balanceConfig.currency);
                  setMainCurrency(balanceConfig.currency);
                }
                return;
              }

              if (typeof window !== 'undefined') {
                const storedHomeData = window.sessionStorage.getItem('homeData');
                if (storedHomeData) {
                  try {
                    const homeData = JSON.parse(storedHomeData);
                    // For non-research users, only preserve balance if it has been modified by transactions
                    // (i.e., different from the default 10706, or has pending additions)
                    if (homeData.totalBalance && parseFloat(homeData.totalBalance) > 0) {
                      const storedBalance = parseFloat(homeData.totalBalance);
                      const hasTransactionHistory = homeData.pendingAddAmount ||
                                                   homeData.lastAddedAmount ||
                                                   storedBalance !== 10706;
                      if (hasTransactionHistory) {
                        console.log('Ignoring carousel total balance update - has transaction history');
                        return;
                      }
                    }
                  } catch (e) {
                    console.warn('Could not parse home data for balance check:', e);
                  }
                }
              }
              // Only update if no stored balance exists and not from research
              setTotalBalance(total);
            }}
            animationDirection={animationDirection}
          />
        </div>

        {homeTaskData.showTasks && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-wise-content-primary font-semibold text-xl">Tasks</h3>
              <button 
                onClick={handleSeeAllTasks}
                className="text-wise-link-content font-semibold text-sm underline"
              >
                See all
              </button>
            </div>
            <div className="mb-12">
              <Tasks tasks={homeTaskData.tasks} />
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-wise-content-primary font-semibold text-xl">Transactions</h3>
            <button 
              onClick={onShowTransactions}
              className="text-wise-link-content font-semibold text-sm underline"
            >
              See all
            </button>
          </div>

          <div className="space-y-2 pb-8">
            {recentTransactions.map((transaction) => {
              const currency = formatTransactionAmount(transaction);
              
              return (
                <ListItem
                  key={transaction.id}
                  avatar={{
                    size: 48,
                    type: transaction.avatar?.type === 'icon' ? 'icon' : 
                          transaction.avatar?.type === 'image' ? 'image' : 'initials',
                    src: transaction.avatar?.src,
                    content: transaction.avatar?.type === 'icon' && transaction.avatar.icon ? 
                            React.createElement(getTransactionIcon(transaction.avatar.icon), { className: "h-5 w-5" }) :
                            transaction.avatar?.initials,
                    alt: transaction.title,
                    badges: transaction.badges?.map(badge => ({
                      type: badge.flag ? 'flag' as const : 'icon' as const,
                      src: badge.flag,
                      iconVariant: badge.iconVariant
                    }))
                  }}
                  content={{
                    largeText: transaction.title,
                    smallText: `${transaction.subtitle} • ${transaction.date}`
                  }}
                  currency={{
                    large: currency.large,
                    small: currency.small,
                    isPositive: isPositiveTransaction(transaction.type)
                  }}
                  rightElement={{
                    type: 'chevron'
                  }}
                  onClick={() => console.log('Transaction clicked:', transaction.title)}
                  className="px-0"
                />
              );
            })}
          </div>
        </div>
      </div>

      <Footer
        buttons={[
          {
            id: 'home',
            icon: <Home className="h-6 w-6" />,
            label: 'Home',
            children: 'Home',
            isActive: true
          },
          {
            id: 'card',
            icon: <CreditCard className="h-6 w-6" />,
            label: 'Card',
            children: 'Card',
            isActive: false
          },
          {
            id: 'recipients',
            icon: <Users className="h-6 w-6" />,
            label: 'Recipients',
            children: 'Recipients',
            isActive: false,
            onClick: handleRecipients
          },
          {
            id: 'payments',
            icon: <Repeat className="h-6 w-6" />,
            label: 'Payments',
            children: 'Payments',
            isActive: false
          }
        ]}
        layout="navigation"
      />
    </motion.div>
  );
});