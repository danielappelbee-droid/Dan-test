import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import Button from './Button';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  whiteControls?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, whiteControls = false }) => {
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  const checkMobileFrame = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 1024;
    setIsMobileFrame(!isMobile);
  }, []);

  useEffect(() => {
    checkMobileFrame();

    const handleResize = () => {
      checkMobileFrame();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkMobileFrame]);

  if (!isOpen) return null;

  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const sheetVariants = {
    hidden: {
      y: "100%",
      transition: springTransition
    },
    visible: {
      y: 0,
      transition: springTransition
    },
    exit: {
      y: "100%",
      transition: springTransition
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        style={{
          borderRadius: isMobileFrame ? '2.5rem' : '0'
        }}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white z-50 shadow-lg"
        style={{
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          borderBottomLeftRadius: isMobileFrame ? '2.5rem' : '0',
          borderBottomRightRadius: isMobileFrame ? '2.5rem' : '0',
          touchAction: 'pan-y'
        }}
        variants={sheetVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          // Close if dragged down more than 100px OR has sufficient velocity
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
      >
        {/* Handle bar for swipe indication */}
        <div className="flex justify-center pt-3 pb-2 relative z-50">
          <div
            className="w-12 h-1 rounded-full"
            style={{
              backgroundColor: whiteControls ? 'white' : '#d1d5db',
              opacity: whiteControls ? 0.5 : 1
            }}
          />
        </div>

        {/* Close button */}
        <div className="absolute top-4 left-4 z-50">
          <div style={whiteControls ? { backgroundColor: 'white', borderRadius: '9999px' } : undefined}>
            <Button
              variant="neutral-grey"
              size="small"
              iconOnly
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 pt-4">
          {children}
        </div>
      </motion.div>
    </>
  );
};
