import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, HelpCircle, File } from 'lucide-react';
import ListItem from '../../components/ListItem';
import Chips from '../../components/Chips';
import Button from '../../components/Button';
import { OverlaySnippet } from '../../components/OverlaySnippet';
import { getPrioritizedChips } from '../../utils/chipsService';
import { getSnippetData, SnippetData } from '../../utils/snippetService';
import { taskService } from '../../utils/taskService';

interface VerificationMainViewProps {
  onBack?: () => void;
  onHelp?: () => void;
  onNavigateTo?: (route: string) => void;
}

export const VerificationMainView = React.memo<VerificationMainViewProps>(function VerificationMainView({ onBack, onHelp, onNavigateTo }) {
  const [showSnippet, setShowSnippet] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState<SnippetData | null>(null);
  const [taskStates, setTaskStates] = useState<{ [key: string]: 'todo' | 'pending' | 'done' }>({
    'bank-statements': 'todo',
    'financial-statements': 'todo'
  });
  
  const financialStatementRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const prioritizedChips = useMemo(() => getPrioritizedChips('verification', handleChipClick), []);

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
    if (onHelp) {
      onHelp();
    } else {
      console.log('Help button clicked');
    }
  };

  const handleTaskClick = (taskId: string) => {
    if (taskStates[taskId] === 'todo') {
      setTaskStates(prev => ({ ...prev, [taskId]: 'pending' }));
      
      if (taskId === 'bank-statements') {
        taskService.setBankStatementsStarted();
      } else if (taskId === 'financial-statements') {
        taskService.setFinancialStatementsStarted();
      }
      
      setTimeout(() => {
        setTaskStates(prev => ({ ...prev, [taskId]: 'done' }));
        
        // Auto-scroll to financial statement when bank statement is verified
        if (taskId === 'bank-statements') {
          setTimeout(() => {
            if (financialStatementRef.current && scrollContainerRef.current) {
              const containerRect = scrollContainerRef.current.getBoundingClientRect();
              const elementRect = financialStatementRef.current.getBoundingClientRect();
              const scrollTop = scrollContainerRef.current.scrollTop;
              const targetScrollTop = scrollTop + (elementRect.top - containerRect.top) - 100; // 100px offset from top
              
              // Smoother custom scroll animation
              const startScrollTop = scrollContainerRef.current.scrollTop;
              const distance = targetScrollTop - startScrollTop;
              const duration = 1200; // Longer duration for softer scroll
              let start: number | null = null;
              
              const smoothScroll = (timestamp: number) => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for softer scroll (ease-in-out cubic)
                const easeInOutCubic = progress < 0.5
                  ? 4 * progress * progress * progress
                  : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                scrollContainerRef.current!.scrollTop = startScrollTop + (distance * easeInOutCubic);
                
                if (progress < 1) {
                  requestAnimationFrame(smoothScroll);
                }
              };
              
              requestAnimationFrame(smoothScroll);
            }
          }, 1000); // 1 second pause before scrolling
        }
      }, 5000);
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

  const handleDone = () => {
    if (onNavigateTo) {
      onNavigateTo('/prototypes/checklist');
    } else {
      console.log('Navigate to checklist');
    }
  };

  const getBadgeVariant = (taskId: string) => {
    const state = taskStates[taskId];
    if (state === 'done') return 'done';
    if (state === 'pending') return 'pending';
    return 'attention';
  };

  const getSubtitle = (taskId: string) => {
    const state = taskStates[taskId];
    if (state === 'done') return 'Verified';
    if (state === 'pending') return 'In review';
    
    if (taskId === 'bank-statements') {
      return '3 months of transactions';
    } else if (taskId === 'financial-statements') {
      return 'Annual tax statement';
    }
    
    return 'Required';
  };

  const verificationTasks = [
    {
      id: 'bank-statements',
      title: 'Bank statements',
      subtitle: getSubtitle('bank-statements'),
      whatToDo: 'Export a .pdf or take a picture and upload a copy of recent bank statements.',
      whyAsking: 'As part of standard regulatory checks, we need your most up-to-date details.'
    },
    {
      id: 'financial-statements',
      title: 'Financial statements',
      subtitle: getSubtitle('financial-statements'),
      whatToDo: 'Export a .pdf or take a picture and upload a copy of a recent annual tax return.'
    }
  ];

  const allTasksVerified = Object.values(taskStates).every(state => state === 'done');

  return (
    <>
      <motion.div 
        key="verification-main"
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

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4">
          <div className="mb-6 mt-6">
            <h1 className="font-wise text-wise-content-primary mb-6 text-left" style={{ fontSize: '2.5rem', lineHeight: '0.9' }}>
              VERIFY YOUR<br />TRANSFER
            </h1>
            
            <p className="text-wise-content-secondary text-base leading-relaxed mb-4">
              We need to confirm your details. It&apos;s part of how we&apos;re regulated and helps keep your money safe.
            </p>

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
            <div className="px-4 pt-8 pb-24">
              <h3 className="text-sm font-semibold text-wise-content-primary mb-4 ml-4">
                Tasks
              </h3>
              
              <div className="space-y-6">
                {verificationTasks.map((task) => (
                  <div 
                    key={task.id} 
                    ref={task.id === 'financial-statements' ? financialStatementRef : undefined}
                    className="bg-wise-background-primary rounded-xl overflow-hidden">
                    <ListItem
                      avatar={{
                        size: 48,
                        type: 'icon',
                        content: <File className="h-5 w-5" />,
                        badges: [{ type: 'icon' as const, iconVariant: getBadgeVariant(task.id) }]
                      }}
                      content={{
                        largeText: task.title,
                        smallText: task.subtitle
                      }}
                      rightElement={{
                        type: 'chevron'
                      }}
                      onClick={() => handleTaskClick(task.id)}
                      className="rounded-b-none cursor-pointer"
                    />
                    
                    <div
                      className="rounded-b-xl px-4 pb-4 mt-2 relative"
                      style={{ 
                        marginLeft: '4px', 
                        marginRight: '4px',
                        backgroundColor: 'var(--wise-interactive-neutral-grey-mid)'
                      }}
                    >
                      <div className="space-y-4 pt-4">
                        <div>
                          <h6 className="text-sm font-semibold text-wise-content-primary mb-2">
                            What to do
                          </h6>
                          <p className="text-sm text-wise-content-secondary leading-relaxed">
                            {task.whatToDo}
                          </p>
                        </div>
                        
                        {task.whyAsking && (
                          <>
                            <div>
                              <div className="border-t border-wise-border-neutral"></div>
                            </div>
                            
                            <div>
                              <h6 className="text-sm font-semibold text-wise-content-primary mb-2">
                                Why we&apos;re asking
                              </h6>
                              <p className="text-sm text-wise-content-secondary leading-relaxed">
                                {task.whyAsking}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {allTasksVerified && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-wise-border-neutral px-4 py-4 z-50">
            <Button 
              variant="primary" 
              size="large" 
              className="w-full"
              onClick={handleDone}
            >
              Done
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
      </AnimatePresence>
    </>
  );
});