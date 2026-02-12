import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Clock, Calendar, ReceiptText, Landmark, CreditCard, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import SendReceiveInput from '../../components/SendReceiveInput';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import AlertBanner from '../../components/AlertBanner';
import AlertMessage from '../../components/AlertMessage';
import SegmentedControl from '../../components/SegmentedControl';
import Nudge from '../../components/Nudge';
import { formatExchangeRate, Currency, formatCurrencyAmount } from '../../utils/currencyService';
import { PaymentMethod } from '../../utils/feeService';
import { ErrorState } from '../../utils/errorService';
import { getArrivalByText, getNextWeekMondayParts } from '../../utils/dateService';
import { LoadingSkeleton } from './LoadingSkeleton';

interface FeeDisplayData {
  feeText: string;
  totalText: string;
  wiseFeeText: string;
  paymentFeeText: string;
  feePercentageText: string;
}

interface CalculatorMainViewProps {
  fromAmount: string;
  toAmount: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  selectedPaymentMethod: PaymentMethod | null;
  feeDisplay: FeeDisplayData;
  amount: number;
  isLoading: boolean;
  controlType: 'segmented' | 'radio' | 'switch' | 'button' | 'tips' | 'pathway' | 'nudge' | 'prompt' | null;
  focusedInput: 'from' | 'to' | null;
  hasBeenFocused: boolean;
  isVeryLargeAmount: boolean;
  isLargeGBPAmount: boolean;
  errorState: ErrorState;
  discountAmount: number;
  hasDiscount: boolean;
  arrivalTiming: 'now' | 'later' | 'week' | 'month';
  scheduledMonth: string | null;
  pathwayUserChoice: 'now' | 'later' | null;
  onFromAmountChange: (value: string) => void;
  onToAmountChange: (value: string) => void;
  onFromCurrencyChange: (code: string) => void;
  onToCurrencyChange: (code: string) => void;
  onFromCurrencyClick?: () => void;
  onToCurrencyClick?: () => void;
  onFromFocus: () => void;
  onFromBlur: () => void;
  onToFocus: () => void;
  onToBlur: () => void;
  onShowPaymentMethods: () => void;
  onContinue: () => void;
  onShowOverlay: () => void;
  onArrivalTimingChange: (timing: 'now' | 'later' | 'week' | 'month') => void;
  onShowBottomSheet?: () => void;
  onPathwaySendNow?: () => void;
  onPathwayLater?: () => void;
  onNudgeLearnMore?: () => void;
  onNudgeClose?: () => void;
  onPromptLearnMore?: () => void;
  onBack?: () => void;
  animationDirection: 'left' | 'right';
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
    case 'Clock': return Clock;
    case 'CreditCard': return CreditCard;
    case 'ReceiptText': return ReceiptText;
    case 'ApplePay': return ApplePayIcon;
    case 'Wise': return WiseIcon;
    default: return Landmark;
  }
};

const getFullMonthName = (shortMonth: string): string => {
  const monthMap: Record<string, string> = {
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sep': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December'
  };
  return monthMap[shortMonth] || shortMonth;
};

const saveCalculatorData = (fromAmount: string, toAmount: string, fromCurrency: Currency, toCurrency: Currency) => {
  if (typeof window !== 'undefined') {
    const exchangeRateText = formatExchangeRate(fromCurrency.code, toCurrency.code);
    const exchangeRate = parseFloat(exchangeRateText.split(' = ')[1]);
    
    const calculatorData = {
      fromAmount,
      toAmount,
      fromCurrency: fromCurrency.code,
      toCurrency: toCurrency.code,
      exchangeRate
    };
    
    try {
      window.sessionStorage.setItem('calculatorData', JSON.stringify(calculatorData));
    } catch (e) {
      console.warn('Could not save calculator data:', e);
    }
  }
};

export const CalculatorMainView = React.memo<CalculatorMainViewProps>(function CalculatorMainView({
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
  selectedPaymentMethod,
  feeDisplay,
  amount,
  isLoading,
  controlType,
  focusedInput,
  hasBeenFocused,
  isVeryLargeAmount,
  isLargeGBPAmount,
  errorState,
  discountAmount,
  hasDiscount,
  arrivalTiming,
  scheduledMonth,
  pathwayUserChoice,
  onFromAmountChange,
  onToAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  onFromCurrencyClick,
  onToCurrencyClick,
  onFromFocus,
  onFromBlur,
  onToFocus,
  onToBlur,
  onShowPaymentMethods,
  onContinue,
  onShowOverlay,
  onArrivalTimingChange,
  onShowBottomSheet,
  onPathwaySendNow,
  onPathwayLater,
  onNudgeLearnMore,
  onNudgeClose,
  onPromptLearnMore,
  onBack,
  animationDirection,
  isExiting = false
}) {
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
    return animationDirection === 'left' ? 'hiddenLeft' : 'hiddenRight';
  };

  const getExitVariant = () => {
    return animationDirection === 'right' ? 'exitRight' : 'exitLeft';
  };

  const getOpacity = (inputType: 'from' | 'to') => {
    if (!isLoading) return 1;
    if (focusedInput === inputType) return 1;
    return 0.4;
  };

  // For pathway variant, disable continue when no choice made and amount is large
  const isPathwayChoiceRequired = controlType === 'pathway' && isLargeGBPAmount && !pathwayUserChoice;

  const shouldShowCalculatorDetails = amount > 0 && !errorState.hideCalculatorDetails && !isPathwayChoiceRequired;
  const shouldShowAlertCalculatorDetails = amount > 0 && errorState.showAlert && (errorState.type === 'tier2_overlay' || errorState.type === 'usd_market_hours');

  const isContinueDisabled = amount <= 0 || isLoading ||
    errorState.type === 'brazil_malaysia_limit' ||
    errorState.type === 'tier2_overlay' ||
    errorState.type === 'usd_market_hours' ||
    isPathwayChoiceRequired;

  const getAlertDescription = () => {
    if (errorState.type === 'usd_market_hours' && errorState.randomizedTime) {
      return errorState.alertConfig?.description;
    }
    
    return errorState.alertConfig?.description;
  };

  const formatDiscountAmount = (amount: number, currency: string): React.ReactNode => {
    const formattedAmount = formatCurrencyAmount(amount, currency, { includeCode: false });
    return (
      <>
        <span className="font-semibold">{formattedAmount} {currency}</span> volume discount
      </>
    );
  };

  const handleContinue = () => {
    saveCalculatorData(fromAmount, toAmount, fromCurrency, toCurrency);
    onContinue();
  };

  return (
    <motion.div 
      key="calculator-main"
      className="h-full bg-wise-background-screen flex flex-col pb-20"
      variants={slideVariants}
      initial={getInitialVariant()}
      animate="visible"
      exit={getExitVariant()}
    >
      <div className="px-4 py-4 flex justify-between items-center">
        {onBack && (
          <Button
            variant="neutral-grey"
            size="large"
            iconOnly
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className={`flex items-center gap-2 bg-wise-background-neutral px-4 py-2 rounded-full ${!onBack ? 'ml-auto' : ''}`}>
          {isLoading ? (
            <LoadingSkeleton width="120px" height="36px" className="rounded-full" />
          ) : (
            <>
              <span className="text-sm font-medium text-wise-content-primary">
                {formatExchangeRate(fromCurrency.code, toCurrency.code)}
              </span>
              <ChevronRight className="h-4 w-4 text-wise-content-tertiary" />
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
        <div className="space-y-4">
          <motion.div
            animate={{ opacity: getOpacity('from') }}
            transition={{ duration: 0.3 }}
          >
            <SendReceiveInput
              label="You send"
              value={fromAmount}
              onChange={onFromAmountChange}
              currencyValue={fromCurrency.code}
              onCurrencyChange={onFromCurrencyChange}
              onCurrencyClick={onFromCurrencyClick}
              onFocus={onFromFocus}
              onBlur={onFromBlur}
              hasBeenFocused={hasBeenFocused}
            />
          </motion.div>


          <motion.div
            animate={{ opacity: getOpacity('to') }}
            transition={{ duration: 0.3 }}
          >
            <SendReceiveInput
              label="Recipient gets"
              value={toAmount}
              onChange={onToAmountChange}
              currencyValue={toCurrency.code}
              onCurrencyChange={onToCurrencyChange}
              onCurrencyClick={onToCurrencyClick}
              onFocus={onToFocus}
              onBlur={onToBlur}
              hasBeenFocused={hasBeenFocused}
            />
          </motion.div>

          {errorState.showMessage && errorState.messageConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AlertMessage
                variant={errorState.messageConfig.variant}
                message={errorState.messageConfig.message}
              />
            </motion.div>
          )}

          {errorState.showAlert && errorState.alertConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AlertBanner
                variant={errorState.alertConfig.variant}
                title={errorState.alertConfig.title}
                description={getAlertDescription()}
                action={{
                  ...errorState.alertConfig.action!,
                  onClick: onShowOverlay
                }}
              />
            </motion.div>
          )}

          {/* Pathway variant - choice containers */}
          {isPathwayChoiceRequired && (
            <div className="pt-6 border-t border-wise-border-neutral">
              <div className="grid grid-cols-2 gap-4">
                {/* Send now container */}
                <button
                  onClick={onPathwaySendNow}
                  className="flex flex-col items-start p-6 rounded-2xl transition-all duration-200 cursor-pointer border-2 border-transparent"
                  style={{
                    backgroundColor: 'var(--wise-interactive-neutral-grey)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--wise-border-neutral)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div className="w-full mb-4">
                    <Image
                      src="/illos/Skip authentication.png"
                      alt="Send now"
                      width={200}
                      height={150}
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="font-semibold text-wise-content-primary text-lg text-left">Send now</p>
                  <p className="text-sm text-wise-content-secondary text-left">
                    Should arrive <span className="font-semibold">{selectedPaymentMethod?.arrivalTime?.toLowerCase().startsWith('by') ? selectedPaymentMethod.arrivalTime : `by ${selectedPaymentMethod?.arrivalTime || getArrivalByText()}`}</span>
                  </p>
                </button>

                {/* Later container */}
                <button
                  onClick={onPathwayLater}
                  className="flex flex-col items-start p-6 rounded-2xl transition-all duration-200 cursor-pointer border-2 border-transparent"
                  style={{
                    backgroundColor: 'var(--wise-interactive-neutral-grey)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--wise-border-neutral)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div className="w-full mb-4">
                    <Image
                      src="/illos/Calendar • Personal.png"
                      alt="Later"
                      width={200}
                      height={150}
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="font-semibold text-wise-content-primary text-lg text-left">Later</p>
                  <p className="text-sm text-wise-content-secondary text-left">
                    We&apos;ll help you <span className="font-semibold">plan ahead</span>
                  </p>
                </button>
              </div>
            </div>
          )}

          {shouldShowCalculatorDetails && (
            <div className="pt-6 border-t border-wise-border-neutral">
              {/* Segmented Control for segmented variant - above calculator details */}
              {controlType === 'segmented' && isLargeGBPAmount && (
                <div className="mb-8">
                  <SegmentedControl
                    options={[
                      { value: 'now', label: 'Now' },
                      { value: 'later', label: 'Later' }
                    ]}
                    selectedValue={arrivalTiming === 'month' ? 'later' : 'now'}
                    onChange={(value) => onArrivalTimingChange(value as 'now' | 'later')}
                    className="w-full"
                  />
                </div>
              )}

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3">
                      <LoadingSkeleton width="40px" height="40px" className="rounded-full" />
                      <div className="space-y-2">
                        <LoadingSkeleton width="80px" height="12px" />
                        <LoadingSkeleton width="120px" height="16px" />
                      </div>
                    </div>
                    <LoadingSkeleton width="60px" height="32px" className="rounded-full" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-wise-background-neutral rounded-full flex items-center justify-center">
                        {selectedPaymentMethod && (() => {
                          const IconComponent = getIcon(selectedPaymentMethod.icon);
                          return <IconComponent className="h-5 w-5 text-wise-content-secondary" />;
                        })()}
                      </div>
                      <div>
                        <p className="text-sm text-wise-content-tertiary">Paying with</p>
                        <p className="font-semibold text-wise-content-primary">
                          {selectedPaymentMethod?.name || 'Select method'}
                        </p>
                      </div>
                    </div>
                    {!isVeryLargeAmount && (
                      <Button 
                        variant="neutral" 
                        size="small"
                        onClick={onShowPaymentMethods}
                      >
                        Change
                      </Button>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center justify-between">
                {isLoading && controlType !== 'segmented' && controlType !== 'nudge' && controlType !== 'prompt' && controlType !== 'pathway' && controlType !== null ? (
                  <>
                    <div className="flex items-center gap-3">
                      <LoadingSkeleton width="40px" height="40px" className="rounded-full" />
                      <div className="space-y-2">
                        <LoadingSkeleton width="50px" height="12px" />
                        <LoadingSkeleton width="100px" height="16px" />
                      </div>
                    </div>
                    <LoadingSkeleton width="70px" height="32px" className="rounded-full" />
                  </>
                ) : isLargeGBPAmount && controlType !== 'segmented' && controlType !== 'button' && controlType !== 'tips' && controlType !== 'nudge' && controlType !== 'prompt' && controlType !== 'pathway' && controlType !== null ? (
                  controlType === 'switch' ? (
                    <button
                      type="button"
                      onClick={() => {
                        onArrivalTimingChange(arrivalTiming === 'now' ? 'later' : 'now');
                      }}
                      className="flex items-center justify-between w-full cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-wise-background-neutral rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-wise-content-secondary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-wise-content-tertiary mb-0">Arrives</p>
                          <p className="font-semibold text-wise-content-primary mb-0">
                            {arrivalTiming === 'now' ? getArrivalByText() : 'Later'}
                          </p>
                        </div>
                      </div>
                      <span
                        className="relative inline-flex h-7 w-12 items-center rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: arrivalTiming === 'now' ? 'var(--wise-green-positive)' : 'var(--wise-interactive-secondary)',
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        <span
                          className="inline-block h-5 w-5 rounded-full bg-white"
                          style={{
                            transform: arrivalTiming === 'now' ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </span>
                    </button>
                  ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-wise-background-neutral rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-wise-content-secondary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-wise-content-tertiary">Arrives</p>
                            <div className="flex flex-col gap-3 mt-3">
                              <label className="flex items-center cursor-pointer">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                  <input
                                    type="radio"
                                    name="arrivalTiming"
                                    value="now"
                                    checked={arrivalTiming === 'now'}
                                    onChange={(e) => onArrivalTimingChange(e.target.value as 'now' | 'later')}
                                    className="absolute w-5 h-5 appearance-none rounded-full border-2 cursor-pointer"
                                    style={{
                                      borderColor: arrivalTiming === 'now' ? 'var(--wise-green-positive)' : 'var(--wise-interactive-secondary)',
                                      backgroundColor: 'white'
                                    }}
                                  />
                                  {arrivalTiming === 'now' && (
                                    <div
                                      className="w-2.5 h-2.5 rounded-full pointer-events-none relative z-10"
                                      style={{ backgroundColor: 'var(--wise-green-positive)' }}
                                    />
                                  )}
                                </div>
                                <span className="ml-3 font-semibold text-wise-content-primary">{getArrivalByText()}</span>
                              </label>
                              <label className="flex items-center cursor-pointer">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                  <input
                                    type="radio"
                                    name="arrivalTiming"
                                    value="later"
                                    checked={arrivalTiming === 'later'}
                                    onChange={(e) => onArrivalTimingChange(e.target.value as 'now' | 'later')}
                                    className="absolute w-5 h-5 appearance-none rounded-full border-2 cursor-pointer"
                                    style={{
                                      borderColor: arrivalTiming === 'later' ? 'var(--wise-green-positive)' : 'var(--wise-interactive-secondary)',
                                      backgroundColor: 'white'
                                    }}
                                  />
                                  {arrivalTiming === 'later' && (
                                    <div
                                      className="w-2.5 h-2.5 rounded-full pointer-events-none relative z-10"
                                      style={{ backgroundColor: 'var(--wise-green-positive)' }}
                                    />
                                  )}
                                </div>
                                <span className="ml-3 font-semibold text-wise-content-primary">Later</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        {!isVeryLargeAmount && (
                          <Button
                            variant="neutral"
                            size="small"
                            onClick={onShowPaymentMethods}
                          >
                            Schedule
                          </Button>
                        )}
                      </>
                  )
                ) : isLoading ? (
                  <>
                    <div className="flex items-center gap-3">
                      <LoadingSkeleton width="40px" height="40px" className="rounded-full" />
                      <div className="space-y-2">
                        <LoadingSkeleton width="50px" height="12px" />
                        <LoadingSkeleton width="100px" height="16px" />
                      </div>
                    </div>
                    {!isVeryLargeAmount && controlType !== 'segmented' && controlType !== 'prompt' && controlType !== null && (
                      <LoadingSkeleton width="70px" height="32px" className="rounded-full" />
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-wise-background-neutral rounded-full flex items-center justify-center">
                        {controlType === 'button' && isLargeGBPAmount && scheduledMonth ? (
                          <Calendar className="h-5 w-5 text-wise-content-secondary" />
                        ) : controlType === 'segmented' && isLargeGBPAmount ? (
                          arrivalTiming === 'now' ? (
                            <Clock className="h-5 w-5 text-wise-content-secondary" />
                          ) : arrivalTiming === 'week' ? (
                            <Calendar className="h-5 w-5 text-wise-content-secondary" />
                          ) : arrivalTiming === 'month' ? (
                            <Calendar className="h-5 w-5 text-wise-content-secondary" />
                          ) : (
                            <Clock className="h-5 w-5 text-wise-content-secondary" />
                          )
                        ) : controlType === 'pathway' && isLargeGBPAmount && pathwayUserChoice ? (
                          pathwayUserChoice === 'now' ? (
                            <Clock className="h-5 w-5 text-wise-content-secondary" />
                          ) : (
                            <Calendar className="h-5 w-5 text-wise-content-secondary" />
                          )
                        ) : (
                          <Clock className="h-5 w-5 text-wise-content-secondary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-wise-content-tertiary">
                          {controlType === 'button' && isLargeGBPAmount && scheduledMonth ? 'Sends in' :
                           controlType === 'segmented' && isLargeGBPAmount && arrivalTiming === 'month' ? 'Sends' :
                           controlType === 'pathway' && isLargeGBPAmount && pathwayUserChoice === 'later' ? 'Sends' :
                           'Arrives'}
                        </p>
                        <p className="font-semibold text-wise-content-primary">
                          {controlType === 'button' && isLargeGBPAmount && scheduledMonth ? (
                            getFullMonthName(scheduledMonth)
                          ) : controlType === 'segmented' && isLargeGBPAmount ? (
                            arrivalTiming === 'now' ? (
                              getArrivalByText()
                            ) : arrivalTiming === 'week' ? (
                              <>by {(() => {
                                const date = getNextWeekMondayParts();
                                return <>{date.month} {date.day}<sup>{date.suffix}</sup></>;
                              })()}</>
                            ) : arrivalTiming === 'month' ? (
                              'Later'
                            ) : (
                              getArrivalByText()
                            )
                          ) : controlType === 'pathway' && isLargeGBPAmount && pathwayUserChoice ? (
                            pathwayUserChoice === 'now' ? (
                              getArrivalByText()
                            ) : (
                              'Later'
                            )
                          ) : (
                            selectedPaymentMethod?.arrivalTime || 'Select payment method'
                          )}
                        </p>
                      </div>
                    </div>
                    {!isVeryLargeAmount && (
                      controlType === null ||
                      controlType === 'nudge' ||
                      controlType === 'prompt' ||
                      controlType === 'button' ||
                      (controlType === 'segmented' && arrivalTiming === 'month')
                    ) && (
                      (controlType === 'button' && isLargeGBPAmount) ? (
                        <button
                          onClick={onShowBottomSheet}
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-wise-interactive-primary font-semibold text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--wise-interactive-neutral)',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--wise-interactive-neutral-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--wise-interactive-neutral)'}
                        >
                          <Calendar className="h-4 w-4" />
                          Later
                        </button>
                      ) : (
                        <Button
                          variant="neutral"
                          size="small"
                          onClick={onShowBottomSheet || (() => {})}
                        >
                          Schedule
                        </Button>
                      )
                    )}
                    {controlType === 'pathway' && isLargeGBPAmount && pathwayUserChoice && !isVeryLargeAmount && (
                      <Button
                        variant="neutral"
                        size="small"
                        onClick={onShowBottomSheet || (() => {})}
                      >
                        Schedule
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Nudge component for control=nudge */}
              {controlType === 'nudge' && isLargeGBPAmount && !isLoading && (
                <div className="ml-12" style={{ marginTop: '1rem' }}>
                  <Nudge
                    text={
                      <>
                        Planning ahead?<br />
                        We&apos;ll help you.
                      </>
                    }
                    linkText="Learn more"
                    illustration="/illos/Calendar • Personal.png"
                    onLinkClick={onNudgeLearnMore}
                    onClose={onNudgeClose}
                  />
                </div>
              )}

              {/* Info alert message for control=prompt */}
              {controlType === 'prompt' && isLargeGBPAmount && !isLoading && (
                <div className="w-fit ml-12" style={{ marginTop: '1rem' }}>
                  <AlertMessage
                    variant="neutral"
                    message={
                      <span>
                        Planning ahead? We&apos;ll help you.<br />
                        <button onClick={onPromptLearnMore} className="font-semibold text-wise-link-content underline mt-1 inline-block">Learn more</button>
                      </span>
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3">
                      <LoadingSkeleton width="40px" height="40px" className="rounded-full" />
                      <div className="space-y-2">
                        <LoadingSkeleton width="90px" height="12px" />
                        <LoadingSkeleton width="60px" height="16px" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <LoadingSkeleton width="80px" height="16px" />
                      <LoadingSkeleton width="16px" height="16px" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-wise-background-neutral rounded-full flex items-center justify-center">
                        <ReceiptText className="h-5 w-5 text-wise-content-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-wise-content-tertiary">Total fees ({feeDisplay.feePercentageText})</p>
                        <p className="font-semibold text-wise-content-primary">{feeDisplay.feeText}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-wise-content-primary">
                        {feeDisplay.totalText}
                      </span>
                      <ChevronRight className="h-4 w-4 text-wise-content-tertiary" />
                    </div>
                  </>
                )}
              </div>
              </div>

              {hasDiscount && discountAmount > 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="w-fit ml-12 mt-4"
                >
                  <AlertMessage
                    variant="promotion"
                    message={formatDiscountAmount(discountAmount, fromCurrency.code)}
                  />
                </motion.div>
              )}
            </div>
          )}

          {shouldShowAlertCalculatorDetails && (
            <div className="pt-6 border-t border-wise-border-neutral">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  {isLoading ? (
                    <>
                      <div className="flex items-center gap-3">
                        <LoadingSkeleton width="40px" height="40px" className="rounded-full" />
                        <div className="space-y-2">
                          <LoadingSkeleton width="90px" height="12px" />
                          <LoadingSkeleton width="60px" height="16px" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <LoadingSkeleton width="80px" height="16px" />
                        <LoadingSkeleton width="16px" height="16px" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-wise-background-neutral rounded-full flex items-center justify-center">
                          <ReceiptText className="h-5 w-5 text-wise-content-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-wise-content-tertiary">Total fees ({feeDisplay.feePercentageText})</p>
                          <p className="font-semibold text-wise-content-primary">{feeDisplay.feeText}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-wise-content-primary">
                          {feeDisplay.totalText}
                        </span>
                        <ChevronRight className="h-4 w-4 text-wise-content-tertiary" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {hasDiscount && discountAmount > 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="w-fit ml-12 mt-4"
                >
                  <AlertMessage
                    variant="promotion"
                    message={formatDiscountAmount(discountAmount, fromCurrency.code)}
                  />
                </motion.div>
              )}
            </div>
          )}

        </div>
      </div>

      <Footer
        buttons={[
          {
            id: 'continue',
            variant: 'primary',
            size: 'large',
            children: 'Continue',
            onClick: handleContinue,
            disabled: isContinueDisabled
          }
        ]}
        layout="single"
      />
    </motion.div>
  );
});