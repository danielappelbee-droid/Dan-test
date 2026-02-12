"use client";

import { ReactNode, useEffect, useState } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function MobileFrame({ children, className = '', noPadding = false }: MobileFrameProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const calculateScale = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const frameHeight = 844;
      const frameWidth = 390;
      const padding = 40;
      
      const availableHeight = viewportHeight - padding;
      const availableWidth = viewportWidth - padding;
      
      const scaleByHeight = availableHeight / frameHeight;
      const scaleByWidth = availableWidth / frameWidth;
      
      const newScale = Math.min(1, Math.min(scaleByHeight, scaleByWidth));
      setScale(newScale);
    };

    const handleResize = () => {
      setVH();
      calculateScale();
    };

    setVH();
    calculateScale();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        setVH();
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, []);

  return (
    <>
      <div className={`hidden md:flex justify-center items-center overflow-hidden ${className}`} style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <div
          className="relative rounded-[3rem] shadow-xl border-8 overflow-hidden"
          style={{
            width: '390px',
            height: '844px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            boxShadow: '0 0 0 8px #ffffff, 0 20px 60px rgba(0, 0, 0, 0.15)',
            backgroundColor: 'white',
            borderColor: 'white'
          }}
        >
          <div
            className="rounded-[2.5rem] h-full w-full overflow-hidden relative"
            style={{
              backgroundColor: 'white'
            }}
          >
            <div
              className={`h-full w-full mobile-prototype-container ${noPadding ? '' : 'pt-12'} relative overflow-y-auto overflow-x-hidden`}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
              }}
            >
              {children}
            </div>
            {/* Inner border overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 0 1px rgba(14, 15, 12, 0.08)',
                borderRadius: '2.5rem',
                zIndex: 9999
              }}
            />
          </div>
        </div>
      </div>

      <div className="md:hidden overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <div className="h-full w-full overflow-y-auto scrollbar-hide" style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none'
        }}>
          {children}
        </div>
      </div>
    </>
  );
}