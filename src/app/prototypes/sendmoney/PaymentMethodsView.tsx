import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Landmark, Zap, CreditCard, ReceiptText } from 'lucide-react';
import Image from 'next/image';
import Button from '../../components/Button';
import { PaymentMethod, FeeCalculation } from '../../utils/feeService';
import { Currency, formatCurrencyAmount } from '../../utils/currencyService';

interface PaymentMethodsViewProps {
  feeCalculation: FeeCalculation;
  fromAmount: string;
  fromCurrency: Currency;
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  onBack: () => void;
  animationDirection?: 'left' | 'right';
  isExiting?: boolean;
}

const ApplePayIcon = React.memo(function ApplePayIcon() {
  return (
    <Image 
      src="/apple-pay.svg" 
      alt="Apple Pay" 
      width={20} 
      height={20} 
      className="object-contain"
    />
  );
});

const WiseIcon = React.memo(function WiseIcon() {
  return (
    <Image 
      src="/wise.svg" 
      alt="Wise" 
      width={20} 
      height={20} 
      className="object-contain"
    />
  );
});

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Landmark': return Landmark;
    case 'Zap': return Zap;
    case 'CreditCard': return CreditCard;
    case 'ReceiptText': return ReceiptText;
    case 'ApplePay': return ApplePayIcon;
    case 'Wise': return WiseIcon;
    default: return Landmark;
  }
};

export const PaymentMethodsView: React.FC<PaymentMethodsViewProps> = ({
  feeCalculation,
  fromAmount,
  fromCurrency,
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onBack,
  animationDirection = 'right',
  isExiting = false
}) => {
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
    return animationDirection === 'right' ? 'exitLeft' : 'exitRight';
  };

  return (
    <motion.div 
      key="payment-methods"
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
          Paying with
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {feeCalculation.availablePaymentMethods.map((method) => {
            const IconComponent = getIcon(method.icon);
            const isSelected = selectedPaymentMethod?.id === method.id;
            const feeAmount = (parseFloat(fromAmount) * method.fee / 100);
            const formattedFeeAmount = formatCurrencyAmount(feeAmount, fromCurrency.code, { includeCode: false });
            
            return (
              <motion.button
                key={method.id}
                onClick={() => !method.disabled && onPaymentMethodSelect(method)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
                  isSelected
                    ? 'border-wise-content-tertiary'
                    : 'border-transparent hover:border-wise-border-neutral'
                } ${method.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                whileHover={!method.disabled ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
                whileTap={!method.disabled ? { scale: 0.98, transition: { duration: 0.1 } } : {}}
                disabled={method.disabled}
              >
                <div className="w-10 h-10 bg-wise-background-neutral rounded-full flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-wise-content-secondary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-wise-content-primary">{method.name}</p>
                  <p className="text-sm text-wise-content-tertiary">
                    {method.description}
                    {!method.disabled && (
                      <>
                        .{' '}
                        <span className="text-wise-content-secondary font-semibold">
                          {formattedFeeAmount} {fromCurrency.code}
                        </span>{' '}
                        fee. Arrives{' '}
                        <span className="text-wise-content-secondary font-semibold">
                          {method.arrivalTime}
                        </span>
                        .
                      </>
                    )}
                  </p>
                </div>
                {!method.disabled && (
                  <ChevronRight className="h-4 w-4 text-wise-content-tertiary" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};