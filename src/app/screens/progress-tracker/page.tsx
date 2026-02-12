"use client";

import ProgressTracker from './index';
import BackButton from '../../components/BackButton';
import MobileFrame from '../../components/MobileFrame';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function ProgressTrackerDemoContent() {
  const router = useRouter();
  const [items, setItems] = useState([
    {
      id: "1",
      title: "Verify your email",
      description: "Check your inbox and click the verification link we sent you",
      completed: true
    },
    {
      id: "2",
      title: "Add your phone number",
      description: "We'll send you a code to verify your phone",
      completed: true
    },
    {
      id: "3",
      title: "Verify your identity",
      description: "Upload a photo of your ID (passport, driver's license, or ID card)",
      completed: false,
      current: true
    },
    {
      id: "4",
      title: "Add payment method",
      description: "Connect your bank account or add a debit card",
      completed: false,
      locked: false
    },
    {
      id: "5",
      title: "Make your first transfer",
      description: "Send money to anywhere in the world at the real exchange rate",
      completed: false,
      locked: false
    }
  ]);

  const handleItemClick = (item: any) => {
    alert(`Clicked: ${item.title}`);
  };

  return (
    <MobileFrame>
      <ProgressTracker
        title="Setup checklist"
        description="Complete these steps to get started"
        items={items}
        onBack={() => router.back()}
        onItemClick={handleItemClick}
        onContinue={() => alert("Continue clicked")}
        continueText="Continue setup"
        style="checklist"
      />
    </MobileFrame>
  );
}

export default function ProgressTrackerDemoPage() {
  return (
    <div className="min-h-screen bg-wise-background-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <BackButton href="/screens-list/" label="Screens" />
        <div className="pt-8">
          <ProgressTrackerDemoContent />
        </div>
      </div>
    </div>
  );
}
