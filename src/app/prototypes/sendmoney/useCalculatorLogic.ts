import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { CalculatorState, initialCalculatorState } from './CalculatorState';
import { CURRENCIES, convertCurrency, Currency } from '../../utils/currencyService';
import { calculateFees, formatFeeDisplay, PaymentMethod } from '../../utils/feeService';
import { getErrorState } from '../../utils/errorService';
import { metaResearchService } from '../../utils/metaResearchService';

const CURRENCY_THRESHOLDS: Record<string, { tier1: number; tier2: number; tier3?: number }> = {
  USD: { tier1: 25000, tier2: 1250000 },
  GBP: { tier1: 20000, tier2: 1000000, tier3: 50000 },
  AUD: { tier1: 40000, tier2: 2000000 },
  CAD: { tier1: 35000, tier2: 1800000 },
  CHF: { tier1: 20000, tier2: 1000000 },
  EUR: { tier1: 22000, tier2: 1100000 },
  NZD: { tier1: 44000, tier2: 2200000 },
  SGD: { tier1: 30000, tier2: 1700000 },
  JPY: { tier1: 3600000, tier2: 180000000 },
  HKD: { tier1: 196000, tier2: 9800000 },
  INR: { tier1: 2142500, tier2: 107125000 },
  BRL: { tier1: 135750, tier2: 6787500 },
  PHP: { tier1: 1407750, tier2: 70387500 },
  HUF: { tier1: 8493500, tier2: 424675000 },
  MYR: { tier1: 105750, tier2: 5287500 },
  MXN: { tier1: 469750, tier2: 23487500 }
};

const CURRENCY_RATES: Record<string, number> = {
  USD: 1.000,
  EUR: 0.850,
  GBP: 0.730,
  JPY: 144.190,
  AUD: 1.520,
  CAD: 1.360,
  CHF: 0.790,
  HKD: 7.850,
  SGD: 1.270,
  NZD: 1.640,
  MXN: 18.790,
  INR: 85.700,
  BRL: 5.430,
  PHP: 56.310,
  HUF: 339.740,
  MYR: 4.230
};

function getThresholds(currency: string): { tier1: number; tier2: number; tier3?: number } {
  if (CURRENCY_THRESHOLDS[currency]) {
    return CURRENCY_THRESHOLDS[currency];
  }

  const rate = CURRENCY_RATES[currency];
  if (!rate) {
    return CURRENCY_THRESHOLDS.USD;
  }

  const usdThresholds = CURRENCY_THRESHOLDS.USD;
  return {
    tier1: usdThresholds.tier1 * rate,
    tier2: usdThresholds.tier2 * rate
  };
}

function dismissMobileKeyboard() {
  if (typeof window !== 'undefined') {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement && (activeElement.type === 'text' || activeElement.type === 'number' || activeElement.inputMode === 'decimal')) {
      activeElement.blur();
    }
    
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[inputmode="decimal"]');
    inputs.forEach(input => {
      (input as HTMLInputElement).blur();
    });
  }
}

export const useCalculatorLogic = (
  controlType: 'segmented' | 'radio' | 'switch' | 'button' | 'tips' | 'pathway' | 'nudge' | 'prompt' | null = null,
  initialAmount?: string | null,
  initialFrom?: string | null,
  initialTo?: string | null
) => {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>(() => {
    const currencyDefaults = metaResearchService.getCalculatorCurrencyDefaults();
    const fromCurrency = initialFrom
      ? CURRENCIES.find(c => c.code === initialFrom.toUpperCase()) || CURRENCIES[2]
      : CURRENCIES.find(c => c.code === currencyDefaults.fromCurrency) || CURRENCIES[2];
    const toCurrency = initialTo
      ? CURRENCIES.find(c => c.code === initialTo.toUpperCase()) || CURRENCIES[0]
      : CURRENCIES.find(c => c.code === currencyDefaults.toCurrency) || CURRENCIES[0];

    return {
      ...initialCalculatorState,
      fromCurrency,
      toCurrency,
      fromAmount: initialAmount || "0",
      controlType,
      hasBeenFocused: !!initialAmount && parseFloat(initialAmount) > 0
    };
  });

  const conversionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keyboardDismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdatedFieldRef = useRef<'from' | 'to'>('from');
  const hasInitializedRef = useRef(false);

  const amount = useMemo(() => parseFloat(calculatorState.fromAmount) || 0, [calculatorState.fromAmount]);
  
  const thresholds = useMemo(() => {
    return getThresholds(calculatorState.fromCurrency.code);
  }, [calculatorState.fromCurrency.code]);

  const isVeryLargeAmount = useMemo(() => {
    return amount > thresholds.tier2;
  }, [amount, thresholds.tier2]);

  const isLargeGBPAmount = useMemo(() => {
    return calculatorState.fromCurrency.code === 'GBP' &&
           thresholds.tier3 !== undefined &&
           amount > thresholds.tier3;
  }, [amount, calculatorState.fromCurrency.code, thresholds.tier3]);
  
  const feeCalculation = useMemo(() => {
    return calculateFees(amount, calculatorState.fromCurrency.code, calculatorState.selectedPaymentMethod?.id);
  }, [amount, calculatorState.fromCurrency.code, calculatorState.selectedPaymentMethod?.id]);
  
  const feeDisplay = useMemo(() => {
    return formatFeeDisplay(feeCalculation, calculatorState.fromCurrency.code);
  }, [feeCalculation, calculatorState.fromCurrency.code]);

  const discountAmount = useMemo(() => {
    return feeCalculation.discountCalculation?.discountAmount || 0;
  }, [feeCalculation.discountCalculation?.discountAmount]);

  const hasDiscount = useMemo(() => {
    return feeCalculation.discountCalculation?.hasDiscount || false;
  }, [feeCalculation.discountCalculation?.hasDiscount]);

  // Handle initial conversion when amount is provided via URL
  useEffect(() => {
    if (!hasInitializedRef.current && initialAmount && parseFloat(initialAmount) > 0) {
      hasInitializedRef.current = true;
      const converted = convertCurrency(parseFloat(initialAmount), calculatorState.fromCurrency.code, calculatorState.toCurrency.code);
      setCalculatorState(prev => ({
        ...prev,
        toAmount: converted.toFixed(2)
      }));
    }
  }, [initialAmount, calculatorState.fromCurrency.code, calculatorState.toCurrency.code]);

  const handleShowOverlay = useCallback(() => {
    const newErrorState = getErrorState(
      amount,
      calculatorState.fromCurrency.code,
      calculatorState.errorState.randomizedTime,
      calculatorState.errorState,
      () => {}
    );
    
    if (newErrorState.overlayConfig) {
      setCalculatorState(prev => ({
        ...prev,
        showOverlay: true,
        overlayConfig: newErrorState.overlayConfig!
      }));
    }
  }, [amount, calculatorState.fromCurrency.code, calculatorState.errorState]);

  const handleCloseOverlay = useCallback(() => {
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }
    
    setCalculatorState(prev => ({
      ...prev,
      showOverlay: false,
      overlayConfig: null,
      errorState: {
        ...prev.errorState,
        showOverlay: false,
        overlayConfig: undefined,
        overlayShown: true
      }
    }));
  }, []);

  useEffect(() => {
    const newErrorState = getErrorState(
      amount, 
      calculatorState.fromCurrency.code,
      calculatorState.errorState.randomizedTime,
      calculatorState.errorState,
      handleShowOverlay
    );
    
    if (calculatorState.errorState.type !== newErrorState.type || 
        calculatorState.errorState.showAlert !== newErrorState.showAlert ||
        calculatorState.errorState.showMessage !== newErrorState.showMessage ||
        calculatorState.errorState.hideCalculatorDetails !== newErrorState.hideCalculatorDetails) {
      
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      if (keyboardDismissTimeoutRef.current) {
        clearTimeout(keyboardDismissTimeoutRef.current);
      }
      
      if (newErrorState.showAlert || newErrorState.showMessage) {
        if (calculatorState.isLoading) {
          keyboardDismissTimeoutRef.current = setTimeout(() => {
            dismissMobileKeyboard();
          }, 800);
          
          setTimeout(() => {
            setCalculatorState(prev => ({
              ...prev,
              errorState: {
                ...newErrorState,
                overlayShown: prev.errorState.overlayShown || newErrorState.overlayShown
              }
            }));
          }, 1400);
        } else {
          dismissMobileKeyboard();
          setCalculatorState(prev => ({
            ...prev,
            errorState: {
              ...newErrorState,
              overlayShown: prev.errorState.overlayShown || newErrorState.overlayShown
            }
          }));
        }
      } else {
        setCalculatorState(prev => ({
          ...prev,
          errorState: {
            ...newErrorState,
            overlayShown: prev.errorState.overlayShown || newErrorState.overlayShown
          }
        }));
      }

      if (newErrorState.showOverlay && newErrorState.overlayConfig && !calculatorState.errorState.overlayShown) {
        if (calculatorState.isLoading) {
          overlayTimeoutRef.current = setTimeout(() => {
            setCalculatorState(prev => ({
              ...prev,
              showOverlay: true,
              overlayConfig: newErrorState.overlayConfig || null
            }));
          }, 1200);
        } else {
          overlayTimeoutRef.current = setTimeout(() => {
            setCalculatorState(prev => ({
              ...prev,
              showOverlay: true,
              overlayConfig: newErrorState.overlayConfig || null
            }));
          }, 100);
        }
      } else if (!newErrorState.showOverlay) {
        setCalculatorState(prev => ({
          ...prev,
          showOverlay: false,
          overlayConfig: null
        }));
      }
    }
  }, [
    amount, 
    calculatorState.fromCurrency.code, 
    calculatorState.errorState.type, 
    calculatorState.errorState.showAlert, 
    calculatorState.errorState.showMessage, 
    calculatorState.errorState.hideCalculatorDetails,
    calculatorState.errorState,
    calculatorState.isLoading,
    calculatorState.errorState.overlayShown,
    handleShowOverlay
  ]);

  useEffect(() => {
    const currentSelectedId = calculatorState.selectedPaymentMethod?.id;
    
    const isCurrentMethodAvailable = feeCalculation.availablePaymentMethods.some(
      method => method.id === currentSelectedId && !method.disabled
    );

    const shouldUpdatePaymentMethod = !calculatorState.selectedPaymentMethod || 
                                      !isCurrentMethodAvailable || 
                                      calculatorState.selectedPaymentMethod.id !== feeCalculation.defaultPaymentMethod.id;

    if (shouldUpdatePaymentMethod) {
      setCalculatorState(prev => ({
        ...prev,
        selectedPaymentMethod: feeCalculation.defaultPaymentMethod
      }));
    }
  }, [amount, calculatorState.fromCurrency.code, feeCalculation.defaultPaymentMethod, feeCalculation.availablePaymentMethods, calculatorState.selectedPaymentMethod]);

  const performConversion = useCallback((sourceAmount: string, sourceField: 'from' | 'to', skipLoading = false) => {
    if (conversionTimeoutRef.current) {
      clearTimeout(conversionTimeoutRef.current);
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }

    const numAmount = parseFloat(sourceAmount) || 0;

    if (numAmount > 0 && !skipLoading) {
      setCalculatorState(prev => ({ ...prev, isLoading: true }));

      loadingTimeoutRef.current = setTimeout(() => {
        setCalculatorState(prev => {
          const newState = { ...prev, isLoading: false };

          if (sourceField === 'from') {
            const converted = convertCurrency(numAmount, prev.fromCurrency.code, prev.toCurrency.code);
            newState.toAmount = converted.toFixed(2);
          } else {
            const converted = convertCurrency(numAmount, prev.toCurrency.code, prev.fromCurrency.code);
            newState.fromAmount = converted.toFixed(2);
          }

          return newState;
        });
      }, 2000);
    } else if (numAmount === 0 && sourceAmount === '') {
      // User is editing and field is empty - don't reset the other field
      setCalculatorState(prev => ({ ...prev, isLoading: false }));
    } else {
      setCalculatorState(prev => ({ ...prev, isLoading: false }));
      conversionTimeoutRef.current = setTimeout(() => {
        setCalculatorState(prev => {
          if (sourceField === 'from') {
            return { ...prev, toAmount: "0" };
          } else {
            return { ...prev, fromAmount: "0" };
          }
        });
      }, 200);
    }
  }, []);

  const handleFromAmountChange = useCallback((value: string) => {
    const currentNumericValue = parseFloat(calculatorState.fromAmount) || 0;
    const newNumericValue = parseFloat(value) || 0;
    
    setCalculatorState(prev => ({ ...prev, fromAmount: value }));
    lastUpdatedFieldRef.current = 'from';
    
    if (currentNumericValue !== newNumericValue) {
      const skipLoading = calculatorState.focusedInput !== 'from';
      performConversion(value, 'from', skipLoading);
    }
  }, [performConversion, calculatorState.focusedInput, calculatorState.fromAmount]);

  const handleToAmountChange = useCallback((value: string) => {
    const currentNumericValue = parseFloat(calculatorState.toAmount) || 0;
    const newNumericValue = parseFloat(value) || 0;
    
    setCalculatorState(prev => ({ ...prev, toAmount: value }));
    lastUpdatedFieldRef.current = 'to';
    
    if (currentNumericValue !== newNumericValue) {
      const skipLoading = calculatorState.focusedInput !== 'to';
      performConversion(value, 'to', skipLoading);
    }
  }, [performConversion, calculatorState.focusedInput, calculatorState.toAmount]);

  const handleFromFocus = useCallback(() => {
    setCalculatorState(prev => ({ 
      ...prev, 
      focusedInput: 'from',
      hasBeenFocused: true
    }));
  }, []);

  const handleFromBlur = useCallback(() => {
    setCalculatorState(prev => ({ ...prev, focusedInput: null }));
  }, []);

  const handleToFocus = useCallback(() => {
    setCalculatorState(prev => ({ 
      ...prev, 
      focusedInput: 'to',
      hasBeenFocused: true
    }));
  }, []);

  const handleToBlur = useCallback(() => {
    setCalculatorState(prev => ({ ...prev, focusedInput: null }));
  }, []);

  const handleFromCurrencyChange = useCallback((code: string) => {
    const currency = CURRENCIES.find(c => c.code === code);
    if (currency) {
      setCalculatorState(prev => ({ 
        ...prev, 
        fromCurrency: currency
      }));
      const currentAmount = lastUpdatedFieldRef.current === 'from' ? calculatorState.fromAmount : calculatorState.toAmount;
      setTimeout(() => {
        performConversion(currentAmount, lastUpdatedFieldRef.current);
      }, 100);
    }
  }, [calculatorState.fromAmount, calculatorState.toAmount, performConversion]);

  const handleToCurrencyChange = useCallback((code: string) => {
    const currency = CURRENCIES.find(c => c.code === code);
    if (currency) {
      setCalculatorState(prev => ({ ...prev, toCurrency: currency }));
      const currentAmount = lastUpdatedFieldRef.current === 'from' ? calculatorState.fromAmount : calculatorState.toAmount;
      setTimeout(() => {
        performConversion(currentAmount, lastUpdatedFieldRef.current);
      }, 100);
    }
  }, [calculatorState.fromAmount, calculatorState.toAmount, performConversion]);

  const handleCurrencySelect = useCallback((currency: Currency, type: 'from' | 'to') => {
    setCalculatorState(prev => ({
      ...prev,
      [type === 'from' ? 'fromCurrency' : 'toCurrency']: currency,
      showCurrencyPicker: null
    }));
    
    const currentAmount = lastUpdatedFieldRef.current === 'from' ? calculatorState.fromAmount : calculatorState.toAmount;
    setTimeout(() => {
      performConversion(currentAmount, lastUpdatedFieldRef.current);
    }, 100);
  }, [calculatorState.fromAmount, calculatorState.toAmount, performConversion]);

  const handlePaymentMethodSelect = useCallback((method: PaymentMethod) => {
    setCalculatorState(prev => ({
      ...prev,
      selectedPaymentMethod: method,
      animationDirection: 'left',
      showPaymentMethods: false,
      isLoading: true
    }));

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      setCalculatorState(prev => ({ ...prev, isLoading: false }));
    }, 2000);
  }, []);

  const handleShowPaymentMethods = useCallback(() => {
    setCalculatorState(prev => ({
      ...prev,
      animationDirection: 'right',
      showPaymentMethods: true
    }));
  }, []);

  const handleBackFromPaymentMethods = useCallback(() => {
    setCalculatorState(prev => ({
      ...prev,
      animationDirection: 'left',
      showPaymentMethods: false
    }));
  }, []);

  const handleRandomizedTimeUpdate = useCallback((newDisplay: string) => {
    setCalculatorState(prev => {
      if (prev.errorState.type !== 'usd_market_hours' || !prev.errorState.randomizedTime) {
        return prev;
      }
      
      const updatedTime = {
        ...prev.errorState.randomizedTime,
        display: newDisplay
      };
      
      const newErrorState = getErrorState(
        amount,
        calculatorState.fromCurrency.code,
        updatedTime,
        prev.errorState,
        handleShowOverlay
      );
      
      return {
        ...prev,
        errorState: {
          ...prev.errorState,
          randomizedTime: updatedTime
        },
        overlayConfig: newErrorState.overlayConfig || null
      };
    });
  }, [amount, calculatorState.fromCurrency.code, handleShowOverlay]);

  const handleContinue = useCallback(() => {
    console.log('Continue with transfer:', {
      from: calculatorState.fromAmount,
      to: calculatorState.toAmount,
      fromCurrency: calculatorState.fromCurrency.code,
      toCurrency: calculatorState.toCurrency.code,
      paymentMethod: calculatorState.selectedPaymentMethod?.name,
      discount: {
        hasDiscount,
        discountAmount,
        tier: feeCalculation.discountCalculation?.tier || 'none'
      }
    });
  }, [calculatorState, hasDiscount, discountAmount, feeCalculation.discountCalculation?.tier]);

  useEffect(() => {
    return () => {
      if (conversionTimeoutRef.current) {
        clearTimeout(conversionTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      if (keyboardDismissTimeoutRef.current) {
        clearTimeout(keyboardDismissTimeoutRef.current);
      }
    };
  }, []);

  return {
    calculatorState,
    setCalculatorState,
    amount,
    isVeryLargeAmount,
    isLargeGBPAmount,
    feeCalculation,
    feeDisplay,
    discountAmount,
    hasDiscount,
    handleFromAmountChange,
    handleToAmountChange,
    handleFromFocus,
    handleFromBlur,
    handleToFocus,
    handleToBlur,
    handleFromCurrencyChange,
    handleToCurrencyChange,
    handleCurrencySelect,
    handlePaymentMethodSelect,
    handleShowPaymentMethods,
    handleBackFromPaymentMethods,
    handleCloseOverlay,
    handleShowOverlay,
    handleRandomizedTimeUpdate,
    handleContinue
  };
};