"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VerificationMainView } from "./VerificationMainView";
import { navigationService } from "../../utils/navigationService";

export default function VerificationPrototype() {
  const router = useRouter();

  useEffect(() => {
    navigationService.pushRoute('/prototypes/verification');
  }, []);

  const handleBack = () => {
    router.push('/prototypes/');
  };

  const handleHelp = () => {
    console.log('Help button clicked');
  };

  const handleNavigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <div className="h-full relative overflow-hidden">
      <VerificationMainView 
        onBack={handleBack} 
        onHelp={handleHelp} 
        onNavigateTo={handleNavigateTo}
      />
    </div>
  );
}