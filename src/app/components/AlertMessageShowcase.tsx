import { motion, Variants } from "motion/react";
import AlertMessage from "./AlertMessage";

export default function AlertMessageShowcase() {
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

  const alertMessages = [
    {
      variant: 'positive' as const,
      message: 'Your transfer has been completed successfully'
    },
    {
      variant: 'neutral' as const,
      message: 'Your account information has been updated'
    },
    {
      variant: 'warning' as const,
      message: 'Exchange rates are changing rapidly today'
    },
    {
      variant: 'negative' as const,
      message: 'Transfer failed due to insufficient funds'
    },
    {
      variant: 'promotion' as const,
      message: 'Special offer: Get 0% fees on your first transfer'
    }
  ];

  return (
    <motion.div
      variants={staggeredContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4"
    >
      {alertMessages.map((alert, index) => (
        <motion.div key={index} variants={staggeredChildVariants}>
          <AlertMessage
            variant={alert.variant}
            message={alert.message}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}