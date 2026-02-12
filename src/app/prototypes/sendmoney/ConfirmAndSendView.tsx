import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import Image from 'next/image';

interface ConfirmAndSendViewProps {
  onBack: () => void;
  onConfirm: () => void;
  animationDirection: 'left' | 'right';
  isExiting?: boolean;
}

export const ConfirmAndSendView = React.memo<ConfirmAndSendViewProps>(function ConfirmAndSendView({
  onBack,
  onConfirm,
  animationDirection,
  isExiting = false
}) {
  // Load data from sessionStorage
  const [calculatorData, setCalculatorData] = React.useState<any>(null);
  const [selectedRecipient, setSelectedRecipient] = React.useState<any>(null);
  const [showCollapsedTitle, setShowCollapsedTitle] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load calculator data
      const storedCalculatorData = window.sessionStorage.getItem('calculatorData');
      if (storedCalculatorData) {
        try {
          setCalculatorData(JSON.parse(storedCalculatorData));
        } catch (e) {
          console.warn('Could not parse calculator data:', e);
        }
      }

      // Load recipient data
      const storedRecipient = window.sessionStorage.getItem('selectedRecipient');
      if (storedRecipient) {
        try {
          setSelectedRecipient(JSON.parse(storedRecipient));
        } catch (e) {
          console.warn('Could not parse recipient data:', e);
        }
      }
    }
  }, []);

  // Handle scroll to show/hide collapsed title
  React.useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        // Show collapsed title when scrolled past the large title
        setShowCollapsedTitle(scrollTop > 60);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

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

  const recipientName = selectedRecipient?.name || 'Henrique Gusso';
  const fromAmount = calculatorData?.fromAmount || '0.01';
  const fromCurrency = calculatorData?.fromCurrency || 'GBP';
  const toAmount = calculatorData?.toAmount || '0.01';
  const toCurrency = calculatorData?.toCurrency || 'GBP';

  return (
    <motion.div
      key="confirm-and-send"
      className="h-full bg-wise-background-screen flex flex-col"
      variants={slideVariants}
      initial={getInitialVariant()}
      animate="visible"
      exit={getExitVariant()}
    >
      {/* Header with collapsed title */}
      <div className="flex-shrink-0 bg-wise-background-screen sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3 relative">
          <Button
            variant="neutral-grey"
            size="large"
            iconOnly
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Collapsed title - appears when scrolling */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: showCollapsedTitle ? 1 : 0,
              y: showCollapsedTitle ? 0 : -10
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h2 className="text-base font-semibold text-wise-content-primary">Confirm and send</h2>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto max-h-[700px]" ref={contentRef}>
        <div className="px-4">
          <h1 className="text-4xl font-bold text-wise-content-primary mb-8">Confirm and send</h1>

        {/* Payment method section */}
        <div className="mb-8">
          <h2 className="text-wise-content-tertiary text-sm mb-4">Payment method</h2>
          <div className="flex items-center gap-3 py-4 border-b border-wise-border-neutral">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              <Image src="/flags/United Kingdom.svg" alt="GBP" width={48} height={48} className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-wise-content-primary">Main account / GBP</p>
              <p className="text-sm text-wise-content-tertiary">10.02 GBP available</p>
            </div>
          </div>
        </div>

        {/* Transfer details section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-wise-content-tertiary text-sm">Transfer details</h2>
            <button className="text-wise-link-content text-sm font-semibold underline">
              Change
            </button>
          </div>

          <div className="">
            <div className="flex items-center justify-between py-2">
              <span className="text-wise-content-primary">You send exactly</span>
              <span className="text-wise-content-primary">{fromAmount} {fromCurrency}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-wise-content-primary">Total fees (included)</span>
              <span className="text-wise-content-primary">0 {fromCurrency}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-wise-border-neutral pb-4">
              <span className="text-wise-content-primary">{recipientName} gets</span>
              <span className="text-wise-content-primary">{toAmount} {toCurrency}</span>
            </div>
          </div>
        </div>

        {/* Recipient details section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-wise-content-tertiary text-sm">Recipient details</h2>
            <button className="text-wise-link-content text-sm font-semibold underline">
              Change
            </button>
          </div>

          <div className="">
            <div className="flex items-center justify-between py-2">
              <span className="text-wise-content-primary">Account holder name</span>
              <span className="text-wise-content-primary text-right">{recipientName}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-wise-border-neutral pb-4">
              <span className="text-wise-content-primary">Account provider</span>
              <span className="text-wise-content-primary">Wise</span>
            </div>
          </div>
        </div>

        {/* Schedule details section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-wise-content-tertiary text-sm">Schedule details</h2>
            <button className="text-wise-link-content text-sm font-semibold underline">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-wise-content-primary">Sending</span>
            <span className="text-wise-content-primary">Now</span>
          </div>
        </div>
        </div>
      </div>

      {/* Confirm and send button - fixed to bottom */}
      <div className="flex-shrink-0 px-4 py-4 bg-wise-background-screen border-t border-wise-border-neutral fixed bottom-0 left-0 right-0">
        <Button
          variant="primary"
          size="large"
          onClick={onConfirm}
          className="w-full"
        >
          Confirm and send
        </Button>
      </div>
    </motion.div>
  );
});
