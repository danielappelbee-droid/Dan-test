import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import Button from '../../components/Button';
import Image from 'next/image';

interface SuccessViewProps {
  onClose: () => void;
  recipientName?: string;
}

export const SuccessView = React.memo<SuccessViewProps>(function SuccessView({
  onClose,
  recipientName = 'Henrique Gusso'
}) {
  return (
    <motion.div
      key="success-view"
      className="fixed inset-0 z-50 flex flex-col pt-safe"
      style={{ backgroundColor: '#163300' }}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Close button */}
      <div className="px-4 pt-16 pb-4 flex items-center justify-start flex-shrink-0">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full border-2 border-wise-green-bright flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#163300' }}
        >
          <X className="h-5 w-5 text-wise-green-bright" />
        </button>
      </div>

      {/* Success content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Checkmark illustration */}
        <motion.div
          initial={{ scale: 0.5, rotate: 0 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1
          }}
          className="mb-12"
        >
          <Image
            src="/illos/Check Mark • Personal.png"
            alt="Success"
            width={200}
            height={200}
            className="object-contain"
          />
        </motion.div>

        {/* All set text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-6xl font-bold text-wise-green-bright mb-6 text-center"
        >
          ALL SET
        </motion.h1>

        {/* Success message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-lg text-white text-center leading-relaxed"
        >
          The money should be with {recipientName} in{' '}
          <span className="text-wise-green-bright font-semibold">seconds</span>. We'll keep you posted.
        </motion.p>
      </div>

      {/* Done button - pinned to bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="flex-shrink-0 px-4 py-6 pb-8"
      >
        <Button
          variant="primary"
          size="large"
          onClick={onClose}
          className="w-full"
        >
          Done
        </Button>
      </motion.div>
    </motion.div>
  );
});
