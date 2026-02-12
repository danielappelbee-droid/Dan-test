import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeft, Home, CreditCard, Users, Repeat } from 'lucide-react';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import ListItem from '../../components/ListItem';
import Footer from '../../components/Footer';
import { getAllRecipients, RecipientProfile } from '../../utils/recipientData';
import { taskService } from '../../utils/taskService';
import { PrototypeRoute, navigationService } from '../../utils/navigationService';

interface RecipientMainViewProps {
  onBack?: () => void;
  onNavigateToChecklist?: () => void;
  onNavigateTo?: (route: PrototypeRoute) => void;
  onNavigateToHome?: () => void;
}

export const RecipientMainView = React.memo<RecipientMainViewProps>(function RecipientMainView({ 
  onBack, 
  onNavigateToChecklist,
  onNavigateTo,
  onNavigateToHome 
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'my-accounts'>('all');
  
  const recentRecipients = getAllRecipients().slice(0, 6);
  const allRecipients = getAllRecipients();
  const filteredRecipients = allRecipients.slice(6);
  
  // Check if we came from home to determine if we should show bottom navigation
  const previousRoute = navigationService.getPreviousRoute();
  const showBottomNavigation = previousRoute === '/prototypes/home' || previousRoute === '/prototypes/home/transactions';

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

  const handleNavigateHome = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      console.log('Navigate to home clicked');
    }
  };

  const handleRecipientSelect = (recipient: RecipientProfile) => {
    // Check if we're coming from checklist by looking at navigation history
    const previousRoute = navigationService.getPreviousRoute();
    const isFromChecklist = previousRoute === '/prototypes/checklist';
    
    if (isFromChecklist) {
      // Coming from checklist - set recipient and go back to checklist (regardless of task completion status)
      taskService.setRecipientSelected(recipient);
      if (onNavigateToChecklist) {
        onNavigateToChecklist();
      } else {
        console.log('Go back to checklist with recipient:', recipient.name);
      }
      return;
    }

    // For non-checklist flows, check task completion status
    const hasAnyCompleted = taskService.getTaskState().addMoneyCompleted || 
                           taskService.getTaskState().recipientCompleted || 
                           (taskService.getTaskState().bankStatementsCompleted && taskService.getTaskState().financialStatementsCompleted);
    
    if (!hasAnyCompleted) {
      // Coming from home with no tasks completed - navigate to calculator and mark for completion
      taskService.setPendingRecipientCompletion(recipient);
      if (onNavigateTo) {
        onNavigateTo('/prototypes/calculator');
      } else {
        console.log('Navigate to calculator with recipient:', recipient.name);
      }
    } else {
      // Normal flow - set recipient and navigate to checklist
      taskService.setRecipientSelected(recipient);
      if (onNavigateToChecklist) {
        onNavigateToChecklist();
      } else if (typeof window !== 'undefined') {
        // Fallback navigation - this should not normally be reached
        // as onNavigateToChecklist should be provided
        console.log('Navigate to checklist with recipient:', recipient.name);
      }
    }
  };

  return (
    <>
      <motion.div 
        className={`h-full bg-wise-background-screen flex flex-col ${showBottomNavigation ? 'pb-20' : ''}`}
        variants={slideVariants}
        initial="visible"
        animate="visible"
      >
        <div className="px-4 py-4 flex justify-between items-center">
          <Button
            variant="neutral-grey"
            size="large"
            iconOnly
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button variant="primary" size="small">
            Add recipient
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-wise text-wise-content-primary mb-6" style={{ fontSize: '2.5rem', lineHeight: '0.9' }}>
              WHO ARE YOU<br />SENDING TO?
            </h1>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-wise-content-primary mb-4">
              Recents
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {recentRecipients.map((recipient) => {
                const badges = recipient.badges?.map(badge => {
                  if (badge.flag) {
                    return { type: 'flag' as const, src: badge.flag, alt: 'Flag' };
                  } else if (badge.type === 'image' && badge.src) {
                    return { type: 'image' as const, src: badge.src, alt: 'Bank' };
                  } else if (badge.icon && badge.iconVariant === 'wise') {
                    return { type: 'icon' as const, iconVariant: 'wise' as const };
                  } else if (badge.icon) {
                    return { 
                      type: 'icon' as const, 
                      iconVariant: badge.iconVariant || 'todo' as const
                    };
                  }
                  return null;
                }).filter((badge): badge is NonNullable<typeof badge> => badge !== null) || [];

                return (
                  <button
                    key={recipient.id}
                    onClick={() => handleRecipientSelect(recipient)}
                    className="flex flex-col items-center p-3 hover:bg-wise-background-neutral rounded-xl transition-colors"
                  >
                    <div className="mb-3">
                      <Avatar
                        size={72}
                        type={recipient.avatar ? 'image' : 'initials'}
                        src={recipient.avatar}
                        content={recipient.initials}
                        alt={recipient.name}
                        badges={badges}
                      />
                    </div>
                    <div className="text-center w-full">
                      <p className="font-semibold text-wise-content-primary text-sm mb-1 truncate">
                        {recipient.name}
                      </p>
                      <p className="text-wise-content-tertiary text-xs truncate">
                        {recipient.handle || `•• ${recipient.accountNumber}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant={activeTab === 'all' ? 'neutral-grey' : 'neutral-grey'}
                size="small"
                onClick={() => setActiveTab('all')}
                className={activeTab === 'all' ?
                  'bg-wise-interactive-neutral-grey-light border-wise-border-neutral' :
                  'bg-transparent border-transparent text-wise-content-tertiary'
                }
              >
                All
              </Button>
              
              <Button
                variant={activeTab === 'my-accounts' ? 'neutral-grey' : 'neutral-grey'}
                size="small"
                onClick={() => setActiveTab('my-accounts')}
                className={activeTab === 'my-accounts' ?
                  'bg-wise-interactive-neutral-grey-light border-wise-border-neutral' :
                  'bg-transparent border-transparent text-wise-content-tertiary'
                }
              >
                My accounts
              </Button>

              <div className="ml-auto">
                <Button
                  variant="neutral-grey"
                  size="small"
                  iconOnly
                  onClick={() => console.log('Search clicked')}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              {filteredRecipients.map((recipient) => {
                const badges = recipient.badges?.map(badge => {
                  if (badge.flag) {
                    return { type: 'flag' as const, src: badge.flag, alt: 'Flag' };
                  } else if (badge.type === 'image' && badge.src) {
                    return { type: 'image' as const, src: badge.src, alt: 'Bank' };
                  } else if (badge.icon && badge.iconVariant === 'wise') {
                    return { type: 'icon' as const, iconVariant: 'wise' as const };
                  } else if (badge.icon) {
                    return { 
                      type: 'icon' as const, 
                      iconVariant: badge.iconVariant || 'todo' as const
                    };
                  }
                  return null;
                }).filter((badge): badge is NonNullable<typeof badge> => badge !== null) || [];

                return (
                  <ListItem
                    key={recipient.id}
                    avatar={{
                      size: 48,
                      type: recipient.avatar ? 'image' : 'initials',
                      src: recipient.avatar,
                      content: recipient.initials,
                      alt: recipient.name,
                      badges: badges
                    }}
                    content={{
                      largeText: recipient.name,
                      smallText: recipient.handle || `•• ${recipient.accountNumber}`
                    }}
                    rightElement={{
                      type: 'chevron'
                    }}
                    onClick={() => handleRecipientSelect(recipient)}
                    className="px-0"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
      
      {showBottomNavigation && (
        <Footer
          buttons={[
            {
              id: 'home',
              icon: <Home className="h-6 w-6" />,
              label: 'Home',
              children: 'Home',
              isActive: false,
              onClick: handleNavigateHome
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
              isActive: true
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
      )}
    </>
  );
});