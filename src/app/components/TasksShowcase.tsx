import { motion, Variants } from "motion/react";
import { User } from "lucide-react";
import Tasks from "./Tasks";

export default function TasksShowcase() {
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

  const sampleTasks = [
    {
      id: 'sending-money',
      title: 'Sending money',
      subtitle: 'Tell us who you\'re sending to',
      buttonText: 'Add recipient',
      avatar: {
        type: 'icon' as const,
        icon: User
      },
      onTaskClick: () => console.log('Task container clicked'),
      onButtonClick: () => console.log('Add recipient clicked')
    }
  ];

  const multipleTasks = [
    {
      id: 'task-1',
      title: 'Sending money',
      subtitle: 'Tell us who you\'re sending to',
      buttonText: 'Add recipient',
      avatar: {
        type: 'icon' as const,
        icon: User
      },
      onTaskClick: () => console.log('Task 1 container clicked'),
      onButtonClick: () => console.log('Task 1 button clicked')
    },
    {
      id: 'task-2', 
      title: '',
      subtitle: '',
      buttonText: '',
      avatar: {
        type: 'initials' as const,
        content: ''
      },
      onTaskClick: () => console.log('Task 2 container clicked'),
      onButtonClick: () => console.log('Task 2 button clicked')
    }
  ];

  return (
    <div className="space-y-24">
      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-8" variants={staggeredChildVariants}>
          Single Task Card
        </motion.h3>
        <motion.div variants={staggeredChildVariants} className="mb-16">
          <Tasks tasks={sampleTasks} />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggeredContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-lg font-medium mb-8" variants={staggeredChildVariants}>
          Stacked Task Cards
        </motion.h3>
        <motion.div variants={staggeredChildVariants} className="mb-16">
          <Tasks tasks={multipleTasks} />
        </motion.div>
      </motion.div>
    </div>
  );
}