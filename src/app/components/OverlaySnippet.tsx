import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle } from 'lucide-react';
import { SnippetData, SnippetContent } from '../utils/snippetService';
import { aiService } from '../utils/aiService';
import { contextService } from '../utils/contextService';

const LoadingSkeleton: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
  width = "100%", 
  height = "1rem", 
  className = "" 
}) => (
  <motion.div
    className={`bg-white bg-opacity-20 rounded ${className}`}
    style={{ width, height }}
    animate={{
      opacity: [0.2, 0.4, 0.2],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

interface OverlaySnippetProps {
  snippetData: SnippetData;
  onClose: () => void;
  onHelp?: () => void;
}

export const OverlaySnippet: React.FC<OverlaySnippetProps> = ({
  snippetData,
  onClose,
  onHelp
}) => {
  const [question, setQuestion] = useState('');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentSnippetData, setCurrentSnippetData] = useState(snippetData);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const checkMobileFrame = React.useCallback(() => {
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

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim() || isLoadingAI) return;

    const userQuestion = question.trim();
    setQuestion('');
    setIsLoadingAI(true);

    try {
      // Gather transfer context
      const transferContext = contextService.gatherTransferContext();
      
      // Generate AI response
      const aiResponse = await aiService.generateAnswer(userQuestion, transferContext);
      
      if (aiResponse) {
        // Create new snippet content from AI response
        const newContent: SnippetContent = {
          id: 'ai-generated',
          title: aiResponse.header,
          intro: aiResponse.subheading,
          bullets: aiResponse.bullets
        };

        // Update snippet data
        const newSnippetData: SnippetData = {
          content: newContent,
          theme: currentSnippetData.theme // Keep same theme
        };

        setCurrentSnippetData(newSnippetData);
      } else {
        // Fallback if AI fails
        console.log('AI failed, showing helpful fallback');
        const fallbackContent: SnippetContent = {
          id: 'ai-fallback',
          title: 'We\'re here to help',
          intro: 'Our AI assistant is temporarily unavailable, but we have helpful information ready.',
          bullets: [
            'Large transfers usually take 1-6 working days to complete',
            'You can track your transfer progress in the Wise app',
            'Contact support if you need immediate assistance'
          ]
        };

        const fallbackSnippetData: SnippetData = {
          content: fallbackContent,
          theme: currentSnippetData.theme
        };

        setCurrentSnippetData(fallbackSnippetData);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Keep original snippet on error
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitQuestion();
    }
  };

  const handleHelp = () => {
    if (onHelp) {
      onHelp();
    } else {
      console.log('Help clicked');
    }
  };

  return (
    <motion.div 
      key="overlay-snippet"
      ref={containerRef}
      className="fixed inset-0 flex flex-col z-50 overflow-hidden"
      style={{ 
        backgroundColor: currentSnippetData.theme.backgroundColor,
        borderRadius: isMobileFrame ? '2.5rem' : '0'
      }}
      variants={overlaySlideVariants}
      initial="hiddenDown"
      animate="visible"
      exit="exitDown"
    >
      <div className="absolute top-0 left-0 right-0 px-4 py-4 flex items-center justify-between pt-16 flex-shrink-0 z-10 bg-transparent">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <X className="h-5 w-5" style={{ color: currentSnippetData.theme.textColor }} />
        </button>
        
        <button
          onClick={handleHelp}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <HelpCircle className="h-5 w-5" style={{ color: currentSnippetData.theme.textColor }} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 min-h-0 overflow-y-auto pt-32 pb-8">
        <AnimatePresence mode="wait">
          {isLoadingAI ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col w-full text-left flex-1"
            >
              <div className="mb-8 mt-2">
                <div className="mb-6">
                  <LoadingSkeleton width="90%" height="3.2rem" className="mb-4" />
                  <LoadingSkeleton width="70%" height="3.2rem" />
                </div>
                
                <div className="mb-6">
                  <LoadingSkeleton width="100%" height="1rem" className="mb-2" />
                  <LoadingSkeleton width="85%" height="1rem" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <LoadingSkeleton width="8px" height="8px" className="mt-2 rounded-full" />
                    <LoadingSkeleton width="95%" height="1rem" />
                  </div>
                  <div className="flex items-start gap-3">
                    <LoadingSkeleton width="8px" height="8px" className="mt-2 rounded-full" />
                    <LoadingSkeleton width="80%" height="1rem" />
                  </div>
                  <div className="flex items-start gap-3">
                    <LoadingSkeleton width="8px" height="8px" className="mt-2 rounded-full" />
                    <LoadingSkeleton width="90%" height="1rem" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={contentBounceVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col w-full text-left flex-1"
            >
              <div className="mb-8 mt-2">
                <h1 
                  className="font-wise mb-6 text-left leading-tight" 
                  style={{ 
                    fontSize: '3.2rem', 
                    lineHeight: '0.9',
                    color: currentSnippetData.theme.textColor
                  }}
                >
                  {currentSnippetData.content.title.toUpperCase()}
                </h1>
                
                <p 
                  className="text-left leading-relaxed mb-6"
                  style={{ 
                    color: currentSnippetData.theme.textColor,
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    fontWeight: '600'
                  }}
                >
                  {currentSnippetData.content.intro}
                </p>
                
                <ul className="space-y-4">
                  {currentSnippetData.content.bullets.map((bullet, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <span 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: currentSnippetData.theme.textColor }}
                      />
                      <span 
                        className="leading-relaxed"
                        style={{ 
                          color: currentSnippetData.theme.textColor,
                          fontSize: '1rem',
                          lineHeight: '1.5'
                        }}
                      >
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0 px-6 pb-8">
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder={isLoadingAI ? "Generating response..." : "Ask a question..."}
              value={question}
              onChange={handleQuestionChange}
              onKeyPress={handleKeyPress}
              disabled={isLoadingAI}
              className={`w-full px-5 py-4 rounded-full outline-none transition-all duration-200 ease-in-out bg-transparent text-base ${isLoadingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                border: `2px solid ${currentSnippetData.theme.borderColor}`,
                color: currentSnippetData.theme.textColor
              }}
            />
            <style jsx>{`
              input::placeholder {
                color: ${currentSnippetData.theme.textColor};
                opacity: 0.7;
              }
              input:disabled::placeholder {
                opacity: 0.4;
              }
            `}</style>
          </div>
          
          <div className="text-center">
            <button
              onClick={onClose}
              className="font-semibold underline transition-colors text-base"
              style={{ color: currentSnippetData.theme.textColor }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};