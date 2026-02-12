"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { LayoutDashboard, List, CheckSquare, FileText, Target } from "lucide-react";

interface CoreScreen {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: string;
  useCases: string[];
  components: string[];
}

const coreScreens: CoreScreen[] = [
  {
    id: "dashboard-home",
    title: "Dashboard Home",
    description: "Multi-card dashboard overview with balance cards, quick actions, and recent activity",
    icon: LayoutDashboard,
    type: "Dashboard",
    useCases: ["Account overview", "Balance display", "Quick actions hub"],
    components: ["Button", "ListItem", "Footer"]
  },
  {
    id: "detail-list",
    title: "Detail List",
    description: "Scrollable list with search, filtering, and individual item navigation",
    icon: List,
    type: "List",
    useCases: ["Transaction history", "Contact list", "Item catalog"],
    components: ["ListItem", "FormInput", "Footer"]
  },
  {
    id: "selection-screen",
    title: "Selection Screen",
    description: "Choose from options with card or list-style selection and continue action",
    icon: CheckSquare,
    type: "Selection",
    useCases: ["Payment methods", "Recipient picker", "Option selector"],
    components: ["Button", "Footer"]
  },
  {
    id: "form-screen",
    title: "Form Screen",
    description: "Input collection with validation, error handling, and submission",
    icon: FileText,
    type: "Form",
    useCases: ["Data entry", "Settings", "Profile editing"],
    components: ["FormInput", "RadioGroup", "Button", "Footer"]
  },
  {
    id: "progress-tracker",
    title: "Progress Tracker",
    description: "Checklist or stepper for tracking progress through multi-step flows",
    icon: Target,
    type: "Progress",
    useCases: ["Onboarding checklist", "Setup wizard", "Multi-step process"],
    components: ["Button", "Footer"]
  }
];

function ScreensListContent() {
  const router = useRouter();

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
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-wise mb-4">Core Screens</h1>
              <p className="text-wise-content-secondary text-lg">
                Reference screen patterns to copy and customize for your prototypes
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="neutral-grey"
                size="medium"
                onClick={() => router.push('/prototypes')}
              >
                Prototypes
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

          <div className="bg-wise-interactive-neutral rounded-3xl p-6 border border-wise-border-neutral">
            <h3 className="font-semibold text-wise-content-primary mb-2">
              How to use core screens
            </h3>
            <p className="text-sm text-wise-content-secondary leading-relaxed">
              These are reference implementations - copy the code from <code className="bg-wise-background-neutral px-2 py-1 rounded text-xs">/src/app/screens/[name]/index.tsx</code> into your prototype directory and customize freely. Your changes won't affect other prototypes.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreScreens.map((screen, index) => {
            const Icon = screen.icon;
            return (
              <motion.div
                key={screen.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index * 0.1
                }}
                className="bg-wise-background-elevated rounded-[40px] p-6 border border-wise-border-neutral cursor-pointer"
                whileHover={{
                  y: -4,
                  boxShadow: 'var(--wise-elevation)',
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                onClick={() => router.push(`/screens/${screen.id}/`)}
              >
                {/* Icon & Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-wise-interactive-accent rounded-2xl p-3">
                    <Icon className="w-6 h-6 text-wise-interactive-primary" />
                  </div>
                  <span className="text-xs text-wise-content-tertiary bg-wise-background-neutral px-3 py-1 rounded-full">
                    {screen.type}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-wise-content-primary mb-2">
                  {screen.title}
                </h3>
                <p className="text-wise-content-secondary text-sm mb-4 leading-relaxed">
                  {screen.description}
                </p>

                {/* Use Cases */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-wise-content-tertiary uppercase tracking-wide mb-2">
                    Use Cases
                  </p>
                  <ul className="space-y-1">
                    {screen.useCases.map((useCase, i) => (
                      <li key={i} className="text-sm text-wise-content-secondary flex items-start">
                        <span className="text-wise-interactive-primary mr-2">•</span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Components Used */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-wise-content-tertiary uppercase tracking-wide mb-2">
                    Uses Components
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {screen.components.map((component, i) => (
                      <span
                        key={i}
                        className="text-xs bg-wise-background-neutral text-wise-content-secondary px-2 py-1 rounded-full"
                      >
                        {component}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Path to Copy */}
                <div className="pt-4 border-t border-wise-border-neutral">
                  <p className="text-xs text-wise-content-tertiary mb-2">
                    Copy from:
                  </p>
                  <code className="text-xs bg-wise-background-neutral text-wise-content-secondary px-2 py-1 rounded block break-all">
                    /screens/{screen.id}/index.tsx
                  </code>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 bg-wise-background-elevated rounded-3xl p-8 border border-wise-border-neutral"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-wise text-2xl mb-4">Creating New Prototypes</h2>
          <div className="space-y-4 text-wise-content-secondary">
            <p>
              <strong>1. Copy a core screen:</strong> Find the pattern you need and copy the code from <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/src/app/screens/[name]/index.tsx</code>
            </p>
            <p>
              <strong>2. Paste into your prototype:</strong> Create <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/prototypes/your-prototype/YourView.tsx</code>
            </p>
            <p>
              <strong>3. Customize freely:</strong> Modify the screen without affecting other prototypes or the core library
            </p>
            <p>
              <strong>4. Iterate rapidly:</strong> Your prototype is self-contained - break things, experiment, and iterate
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ScreensListPage() {
  return <ScreensListContent />;
}
