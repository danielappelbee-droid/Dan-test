"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecipientMainView } from "./RecipientMainView";
import { navigationService, PrototypeRoute } from "../../utils/navigationService";

export default function RecipientPrototype() {
  const router = useRouter();

  useEffect(() => {
    navigationService.pushRoute('/prototypes/recipient');
  }, []);

  const handleBack = () => {
    router.push('/prototypes/');
  };

  const handleNavigateToChecklist = () => {
    navigationService.navigate(router, '/prototypes/checklist');
  };

  const handleNavigateTo = (route: PrototypeRoute) => {
    navigationService.navigate(router, route);
  };

  const handleNavigateToHome = () => {
    navigationService.navigate(router, '/prototypes/home');
  };

  return (
    <div className="h-full relative overflow-hidden">
      <RecipientMainView 
        onBack={handleBack} 
        onNavigateToChecklist={handleNavigateToChecklist}
        onNavigateTo={handleNavigateTo}
        onNavigateToHome={handleNavigateToHome}
      />
    </div>
  );
}