"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChecklistMainView } from "./ChecklistMainView";
import { navigationService, PrototypeRoute } from "../../utils/navigationService";

export default function ChecklistPrototype() {
  const router = useRouter();

  useEffect(() => {
    navigationService.pushRoute('/prototypes/checklist');
  }, []);

  const handleBack = () => {
    router.push('/prototypes/');
  };

  const handleNavigateTo = (route: string) => {
    navigationService.navigate(router, route as PrototypeRoute);
  };

  return (
    <div className="h-full relative overflow-hidden">
      <ChecklistMainView 
        onBack={handleBack}
        onNavigateTo={handleNavigateTo}
      />
    </div>
  );
}