import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Button from './Button';
import { metaResearchService } from '../utils/metaResearchService';
import { formatCurrencyAmount } from '../utils/currencyService';
import { calculateFees } from '../utils/feeService';

interface CalculatorData {
  fromAmount: string;
  toAmount: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
}

interface OverlaySuccessProps {
  onClose: () => void;
}

export const OverlaySuccess: React.FC<OverlaySuccessProps> = ({
  onClose
}) => {
  const [illustrationSize, setIllustrationSize] = useState({ width: 280, height: 280 });
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
  const [accountType, setAccountType] = useState<'Personal' | 'Business'>('Personal');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountCurrency, setDiscountCurrency] = useState('GBP');
  const [hasDiscount, setHasDiscount] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8
  };

  const overlaySlideVariants = {
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

  const contentBounceVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const checkMobileFrame = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isMobile = window.innerWidth < 1024;
    setIsMobileFrame(!isMobile);
  }, []);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current || !headerRef.current || !footerRef.current || !contentRef.current) {
      return;
    }

    const containerHeight = containerRef.current.clientHeight;
    const headerHeight = headerRef.current.clientHeight;
    const footerHeight = footerRef.current.clientHeight;
    
    const availableHeight = containerHeight - headerHeight - footerHeight;
    const contentPadding = 64;
    const textPadding = 136;
    
    const maxImageHeight = availableHeight - contentPadding - textPadding;
    const maxImageWidth = containerRef.current.clientWidth - 128;
    
    const targetSize = Math.min(300, Math.max(200, Math.min(maxImageHeight, maxImageWidth)));
    
    setIllustrationSize({
      width: targetSize,
      height: targetSize
    });
  }, []);

  const loadCalculatorData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const data = window.sessionStorage.getItem('calculatorData');
      if (data) {
        const parsed: CalculatorData = JSON.parse(data);
        setCalculatorData(parsed);
        
        // Calculate discount based on the amount and currency
        const amount = parseFloat(parsed.fromAmount) || 0;
        if (amount > 0) {
          const feeCalculation = calculateFees(amount, parsed.fromCurrency);
          const discount = feeCalculation.discountCalculation?.discountAmount || 0;
          const hasDiscountValue = feeCalculation.discountCalculation?.hasDiscount || false;
          
          setDiscountAmount(discount);
          setDiscountCurrency(parsed.fromCurrency);
          setHasDiscount(hasDiscountValue);
        }
      }
    } catch (e) {
      console.warn('Could not load calculator data:', e);
    }
  }, []);

  const loadResearchData = useCallback(() => {
    const config = metaResearchService.getConfiguration();
    if (config.accountType) {
      setAccountType(config.accountType);
    }
  }, []);

  const getIllustration = () => {
    const isPersonal = accountType === 'Personal';
    return isPersonal 
      ? '/illos/Confetti • Personal.png' 
      : '/illos/Confetti • Business.png';
  };

  const formatAmountDisplay = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    return formatCurrencyAmount(numAmount, currency, { includeCode: false });
  };

  const handleDone = () => {
    // Clear localStorage and sessionStorage
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch (e) {
        console.warn('Could not clear storage:', e);
      }
    }
    
    // Navigate to /research instead of resetting prototype
    window.location.href = '/research';
  };

  useEffect(() => {
    checkMobileFrame();
    loadCalculatorData();
    loadResearchData();
    
    const timer = setTimeout(() => {
      calculateLayout();
    }, 100);

    const handleResize = () => {
      checkMobileFrame();
      calculateLayout();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateLayout, checkMobileFrame, loadCalculatorData, loadResearchData]);

  return (
    <motion.div 
      key="overlay-success"
      ref={containerRef}
      className="fixed inset-0 flex flex-col z-50 overflow-hidden"
      style={{ 
        backgroundColor: '#163300',
        borderRadius: isMobileFrame ? '2.5rem' : '0'
      }}
      variants={overlaySlideVariants}
      initial="hiddenDown"
      animate="visible"
      exit="exitDown"
    >
      <div ref={headerRef} className="absolute top-0 left-0 right-0 px-4 py-4 flex items-center pt-16 flex-shrink-0 z-10 bg-transparent">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <X className="h-5 w-5" style={{ color: '#9FE870' }} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 min-h-0 overflow-y-auto pt-24">
        <motion.div
          ref={contentRef}
          variants={contentBounceVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full text-center flex-1 justify-center py-8"
        >
          <div className="flex-shrink-0 mb-2 w-full flex justify-center">
            <Image
              src={getIllustration()}
              alt="Success Confetti"
              width={illustrationSize.width}
              height={illustrationSize.height}
              className="object-contain"
              style={{
                width: `${illustrationSize.width}px`,
                height: `${illustrationSize.height}px`,
                maxWidth: '100%'
              }}
            />
          </div>
          
          <div className="flex flex-col items-center w-full text-center space-y-6">
            <h2 className="font-wise text-center leading-tight" style={{ fontSize: '3.8rem', lineHeight: '0.9', color: '#9FE870' }}>
              ALL DONE
            </h2>
            
            <div className="text-white leading-relaxed text-center max-w-xs space-y-2">
              {calculatorData && (
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">{formatAmountDisplay(calculatorData.fromAmount, calculatorData.fromCurrency)} {calculatorData.fromCurrency}</span> to <span className="font-semibold">{formatAmountDisplay(calculatorData.toAmount, calculatorData.toCurrency)} {calculatorData.toCurrency}</span>
                  </div>
                  {hasDiscount && discountAmount > 0 && (
                    <div>
                      You saved <span className="font-semibold">{formatAmountDisplay(discountAmount.toString(), discountCurrency)} {discountCurrency}</span> with discounts
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={footerRef} className="flex-shrink-0 px-6 pb-8">
        <Button
          variant="primary"
          size="large"
          onClick={handleDone}
          className="w-full"
        >
          Done
        </Button>
      </div>
    </motion.div>
  );
};