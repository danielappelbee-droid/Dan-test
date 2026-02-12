/**
 * Core Screen: Selection Screen
 *
 * Choose from a list of options with radio or card selection.
 * Copy this to your prototype and customize as needed.
 *
 * @example
 * ```tsx
 * <SelectionScreen
 *   title="Choose payment method"
 *   description="Select how you'd like to pay"
 *   options={[
 *     { id: "bank", title: "Bank transfer", subtitle: "2-3 days", icon: Bank },
 *     { id: "card", title: "Debit card", subtitle: "Instant", icon: CreditCard }
 *   ]}
 *   selectedId="bank"
 *   onSelect={(option) => console.log(option)}
 *   onContinue={() => {}}
 * />
 * ```
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, ChevronLeft, Check } from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';

export interface SelectionOption {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  disabled?: boolean;
  metadata?: Record<string, any>;
}

export interface SelectionScreenProps {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Selection options */
  options: SelectionOption[];
  /** Currently selected option ID */
  selectedId?: string;
  /** Selection change handler */
  onSelect: (option: SelectionOption) => void;
  /** Back button handler */
  onBack?: () => void;
  /** Continue button handler */
  onContinue?: () => void;
  /** Continue button text */
  continueText?: string;
  /** Require selection before continuing */
  requireSelection?: boolean;
  /** Show as card or list style */
  style?: 'card' | 'list';
  /** Animation direction */
  animationDirection?: 'left' | 'right';
}

export default function SelectionScreen({
  title,
  description,
  options,
  selectedId,
  onSelect,
  onBack,
  onContinue,
  continueText = "Continue",
  requireSelection = true,
  style = 'card',
  animationDirection = 'right'
}: SelectionScreenProps) {
  const canContinue = !requireSelection || selectedId !== undefined;

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
      </div>

      {/* Options */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="space-y-3 mt-4">
          {options.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedId === option.id;

            if (style === 'card') {
              return (
                <motion.button
                  key={option.id}
                  onClick={() => !option.disabled && onSelect(option)}
                  disabled={option.disabled}
                  className={`w-full text-left rounded-[32px] p-6 border-2 transition-all ${
                    isSelected
                      ? 'border-wise-interactive-primary bg-wise-background-neutral'
                      : 'border-wise-border-neutral bg-wise-background-elevated hover:border-wise-interactive-secondary'
                  } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={!option.disabled ? { scale: 1.01 } : {}}
                  whileTap={!option.disabled ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-start gap-4">
                    {Icon && (
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-6 h-6 text-wise-content-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-wise-content-primary">
                          {option.title}
                        </h3>
                        {option.badge && (
                          <span className="text-xs bg-wise-interactive-accent text-wise-interactive-primary px-2 py-1 rounded-full">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.subtitle && (
                        <p className="text-sm text-wise-content-secondary">
                          {option.subtitle}
                        </p>
                      )}
                      {option.description && (
                        <p className="text-sm text-wise-content-tertiary mt-2">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-wise-interactive-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            }
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
