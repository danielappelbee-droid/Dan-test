import { motion, Variants } from "motion/react";
import { 
  Plus, Edit, Download, Settings, Home,
  Heart, Star, User, Calendar, MapPin, Share, Trash2
} from "lucide-react";
import Button from "./Button";

interface IconData {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
}

interface ButtonVariantProps {
  title: string;
  variant: 'primary' | 'neutral' | 'neutral-grey' | 'outline';
  icons: IconData[];
}

const ButtonVariant = ({ title, variant, icons }: ButtonVariantProps) => {
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
    <motion.div
      variants={staggeredContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.h3 className="text-xl font-medium mb-6" variants={staggeredChildVariants}>{title}</motion.h3>
      <motion.div 
        className="flex flex-wrap gap-4 items-center"
        variants={staggeredChildVariants}
      >
        <div>
          <Button variant={variant} size="small">Small</Button>
        </div>
        <div>
          <Button variant={variant} size="medium">Medium</Button>
        </div>
        <div>
          <Button variant={variant} size="large">Large</Button>
        </div>
        <div>
          <Button variant={variant} size="large" disabled>Disabled</Button>
        </div>
        
        {icons.slice(0, 3).map(({ Icon }, index) => (
          <div key={index}>
            <Button variant={variant} size={index === 0 ? "small" : index === 1 ? "medium" : "large"} iconOnly>
              <Icon className={`h-${index === 0 ? 4 : index === 1 ? 5 : 6} w-${index === 0 ? 4 : index === 1 ? 5 : 6}`} />
            </Button>
          </div>
        ))}
        
        <div>
          <Button variant={variant} size="large" iconOnly disabled>
            <Edit className="h-6 w-6" />
          </Button>
        </div>
        
        {icons.slice(0, 3).map(({ Icon, name }, index) => (
          <div key={index}>
            <Button variant={variant} size={index === 0 ? "small" : index === 1 ? "medium" : "large"}>
              <Icon className={`h-${index === 0 ? 4 : index === 1 ? 5 : 6} w-${index === 0 ? 4 : index === 1 ? 5 : 6}`} />
              {name}
            </Button>
          </div>
        ))}
        
        <div>
          <Button variant={variant} size="large" disabled>
            <Settings className="h-6 w-6" />
            Disabled
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ButtonShowcase() {
  const buttonVariants: ButtonVariantProps[] = [
    {
      title: "Primary Buttons",
      variant: "primary",
      icons: [
        { Icon: Plus, name: "Save" },
        { Icon: Download, name: "Send Message" },
        { Icon: Share, name: "Download File" }
      ]
    },
    {
      title: "Neutral Buttons", 
      variant: "neutral",
      icons: [
        { Icon: Edit, name: "Edit" },
        { Icon: Settings, name: "Settings" },
        { Icon: Home, name: "Upload Files" }
      ]
    },
    {
      title: "Neutral Grey Buttons",
      variant: "neutral-grey",
      icons: [
        { Icon: User, name: "Profile" },
        { Icon: Calendar, name: "Schedule" },
        { Icon: MapPin, name: "Location" }
      ]
    },
    {
      title: "Outline Buttons",
      variant: "outline",
      icons: [
        { Icon: Heart, name: "Like" },
        { Icon: Star, name: "Favorite" },
        { Icon: Trash2, name: "Delete Item" }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {buttonVariants.map((variant, index) => (
        <ButtonVariant key={index} {...variant} />
      ))}
    </div>
  );
}