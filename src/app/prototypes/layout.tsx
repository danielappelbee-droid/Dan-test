"use client";

import { ReactNode, Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import MobileFrame from '../components/MobileFrame';
import BackButton from '../components/BackButton';
import ProtoPrompt from '../components/ProtoPrompt';
import { navigationService } from '../utils/navigationService';
import { metaResearchService } from '../utils/metaResearchService';

interface PrototypesLayoutProps {
  children: ReactNode;
}

export default function PrototypesLayout({ children }: PrototypesLayoutProps) {
  const pathname = usePathname();
  
  // Reset research configuration when arriving from /prototypes to avoid conflicts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;

      // Check if user came from /prototypes page (not from research or other flows)
      if (referrer.includes(`${currentOrigin}/prototypes`) && !referrer.includes('/research')) {
        metaResearchService.reset();
      }

      // Only reset if user came from external site or prototypes index (but preserve research data)
      // Check if we have existing research data before resetting
      const hasResearchData = window.sessionStorage.getItem('researchData');
      if ((!referrer || !referrer.startsWith(currentOrigin)) && !hasResearchData) {
        metaResearchService.reset();
      }
    }
  }, []);
  
  // Determine if we're on a prototype page that needs the frame
  const isPrototypePage = pathname.startsWith('/prototypes/') && 
    pathname !== '/prototypes';
  
  const promptConfig = metaResearchService.getPromptConfiguration(pathname);

  // Determine the back route based on current pathname
  let backRoute: string;
  if (pathname === '/prototypes/home' || pathname === '/prototypes/sendmoney') {
    backRoute = '/';
  } else {
    backRoute = navigationService.getBackRoute('/prototypes/sendmoney');
  }
  
  // Remove padding for verification and checklist prototypes
  const shouldRemovePadding = pathname === '/prototypes/verification' || pathname === '/prototypes/checklist';

  if (!isPrototypePage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-wise-background-screen overflow-hidden">
      <BackButton href={backRoute} />

      <MobileFrame noPadding={shouldRemovePadding}>
        <Suspense fallback={
          <div className="h-full flex items-center justify-center">
            <div className="text-wise-content-secondary">Loading...</div>
          </div>
        }>
          <div className="h-full relative">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
              className="h-full absolute inset-0"
            >
              {children}
            </motion.div>
          </div>
        </Suspense>
      </MobileFrame>

      <ProtoPrompt prompts={promptConfig.content} title={promptConfig.title} />
    </div>
  );
}