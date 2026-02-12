import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import { CURRENCIES, Currency } from '../../utils/currencyService';

interface CurrencyPickerViewProps {
  pickerType: 'from' | 'to';
  onCurrencySelect: (currency: Currency, type: 'from' | 'to') => void;
  onClose: () => void;
}

export const CurrencyPickerView: React.FC<CurrencyPickerViewProps> = ({
  pickerType,
  onCurrencySelect,
  onClose
}) => {
  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8
  };

  const currencySlideVariants = {
    hiddenDown: {
      y: "100%",
      transition: springTransition
    },
    visible: {
      y: 0,
      transition: springTransition
    },
    exitDown: {
      y: "100%",
      transition: springTransition
    }
  };

  return (
    <motion.div
      key="currency-picker"
      className="absolute inset-0 bg-wise-background-screen flex flex-col z-50 pb-20"
      variants={currencySlideVariants}
      initial="hiddenDown"
      animate="visible"
      exit="exitDown"
    >
      <div className="px-4 py-4 flex justify-between items-center">
        <Button
          variant="neutral-grey"
          size="large"
          iconOnly
          onClick={onClose}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="font-semibold text-wise-content-primary font-body">
          Select currency
        </div>

        <div className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {CURRENCIES.map((currency) => (
            <motion.button
              key={currency.code}
              onClick={() => onCurrencySelect(currency, pickerType)}
              className="w-full flex items-center gap-4 p-4 hover:bg-wise-background-neutral rounded-xl transition-colors"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            >
              <Image
                src={currency.flag}
                alt={currency.name}
                width={32}
                height={32}
                className="rounded-sm"
              />
              <div className="flex-1 text-left">
                <p className="font-semibold text-wise-content-primary">{currency.name}</p>
                <p className="text-sm text-wise-content-tertiary">{currency.code}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Footer
        buttons={[
          {
            id: 'done',
            variant: 'primary',
            size: 'large',
            children: 'Done',
            onClick: onClose
          }
        ]}
        layout="single"
      />
    </motion.div>
  );
};