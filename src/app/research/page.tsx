"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { User, Briefcase } from "lucide-react";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import ListItem from "../components/ListItem";
import { metaResearchService } from "../utils/metaResearchService";

type Country = 'US' | 'UK' | null;
type AccountType = 'Personal' | 'Business' | null;

function ResearchContent() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(null);

  // Clear all storage when landing on research page
  React.useEffect(() => {
    metaResearchService.clearAllStorage();
  }, []);

  const isStartEnabled = selectedCountry !== null && selectedAccountType !== null;

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleAccountTypeSelect = (accountType: AccountType) => {
    setSelectedAccountType(accountType);
  };

  const handleStart = () => {
    if (isStartEnabled && selectedCountry && selectedAccountType) {
      const researchData = {
        country: selectedCountry,
        accountType: selectedAccountType,
        timestamp: Date.now()
      };
      
      // Initialize meta research service without clearing storage (already cleared on page load)
      metaResearchService.initializeFromResearch(researchData);
      
      // Navigate to home prototype
      router.push('/prototypes/home');
    }
  };

  const countryOptions = [
    {
      id: 'US',
      title: 'United States',
      subtitle: 'USD currency',
      flag: '/flags/United States.svg'
    },
    {
      id: 'UK',
      title: 'United Kingdom', 
      subtitle: 'GBP currency',
      flag: '/flags/United Kingdom.svg'
    }
  ];

  const accountOptions = [
    {
      id: 'Personal',
      title: 'Personal',
      subtitle: 'Individual account',
      icon: User
    },
    {
      id: 'Business',
      title: 'Business',
      subtitle: 'Company account',
      icon: Briefcase
    }
  ];

  return (
    <div className="min-h-screen bg-wise-background-screen py-16 px-6">
      <BackButton href="/" />
      
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-left mb-12 pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="font-wise mb-4">Research</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Country Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral"
          >
            <h3 className="text-lg font-semibold text-wise-content-primary mb-6">
              Country
            </h3>
            <div className="space-y-2">
              {countryOptions.map((country) => (
                <ListItem
                  key={country.id}
                  avatar={{
                    size: 48,
                    type: 'image',
                    src: country.flag,
                    alt: country.title
                  }}
                  content={{
                    largeText: country.title,
                    smallText: country.subtitle
                  }}
                  rightElement={{
                    type: 'radio',
                    radio: {
                      checked: selectedCountry === country.id,
                      onChange: () => handleCountrySelect(country.id as Country),
                      name: 'country',
                      value: country.id
                    }
                  }}
                  onClick={() => handleCountrySelect(country.id as Country)}
                  className="cursor-pointer"
                />
              ))}
            </div>
          </motion.div>

          {/* Account Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral"
          >
            <h3 className="text-lg font-semibold text-wise-content-primary mb-6">
              Account
            </h3>
            <div className="space-y-2">
              {accountOptions.map((account) => {
                const IconComponent = account.icon;
                return (
                  <ListItem
                    key={account.id}
                    avatar={{
                      size: 48,
                      type: 'icon',
                      content: <IconComponent className="h-5 w-5" />
                    }}
                    content={{
                      largeText: account.title,
                      smallText: account.subtitle
                    }}
                    rightElement={{
                      type: 'radio',
                      radio: {
                        checked: selectedAccountType === account.id,
                        onChange: () => handleAccountTypeSelect(account.id as AccountType),
                        name: 'account',
                        value: account.id
                      }
                    }}
                    onClick={() => handleAccountTypeSelect(account.id as AccountType)}
                    className="cursor-pointer"
                  />
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        >
          <Button
            variant="primary"
            size="large"
            disabled={!isStartEnabled}
            onClick={handleStart}
            className="w-full"
          >
            Start
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return <ResearchContent />;
}