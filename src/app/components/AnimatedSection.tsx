import { motion, Variants } from "motion/react";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  withBorder?: boolean;
}

export default function AnimatedSection({ 
  children, 
  className = "", 
  title,
  withBorder = true 
}: AnimatedSectionProps) {
  const sectionVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

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
    <motion.div 
      className={`py-12 ${withBorder ? "border-b border-wise-border-neutral" : ""} ${className}`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {title && (
        <motion.h2 
          className="font-wise mb-8"
          variants={staggeredChildVariants}
        >
          {title}
        </motion.h2>
      )}
      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}