/**
 * Core Screen: Progress Tracker
 *
 * Checklist or stepper for tracking progress through a flow.
 * Copy this to your prototype and customize as needed.
 *
 * @example
 * ```tsx
 * <ProgressTracker
 *   title="Setup checklist"
 *   items={[
 *     { id: "1", title: "Verify email", completed: true },
 *     { id: "2", title: "Add payment method", completed: false, current: true },
 *     { id: "3", title: "Make first transfer", completed: false }
 *   ]}
 *   onItemClick={(item) => console.log(item)}
 * />
 * ```
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, Circle, ChevronRight } from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';

export interface ProgressItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current?: boolean;
  locked?: boolean;
  onClick?: () => void;
}

export interface ProgressTrackerProps {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Progress items */
  items: ProgressItem[];
  /** Back button handler */
  onBack?: () => void;
  /** Item click handler */
  onItemClick?: (item: ProgressItem) => void;
  /** Continue button handler */
  onContinue?: () => void;
  /** Continue button text */
  continueText?: string;
  /** Show continue only when all complete */
  requireAllComplete?: boolean;
  /** Display style */
  style?: 'checklist' | 'stepper';
  /** Animation direction */
  animationDirection?: 'left' | 'right';
}

export default function ProgressTracker({
  title,
  description,
  items,
  onBack,
  onItemClick,
  onContinue,
  continueText = "Continue",
  requireAllComplete = false,
  style = 'checklist',
  animationDirection = 'right'
}: ProgressTrackerProps) {
  const allComplete = items.every(item => item.completed);
  const canContinue = !requireAllComplete || allComplete;

  const slideVariants = {
    enter: {
      x: animationDirection === 'right' ? '100%' : '-100%',
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-wise-background-screen flex flex-col"
      variants={slideVariants}
      initial="enter"
      animate="center"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-wise-background-neutral rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-wise-content-primary" />
            </button>
          )}
          <h1 className="font-wise text-2xl">{title}</h1>
        </div>
        {description && (
          <p className="text-wise-content-secondary mt-2">{description}</p>
        )}

        {/* Progress Bar (for stepper style) */}
        {style === 'stepper' && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-wise-content-secondary mb-2">
              <span>Step {items.findIndex(i => i.current) + 1} of {items.length}</span>
              <span>{items.filter(i => i.completed).length} / {items.length} complete</span>
            </div>
            <div className="h-2 bg-wise-background-neutral rounded-full overflow-hidden">
              <div
                className="h-full bg-wise-interactive-primary transition-all duration-500"
                style={{
                  width: `${(items.filter(i => i.completed).length / items.length) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className={style === 'stepper' ? 'space-y-0' : 'space-y-3 mt-4'}>
          {items.map((item, index) => {
            const isClickable = !item.locked && (item.onClick || onItemClick);

            if (style === 'stepper') {
              return (
                <div key={item.id} className="flex items-start gap-4 py-4">
                  {/* Step Indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-wise-interactive-primary text-white'
                          : item.current
                          ? 'bg-wise-interactive-accent text-wise-interactive-primary border-2 border-wise-interactive-primary'
                          : 'bg-wise-background-neutral text-wise-content-tertiary'
                      }`}
                    >
                      {item.completed ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>
                    {index < items.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[40px] ${
                        item.completed ? 'bg-wise-interactive-primary' : 'bg-wise-border-neutral'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <button
                    onClick={() => isClickable && (item.onClick?.() || onItemClick?.(item))}
                    disabled={!isClickable || item.locked}
                    className={`flex-1 text-left ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <h3 className={`font-semibold ${
                      item.completed || item.current
                        ? 'text-wise-content-primary'
                        : 'text-wise-content-secondary'
                    }`}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-wise-content-tertiary mt-1">
                        {item.description}
                      </p>
                    )}
                  </button>

                  {isClickable && !item.locked && (
                    <ChevronRight className="w-5 h-5 text-wise-content-tertiary mt-2" />
                  )}
                </div>
              );
            }

            // Checklist style
            return (
              <motion.button
                key={item.id}
                onClick={() => isClickable && (item.onClick?.() || onItemClick?.(item))}
                disabled={!isClickable || item.locked}
                className={`w-full text-left rounded-[32px] p-6 border transition-all ${
                  item.completed
                    ? 'border-wise-interactive-primary bg-wise-background-neutral'
                    : item.current
                    ? 'border-wise-interactive-accent bg-wise-background-elevated'
                    : 'border-wise-border-neutral bg-wise-background-elevated'
                } ${isClickable && !item.locked ? 'hover:border-wise-interactive-secondary cursor-pointer' : 'cursor-default'} ${
                  item.locked ? 'opacity-50' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isClickable && !item.locked ? { scale: 1.01 } : {}}
                whileTap={isClickable && !item.locked ? { scale: 0.99 } : {}}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-1">
                    {item.completed ? (
                      <div className="w-6 h-6 rounded-full bg-wise-interactive-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-wise-content-tertiary" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      item.completed
                        ? 'text-wise-content-primary'
                        : 'text-wise-content-primary'
                    }`}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-wise-content-secondary mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {isClickable && !item.locked && (
                    <ChevronRight className="w-5 h-5 text-wise-content-tertiary flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer with Continue Button */}
      {onContinue && (
        <div className="px-6 pb-6">
          <Button
            variant="primary"
            size="large"
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full"
          >
            {continueText}
          </Button>
        </div>
      )}

      <Footer />
    </motion.div>
  );
}
