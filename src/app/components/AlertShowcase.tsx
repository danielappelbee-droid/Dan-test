import { motion, Variants } from "motion/react";
import { useState } from "react";
import AlertBanner from "./AlertBanner";

export default function AlertShowcase() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const staggeredChildVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  const staggeredContainerVariants: Variants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const resetAlerts = () => {
    setDismissedAlerts([]);
  };

  const alertVariants = [
    {
      id: 'neutral-link',
      variant: 'neutral' as const,
      title: 'Neutral',
      description: 'Description',
      action: {
        type: 'link' as const,
        text: 'Link',
        href: '#'
      },
      onClose: () => handleDismiss('neutral-link')
    },
    {
      id: 'positive-action',
      variant: 'positive' as const,
      title: 'Positive',
      description: 'Description',
      action: {
        type: 'button' as const,
        text: 'Action',
        onClick: () => console.log('Positive action clicked')
      }
    },
    {
      id: 'warning-action',
      variant: 'warning' as const,
      title: 'Warning',
      description: 'Description',
      action: {
        type: 'button' as const,
        text: 'Action',
        onClick: () => console.log('Warning action clicked')
      }
    },
    {
      id: 'negative-action',
      variant: 'negative' as const,
      title: 'Negative',
      description: 'Description',
      action: {
        type: 'button' as const,
        text: 'Action',
        onClick: () => console.log('Negative action clicked')
      }
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4"
      >
        {alertVariants.map((alert) => {
          if (dismissedAlerts.includes(alert.id)) return null;
          
          return (
            <motion.div key={alert.id} variants={staggeredChildVariants}>
              <AlertBanner
                variant={alert.variant}
                title={alert.title}
                description={alert.description}
                action={alert.action}
                onClose={alert.onClose}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {dismissedAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={resetAlerts}
            className="text-wise-link-content text-sm font-medium underline hover:text-wise-green-forest transition-colors"
          >
            Reset dismissed alerts
          </button>
        </motion.div>
      )}
    </div>
  );
}