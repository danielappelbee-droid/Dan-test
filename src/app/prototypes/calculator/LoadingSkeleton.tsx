import React from 'react';
import { motion } from 'motion/react';

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  width = "100%", 
  height = "1rem", 
  className = "" 
}) => (
  <motion.div
    className={`bg-wise-interactive-secondary rounded ${className}`}
    style={{ width, height, opacity: 0.3 }}
    animate={{
      opacity: [0.2, 0.3, 0.2],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);