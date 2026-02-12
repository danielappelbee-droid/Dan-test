'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, CreditCard, TrendingUp, Download, ChevronRight } from 'lucide-react';
import Button from '../../components/Button';

type Step = 'greeting' | 'account-type' | 'goal' | 'dashboard';
type AccountType = 'personal' | 'business' | null;
type Goal = 'send' | 'spend' | 'save' | null;

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>('greeting');
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [goal, setGoal] = useState<Goal>(null);
  const [activeTab, setActiveTab] = useState<'gbp' | 'usd' | 'eur'>('gbp');
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);

  const handleGreetingResponse = (confirmed: boolean) => {
    if (confirmed) {
      setTimeout(() => setStep('account-type'), 600);
    }
  };

  const handleAccountTypeSelect = (type: 'personal' | 'business') => {
    setAccountType(type);
    setTimeout(() => setStep('goal'), 600);
  };

  const handleGoalSelect = (selectedGoal: 'send' | 'spend' | 'save') => {
    setGoal(selectedGoal);
    setTimeout(() => setStep('dashboard'), 800);
  };

  const currencies = {
    gbp: { flag: '🇬🇧', name: 'British Pound', code: 'GBP', balance: '1,289.09', account: '23-14-70 • 26946196' },
    usd: { flag: '🇺🇸', name: 'US Dollar', code: 'USD', balance: '842.50', account: '084009519 • 9600000000' },
    eur: { flag: '🇪🇺', name: 'Euro', code: 'EUR', balance: '1,456.32', account: 'BE71 0961 2345 6769' }
  };

  return (
    <div className="min-h-screen bg-wise-green-forest relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-wise-green-bright rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-wise-green-bright rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Chat Phase */}
        <AnimatePresence mode="wait">
          {step !== 'dashboard' && (
            <motion.div
              key="chat-phase"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex items-center justify-center px-4 py-12"
            >
              <div className="w-full max-w-2xl space-y-6">
                {/* Greeting Step */}
                {step === 'greeting' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center mb-12"
                    >
                      <h1 className="font-wise text-6xl text-wise-green-bright mb-4">
                        Bonjour! 👋
                      </h1>
                      <p className="text-2xl text-white/90 leading-relaxed">
                        We've detected you're joining us from France—is that right?
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex gap-4 justify-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGreetingResponse(true)}
                        className="px-12 py-6 bg-wise-interactive-accent rounded-full text-wise-interactive-primary font-semibold text-xl shadow-xl"
                      >
                        Yes, that's right ✓
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {}}
                        className="px-12 py-6 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold text-xl border-2 border-white/20"
                      >
                        Choose another
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Account Type Step */}
                {step === 'account-type' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center mb-12"
                    >
                      <h1 className="font-wise text-5xl text-wise-green-bright mb-4">
                        Perfect.
                      </h1>
                      <p className="text-2xl text-white/90 leading-relaxed">
                        To tailor your experience, are we setting this up for your personal life or your business?
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="grid gap-6"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, y: -8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAccountTypeSelect('personal')}
                        className="bg-white/95 backdrop-blur-xl rounded-[40px] p-10 text-left shadow-2xl border-2 border-transparent hover:border-wise-green-bright transition-all"
                      >
                        <div className="flex items-start gap-6">
                          <div className="text-5xl">🌍</div>
                          <div className="flex-1">
                            <h3 className="font-wise text-3xl text-wise-content-primary mb-3">
                              Personal
                            </h3>
                            <p className="text-lg text-wise-content-secondary leading-relaxed">
                              For travel and friends. Send money abroad, get a debit card, and spend in 40+ currencies at the real exchange rate.
                            </p>
                          </div>
                          <ChevronRight className="w-8 h-8 text-wise-content-tertiary" />
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02, y: -8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAccountTypeSelect('business')}
                        className="bg-white/95 backdrop-blur-xl rounded-[40px] p-10 text-left shadow-2xl border-2 border-transparent hover:border-wise-green-bright transition-all"
                      >
                        <div className="flex items-start gap-6">
                          <div className="text-5xl">💼</div>
                          <div className="flex-1">
                            <h3 className="font-wise text-3xl text-wise-content-primary mb-3">
                              Business
                            </h3>
                            <p className="text-lg text-wise-content-secondary leading-relaxed">
                              For global clients and scaling. Pay invoices, manage team expenses, and hold money in multiple currencies.
                            </p>
                          </div>
                          <ChevronRight className="w-8 h-8 text-wise-content-tertiary" />
                        </div>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Goal Step */}
                {step === 'goal' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center mb-12"
                    >
                      <h1 className="font-wise text-5xl text-wise-green-bright mb-4">
                        What's your main goal today?
                      </h1>
                      <p className="text-xl text-white/80 leading-relaxed">
                        We'll show you what's possible
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="grid sm:grid-cols-3 gap-6"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGoalSelect('send')}
                        className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 text-center shadow-2xl"
                      >
                        <div className="text-5xl mb-4">💸</div>
                        <h3 className="font-wise text-2xl text-wise-content-primary mb-2">
                          Sending
                        </h3>
                        <p className="text-wise-content-secondary">
                          Transfer money abroad
                        </p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGoalSelect('spend')}
                        className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 text-center shadow-2xl"
                      >
                        <div className="text-5xl mb-4">💳</div>
                        <h3 className="font-wise text-2xl text-wise-content-primary mb-2">
                          Spending
                        </h3>
                        <p className="text-wise-content-secondary">
                          Travel and shop globally
                        </p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGoalSelect('save')}
                        className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 text-center shadow-2xl"
                      >
                        <div className="text-5xl mb-4">📈</div>
                        <h3 className="font-wise text-2xl text-wise-content-primary mb-2">
                          Saving
                        </h3>
                        <p className="text-wise-content-secondary">
                          Earn returns on your money
                        </p>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Phase */}
        <AnimatePresence>
          {step === 'dashboard' && (
            <motion.div
              key="dashboard-phase"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 bg-wise-background-screen rounded-t-[40px] overflow-hidden"
            >
              <div className="h-full flex flex-col">
                {/* Top Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-6 border-b border-wise-border-neutral"
                >
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    <Button variant="primary" size="small" className="whitespace-nowrap">
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="neutral-grey" size="small" className="whitespace-nowrap">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Card
                    </Button>
                    <Button variant="neutral-grey" size="small" className="whitespace-nowrap">
                      <Download className="w-4 h-4 mr-2" />
                      Receive
                    </Button>
                    <Button variant="neutral-grey" size="small" className="whitespace-nowrap">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Earn returns
                    </Button>
                  </div>
                </motion.div>

                {/* Currency Cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex-1 p-6 overflow-y-auto"
                >
                  <div className="max-w-2xl mx-auto">
                    {/* Card Stack */}
                    <div className="relative h-[400px] mb-8">
                      <AnimatePresence>
                        {!showAllCurrencies ? (
                          <>
                            {/* Main GBP Card */}
                            <motion.div
                              layoutId="gbp-card"
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0, zIndex: 30 }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 bg-gradient-to-br from-wise-green-forest to-wise-green-positive rounded-[40px] p-8 text-white shadow-2xl"
                            >
                              <div className="flex flex-col h-full justify-between">
                                <div>
                                  <div className="flex items-center gap-3 mb-6">
                                    <span className="text-4xl">{currencies.gbp.flag}</span>
                                    <span className="text-xl opacity-90">{currencies.gbp.name}</span>
                                  </div>
                                  <div className="font-wise text-6xl mb-2">
                                    £{currencies.gbp.balance}
                                  </div>
                                  <div className="text-wise-green-bright/80 text-lg">
                                    {currencies.gbp.code}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-white/60 text-sm">Account details</div>
                                  <div className="font-mono text-lg">{currencies.gbp.account}</div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Peeking USD Card */}
                            <motion.div
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 0.6, y: 20, zIndex: 20 }}
                              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 bg-gradient-to-br from-wise-content-primary to-wise-content-secondary rounded-[40px] shadow-xl"
                            />

                            {/* Peeking EUR Card */}
                            <motion.div
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 0.4, y: 40, zIndex: 10 }}
                              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 bg-gradient-to-br from-wise-content-secondary to-wise-content-tertiary rounded-[40px] shadow-xl"
                            />
                          </>
                        ) : (
                          /* All Cards Spread */
                          <div className="space-y-4">
                            {Object.entries(currencies).map(([key, currency], index) => (
                              <motion.div
                                key={key}
                                layoutId={`${key}-card`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => setActiveTab(key as any)}
                                className={`bg-gradient-to-br ${
                                  key === 'gbp' ? 'from-wise-green-forest to-wise-green-positive' :
                                  key === 'usd' ? 'from-wise-content-primary to-wise-content-secondary' :
                                  'from-wise-content-secondary to-wise-content-tertiary'
                                } rounded-[32px] p-6 text-white shadow-xl cursor-pointer`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-3xl">{currency.flag}</span>
                                    <div>
                                      <div className="font-wise text-2xl">
                                        {key === 'gbp' ? '£' : key === 'usd' ? '$' : '€'}{currency.balance}
                                      </div>
                                      <div className="text-white/60 text-sm">{currency.code}</div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-6 h-6" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Toggle Button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-center"
                    >
                      <Button
                        variant="neutral-grey"
                        size="medium"
                        onClick={() => setShowAllCurrencies(!showAllCurrencies)}
                      >
                        {showAllCurrencies ? 'Show less' : 'See available currencies'}
                      </Button>
                    </motion.div>

                    {/* Welcome Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-12 bg-wise-background-neutral rounded-[32px] p-8"
                    >
                      <h3 className="font-wise text-2xl text-wise-content-primary mb-3">
                        You're all set! 🎉
                      </h3>
                      <p className="text-wise-content-secondary text-lg leading-relaxed mb-6">
                        {accountType === 'personal'
                          ? "Your personal Wise account is ready. Send money to friends and family in 160+ countries at the real exchange rate."
                          : "Your business account is ready. Pay invoices, manage expenses, and scale globally with multi-currency accounts."}
                      </p>
                      <Button variant="primary" size="large" className="w-full">
                        {goal === 'send' ? 'Send your first transfer' :
                         goal === 'spend' ? 'Order your Wise card' :
                         'Start earning returns'}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
