"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReasonMainView } from "./ReasonMainView";
import { navigationService } from "../../utils/navigationService";

export default function ReasonPrototype() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    navigationService.pushRoute('/prototypes/reason');
  }, []);

  const handleBack = () => {
    // Preserve URL parameters when navigating back
    const params = new URLSearchParams();
    const control = searchParams.get('control');
    const amount = searchParams.get('amount');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const tipsChoice = searchParams.get('tipsChoice');

    if (control) params.set('control', control);
    if (amount) params.set('amount', amount);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (tipsChoice) params.set('tipsChoice', tipsChoice);

    const queryString = params.toString();
    router.push(`/prototypes/calculator${queryString ? `?${queryString}` : ''}`);
  };

  const handleContinue = () => {
    navigationService.navigate(router, '/prototypes/checklist');
  };

  const handleSkip = () => {
    navigationService.navigate(router, '/prototypes/checklist');
  };

  return (
    <div className="h-full relative overflow-hidden">
      <ReasonMainView 
        onBack={handleBack}
        onContinue={handleContinue}
        onSkip={handleSkip}
      />
    </div>
  );
}