import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { X, Phone, Mail, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface OverlayViewProps {
  variant: 'positive' | 'warning' | 'negative';
  title: string;
  description: string | React.ReactNode;
  illustration?: string;
  onClose: () => void;
}

export const OverlayView: React.FC<OverlayViewProps> = ({
  variant,
  title,
  description,
  illustration = '/illos/Plane 2.png',
  onClose
}) => {
  const [illustrationSize, setIllustrationSize] = useState({ width: 280, height: 280 });
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8
  };

  const overlaySlideVariants = {
    hiddenDown: { 
      y: "100%",
      transition: springTransition
    },
    visible: { 
      y: 0,
      transition: springTransition
    },
    exitDown: { 
      y: "100%",
      transition: springTransition
    }
  };

  const contentBounceVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'positive':
        return '#E2F6D5';
      case 'warning':
        return '#FFF7D7';
      case 'negative':
        return '#FBEAEA';
      default:
        return '#E2F6D5';
    }
  };

  const parseDescription = (text: string | React.ReactNode) => {
    if (typeof text !== 'string') return text;
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="font-semibold">
            {part.slice(2, -2)}
          </span>
        );
      }
      
      if (part.includes('Wait ')) {
        const waitParts = part.split(/(Wait )(.+?\.)/g);
        return waitParts.map((waitPart, waitIndex) => {
          if (waitPart === 'Wait ') {
            return (
              <span key={`${index}-${waitIndex}`}>
                <br />
                Wait{' '}
              </span>
            );
          }
          if (waitPart.match(/^\d+.*\.$/)) {
            return (
              <span key={`${index}-${waitIndex}`} className="font-semibold">
                {waitPart}
              </span>
            );
          }
          return waitPart;
        });
      }
      
      return part;
    });
  };

  const checkMobileFrame = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isMobile = window.innerWidth < 1024;
    setIsMobileFrame(!isMobile);
  }, []);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current || !headerRef.current || !footerRef.current || !contentRef.current) {
      return;
    }

    const containerHeight = containerRef.current.clientHeight;
    const headerHeight = headerRef.current.clientHeight;
    const footerHeight = footerRef.current.clientHeight;
    
    const availableHeight = containerHeight - headerHeight - footerHeight;
    const contentPadding = 64;
    const textPadding = 136;
    
    const maxImageHeight = availableHeight - contentPadding - textPadding;
    const maxImageWidth = containerRef.current.clientWidth - 128;
    
    let targetSize = Math.min(300, Math.max(200, Math.min(maxImageHeight, maxImageWidth)));
    
    if (illustration === '/illos/Skip authentication.png') {
      targetSize = Math.min(180, targetSize);
    }
    
    setIllustrationSize({
      width: targetSize,
      height: targetSize
    });
  }, [illustration]);

  const dismissMobileKeyboard = () => {
    if (typeof window !== 'undefined') {
      const activeElement = document.activeElement as HTMLInputElement;
      if (activeElement && (activeElement.type === 'text' || activeElement.type === 'number' || activeElement.inputMode === 'decimal')) {
        activeElement.blur();
      }
      
      const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[inputmode="decimal"]');
      inputs.forEach(input => {
        (input as HTMLInputElement).blur();
      });

      if (window.visualViewport) {
        const handleViewportChange = () => {
          if (window.visualViewport!.height === window.innerHeight) {
            window.visualViewport!.removeEventListener('resize', handleViewportChange);
          }
        };
        window.visualViewport.addEventListener('resize', handleViewportChange);
      }
    }
  };

  useEffect(() => {
    checkMobileFrame();
    dismissMobileKeyboard();
    
    const timer = setTimeout(() => {
      calculateLayout();
    }, 100);

    const handleResize = () => {
      checkMobileFrame();
      calculateLayout();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateLayout, checkMobileFrame]);

  useEffect(() => {
    const scrollContainer = containerRef.current?.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      const scrollToBottom = () => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      };
      
      const timer = setTimeout(scrollToBottom, 300);
      return () => clearTimeout(timer);
    }
  }, [title, description, illustration]);

  useEffect(() => {
    calculateLayout();
  }, [title, description, illustration, calculateLayout]);

  const handlePhoneClick = () => {
    console.log('Phone clicked');
  };

  const handleEmailClick = () => {
    console.log('Email clicked');
  };

  const handleChatClick = () => {
    console.log('Chat clicked');
  };

  const handleWaitClick = () => {
    onClose();
  };

  const isSkipAuthenticationOverlay = illustration === '/illos/Skip authentication.png';

  return (
    <motion.div 
      key="overlay-view"
      ref={containerRef}
      className="fixed inset-0 flex flex-col z-50 overflow-hidden"
      style={{ 
        backgroundColor: getBackgroundColor(),
        borderRadius: isMobileFrame ? '2.5rem' : '0'
      }}
      variants={overlaySlideVariants}
      initial="hiddenDown"
      animate="visible"
      exit="exitDown"
    >
      <div ref={headerRef} className="absolute top-0 left-0 right-0 px-4 py-4 flex items-center pt-16 flex-shrink-0 z-10 bg-transparent">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'var(--wise-background-overlay)' }}
        >
          <X className="h-5 w-5 text-wise-content-secondary" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 min-h-0 overflow-y-auto pt-24">
        <motion.div
          ref={contentRef}
          variants={contentBounceVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full text-center flex-1 justify-center py-8"
        >
          <div className="flex-shrink-0 mb-2 w-full flex justify-center">
            <Image
              src={illustration}
              alt="Illustration"
              width={illustrationSize.width}
              height={illustrationSize.height}
              className="object-contain"
              style={{
                width: `${illustrationSize.width}px`,
                height: `${illustrationSize.height}px`,
                maxWidth: '100%'
              }}
            />
          </div>
          
          <div className="flex flex-col items-center w-full text-center space-y-6">
            <h2 className="font-wise text-wise-content-primary text-center leading-tight" style={{ fontSize: '3.8rem', lineHeight: '0.9' }}>
              {title}
            </h2>
            
            <div className={`text-wise-content-secondary leading-relaxed text-center max-w-xs ${isMobileFrame ? 'text-base' : 'text-xs'}`}>
              {parseDescription(description)}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={footerRef} className="flex-shrink-0 px-6 pb-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex justify-center gap-6">
            <button
              onClick={handlePhoneClick}
              className="flex flex-col items-center gap-3 p-4 rounded-lg transition-colors hover:bg-wise-background-overlay"
            >
              <div className="w-16 h-16 bg-wise-interactive-accent rounded-full flex items-center justify-center">
                <Phone className="h-7 w-7 text-wise-interactive-primary" />
              </div>
              <span className="text-wise-link-content font-semibold">
                Phone
              </span>
            </button>

            <button
              onClick={handleEmailClick}
              className="flex flex-col items-center gap-3 p-4 rounded-lg transition-colors hover:bg-wise-background-overlay"
            >
              <div className="w-16 h-16 bg-wise-interactive-accent rounded-full flex items-center justify-center">
                <Mail className="h-7 w-7 text-wise-interactive-primary" />
              </div>
              <span className="text-wise-link-content font-semibold">
                Email
              </span>
            </button>

            <button
              onClick={handleChatClick}
              className="flex flex-col items-center gap-3 p-4 rounded-lg transition-colors hover:bg-wise-background-overlay"
            >
              <div className="w-16 h-16 bg-wise-interactive-accent rounded-full flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-wise-interactive-primary" />
              </div>
              <span className="text-wise-link-content font-semibold">
                Chat
              </span>
            </button>
          </div>

          {isSkipAuthenticationOverlay && (
            <button
              onClick={handleWaitClick}
              className="text-wise-link-content font-semibold underline hover:text-wise-green-forest transition-colors"
            >
              No, I&apos;ll wait
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};