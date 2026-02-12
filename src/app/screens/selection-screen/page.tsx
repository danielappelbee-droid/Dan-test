"use client";

import SelectionScreen from './index';
import { CreditCard, Building2, Smartphone } from 'lucide-react';
import BackButton from '../../components/BackButton';
import MobileFrame from '../../components/MobileFrame';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SelectionScreenDemoContent() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <MobileFrame>
      <SelectionScreen
        title="Choose payment method"
        description="Select how you'd like to pay for this transfer"
        options={[
          {
            id: "balance",
            title: "Wise balance",
            subtitle: "Instant • No fees",
            description: "Use your GBP balance. You have £8,450.80 available",
            icon: Smartphone,
            badge: "Fastest"
          },
          {
            id: "bank",
            title: "Bank transfer",
            subtitle: "1-2 business days • No fees",
            description: "Transfer from your linked bank account",
            icon: Building2,
            badge: "Recommended"
          },
          {
            id: "card",
            title: "Debit card",
            subtitle: "Instant • Small fee",
            description: "0.7% fee (minimum £0.30). Use any debit card",
            icon: CreditCard
          }
        ]}
        selectedId={selectedId}
        onSelect={(option) => setSelectedId(option.id)}
        onBack={() => router.back()}
        onContinue={() => alert(`Continuing with ${selectedId}`)}
        continueText="Continue"
      />
    </MobileFrame>
  );
}

export default function SelectionScreenDemoPage() {
  return (
    <div className="min-h-screen bg-wise-background-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <BackButton href="/screens-list/" label="Screens" />
        <div className="pt-8">
          <SelectionScreenDemoContent />
        </div>
      </div>
    </div>
  );
}
