'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Globe, Check, Loader2, ArrowRightLeft, Wallet, CreditCard, TrendingUp, Info, X, ArrowLeft } from 'lucide-react';
import SendReceiveInput from '../../components/SendReceiveInput';
import { BottomSheet } from '../../components/BottomSheet';
import { CurrencyPickerView } from '../sendmoney/CurrencyPickerView';
import { Currency, CURRENCIES } from '../../utils/currencyService';
import Button from '../../components/Button';
import Image from 'next/image';

type AppState = 'splash' | 'chat' | 'loading' | 'success';
type MessageType = 'assistant' | 'user' | 'country-confirm' | 'pills' | 'calculator' | 'card' | 'receive' | 'invest';

interface Message {
  id: string;
  type: MessageType;
  content: string;
}

const COUNTRIES = [
  { name: 'France', flag: '🇫🇷', code: 'FR', features: ['Send', 'Receive', 'Card', 'Invest'] },
  { name: 'UK', flag: '🇬🇧', code: 'GB', features: ['Send', 'Receive', 'Card', 'Invest'] },
  { name: 'US', flag: '🇺🇸', code: 'US', features: ['Send', 'Receive', 'Card'] },
  { name: 'Germany', flag: '🇩🇪', code: 'DE', features: ['Send', 'Receive', 'Card', 'Invest'] },
  { name: 'Spain', flag: '🇪🇸', code: 'ES', features: ['Send', 'Receive', 'Card'] },
  { name: 'Australia', flag: '🇦🇺', code: 'AU', features: ['Send', 'Receive', 'Card', 'Invest'] },
  { name: 'Canada', flag: '🇨🇦', code: 'CA', features: ['Send', 'Receive', 'Card'] },
];

export default function WiseConcierge() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(COUNTRIES[0]);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [showLargeTransferSheet, setShowLargeTransferSheet] = useState(false);
  const [currencyPickerType, setCurrencyPickerType] = useState<'from' | 'to' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculator state
  const [fromAmount, setFromAmount] = useState('1000');
  const [toAmount, setToAmount] = useState('850.00');
  const [fromCurrency, setFromCurrency] = useState<Currency>(
    CURRENCIES.find(c => c.code === 'EUR') || CURRENCIES[1]
  );
  const [toCurrency, setToCurrency] = useState<Currency>(
    CURRENCIES.find(c => c.code === 'GBP') || CURRENCIES[2]
  );

  // Real-time calculation
  useEffect(() => {
    const numeric = parseFloat(fromAmount.replace(/,/g, '')) || 0;
    // Calculate exchange rate between the two currencies
    const fromRate = fromCurrency.rate;
    const toRate = toCurrency.rate;
    const exchangeRate = toRate / fromRate;
    const calculated = (numeric * exchangeRate).toFixed(2);
    setToAmount(calculated);
  }, [fromAmount, fromCurrency, toCurrency]);

  // Removed auto-scroll to prevent page jumping

  const startChat = () => {
    setAppState('chat');
    setTimeout(() => {
      addMessage('assistant', `Hi! I see you're joining us from ${detectedCountry.name} ${detectedCountry.flag}. Is that right?`);
      setTimeout(() => {
        addMessage('country-confirm', '');
      }, 800);
    }, 300);
  };

  const addMessage = (type: MessageType, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleCountryConfirm = () => {
    addMessage('user', 'Yes, that\'s right');
    setSelectedCountry(detectedCountry);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const features = detectedCountry.features;
      addMessage('assistant', `Perfect! In ${detectedCountry.name}, you can access: ${features.join(', ')}. What interests you most?`);
      setTimeout(() => {
        addMessage('pills', '');
      }, 500);
    }, 1200);
  };

  const handleChangeCountry = () => {
    setShowCountryPicker(true);
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setDetectedCountry(country);
    setShowCountryPicker(false);
    addMessage('user', `${country.flag} ${country.name}`);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const features = country.features;
      addMessage('assistant', `Perfect! In ${country.name}, you can access: ${features.join(', ')}. What interests you most?`);
      setTimeout(() => {
        addMessage('pills', '');
      }, 500);
    }, 1200);
  };

  const handlePillClick = (pill: string) => {
    addMessage('user', pill);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      if (pill === 'Send') {
        addMessage('assistant', "Perfect! Here's our real-time calculator. Send money at the real exchange rate.");
        setTimeout(() => {
          addMessage('calculator', '');
          setShowCreateButton(true);
        }, 500);
      } else if (pill === 'Card') {
        addMessage('assistant', "Great choice! The Wise card gives you real exchange rates when you spend abroad.");
        setTimeout(() => {
          addMessage('card', '');
          setShowCreateButton(true);
        }, 500);
      } else if (pill === 'Receive') {
        addMessage('assistant', "Excellent! Get your own local account details to receive money like a local.");
        setTimeout(() => {
          addMessage('receive', '');
          setShowCreateButton(true);
        }, 500);
      } else if (pill === 'Invest') {
        addMessage('assistant', "Smart move! Grow your money with competitive interest rates on your balance.");
        setTimeout(() => {
          addMessage('invest', '');
          setShowCreateButton(true);
        }, 500);
      }
    }, 1200);
  };

  const handleTextInput = (text: string) => {
    const lower = text.toLowerCase();

    // Check for Send-related keywords
    if (lower.includes('send') || lower.includes('transfer') || lower.includes('money') || lower.includes('bill') || lower.includes('pay')) {
      addMessage('user', text);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('assistant', "Perfect! Here's our real-time calculator. Send money at the real exchange rate.");
        setTimeout(() => {
          addMessage('calculator', '');
          setShowCreateButton(true);
        }, 500);
      }, 1200);
    }
    // Check for Card-related keywords
    else if (lower.includes('card') || lower.includes('spend') || lower.includes('shopping') || lower.includes('travel') || lower.includes('atm')) {
      addMessage('user', text);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('assistant', "Great choice! The Wise card gives you real exchange rates when you spend abroad.");
        setTimeout(() => {
          addMessage('card', '');
          setShowCreateButton(true);
        }, 500);
      }, 1200);
    }
    // Check for Receive-related keywords
    else if (lower.includes('receive') || lower.includes('get paid') || lower.includes('freelance') || lower.includes('invoice') || lower.includes('account details')) {
      addMessage('user', text);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('assistant', "Excellent! Get your own local account details to receive money like a local.");
        setTimeout(() => {
          addMessage('receive', '');
          setShowCreateButton(true);
        }, 500);
      }, 1200);
    }
    // Check for Invest-related keywords
    else if (lower.includes('invest') || lower.includes('interest') || lower.includes('save') || lower.includes('grow') || lower.includes('balance')) {
      addMessage('user', text);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('assistant', "Smart move! Grow your money with competitive interest rates on your balance.");
        setTimeout(() => {
          addMessage('invest', '');
          setShowCreateButton(true);
        }, 500);
      }, 1200);
    }
    // General/unclear intent - recommend Send as most popular
    else {
      addMessage('user', text);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('assistant', "Based on what you're describing, I think our Send Money feature would be perfect for you. It lets you transfer money internationally at the real exchange rate with low fees. Want to see how it works?");
        setTimeout(() => {
          addMessage('calculator', '');
          setShowCreateButton(true);
        }, 500);
      }, 1200);
    }
  };

  const handleCreateAccount = () => {
    setAppState('loading');
    setTimeout(() => {
      setAppState('success');
    }, 2000);
  };

  const handleCurrencySelect = (currency: Currency, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromCurrency(currency);
    } else {
      setToCurrency(currency);
    }
    setCurrencyPickerType(null);
  };

  const getPillIcon = (pill: string) => {
    switch (pill) {
      case 'Send': return <ArrowRightLeft className="w-4 h-4" />;
      case 'Receive': return <Wallet className="w-4 h-4" />;
      case 'Card': return <CreditCard className="w-4 h-4" />;
      case 'Invest': return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
  };

  // Splash Screen
  if (appState === 'splash') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#193E39] flex flex-col items-center justify-between p-8"
      >
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="relative">
              <Globe className="w-24 h-24 text-[#9FE870]" strokeWidth={1.2} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#9FE870"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold text-white mb-12 text-center"
          >
            Welcome to Wise
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full space-y-4"
          >
            <button
              onClick={startChat}
              className="w-full bg-[#9FE870] text-[#193E39] font-semibold py-4 px-6 rounded-full hover:scale-105 transition-transform"
            >
              Get an account
            </button>

            <button className="w-full bg-transparent border-2 border-white text-white font-semibold py-4 px-6 rounded-full hover:bg-white/10 transition-colors">
              Log in
            </button>
          </motion.div>
        </div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          href="#"
          className="flex items-center gap-2 text-[#9FE870] text-sm font-medium"
        >
          <Shield className="w-4 h-4" />
          Safety & Security
        </motion.a>
      </motion.div>
    );
  }

  // Loading State
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#193E39] animate-spin mx-auto mb-4" />
          <p className="text-wise-content-primary text-lg font-medium">Creating your account...</p>
        </div>
      </div>
    );
  }

  // Success State
  if (appState === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-white flex items-center justify-center p-8"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-20 h-20 bg-[#9FE870] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-[#193E39]" strokeWidth={3} />
          </motion.div>
          <h2 className="text-3xl font-bold text-wise-content-primary mb-3">All set!</h2>
          <p className="text-wise-content-secondary text-lg">Redirecting you to finish your profile...</p>
        </div>
      </motion.div>
    );
  }

  // Chat Interface
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-wise-background-screen flex flex-col"
    >
      {/* Header with Back Button and Wise Logo */}
      <div className="bg-wise-background-elevated border-b border-wise-border-neutral px-4 py-4 flex items-center justify-between">
        <Button
          variant="neutral-grey"
          size="large"
          iconOnly
          onClick={() => {
            setAppState('splash');
            setMessages([]);
            setShowCreateButton(false);
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Image
          src="/wise.svg"
          alt="Wise"
          width={45}
          height={18}
          className="object-contain"
        />

        <div className="w-12" />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-40">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => {
            // Assistant Message
            if (message.type === 'assistant') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start gap-2 items-end"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-wise-interactive-accent rounded-full flex items-center justify-center">
                    <Image
                      src="/wise.svg"
                      alt="Wise"
                      width={16}
                      height={8}
                      className="object-contain"
                    />
                  </div>
                  <div className="bg-wise-background-elevated rounded-[20px] rounded-tl-sm px-4 py-3 max-w-[85%] border border-wise-border-neutral">
                    <p className="text-wise-content-primary">{message.content}</p>
                  </div>
                </motion.div>
              );
            }

            // User Message
            if (message.type === 'user') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-end"
                >
                  <div className="bg-wise-interactive-primary rounded-[20px] rounded-tr-sm px-4 py-3 max-w-[85%]">
                    <p className="text-white">{message.content}</p>
                  </div>
                </motion.div>
              );
            }

            // Country Confirmation
            if (message.type === 'country-confirm') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  <button
                    onClick={handleCountryConfirm}
                    className="bg-wise-interactive-accent text-wise-interactive-primary font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform text-sm"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleChangeCountry}
                    className="bg-wise-background-elevated text-wise-content-primary border border-wise-border-neutral font-medium px-6 py-2 rounded-full hover:bg-wise-background-neutral transition-colors text-sm"
                  >
                    Change country
                  </button>
                </motion.div>
              );
            }

            // Pills
            if (message.type === 'pills') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {selectedCountry.features.map((pill) => (
                    <button
                      key={pill}
                      onClick={() => handlePillClick(pill)}
                      className="bg-wise-background-elevated text-wise-content-primary border border-wise-border-neutral font-medium px-4 py-2 rounded-full hover:bg-wise-interactive-accent hover:text-wise-interactive-primary transition-colors text-sm flex items-center gap-2"
                    >
                      {getPillIcon(pill)}
                      {pill}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      addMessage('user', 'Not sure yet');
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage('assistant', "No worries! Most people start with our Send Money feature — it's the easiest way to transfer money internationally at the real exchange rate. Want to see how it works?");
                        setTimeout(() => {
                          addMessage('calculator', '');
                          setShowCreateButton(true);
                        }, 500);
                      }, 1200);
                    }}
                    className="bg-wise-background-elevated text-wise-content-primary border border-wise-border-neutral font-medium px-4 py-2 rounded-full hover:bg-wise-background-neutral transition-colors text-sm"
                  >
                    Not sure yet
                  </button>
                </motion.div>
              );
            }

            // Calculator Module
            if (message.type === 'calculator') {
              const exchangeRate = (toCurrency.rate / fromCurrency.rate).toFixed(4);

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-full max-w-sm mb-6"
                >
                  <div className="bg-wise-background-elevated rounded-2xl p-5 border border-wise-border-neutral">
                    <div className="flex flex-col space-y-4">
                      <SendReceiveInput
                        label="You send"
                        value={fromAmount}
                        onChange={setFromAmount}
                        currencyValue={fromCurrency.code}
                        onCurrencyClick={() => setCurrencyPickerType('from')}
                      />

                      <div className="flex items-center justify-center py-1">
                        <div className="bg-wise-interactive-accent/20 rounded-full px-3 py-1">
                          <p className="text-xs text-wise-content-secondary">
                            <span className="font-semibold">1 {fromCurrency.code} = {exchangeRate} {toCurrency.code}</span>
                          </p>
                        </div>
                      </div>

                      <SendReceiveInput
                        label="Recipient gets"
                        value={toAmount}
                        currencyValue={toCurrency.code}
                        onCurrencyClick={() => setCurrencyPickerType('to')}
                        readOnly
                      />

                      <div className="mt-4 pt-4 border-t border-wise-border-neutral text-center">
                        <p className="text-sm text-wise-content-primary mb-2">
                          Sending over 20,000 GBP or equivalent?
                        </p>
                        <button
                          onClick={() => setShowLargeTransferSheet(true)}
                          className="text-sm text-wise-content-tertiary hover:text-wise-interactive-primary transition-colors underline"
                        >
                          Get lower rates and premium support
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Card Module
            if (message.type === 'card') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-full max-w-sm mb-6"
                >
                  {/* Card Image */}
                  <div className="bg-gradient-to-br from-wise-green-forest to-wise-green-positive rounded-2xl p-8 text-white mb-4 shadow-lg">
                    <div className="flex flex-col h-40 justify-between">
                      <div>
                        <div className="text-sm opacity-80 mb-2">Wise Debit Card</div>
                        <div className="font-wise text-3xl">••• 4567</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs opacity-60 mb-1">Valid thru</div>
                          <div className="text-sm font-medium">12/27</div>
                        </div>
                        <div className="w-12 h-8 bg-white/20 rounded-md" />
                      </div>
                    </div>
                  </div>

                  {/* Card Benefits */}
                  <div className="bg-wise-background-elevated rounded-2xl p-5 border border-wise-border-neutral">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="bg-wise-interactive-accent rounded-full p-2 mt-0.5">
                          <Check className="w-3 h-3 text-wise-interactive-primary" />
                        </div>
                        <p className="text-wise-content-primary">Spend in 40+ currencies at the real exchange rate</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-wise-interactive-accent rounded-full p-2 mt-0.5">
                          <Check className="w-3 h-3 text-wise-interactive-primary" />
                        </div>
                        <p className="text-wise-content-primary">Save up to 3% vs your bank on international purchases</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-wise-interactive-accent rounded-full p-2 mt-0.5">
                          <Check className="w-3 h-3 text-wise-interactive-primary" />
                        </div>
                        <p className="text-wise-content-primary">Free ATM withdrawals up to £200 every month</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Receive Module
            if (message.type === 'receive') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-full max-w-sm mb-6"
                >
                  <div className="bg-wise-background-elevated rounded-2xl p-5 border border-wise-border-neutral">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="w-6 h-6 text-wise-interactive-primary" />
                      <h3 className="font-bold text-lg text-wise-content-primary">Receive Money</h3>
                    </div>
                    <div className="space-y-3 text-sm text-wise-content-primary">
                      <div className="flex items-start gap-2">
                        <div className="bg-wise-interactive-accent/30 rounded-full p-1 mt-0.5">
                          <div className="w-1 h-1 bg-wise-interactive-primary rounded-full" />
                        </div>
                        <p>Get local account details in 10+ currencies</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-wise-interactive-accent/30 rounded-full p-1 mt-0.5">
                          <div className="w-1 h-1 bg-wise-interactive-primary rounded-full" />
                        </div>
                        <p>Receive money like a local — no conversion fees</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-wise-interactive-accent/30 rounded-full p-1 mt-0.5">
                          <div className="w-1 h-1 bg-wise-interactive-primary rounded-full" />
                        </div>
                        <p>Perfect for freelancers and global businesses</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Invest Module
            if (message.type === 'invest') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-full max-w-sm mb-6"
                >
                  <div className="bg-wise-background-elevated rounded-2xl p-5 border border-wise-border-neutral">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-wise-interactive-primary" />
                      <h3 className="font-bold text-lg text-wise-content-primary">Wise Interest</h3>
                    </div>
                    <div className="bg-wise-interactive-accent/10 rounded-xl p-4 mb-4">
                      <div className="text-wise-content-secondary text-xs mb-1">Current rate</div>
                      <div className="text-4xl font-bold text-wise-interactive-primary">4.87%</div>
                      <div className="text-wise-content-tertiary text-xs mt-1">Annual interest on EUR balance</div>
                    </div>
                    <div className="space-y-2 text-sm text-wise-content-primary">
                      <div className="flex items-start gap-2">
                        <div className="bg-wise-interactive-accent/30 rounded-full p-1 mt-0.5">
                          <div className="w-1 h-1 bg-wise-interactive-primary rounded-full" />
                        </div>
                        <p>No lock-in period — access anytime</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-wise-interactive-accent/30 rounded-full p-1 mt-0.5">
                          <div className="w-1 h-1 bg-wise-interactive-primary rounded-full" />
                        </div>
                        <p>Protected up to €100,000</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return null;
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="bg-wise-background-elevated rounded-[20px] rounded-tl-sm px-4 py-3 border border-wise-border-neutral">
                <div className="flex gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay }}
                      className="w-2 h-2 bg-wise-content-tertiary rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-wise-background-elevated border-t border-wise-border-neutral px-4 py-3">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                handleTextInput(inputValue);
                setInputValue('');
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-wise-background-screen rounded-full px-5 py-3 outline-none text-wise-content-primary placeholder:text-wise-content-tertiary border border-wise-border-neutral focus:border-wise-interactive-primary transition-colors"
          />
          <button
            onClick={() => {
              if (inputValue.trim()) {
                handleTextInput(inputValue);
                setInputValue('');
              }
            }}
            disabled={!inputValue.trim()}
            className="bg-wise-interactive-primary text-white rounded-full p-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sticky Footer Button */}
      <AnimatePresence>
        {showCreateButton && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-wise-background-elevated border-t border-wise-border-neutral px-4 py-4"
          >
            <div className="max-w-md mx-auto">
              <button
                onClick={handleCreateAccount}
                className="w-full bg-wise-interactive-accent text-wise-interactive-primary font-bold py-4 rounded-full hover:scale-105 transition-transform"
              >
                Create your account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Large Transfer Bottom Sheet */}
      <BottomSheet
        isOpen={showLargeTransferSheet}
        onClose={() => setShowLargeTransferSheet(false)}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-wise-content-primary mb-4">Large transfers</h2>
          <p className="text-wise-content-primary">
            Need to send over €50,000? We've got you covered with our large transfer service.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-wise-interactive-accent rounded-full p-2 mt-0.5">
                <Check className="w-4 h-4 text-wise-interactive-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-wise-content-primary">Dedicated support</h4>
                <p className="text-sm text-wise-content-secondary">Personal assistance from our large transfer team</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-wise-interactive-accent rounded-full p-2 mt-0.5">
                <Check className="w-4 h-4 text-wise-interactive-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-wise-content-primary">Better rates</h4>
                <p className="text-sm text-wise-content-secondary">Access to preferential exchange rates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-wise-interactive-accent rounded-full p-2 mt-0.5">
                <Check className="w-4 h-4 text-wise-interactive-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-wise-content-primary">Rate locks</h4>
                <p className="text-sm text-wise-content-secondary">Lock in your rate for up to 48 hours</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-wise-interactive-accent text-wise-interactive-primary font-semibold py-3 rounded-full mt-4">
            Contact our team
          </button>
        </div>
      </BottomSheet>

      {/* Currency Picker - Full Screen Overlay */}
      <AnimatePresence>
        {currencyPickerType && (
          <div className="fixed inset-0 z-[100]">
            <CurrencyPickerView
              pickerType={currencyPickerType}
              onCurrencySelect={handleCurrencySelect}
              onClose={() => setCurrencyPickerType(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Country Picker - Full Screen Overlay */}
      <AnimatePresence>
        {showCountryPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-wise-background-screen flex flex-col"
          >
            <div className="px-4 py-4 flex justify-between items-center border-b border-wise-border-neutral">
              <Button
                variant="neutral-grey"
                size="large"
                iconOnly
                onClick={() => setShowCountryPicker(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="font-semibold text-wise-content-primary">
                Select country
              </div>

              <div className="w-12" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-2 max-w-md mx-auto">
                {COUNTRIES.map((country) => (
                  <motion.button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-wise-background-neutral rounded-xl transition-colors text-left"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  >
                    <span className="text-4xl">{country.flag}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-wise-content-primary">{country.name}</p>
                      <p className="text-sm text-wise-content-tertiary">{country.features.join(', ')}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
