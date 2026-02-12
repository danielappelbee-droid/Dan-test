import { Currency } from '../../utils/currencyService';
import { PaymentMethod } from '../../utils/feeService';
import { ErrorState } from '../../utils/errorService';

export interface OverlayConfig {
  variant: 'positive' | 'warning' | 'negative';
  title: string;
  description: string | React.ReactNode;
  illustration?: string;
}

export interface CalculatorState {
  fromAmount: string;
  toAmount: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  selectedPaymentMethod: PaymentMethod | null;
  showCurrencyPicker: 'from' | 'to' | null;
  showPaymentMethods: boolean;
  showOverlay: boolean;
  overlayConfig: OverlayConfig | null;
  animationDirection: 'left' | 'right';
  isLoading: boolean;
  focusedInput: 'from' | 'to' | null;
  hasBeenFocused: boolean;
  errorState: ErrorState;
  arrivalTiming: 'now' | 'later' | 'week' | 'month';
  controlType: 'segmented' | 'radio' | 'switch' | 'button' | 'tips' | 'pathway' | 'nudge' | 'prompt' | null;
  showBottomSheet: boolean;
  scheduledMonth: string | null;
  showTipsBottomSheet: boolean;
  tipsUserChoice: 'yes' | 'no' | null;
  showTipsNowModal: boolean;
  showTipsLaterModal: boolean;
  pathwayUserChoice: 'now' | 'later' | null;
}

export const initialCalculatorState: CalculatorState = {
  fromAmount: "0",
  toAmount: "0",
  fromCurrency: { code: "GBP", flag: "/flags/United Kingdom.svg", name: "British Pound", rate: 0.730 },
  toCurrency: { code: "USD", flag: "/flags/United States.svg", name: "US Dollar", rate: 1.000 },
  selectedPaymentMethod: null,
  showCurrencyPicker: null,
  showPaymentMethods: false,
  showOverlay: false,
  overlayConfig: null,
  animationDirection: 'right',
  isLoading: false,
  focusedInput: null,
  hasBeenFocused: false,
  errorState: {
    type: 'none',
    showAlert: false,
    showMessage: false,
    hideCalculatorDetails: false,
    showOverlay: false
  },
  arrivalTiming: 'now',
  controlType: null,
  showBottomSheet: false,
  scheduledMonth: null,
  showTipsBottomSheet: false,
  tipsUserChoice: null,
  showTipsNowModal: false,
  showTipsLaterModal: false,
  pathwayUserChoice: null
};