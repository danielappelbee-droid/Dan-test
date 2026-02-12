import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRightLeft, ReceiptText } from 'lucide-react';
import Button from '../../components/Button';
import ListItem from '../../components/ListItem';
import { getAllTransactions, Transaction } from '../../utils/transactionData';

interface TransactionsViewProps {
  onBack: () => void;
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

const formatTransactionAmount = (transaction: Transaction): { large: string; small?: string } => {
  const prefix = getAmountPrefix(transaction.type);
  const large = `${prefix}${transaction.amount} ${transaction.currency}`;
  
  if (transaction.convertedAmount && transaction.convertedCurrency) {
    const small = `${transaction.convertedAmount} ${transaction.convertedCurrency}`;
    return { large, small };
  }
  
  return { large };
};

const isPositiveTransaction = (type: string): boolean => {
  return type === 'received' || type === 'moved';
};

export const TransactionsView: React.FC<TransactionsViewProps> = ({ 
  onBack, 
  animationDirection,
  isExiting = false
}) => {
  const transactions = getAllTransactions();

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
    return animationDirection === 'right' ? 'hiddenRight' : 'hiddenLeft';
  };

  const getExitVariant = () => {
    return animationDirection === 'left' ? 'exitLeft' : 'exitRight';
  };

  const groupTransactionsByMonth = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    const previousDate = new Date(currentDate);
    previousDate.setMonth(previousDate.getMonth() - 1);
    const previousMonth = previousDate.toLocaleString('default', { month: 'long' });
    const previousYear = previousDate.getFullYear();
    
    transactions.forEach(transaction => {
      const date = transaction.date;
      let monthKey: string;
      
      if (['Today', 'Yesterday'].includes(date)) {
        monthKey = `${currentMonth} ${currentYear}`;
      } else if (date.includes('day') && !['Today', 'Yesterday'].includes(date)) {
        monthKey = `${currentMonth} ${currentYear}`;
      } else {
        const dayMatch = date.match(/^\d+/);
        if (dayMatch) {
          const transactionDate = new Date(currentDate);
          transactionDate.setDate(transactionDate.getDate() - Math.floor(Math.random() * 30 + 30));
          
          if (transactionDate.getMonth() === currentDate.getMonth()) {
            monthKey = `${currentMonth} ${currentYear}`;
          } else {
            monthKey = `${previousMonth} ${previousYear}`;
          }
        } else {
          monthKey = `${previousMonth} ${previousYear}`;
        }
      }
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(transaction);
    });
    
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (a.includes(currentMonth.toString()) && a.includes(currentYear.toString())) return -1;
      if (b.includes(currentMonth.toString()) && b.includes(currentYear.toString())) return 1;
      return new Date(b).getTime() - new Date(a).getTime();
    });
    
    const sortedGrouped: { [key: string]: Transaction[] } = {};
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key];
    });
    
    return sortedGrouped;
  };

  const groupedTransactions = groupTransactionsByMonth(transactions);

  return (
    <motion.div 
      key="transactions-view"
      className="h-full bg-wise-background-screen flex flex-col"
      variants={slideVariants}
      initial={getInitialVariant()}
      animate="visible"
      exit={getExitVariant()}
    >
      <div className="px-4 py-4 flex items-center gap-4">
        <Button
          variant="neutral-grey"
          size="large"
          iconOnly
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-2xl font-bold text-wise-content-primary">
          Transactions
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([monthKey, monthTransactions]) => (
            <div key={monthKey}>
              <h6 className="text-base font-medium text-wise-content-tertiary mb-2">
                {monthKey}
              </h6>
              <div className="border-t border-wise-border-neutral mb-4"></div>
              <div className="space-y-2 pb-8">
                {monthTransactions.map((transaction) => {
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
          ))}
        </div>
      </div>
    </motion.div>
  );
};