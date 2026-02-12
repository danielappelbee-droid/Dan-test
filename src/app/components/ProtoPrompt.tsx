"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface ProtoPromptProps {
  prompts: string[];
  title?: string;
  className?: string;
}

export default function ProtoPrompt({ prompts, title = "Test the prototype:", className = '' }: ProtoPromptProps) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={`hidden lg:block fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="flex flex-col items-end">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="mb-4 bg-white rounded-2xl p-6 shadow-xl max-w-xs border"
              style={{ 
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                borderColor: 'var(--wise-border-neutral)'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--wise-sentiment-warning-secondary)' }}
                >
                  <Lightbulb className="h-3 w-3 text-wise-content-primary" />
                </div>
                <h3 className="font-semibold text-wise-content-primary text-sm">
                  {title}
                </h3>
              </div>
              <ul className="space-y-2">
                {prompts.map((prompt, index) => {
                  // Split by both currency amounts and bold text markers
                  const parts = prompt.split(/(\*[^*]+\*|\d+(?:,\d{3})*\.?\d*\s[A-Z]{3}|€\d+(?:,\d{3})*\.?\d*\sEUR|\$\d+(?:,\d{3})*\.?\d*\s[A-Z]{3})/g);
                  
                  return (
                    <li 
                      key={index}
                      className="text-xs text-wise-content-secondary leading-relaxed flex items-start gap-2"
                    >
                      <span className="w-1 h-1 bg-wise-content-tertiary rounded-full mt-2 flex-shrink-0" />
                      <span>
                        {parts.map((part, partIndex) => {
                          // Handle bold text wrapped in asterisks
                          if (part.startsWith('*') && part.endsWith('*')) {
                            return (
                              <span key={partIndex} className="font-semibold">
                                {part.slice(1, -1)}
                              </span>
                            );
                          }
                          // Handle currency amounts
                          if (/\d+(?:,\d{3})*\.?\d*\s[A-Z]{3}|€\d+(?:,\d{3})*\.?\d*\sEUR|\$\d+(?:,\d{3})*\.?\d*\s[A-Z]{3}/.test(part)) {
                            return (
                              <span key={partIndex} className="font-semibold">
                                {part}
                              </span>
                            );
                          }
                          return part;
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={toggleVisibility}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border"
          style={{ 
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            borderColor: 'var(--wise-border-neutral)'
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
        >
          {isVisible ? (
            <ChevronDown className="h-5 w-5 text-wise-content-secondary" />
          ) : (
            <ChevronUp className="h-5 w-5 text-wise-content-secondary" />
          )}
        </motion.button>
      </div>
    </div>
  );
}