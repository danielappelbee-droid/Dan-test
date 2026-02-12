"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import BackButton from "../components/BackButton";

interface Prototype {
  id: string;
  title: string;
  description: string;
  type: string;
  lastUpdated: string;
}

const prototypes: Prototype[] = [
  {
    id: "sendmoney",
    title: "Send money",
    description: "Complete send money flow with recipient selection, currency calculator, confirmation, and success celebration",
    type: "Flow",
    lastUpdated: "2025-11-17"
  },
  {
    id: "home",
    title: "Home",
    description: "Multi-currency balance display with card management, transaction history, and navigation",
    type: "Dashboard",
    lastUpdated: "2025-07-22"
  },
  {
    id: "calculator",
    title: "Calculator",
    description: "Interactive currency conversion calculator with live rates and payment options",
    type: "Tools",
    lastUpdated: "2025-06-27"
  },
  {
    id: "recipient",
    title: "Recipient",
    description: "Recipient selection interface with recent contacts, search functionality, and user profiles",
    type: "Interface",
    lastUpdated: "2025-07-22"
  },
  {
    id: "checklist",
    title: "Checklist",
    description: "Transfer progress checklist with task completion tracking and interactive checkboxes",
    type: "Tools",
    lastUpdated: "2025-07-28"
  },
  {
    id: "verification",
    title: "Verification",
    description: "Document verification interface with expandable task details and regulatory compliance information",
    type: "Form",
    lastUpdated: "2025-08-04"
  },
  {
    id: "reason",
    title: "Reason",
    description: "Transfer reason selection interface with multiple purpose options and radio button selection",
    type: "Form",
    lastUpdated: "2025-08-04"
  },
  {
    id: "addmoney",
    title: "Add money",
    description: "Bank payment details interface with copyable fields and transfer confirmation options",
    type: "Payment",
    lastUpdated: "2025-08-04"
  }
];

function PrototypesContent() {
  const router = useRouter();

  const handlePrototypeClick = (id: string) => {
    router.push(`/prototypes/${id}`);
  };

  return (
    <div className="min-h-screen bg-wise-background-screen py-16 px-6">
      <BackButton href="/" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-left mb-12 pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="font-wise mb-4">Prototypes</h1>
              <p className="text-wise-content-secondary text-lg">
                Interactive prototypes from Wise.design
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="neutral-grey"
                size="medium"
                onClick={() => router.push('/screens-list')}
              >
                Core Screens
              </Button>
              <Button
                variant="neutral-grey"
                size="medium"
                onClick={() => router.push('/components-showcase')}
              >
                Components
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prototypes.map((prototype, index) => (
            <motion.div
              key={prototype.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: index * 0.1
              }}
              className="bg-wise-background-elevated rounded-[40px] p-6 border border-wise-border-neutral cursor-pointer"
              onClick={() => handlePrototypeClick(prototype.id)}
              whileHover={{
                y: -4,
                boxShadow: 'var(--wise-elevation)',
                transition: { duration: 0.1, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-wise-content-primary">
                  {prototype.title}
                </h3>
              </div>

              <p className="text-wise-content-secondary text-sm mb-4 leading-relaxed">
                {prototype.description}
              </p>

              <div className="flex justify-end">
                <Button variant="primary" size="small">
                  View
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Placeholder card */}
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: prototypes.length * 0.1
            }}
            className="bg-wise-background-elevated rounded-[40px] p-6 border-2 border-dashed border-wise-border-neutral flex items-center justify-center min-h-[200px]"
          >
            <div className="text-center">
              <p className="text-wise-content-tertiary text-lg font-semibold">
                Your prototype here
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PrototypesPage() {
  return <PrototypesContent />;
}