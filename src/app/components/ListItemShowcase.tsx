import { motion, Variants } from "motion/react";
import { useState } from "react";
import { Edit, Copy, Star, User, Building } from "lucide-react";
import ListItem from "./ListItem";

export default function ListItemShowcase() {
  const [checkboxState, setCheckboxState] = useState(false);
  const [radioState, setRadioState] = useState('');
  const [switchState, setSwitchState] = useState(false);

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
    <div className="space-y-12">
      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Basic List Items with Chevron
        </motion.h3>
        <motion.div 
          className="space-y-2"
          variants={staggeredChildVariants}
        >
          <ListItem
            avatar={{
              size: 48,
              type: 'image',
              src: '/user-avs/female/1.png',
              alt: 'User'
            }}
            content={{
              largeText: 'Joanne Davis',
              smallText: 'joanne@example.com'
            }}
            rightElement={{
              type: 'chevron'
            }}
            onClick={() => console.log('Navigate to Joanne')}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'initials',
              content: 'JD'
            }}
            content={{
              largeText: 'John Smith',
              smallText: 'john@company.com',
              link: {
                text: 'View profile',
                onClick: () => console.log('View profile')
              },
              order: ['large', 'small', 'link']
            }}
            rightElement={{
              type: 'chevron'
            }}
            onClick={() => console.log('Navigate to John')}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          List Items with Currency
        </motion.h3>
        <motion.div 
          className="space-y-2"
          variants={staggeredChildVariants}
        >
          <ListItem
            avatar={{
              size: 48,
              type: 'flag',
              src: '/flags/United States.svg',
              alt: 'USD'
            }}
            content={{
              largeText: 'US Dollar',
              smallText: 'Primary balance'
            }}
            currency={{
              large: '1,250.00 USD',
              small: '912.50 GBP'
            }}
            rightElement={{
              type: 'chevron'
            }}
            onClick={() => console.log('View USD balance')}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'flag',
              src: '/flags/Euro.svg',
              alt: 'EUR'
            }}
            content={{
              largeText: 'Euro',
              smallText: 'Savings account'
            }}
            currency={{
              large: '850.75 EUR',
              small: '735.20 GBP',
              order: ['small', 'large']
            }}
            rightElement={{
              type: 'button',
              button: {
                text: 'Transfer',
                onClick: () => console.log('Transfer EUR')
              }
            }}
            onClick={() => console.log('View EUR balance')}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Interactive List Items
        </motion.h3>
        <motion.div 
          className="space-y-2"
          variants={staggeredChildVariants}
        >
          <ListItem
            avatar={{
              size: 48,
              type: 'icon',
              content: <User className="h-5 w-5" />
            }}
            content={{
              largeText: 'Enable notifications',
              smallText: 'Get updates about your transfers'
            }}
            rightElement={{
              type: 'checkbox',
              checkbox: {
                checked: checkboxState,
                onChange: setCheckboxState,
                name: 'notifications'
              }
            }}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'icon',
              content: <Building className="h-5 w-5" />
            }}
            content={{
              largeText: 'Account type',
              smallText: 'Personal account'
            }}
            rightElement={{
              type: 'radio',
              radio: {
                checked: radioState === 'personal',
                onChange: () => setRadioState('personal'),
                name: 'accountType',
                value: 'personal'
              }
            }}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'initials',
              content: 'BZ'
            }}
            content={{
              largeText: 'Business account',
              smallText: 'Switch to business features'
            }}
            rightElement={{
              type: 'radio',
              radio: {
                checked: radioState === 'business',
                onChange: () => setRadioState('business'),
                name: 'accountType',
                value: 'business'
              }
            }}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'icon',
              content: <Star className="h-5 w-5" />
            }}
            content={{
              largeText: 'Dark mode',
              smallText: 'Use dark theme'
            }}
            rightElement={{
              type: 'switch',
              switch: {
                checked: switchState,
                onChange: setSwitchState,
                name: 'darkMode'
              }
            }}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'image',
              src: '/user-avs/male/5.png',
              alt: 'Document'
            }}
            content={{
              largeText: 'Transfer receipt',
              smallText: 'Download your receipt',
              link: {
                text: 'View details',
                onClick: () => console.log('View details')
              }
            }}
            rightElement={{
              type: 'icon',
              icon: {
                icon: <Copy className="h-5 w-5" />,
                onClick: () => console.log('Copy receipt')
              }
            }}
            onClick={() => console.log('Navigate to receipt')}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Complete Container (Grey Background)
        </motion.h3>
        <motion.div 
          className="space-y-2"
          variants={staggeredChildVariants}
        >
          <ListItem
            avatar={{
              size: 48,
              type: 'initials',
              content: 'CD'
            }}
            content={{
              largeText: 'Clara Davis',
              smallText: 'Completed transfer'
            }}
            currency={{
              large: '500.00 USD',
              small: '365.00 GBP'
            }}
            rightElement={{
              type: 'button',
              button: {
                text: 'Receipt',
                onClick: () => console.log('Download receipt'),
                variant: 'neutral-grey'
              }
            }}
            container="complete"
            onClick={() => console.log('Navigate to Clara transfer')}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'image',
              src: '/user-avs/female/12.png',
              alt: 'Sarah'
            }}
            content={{
              largeText: 'Sarah Wilson',
              smallText: 'Transfer completed'
            }}
            rightElement={{
              type: 'icon',
              icon: {
                icon: <Edit className="h-5 w-5" />,
                onClick: () => console.log('Edit transfer')
              }
            }}
            container="complete"
            onClick={() => console.log('Navigate to Sarah transfer')}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Incomplete Container (Dashed Border)
        </motion.h3>
        <motion.div 
          className="space-y-2"
          variants={staggeredChildVariants}
        >
          <ListItem
            avatar={{
              size: 48,
              type: 'initials',
              content: 'MW'
            }}
            content={{
              largeText: 'Mike Williams',
              smallText: 'Pending verification',
              link: {
                text: 'Complete setup',
                onClick: () => console.log('Complete setup')
              }
            }}
            currency={{
              large: '0.00 USD',
              small: '0.00 GBP'
            }}
            rightElement={{
              type: 'button',
              button: {
                text: 'Verify',
                onClick: () => console.log('Verify account')
              }
            }}
            container="incomplete"
            onClick={() => console.log('Navigate to Mike verification')}
          />
          
          <ListItem
            avatar={{
              size: 48,
              type: 'icon',
              content: <Building className="h-5 w-5" />
            }}
            content={{
              largeText: 'Business setup',
              smallText: 'Complete your business profile'
            }}
            rightElement={{
              type: 'chevron'
            }}
            onClick={() => console.log('Setup business')}
            container="incomplete"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}