import { motion, Variants } from "motion/react";
import { User, Building, Star, Heart, Settings } from "lucide-react";
import Avatar from "./Avatar";

export default function AvatarShowcase() {
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

  const sizes: Array<24 | 40 | 48 | 56 | 72> = [24, 40, 48, 56, 72];

  return (
    <div className="space-y-12">
      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Initials Avatars
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-4"
          variants={staggeredChildVariants}
        >
          {sizes.map((size) => (
            <div key={`initials-${size}`} className="flex flex-col items-center gap-2">
              <Avatar
                size={size}
                type="initials"
                content="WW"
              />
              <span className="text-xs text-wise-content-tertiary">{size}px</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Icon Avatars
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-4"
          variants={staggeredChildVariants}
        >
          {sizes.map((size, index) => {
            const icons = [User, Building, Star, Heart, Settings];
            const IconComponent = icons[index % icons.length];
            return (
              <div key={`icon-${size}`} className="flex flex-col items-center gap-2">
                <Avatar
                  size={size}
                  type="icon"
                  content={<IconComponent />}
                />
                <span className="text-xs text-wise-content-tertiary">{size}px</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Flag Avatars
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-4"
          variants={staggeredChildVariants}
        >
          {sizes.map((size, index) => {
            const flags = [
              "/flags/United States.svg",
              "/flags/United Kingdom.svg", 
              "/flags/Euro.svg",
              "/flags/Japan.svg",
              "/flags/Australia.svg"
            ];
            return (
              <div key={`flag-${size}`} className="flex flex-col items-center gap-2">
                <Avatar
                  size={size}
                  type="flag"
                  src={flags[index % flags.length]}
                  alt={`Flag ${index + 1}`}
                />
                <span className="text-xs text-wise-content-tertiary">{size}px</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          User Avatars
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-4"
          variants={staggeredChildVariants}
        >
          {sizes.map((size, index) => {
            const avatars = [
              "/user-avs/female/1.png",
              "/user-avs/male/5.png",
              "/user-avs/female/12.png",
              "/user-avs/male/8.png",
              "/user-avs/female/25.png"
            ];
            return (
              <div key={`user-${size}`} className="flex flex-col items-center gap-2">
                <Avatar
                  size={size}
                  type="image"
                  src={avatars[index % avatars.length]}
                  alt={`User ${index + 1}`}
                />
                <span className="text-xs text-wise-content-tertiary">{size}px</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-6" variants={staggeredChildVariants}>
          Avatars with Flag Badges
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-6"
          variants={staggeredChildVariants}
        >
          <Avatar 
            size={72} 
            type="image" 
            src="/user-avs/female/1.png" 
            alt="User" 
            badges={[
              { type: 'flag', src: '/flags/United Kingdom.svg', alt: 'UK' }
            ]}
          />
          <Avatar 
            size={56} 
            type="initials" 
            content="JS" 
            badges={[
              { type: 'flag', src: '/flags/United States.svg', alt: 'US' },
              { type: 'flag', src: '/flags/Euro.svg', alt: 'EU' }
            ]}
          />
          <Avatar 
            size={48} 
            type="image" 
            src="/user-avs/male/8.png" 
            alt="User"
            badges={[
              { type: 'flag', src: '/flags/Canada.svg', alt: 'Canada' }
            ]}
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
          Avatars with Bank Badges
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-6"
          variants={staggeredChildVariants}
        >
          <Avatar 
            size={72} 
            type="image" 
            src="/user-avs/male/15.png" 
            alt="User" 
            badges={[
              { type: 'image', src: '/banks/uk/hsbc.jpeg', alt: 'HSBC' }
            ]}
          />
          <Avatar 
            size={56} 
            type="initials" 
            content="MW" 
            badges={[
              { type: 'image', src: '/banks/us/jpmorgan.webp', alt: 'JPMorgan' },
              { type: 'image', src: '/banks/uk/barclays.webp', alt: 'Barclays' }
            ]}
          />
          <Avatar 
            size={48} 
            type="image" 
            src="/user-avs/female/25.png" 
            alt="User"
            badges={[
              { type: 'image', src: '/banks/us/bankofamerica.webp', alt: 'Bank of America' }
            ]}
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
          Avatars with Status Icon Badges
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-6"
          variants={staggeredChildVariants}
        >
          <Avatar 
            size={72} 
            type="image" 
            src="/user-avs/female/12.png" 
            alt="User" 
            badges={[
              { type: 'icon', iconVariant: 'done' }
            ]}
          />
          <Avatar 
            size={56} 
            type="initials" 
            content="AB" 
            badges={[
              { type: 'icon', iconVariant: 'todo' },
              { type: 'icon', iconVariant: 'attention' }
            ]}
          />
          <Avatar 
            size={48} 
            type="image" 
            src="/user-avs/male/5.png" 
            alt="User"
            badges={[
              { type: 'icon', iconVariant: 'pending' }
            ]}
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
          Mixed Badge Examples
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-6"
          variants={staggeredChildVariants}
        >
          <Avatar 
            size={72} 
            type="image" 
            src="/user-avs/male/15.png" 
            alt="User" 
            badges={[
              { type: 'flag', src: '/flags/United Kingdom.svg', alt: 'UK' },
              { type: 'icon', iconVariant: 'done' }
            ]}
          />
          <Avatar 
            size={56} 
            type="initials" 
            content="SW" 
            badges={[
              { type: 'image', src: '/banks/us/wellsfargo.webp', alt: 'Wells Fargo' },
              { type: 'icon', iconVariant: 'attention' }
            ]}
          />
          <Avatar 
            size={48} 
            type="icon" 
            content={<Building />}
            badges={[
              { type: 'flag', src: '/flags/Euro.svg', alt: 'EU' }
            ]}
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
          Status Badge Variations
        </motion.h3>
        <motion.div 
          className="flex flex-wrap items-center gap-4"
          variants={staggeredChildVariants}
        >
          <div className="flex flex-col items-center gap-2">
            <Avatar 
              size={56} 
              type="initials" 
              content="TD" 
              badges={[{ type: 'icon', iconVariant: 'todo' }]}
            />
            <span className="text-xs text-wise-content-tertiary">Todo</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar 
              size={56} 
              type="initials" 
              content="DN" 
              badges={[{ type: 'icon', iconVariant: 'done' }]}
            />
            <span className="text-xs text-wise-content-tertiary">Done</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar 
              size={56} 
              type="initials" 
              content="AT" 
              badges={[{ type: 'icon', iconVariant: 'attention' }]}
            />
            <span className="text-xs text-wise-content-tertiary">Attention</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar 
              size={56} 
              type="initials" 
              content="PD" 
              badges={[{ type: 'icon', iconVariant: 'pending' }]}
            />
            <span className="text-xs text-wise-content-tertiary">Pending</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}