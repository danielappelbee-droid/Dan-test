import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, Gift, TrendingUp, Banknote, HelpCircle, ArrowLeft,
  RefreshCcw, ShoppingBag, RotateCcw, ArrowDownToLine, Plane, Coins, MoreHorizontal
} from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import ListItem from '../../components/ListItem';
import { metaResearchService } from '../../utils/metaResearchService';

interface ReasonOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ReasonMainViewProps {
  onBack?: () => void;
  onContinue?: () => void;
  onSkip?: () => void;
}

// Icon mapping for dynamic icon selection
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Home': Home,
  'Gift': Gift,
  'TrendingUp': TrendingUp,
  'Plane': Plane,
  'Coins': Coins,
  'MoreHorizontal': MoreHorizontal,
  'RefreshCcw': RefreshCcw,
  'ShoppingBag': ShoppingBag,
  'RotateCcw': RotateCcw,
  'Banknote': Banknote,
  'ArrowDownToLine': ArrowDownToLine
};

const getReasonOptions = (): ReasonOption[] => {
  const reasonConfig = metaResearchService.getReasonConfiguration();
  
  return reasonConfig.options.map(option => ({
    id: option.id,
    label: option.title,
    icon: iconMap[option.iconName] || HelpCircle
  }));
};

const saveReasonData = (reason: string) => {
  if (typeof window !== 'undefined') {
    const reasonData = {
      selectedReason: reason
    };
    
    try {
      window.sessionStorage.setItem('reasonData', JSON.stringify(reasonData));
    } catch (e) {
      console.warn('Could not save reason data:', e);
    }
  }
};

export const ReasonMainView = React.memo<ReasonMainViewProps>(function ReasonMainView({ onBack, onContinue, onSkip }) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const reasonOptions = getReasonOptions();

  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8
  };

  const slideVariants = {
    visible: { 
      x: 0,
      transition: springTransition
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Back button clicked');
    }
  };

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
  };

  const handleContinue = () => {
    saveReasonData(selectedReason);
    if (onContinue) {
      onContinue();
    } else {
      console.log('Continue with reason:', selectedReason);
    }
  };

  const handleSkip = () => {
    saveReasonData('other');
    if (onSkip) {
      onSkip();
    } else {
      console.log('Skip reason selection');
    }
  };

  return (
    <motion.div 
      key="reason-main"
      className="h-full bg-wise-background-screen flex flex-col pb-20"
      variants={slideVariants}
      initial="visible"
      animate="visible"
    >
      <div className="px-4 py-4 flex items-center">
        <Button
          variant="neutral-grey"
          size="large"
          iconOnly
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-8">
          <div className="text-left mb-8">
            <h3 className="text-wise-content-primary font-semibold mb-4" style={{ fontSize: '1.75rem', lineHeight: '1.75rem' }}>
              What&apos;s your reason for sending money?
            </h3>
            
            <p className="text-wise-content-secondary text-sm leading-relaxed">
              Large transfers are a big deal. We&apos;ll use this information to give you personalized guidance and make sending money as smooth as possible.
            </p>
          </div>

          <div className="space-y-2 pb-16">
            {reasonOptions.map((reason) => {
              const IconComponent = reason.icon;
              
              return (
                <ListItem
                  key={reason.id}
                  avatar={{
                    size: 48,
                    type: 'icon',
                    content: <IconComponent className="h-5 w-5" />
                  }}
                  content={{
                    largeText: reason.label
                  }}
                  rightElement={{
                    type: 'radio',
                    radio: {
                      checked: selectedReason === reason.id,
                      onChange: () => handleReasonSelect(reason.id),
                      name: 'reason',
                      value: reason.id
                    }
                  }}
                  onClick={() => handleReasonSelect(reason.id)}
                  className="px-4 cursor-pointer"
                />
              );
            })}
          </div>
        </div>
      </div>

      <Footer className="px-4 pt-4 pb-8">
        <div className="space-y-4">
          <Button
            variant="primary"
            size="large"
            onClick={handleContinue}
            disabled={!selectedReason}
            className="w-full"
          >
            Continue
          </Button>
          
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-wise-link-content font-semibold underline hover:text-wise-green-forest transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </Footer>
    </motion.div>
  );
});