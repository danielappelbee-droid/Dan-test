import { motion, Variants } from "motion/react";
import Chips from "./Chips";

export default function ChipsShowcase() {
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

  const sampleChips = [
    { id: 'timing', label: 'How long transfers take', onClick: () => console.log('Timing clicked') },
    { id: 'limits', label: 'Bank limits', onClick: () => console.log('Limits clicked') },
    { id: 'documents', label: 'Documents you\'ll need', onClick: () => console.log('Documents clicked') },
    { id: 'adding-money', label: 'Adding money to Wise', onClick: () => console.log('Adding money clicked') },
    { id: 'protection', label: 'How Wise protects your money', onClick: () => console.log('Protection clicked') }
  ];

  const categoryChips = [
    { id: 'all', label: 'All transfers', onClick: () => console.log('All clicked') },
    { id: 'pending', label: 'Pending', onClick: () => console.log('Pending clicked') },
    { id: 'completed', label: 'Completed', onClick: () => console.log('Completed clicked') },
    { id: 'cancelled', label: 'Cancelled', onClick: () => console.log('Cancelled clicked') }
  ];

  const currencyChips = [
    { id: 'usd', label: 'USD transfers', onClick: () => console.log('USD clicked') },
    { id: 'eur', label: 'EUR transfers', onClick: () => console.log('EUR clicked') },
    { id: 'gbp', label: 'GBP transfers', onClick: () => console.log('GBP clicked') },
    { id: 'jpy', label: 'JPY transfers', onClick: () => console.log('JPY clicked') },
    { id: 'aud', label: 'AUD transfers', onClick: () => console.log('AUD clicked') },
    { id: 'cad', label: 'CAD transfers', onClick: () => console.log('CAD clicked') }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          White Chips on Grey Background
        </motion.h3>
        <motion.div variants={staggeredChildVariants}>
          <Chips 
            chips={sampleChips} 
            variant="white-on-grey"
            addFirstChipMargin={true}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Grey Chips on White Background
        </motion.h3>
        <motion.div variants={staggeredChildVariants}>
          <Chips 
            chips={categoryChips} 
            variant="grey-on-white"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Currency Filter Chips
        </motion.h3>
        <motion.div variants={staggeredChildVariants}>
          <Chips 
            chips={currencyChips} 
            variant="grey-on-white"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}