"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { Landmark, Lock, Headset, Banknote, FileText } from "lucide-react";
import { useCalculatorLogic } from "./useCalculatorLogic";
import { CalculatorMainView } from "./CalculatorMainView";
import { PaymentMethodsView } from "./PaymentMethodsView";
import { CurrencyPickerView } from "./CurrencyPickerView";
import { OverlayView } from "../../components/OverlayView";
import { BottomSheet } from "../../components/BottomSheet";
import { navigationService } from "../../utils/navigationService";
import { PaymentMethod } from "../../utils/feeService";
import { getArrivalByText } from "../../utils/dateService";

const getNext11Months = (): string[] => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const months: string[] = [];

  for (let i = 1; i <= 11; i++) {
    const monthIndex = (currentMonth + i) % 12;
    months.push(monthNames[monthIndex]);
  }

  return months;
};

const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth < 768;
};

function CalculatorContent() {
  const MONTHS = getNext11Months();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const controlType = searchParams.get('control') as 'segmented' | 'radio' | 'switch' | 'button' | 'tips' | 'pathway' | 'nudge' | 'prompt' | null;
  const amount = searchParams.get('amount');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const tipsChoice = searchParams.get('tipsChoice') as 'yes' | 'no' | null;

  const showPaymentMethods = view === 'payment-methods';

  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isExiting, setIsExiting] = useState(false);
  const tipsTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastShownAmountRef = React.useRef<{ from: string; to: string; paymentMethodId: string }>({ from: '', to: '', paymentMethodId: '' });
  const previousLoadingStateRef = React.useRef<boolean | null>(null);

  const {
    calculatorState,
    setCalculatorState,
    amount: calculatedAmount,
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
    handleCloseOverlay,
    handleShowOverlay
  } = useCalculatorLogic(controlType, amount, from, to);

  useEffect(() => {
    const currentPath = showPaymentMethods ? '/prototypes/calculator/payment-methods' : '/prototypes/calculator';
    navigationService.pushRoute(currentPath);
  }, [showPaymentMethods]);

  // Initialize tipsUserChoice from URL parameter
  useEffect(() => {
    if (tipsChoice && controlType === 'tips') {
      setCalculatorState(prev => ({
        ...prev,
        tipsUserChoice: tipsChoice
      }));
    }
  }, [tipsChoice, controlType, setCalculatorState]);

  const handleShowPaymentMethods = () => {
    setAnimationDirection('right');
    setIsExiting(false);
    const params = new URLSearchParams();
    params.set('view', 'payment-methods');
    if (controlType) params.set('control', controlType);
    if (amount) params.set('amount', amount);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (calculatorState.tipsUserChoice) params.set('tipsChoice', calculatorState.tipsUserChoice);
    router.push(`/prototypes/calculator?${params.toString()}`);
  };

  const handleBackFromPaymentMethods = () => {
    setAnimationDirection('left');
    setIsExiting(true);

    setTimeout(() => {
      const params = new URLSearchParams();
      if (controlType) params.set('control', controlType);
      if (amount) params.set('amount', amount);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (calculatorState.tipsUserChoice) params.set('tipsChoice', calculatorState.tipsUserChoice);
      router.push(`/prototypes/calculator?${params.toString()}`);
      setIsExiting(false);
    }, 50);
  };

  const handleBack = () => {
    router.push('/prototypes/');
  };

  const handleContinue = () => {
    // If control is tips and user selected "Yes", show the now modal instead
    if (controlType === 'tips' && calculatorState.tipsUserChoice === 'yes') {
      setCalculatorState(prev => ({
        ...prev,
        showTipsNowModal: true
      }));
    }
    // If control is nudge with large GBP, show the now modal
    else if (controlType === 'nudge' && isLargeGBPAmount) {
      setCalculatorState(prev => ({
        ...prev,
        showTipsNowModal: true
      }));
    }
    // If control is prompt with large GBP, show the now modal
    else if (controlType === 'prompt' && isLargeGBPAmount) {
      setCalculatorState(prev => ({
        ...prev,
        showTipsNowModal: true
      }));
    }
    // If control is segmented and set to "now", show the now modal
    else if (controlType === 'segmented' && calculatorState.arrivalTiming === 'now' && isLargeGBPAmount) {
      setCalculatorState(prev => ({
        ...prev,
        showTipsNowModal: true
      }));
    }
    // If control is segmented and set to "later" (month), show the later modal
    else if (controlType === 'segmented' && calculatorState.arrivalTiming === 'month' && isLargeGBPAmount) {
      setCalculatorState(prev => ({
        ...prev,
        showTipsLaterModal: true
      }));
    }
    // If control is button with large GBP, show the now modal
    else if (controlType === 'button' && isLargeGBPAmount) {
      setCalculatorState(prev => ({
        ...prev,
        showTipsNowModal: true
      }));
    } else {
      const params = new URLSearchParams();
      if (controlType) params.set('control', controlType);
      if (amount) params.set('amount', amount);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (calculatorState.tipsUserChoice) params.set('tipsChoice', calculatorState.tipsUserChoice);
      const queryString = params.toString();
      router.push(`/prototypes/reason${queryString ? `?${queryString}` : ''}`);
    }
  };

  const handlePaymentMethodSelectWithNav = (method: PaymentMethod) => {
    handlePaymentMethodSelect(method);

    setAnimationDirection('left');
    setIsExiting(true);

    setTimeout(() => {
      const params = new URLSearchParams();
      if (controlType) params.set('control', controlType);
      if (amount) params.set('amount', amount);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (calculatorState.tipsUserChoice) params.set('tipsChoice', calculatorState.tipsUserChoice);
      router.push(`/prototypes/calculator?${params.toString()}`);
      setIsExiting(false);
    }, 50);
  };

  const handleArrivalTimingChange = (timing: 'now' | 'later' | 'week' | 'month') => {
    if (controlType === 'segmented') {
      // Map 'later' to 'month' for segmented
      const mappedTiming = timing === 'later' ? 'month' : timing;

      // Only trigger loading if the timing is actually changing
      if (calculatorState.arrivalTiming !== mappedTiming) {
        setCalculatorState(prev => ({ ...prev, isLoading: true }));

        setTimeout(() => {
          setCalculatorState(prev => ({
            ...prev,
            arrivalTiming: mappedTiming,
            isLoading: false
          }));
        }, 800);
      }
    } else {
      setCalculatorState(prev => ({ ...prev, arrivalTiming: timing }));
    }
  };

  const handleShowBottomSheet = () => {
    // For control=button with large GBP, show Later modal instead
    if (controlType === 'button' && isLargeGBPAmount) {
      setCalculatorState(prev => ({ ...prev, showTipsLaterModal: true }));
    } else {
      setCalculatorState(prev => ({ ...prev, showBottomSheet: true }));
    }
  };

  const handleCloseBottomSheet = () => {
    setCalculatorState(prev => ({ ...prev, showBottomSheet: false }));
  };

  const handleSelectSendNow = () => {
    setCalculatorState(prev => ({
      ...prev,
      scheduledMonth: null,
      showBottomSheet: false
    }));
  };

  const handleSelectMonth = (month: string) => {
    setCalculatorState(prev => ({
      ...prev,
      scheduledMonth: month,
      showBottomSheet: false
    }));
  };

  // Tips bottom sheet handlers
  const handleCloseTipsBottomSheet = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsBottomSheet: false
    }));
  };

  const handleTipsNowClick = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsBottomSheet: false,
      tipsUserChoice: 'yes',
      isLoading: true
    }));

    // Show loading state briefly to give feedback
    setTimeout(() => {
      setCalculatorState(prev => ({
        ...prev,
        isLoading: false
      }));
    }, 800);
  };

  const handleTipsLaterClick = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsBottomSheet: false,
      tipsUserChoice: 'no'
    }));
    // Show Later modal after a brief delay
    setTimeout(() => {
      setCalculatorState(prev => ({
        ...prev,
        showTipsLaterModal: true
      }));
    }, 600);
  };

  const handleCloseTipsNowModal = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsNowModal: false
    }));
  };

  const handleCloseTipsLaterModal = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsLaterModal: false
    }));
  };

  const handleTipsNowContinue = () => {
    handleCloseTipsNowModal();

    // For pathway variant, set the choice and show normal calculator
    if (controlType === 'pathway') {
      setCalculatorState(prev => ({
        ...prev,
        pathwayUserChoice: 'now'
      }));
    } else {
      const params = new URLSearchParams();
      if (controlType) params.set('control', controlType);
      if (amount) params.set('amount', amount);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (calculatorState.tipsUserChoice) params.set('tipsChoice', calculatorState.tipsUserChoice);
      const queryString = params.toString();
      router.push(`/prototypes/reason${queryString ? `?${queryString}` : ''}`);
    }
  };

  const handleAddMoney = () => {
    handleCloseTipsLaterModal();

    // For pathway variant, set the choice and show normal calculator
    if (controlType === 'pathway') {
      setCalculatorState(prev => ({
        ...prev,
        pathwayUserChoice: 'later'
      }));
    }
  };

  const handlePathwaySendNow = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsNowModal: true
    }));
  };

  const handlePathwayLater = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsLaterModal: true
    }));
  };

  const handleNudgeLearnMore = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsLaterModal: true
    }));
  };

  const handlePromptLearnMore = () => {
    setCalculatorState(prev => ({
      ...prev,
      showTipsLaterModal: true
    }));
  };

  const handleNudgeClose = () => {
    // Just a no-op for now, or could track dismissal in state if needed
  };

  const clearTipsTimer = React.useCallback(() => {
    if (tipsTimerRef.current) {
      clearTimeout(tipsTimerRef.current);
      tipsTimerRef.current = null;
    }
  }, []);

  const triggerTipsBottomSheet = React.useCallback(() => {
    const numAmount = parseFloat(calculatorState.fromAmount) || 0;
    const isGBP = calculatorState.fromCurrency.code === 'GBP';
    const isOverThreshold = numAmount > 50000;
    const currentPaymentMethodId = calculatorState.selectedPaymentMethod?.id || '';

    // Don't trigger if overlays are open
    const hasOverlaysOpen = showPaymentMethods || calculatorState.showCurrencyPicker !== null;

    // Only trigger if amount OR payment method has changed since last shown
    const hasAmountChanged =
      calculatorState.fromAmount !== lastShownAmountRef.current.from ||
      calculatorState.toAmount !== lastShownAmountRef.current.to;
    const hasPaymentMethodChanged =
      currentPaymentMethodId !== lastShownAmountRef.current.paymentMethodId;
    const hasAnythingChanged = hasAmountChanged || hasPaymentMethodChanged;

    console.log('[Tips Timer] Trigger check:', {
      isGBP,
      isOverThreshold,
      hasAmountChanged,
      hasPaymentMethodChanged,
      hasAnythingChanged,
      hasOverlaysOpen,
      showPaymentMethods,
      showCurrencyPicker: calculatorState.showCurrencyPicker,
      lastShown: lastShownAmountRef.current,
      current: {
        from: calculatorState.fromAmount,
        to: calculatorState.toAmount,
        paymentMethodId: currentPaymentMethodId
      }
    });

    if (controlType === 'tips' && isGBP && isOverThreshold && hasAnythingChanged && !hasOverlaysOpen) {
      console.log('[Tips Timer] 🎉 TRIGGERING MODAL');
      setCalculatorState(prev => ({ ...prev, showTipsBottomSheet: true }));
      lastShownAmountRef.current = {
        from: calculatorState.fromAmount,
        to: calculatorState.toAmount,
        paymentMethodId: currentPaymentMethodId
      };
      clearTipsTimer();
    } else if (hasOverlaysOpen) {
      console.log('[Tips Timer] ⏸️ Overlays open, not triggering');
    }
  }, [calculatorState.fromAmount, calculatorState.toAmount, calculatorState.fromCurrency.code, calculatorState.selectedPaymentMethod?.id, calculatorState.showCurrencyPicker, showPaymentMethods, controlType, clearTipsTimer, setCalculatorState]);

  const startTipsTimer = React.useCallback(() => {
    clearTipsTimer();
    tipsTimerRef.current = setTimeout(() => {
      triggerTipsBottomSheet();
    }, 2000);
  }, [clearTipsTimer, triggerTipsBottomSheet]);

  // Simple logic: After loading completes, start 2s timer if conditions met
  useEffect(() => {
    if (controlType !== 'tips') return;

    const wasLoading = previousLoadingStateRef.current;
    const isLoadingNow = calculatorState.isLoading;
    const loadingJustCompleted = wasLoading === true && !isLoadingNow;

    console.log('[Tips Timer] Loading check:', {
      wasLoading,
      isLoadingNow,
      loadingJustCompleted,
      controlType
    });

    // Update ref for next check
    previousLoadingStateRef.current = isLoadingNow;

    if (calculatorState.isLoading) {
      console.log('[Tips Timer] Loading in progress, clearing timer');
      clearTipsTimer();
      return;
    }

    // After loading completes, check conditions and start timer
    if (loadingJustCompleted) {
      const numAmount = parseFloat(calculatorState.fromAmount) || 0;
      const isGBP = calculatorState.fromCurrency.code === 'GBP';
      const isOverThreshold = numAmount > 50000;

      console.log('[Tips Timer] Loading completed, checking conditions:', {
        numAmount,
        isGBP,
        isOverThreshold
      });

      if (isGBP && isOverThreshold) {
        const isMobile = isMobileDevice();

        // Desktop: Always start timer after loading
        if (!isMobile) {
          console.log('[Tips Timer] Desktop: Starting 2s timer');
          startTipsTimer();
        }
        // Mobile: Only start timer if not focused (number pad closed)
        else if (!calculatorState.focusedInput) {
          console.log('[Tips Timer] Mobile: Starting 2s timer (number pad closed)');
          startTipsTimer();
        } else {
          console.log('[Tips Timer] Mobile: Number pad open, waiting for blur');
        }
      }
    }

    return () => clearTipsTimer();
  }, [calculatorState.isLoading, calculatorState.focusedInput, calculatorState.fromAmount, calculatorState.fromCurrency.code, controlType, startTipsTimer, clearTipsTimer]);

  // Mobile only: Start timer after blur (number pad closed)
  useEffect(() => {
    if (controlType !== 'tips') return;

    const isMobile = isMobileDevice();
    if (!isMobile) return;

    const numAmount = parseFloat(calculatorState.fromAmount) || 0;
    const isGBP = calculatorState.fromCurrency.code === 'GBP';
    const isOverThreshold = numAmount > 50000;

    // When user closes number pad on mobile
    if (!calculatorState.focusedInput && !calculatorState.isLoading && isGBP && isOverThreshold) {
      startTipsTimer();
    }
  }, [calculatorState.focusedInput, calculatorState.isLoading, calculatorState.fromAmount, calculatorState.fromCurrency.code, controlType, startTipsTimer]);

  // Unfocus input when modal appears on desktop
  useEffect(() => {
    if (controlType !== 'tips') return;

    if (calculatorState.showTipsBottomSheet) {
      const isMobile = isMobileDevice();

      // On desktop, unfocus the input when modal appears
      if (!isMobile && calculatorState.focusedInput) {
        const activeElement = document.activeElement as HTMLInputElement;
        if (activeElement && (activeElement.type === 'text' || activeElement.type === 'number' || activeElement.inputMode === 'decimal')) {
          activeElement.blur();
        }
      }
    }
  }, [calculatorState.showTipsBottomSheet, calculatorState.focusedInput, controlType]);


  return (
    <>
      <div className="h-full relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {showPaymentMethods ? (
            <PaymentMethodsView
              key="payment-methods"
              feeCalculation={feeCalculation}
              fromAmount={calculatorState.fromAmount}
              fromCurrency={calculatorState.fromCurrency}
              selectedPaymentMethod={calculatorState.selectedPaymentMethod}
              onPaymentMethodSelect={handlePaymentMethodSelectWithNav}
              onBack={handleBackFromPaymentMethods}
              animationDirection={animationDirection}
              isExiting={isExiting}
            />
          ) : (
            <CalculatorMainView
              key="calculator-main"
              fromAmount={calculatorState.fromAmount}
              toAmount={calculatorState.toAmount}
              fromCurrency={calculatorState.fromCurrency}
              toCurrency={calculatorState.toCurrency}
              selectedPaymentMethod={calculatorState.selectedPaymentMethod}
              feeDisplay={feeDisplay}
              amount={calculatedAmount}
              isLoading={calculatorState.isLoading}
              controlType={calculatorState.controlType}
              focusedInput={calculatorState.focusedInput}
              hasBeenFocused={calculatorState.hasBeenFocused}
              isVeryLargeAmount={isVeryLargeAmount}
              isLargeGBPAmount={isLargeGBPAmount}
              errorState={calculatorState.errorState}
              discountAmount={discountAmount}
              hasDiscount={hasDiscount}
              arrivalTiming={calculatorState.arrivalTiming}
              scheduledMonth={calculatorState.scheduledMonth}
              pathwayUserChoice={calculatorState.pathwayUserChoice}
              onFromAmountChange={handleFromAmountChange}
              onToAmountChange={handleToAmountChange}
              onFromCurrencyChange={handleFromCurrencyChange}
              onToCurrencyChange={handleToCurrencyChange}
              onFromCurrencyClick={() => setCalculatorState(prev => ({ ...prev, showCurrencyPicker: 'from' }))}
              onToCurrencyClick={() => setCalculatorState(prev => ({ ...prev, showCurrencyPicker: 'to' }))}
              onFromFocus={handleFromFocus}
              onFromBlur={handleFromBlur}
              onToFocus={handleToFocus}
              onToBlur={handleToBlur}
              onShowPaymentMethods={handleShowPaymentMethods}
              onContinue={handleContinue}
              onShowOverlay={handleShowOverlay}
              onArrivalTimingChange={handleArrivalTimingChange}
              onShowBottomSheet={handleShowBottomSheet}
              onPathwaySendNow={handlePathwaySendNow}
              onPathwayLater={handlePathwayLater}
              onNudgeLearnMore={handleNudgeLearnMore}
              onNudgeClose={handleNudgeClose}
              onPromptLearnMore={handlePromptLearnMore}
              onBack={handleBack}
              animationDirection={animationDirection}
              isExiting={isExiting}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {calculatorState.showCurrencyPicker && (
            <CurrencyPickerView
              pickerType={calculatorState.showCurrencyPicker}
              onCurrencySelect={handleCurrencySelect}
              onClose={() => setCalculatorState(prev => ({ ...prev, showCurrencyPicker: null }))}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {calculatorState.showOverlay && calculatorState.overlayConfig && (
          <OverlayView
            variant={calculatorState.overlayConfig.variant}
            title={calculatorState.overlayConfig.title}
            description={calculatorState.overlayConfig.description}
            illustration={calculatorState.overlayConfig.illustration}
            onClose={handleCloseOverlay}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {calculatorState.showBottomSheet && controlType === 'button' && (
          <BottomSheet
            isOpen={calculatorState.showBottomSheet}
            onClose={handleCloseBottomSheet}
          >
            <div className="pt-6 space-y-4">
              {/* Send Now Option */}
              <button
                onClick={handleSelectSendNow}
                className="w-full text-left flex items-center justify-between py-2 pl-1 pr-0"
              >
                <div className="flex-1">
                  <p className="text-sm text-wise-content-tertiary">Send now</p>
                  <p className="font-semibold text-wise-content-primary">
                    Arrives {calculatorState.selectedPaymentMethod?.arrivalTime || 'soon'}
                  </p>
                </div>
                <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <input
                    type="radio"
                    checked={!calculatorState.scheduledMonth}
                    onChange={() => {}}
                    className="absolute w-5 h-5 appearance-none rounded-full border-2 cursor-pointer"
                    style={{
                      borderColor: !calculatorState.scheduledMonth ? 'var(--wise-green-positive)' : 'var(--wise-interactive-secondary)',
                      backgroundColor: 'white'
                    }}
                  />
                  {!calculatorState.scheduledMonth && (
                    <div
                      className="w-2.5 h-2.5 rounded-full pointer-events-none relative z-10"
                      style={{ backgroundColor: 'var(--wise-green-positive)' }}
                    />
                  )}
                </div>
              </button>

              {/* Send Later - Month Selection */}
              <div>
                <p className="text-sm text-wise-content-tertiary mb-3 px-1">Send later</p>
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS.map((month) => (
                    <button
                      key={month}
                      onClick={() => handleSelectMonth(month)}
                      className={`p-3 rounded-xl text-center transition-colors font-semibold ${
                        calculatorState.scheduledMonth === month
                          ? 'border border-wise-green-positive text-wise-content-primary'
                          : 'bg-wise-interactive-neutral-grey-light border border-dashed hover:bg-wise-background-neutral text-wise-content-primary'
                      }`}
                      style={{
                        backgroundColor: calculatorState.scheduledMonth === month ? '#E2F6D5' : undefined
                      }}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {calculatorState.showTipsBottomSheet && controlType === 'tips' && (
          <BottomSheet
            isOpen={calculatorState.showTipsBottomSheet}
            onClose={handleCloseTipsBottomSheet}
          >
            <div className="pt-6 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-wise-content-primary mb-6" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', textTransform: 'none' }}>
                  Need this quickly?
                </h2>
                <p className="text-base text-wise-content-secondary">
                  We&apos;ll help you through each step and you&apos;ll get <span className="font-semibold">expert support</span> with this transfer.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleTipsNowClick}
                  className="w-full flex items-center justify-between py-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer"
                >
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-wise-content-primary text-base">
                      Yes
                    </div>
                    <div className="text-wise-content-secondary text-sm">
                      Should arrive <span className="font-semibold text-wise-content-primary">{calculatorState.selectedPaymentMethod?.arrivalTime?.toLowerCase().startsWith('by') ? calculatorState.selectedPaymentMethod.arrivalTime : `by ${calculatorState.selectedPaymentMethod?.arrivalTime || getArrivalByText()}`}</span>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wise-content-tertiary flex-shrink-0 ml-1">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                <button
                  onClick={handleTipsLaterClick}
                  className="w-full flex items-center justify-between py-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer"
                >
                  <div className="flex-1 text-left flex items-center">
                    <div className="font-semibold text-wise-content-primary text-base">
                      No, I&apos;m planning ahead
                    </div>
                    <div className="text-wise-content-secondary text-sm" style={{ visibility: 'hidden', position: 'absolute' }}>
                      Placeholder for equal height
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wise-content-tertiary flex-shrink-0 ml-1">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {calculatorState.showTipsNowModal && (controlType === 'tips' || controlType === 'segmented' || controlType === 'button' || controlType === 'pathway' || controlType === 'nudge' || controlType === 'prompt') && (
          <BottomSheet
            isOpen={calculatorState.showTipsNowModal}
            onClose={handleCloseTipsNowModal}
            whiteControls={true}
          >
            <div className="-mx-6 -mt-[2.5rem] mb-6 relative overflow-hidden" style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', height: '180px' }}>
              <Image
                src="/img/1.png"
                alt="Move money fast"
                width={600}
                height={200}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center top' }}
              />
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-wise-content-primary mb-6" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', textTransform: 'none' }}>
                  How to move money fast
                </h2>
              </div>

              <div className="space-y-4">
                {/* Section 1: Bank limits */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Landmark className="h-5 w-5 text-wise-content-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-wise-content-primary text-base">
                      Check your bank&apos;s daily limits
                    </div>
                    <div className="text-wise-content-secondary text-sm">
                      Ask your bank to remove them or find out how many days you&apos;ll need to transfer
                    </div>
                  </div>
                </div>

                {/* Section 2: Rate guarantee */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Lock className="h-5 w-5 text-wise-content-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-wise-content-primary text-base">
                      Your rate is guaranteed for 3 days
                    </div>
                    <div className="text-wise-content-secondary text-sm">
                      We&apos;ll lock in this rate for you whilst you transfer funds and complete verification.
                    </div>
                  </div>
                </div>

                {/* Section 3: Expert support */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Headset className="h-5 w-5 text-wise-content-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-wise-content-primary text-base">
                      Expert support if you need it
                    </div>
                    <div className="text-wise-content-secondary text-sm">
                      Our experts have helped thousands of customer send large transfers.
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-wise-link-content underline text-base">Get in touch</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-2 pt-2">
                <button
                  onClick={handleTipsNowContinue}
                  className="w-full py-3 px-6 rounded-full font-semibold text-wise-interactive-primary transition-all duration-200"
                  style={{ backgroundColor: 'var(--wise-interactive-accent)' }}
                >
                  Continue
                </button>
              </div>
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {calculatorState.showTipsLaterModal && (controlType === 'tips' || controlType === 'segmented' || controlType === 'button' || controlType === 'pathway' || controlType === 'nudge' || controlType === 'prompt') && (
          <BottomSheet
            isOpen={calculatorState.showTipsLaterModal}
            onClose={handleCloseTipsLaterModal}
            whiteControls={true}
          >
            <div className="-mx-6 -mt-[2.5rem] mb-6 relative overflow-hidden" style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', height: '180px' }}>
              <Image
                src="/img/2.png"
                alt="Plan ahead"
                width={600}
                height={200}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center top' }}
              />
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-wise-content-primary mb-6" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', textTransform: 'none' }}>
                  Here&apos;s what you need to do
                </h2>
              </div>

              <div className="space-y-4">
                {/* Section 1: Add money */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Banknote className="h-5 w-5 text-wise-content-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-wise-content-primary text-base">
                      Add money to your Wise account
                    </div>
                    <div className="text-wise-content-secondary text-sm">
                      Reach out to your bank if you need to remove daily limits, or send a few separate transfers.
                    </div>
                  </div>
                </div>

                {/* Section 2: Verification documents */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <FileText className="h-5 w-5 text-wise-content-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-wise-content-primary text-base">
                      Get verification documents ready
                    </div>
                    <div className="text-wise-content-secondary text-sm">
                      For large amounts, we may need to ask you where the money came from.
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-wise-link-content underline text-base">Learn more</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Expert support */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Headset className="h-5 w-5 text-wise-content-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-wise-content-primary text-base">
                      Expert support if you need it
                    </div>
                    <div className="text-wise-content-secondary text-sm">
                      Our experts have helped thousands of customer send large transfers.
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-wise-link-content underline text-base">Get in touch</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-2 pt-2 space-y-2">
                <button
                  onClick={handleAddMoney}
                  className="w-full py-3 px-6 rounded-full font-semibold text-wise-interactive-primary transition-all duration-200"
                  style={{ backgroundColor: 'var(--wise-interactive-accent)' }}
                >
                  Add money
                </button>
                {controlType === 'button' && (
                  <button
                    onClick={handleCloseTipsLaterModal}
                    className="w-full py-3 px-6 rounded-full font-semibold text-wise-interactive-primary transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--wise-interactive-neutral-grey)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--wise-interactive-neutral-grey-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--wise-interactive-neutral-grey)'}
                  >
                    Schedule
                  </button>
                )}
              </div>
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CalculatorPrototype() {
  return <CalculatorContent />;
}