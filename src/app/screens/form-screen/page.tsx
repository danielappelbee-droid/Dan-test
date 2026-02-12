"use client";

import FormScreen from './index';
import BackButton from '../../components/BackButton';
import MobileFrame from '../../components/MobileFrame';
import { useRouter } from 'next/navigation';

function FormScreenDemoContent() {
  const router = useRouter();

  return (
    <MobileFrame>
      <FormScreen
        title="Transfer details"
        description="Enter the details for your transfer"
        initialValues={{
          reason: "personal",
          urgent: "standard"
        }}
        fields={[
          {
            id: "amount",
            type: "number",
            label: "Amount to send",
            placeholder: "0.00",
            required: true,
            helperText: "Minimum transfer amount is £1.00",
            validator: (value) => {
              const num = parseFloat(value);
              if (isNaN(num) || num < 1) {
                return "Amount must be at least £1.00";
              }
              if (num > 10000) {
                return "Maximum amount is £10,000";
              }
              return null;
            }
          },
          {
            id: "reference",
            type: "text",
            label: "Reference (optional)",
            placeholder: "What's this for?",
            helperText: "This will appear on the recipient's statement"
          },
          {
            id: "reason",
            type: "select",
            label: "Reason for transfer",
            required: true,
            options: [
              { value: "", label: "Select a reason" },
              { value: "personal", label: "Personal transfer" },
              { value: "bills", label: "Paying bills and utilities" },
              { value: "rent", label: "Rent or mortgage payment" },
              { value: "family", label: "Family support" },
              { value: "gift", label: "Gift" },
              { value: "business", label: "Business expense" },
              { value: "other", label: "Other" }
            ],
            helperText: "Required for regulatory purposes"
          },
          {
            id: "urgent",
            type: "radio",
            label: "Delivery speed",
            required: true,
            options: [
              { value: "standard", label: "Standard (1-2 days) • Free" },
              { value: "fast", label: "Fast (within hours) • £2.50 fee" }
            ]
          },
          {
            id: "notification",
            type: "select",
            label: "Notify recipient",
            options: [
              { value: "email", label: "Email notification" },
              { value: "sms", label: "SMS notification" },
              { value: "none", label: "No notification" }
            ],
            helperText: "Let them know the money is on the way"
          }
        ]}
        onBack={() => router.back()}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
          alert(`Form submitted:\n${JSON.stringify(values, null, 2)}`);
        }}
        submitText="Continue"
        showSkip
        onSkip={() => alert("Skipped")}
      />
    </MobileFrame>
  );
}

export default function FormScreenDemoPage() {
  return (
    <div className="min-h-screen bg-wise-background-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <BackButton href="/screens-list/" label="Screens" />
        <div className="pt-8">
          <FormScreenDemoContent />
        </div>
      </div>
    </div>
  );
}
