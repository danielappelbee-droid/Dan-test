"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddMoneyMainView } from "./AddMoneyMainView";
import { navigationService, PrototypeRoute } from "../../utils/navigationService";

export default function AddMoneyPrototype() {
  const router = useRouter();

  useEffect(() => {
    navigationService.pushRoute('/prototypes/addmoney');
  }, []);

  const handleBack = () => {
    router.push('/prototypes/');
  };

  const handleNavigateTo = (route: PrototypeRoute) => {
    navigationService.navigate(router, route);
  };

  return (
    <div className="h-full relative overflow-hidden">
      <AddMoneyMainView onBack={handleBack} onNavigateTo={handleNavigateTo} />
    </div>
  );
}