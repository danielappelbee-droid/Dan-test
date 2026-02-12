import { motion, Variants } from "motion/react";

interface ColorSwatchProps {
  color: string;
  name: string;
  textColor?: string;
  backgroundColor?: string;
}

const ColorSwatch = ({ color, name, textColor, backgroundColor }: ColorSwatchProps) => (
  <motion.div 
    className={`flex flex-col items-center p-4 rounded-lg ${textColor || ''}`}
    style={backgroundColor ? { backgroundColor } : { backgroundColor: color }}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
  >
    <div 
      className="w-10 h-10 rounded-lg mb-2" 
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-xs">{name}</span>
  </motion.div>
);

export default function ColorShowcase() {
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

  return (
    <div className="space-y-8">
      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>Interactive Colors</motion.h3>
        <motion.div 
          className="grid grid-cols-3 gap-6"
          variants={staggeredChildVariants}
        >
          <ColorSwatch
            color="var(--wise-interactive-accent)"
            name="Accent"
            textColor="text-wise-interactive-primary"
            backgroundColor="var(--wise-interactive-accent)"
          />
          <ColorSwatch
            color="var(--wise-interactive-neutral)"
            name="Neutral"
            textColor="text-wise-interactive-primary"
            backgroundColor="var(--wise-interactive-neutral)"
          />
          <ColorSwatch
            color="#868685"
            name="Secondary"
            textColor="text-wise-base-light bg-wise-interactive-secondary"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>Brand Colors</motion.h3>
        <motion.div 
          className="grid grid-cols-4 gap-6"
          variants={staggeredChildVariants}
        >
          <ColorSwatch
            color="#9FE870"
            name="Bright Green"
            textColor="text-wise-interactive-primary bg-wise-green-bright"
          />
          <ColorSwatch
            color="#163300"
            name="Forest Green"
            textColor="text-wise-base-light bg-wise-green-forest"
          />
          <ColorSwatch
            color="#FFC091"
            name="Orange"
            textColor="bg-wise-orange-bright"
          />
          <ColorSwatch
            color="#FFEB69"
            name="Yellow"
            textColor="bg-wise-yellow-bright"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>Sentiment Colors</motion.h3>
        <motion.div 
          className="grid grid-cols-3 gap-6"
          variants={staggeredChildVariants}
        >
          <ColorSwatch
            color="#2F5711"
            name="Positive"
            textColor="text-wise-base-light bg-wise-sentiment-positive"
          />
          <ColorSwatch
            color="#EDC843"
            name="Warning"
            textColor="bg-wise-sentiment-warning"
          />
          <ColorSwatch
            color="#A8200D"
            name="Negative"
            textColor="text-wise-base-light bg-wise-sentiment-negative"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}