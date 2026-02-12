"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useCalculatorLogic } from "../useCalculatorLogic";
import { CalculatorMainView } from "../CalculatorMainView";
import { PaymentMethodsView } from "../PaymentMethodsView";
import { CurrencyPickerView } from "../CurrencyPickerView";
import { ConfirmAndSendView } from "../ConfirmAndSendView";
import { SuccessView } from "../SuccessView";
import { OverlayView } from "../../../components/OverlayView";
import { navigationService } from "../../../utils/navigationService";
import { PaymentMethod } from "../../../utils/feeService";

function SendMoneyCalculatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const showPaymentMethods = view === 'payment-methods';
  const showConfirmation = view === 'confirm';
  const showSuccess = view === 'success';

  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isExiting, setIsExiting] = useState(false);

  // Load selected recipient from sessionStorage
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRecipient = window.sessionStorage.getItem('selectedRecipient');
      if (storedRecipient) {
        try {
          setSelectedRecipient(JSON.parse(storedRecipient));
        } catch (e) {
          console.warn('Could not parse selected recipient:', e);
        }
      }
    }
  }, []);

  const controlType = searchParams.get('control') as 'segmented' | 'radio' | 'switch' | 'button' | 'tips' | 'pathway' | 'nudge' | 'prompt' | null;
  const amount = searchParams.get('amount');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

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
    const currentPath = showPaymentMethods ? '/prototypes/sendmoney/calculator/payment-methods' : '/prototypes/sendmoney/calculator';
    navigationService.pushRoute(currentPath);
  }, [showPaymentMethods]);

  const handleShowPaymentMethods = () => {
    setAnimationDirection('right');
    setIsExiting(false);
    const params = new URLSearchParams();
    params.set('view', 'payment-methods');
    if (controlType) params.set('control', controlType);
    router.push(`/prototypes/sendmoney/calculator?${params.toString()}`);
  };

  const handleBackFromPaymentMethods = () => {
    setAnimationDirection('left');
    setIsExiting(true);

    setTimeout(() => {
      router.push('/prototypes/sendmoney/calculator');
      setIsExiting(false);
    }, 50);
  };

  const handleBackFromCalculator = () => {
    router.push('/prototypes/sendmoney');
  };

  const handleContinue = () => {
    setAnimationDirection('right');
    setIsExiting(false);
    const params = new URLSearchParams();
    params.set('view', 'confirm');
    if (controlType) params.set('control', controlType);
    router.push(`/prototypes/sendmoney/calculator?${params.toString()}`);
  };

  const handleBackFromConfirmation = () => {
    setAnimationDirection('left');
    setIsExiting(true);

    setTimeout(() => {
      const params = new URLSearchParams();
      if (controlType) params.set('control', controlType);
      const queryString = params.toString();
      router.push(`/prototypes/sendmoney/calculator${queryString ? `?${queryString}` : ''}`);
      setIsExiting(false);
    }, 50);
  };

  const handleConfirmAndSend = () => {
    const params = new URLSearchParams();
    params.set('view', 'success');
    if (controlType) params.set('control', controlType);
    router.push(`/prototypes/sendmoney/calculator?${params.toString()}`);
  };

  const handleCloseSuccess = () => {
    router.push('/prototypes/sendmoney');
  };

  const handlePaymentMethodSelectWithNav = (method: PaymentMethod) => {
    handlePaymentMethodSelect(method);
    setAnimationDirection('left');
    setIsExiting(true);

    setTimeout(() => {
      router.push('/prototypes/sendmoney/calculator');
      setIsExiting(false);
    }, 50);
  };

  return (
    <>
      <div className="h-full relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {showConfirmation ? (
            <ConfirmAndSendView
              key="confirm-and-send"
              onBack={handleBackFromConfirmation}
              onConfirm={handleConfirmAndSend}
              animationDirection={animationDirection}
              isExiting={isExiting}
            />
          ) : showPaymentMethods ? (
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
              recipientName={selectedRecipient?.name}
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
              onBack={handleBackFromCalculator}
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

      {/* Success modal overlay */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessView
            key="success"
            onClose={handleCloseSuccess}
            recipientName={selectedRecipient?.name}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function SendMoneyCalculatorPage() {
  return <SendMoneyCalculatorContent />;
}
