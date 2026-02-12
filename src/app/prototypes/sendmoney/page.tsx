"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { HomeMainView } from "./HomeMainView";
import { TransactionsView } from "./TransactionsView";
import { navigationService, PrototypeRoute } from "../../utils/navigationService";

function SendMoneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const showTransactions = view === 'transactions';

  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const currentPath = showTransactions ? '/prototypes/sendmoney/transactions' : '/prototypes/sendmoney';
    navigationService.pushRoute(currentPath as PrototypeRoute);
  }, [showTransactions]);

  const handleShowTransactions = () => {
    setAnimationDirection('right');
    setIsExiting(false);
    router.push('/prototypes/sendmoney?view=transactions');
  };

  const handleBackFromTransactions = () => {
    setAnimationDirection('left');
    setIsExiting(true);

    setTimeout(() => {
      router.push('/prototypes/sendmoney');
      setIsExiting(false);
    }, 50);
  };

  const handleNavigateTo = (route: string) => {
    navigationService.navigate(router, route as PrototypeRoute);
  };

  return (
    <div className="h-full relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {showTransactions ? (
          <TransactionsView
            key="transactions"
            onBack={handleBackFromTransactions}
            animationDirection={animationDirection}
            isExiting={isExiting}
          />
        ) : (
          <HomeMainView
            key="home"
            onShowTransactions={handleShowTransactions}
            onNavigateTo={handleNavigateTo}
            animationDirection={animationDirection}
            isExiting={isExiting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SendMoneyPrototype() {
  return <SendMoneyContent />;
}
