"use client";

import { motion, Variants } from "motion/react";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import { Smartphone, Palette, Layout, ArrowRightLeft, FileText } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const titleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    }
  };

  const subtitleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  const buttonVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  const featureVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  const features = [
    {
      icon: Smartphone,
      title: "Interactive Prototypes",
      description: "Explore fully functional mobile app flows and screens, designed in the Wise style",
      route: "/prototypes"
    },
    {
      icon: Layout,
      title: "Core Screens",
      description: "Reference screen patterns to copy and customize for your prototypes",
      route: "/screens-list"
    },
    {
      icon: Palette,
      title: "Design Components",
      description: "View the complete library of reusable UI components from the Wise design system",
      route: "/components-showcase"
    }
  ];

  return (
    <div className="min-h-screen bg-wise-background-screen">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-wise mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: '0.9' }}
            variants={titleVariants}
          >
            Wise Prototyping Workshop
          </motion.h1>

          <motion.p
            className="text-wise-content-secondary text-xl md:text-2xl max-w-3xl mx-auto"
            variants={subtitleVariants}
          >
            A showcase of mobile app prototypes and design components. Explore interactive flows, browse individual screens, and discover the building blocks of the Wise design system.
          </motion.p>
        </motion.div>

        {/* Prototypes Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Briefs card */}
            <motion.div
              variants={featureVariants}
              className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral cursor-pointer"
              onClick={() => router.push("/guides/briefs")}
              whileHover={{
                y: -4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-6">
                <div className="bg-wise-interactive-accent rounded-2xl p-3">
                  <FileText className="w-6 h-6 text-wise-interactive-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-wise-content-primary mb-2">
                    Design Briefs
                  </h3>
                  <p className="text-wise-content-secondary leading-relaxed">
                    Design briefs and challenges for prototyping workshops
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={featureVariants}
              className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral cursor-pointer"
              onClick={() => router.push("/prototypes/sendmoney")}
              whileHover={{
                y: -4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-6">
                <div className="bg-wise-interactive-accent rounded-2xl p-3">
                  <ArrowRightLeft className="w-6 h-6 text-wise-interactive-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-wise-content-primary mb-2">
                    Send Money Flow
                  </h3>
                  <p className="text-wise-content-secondary leading-relaxed">
                    Complete end-to-end money transfer flow with recipient selection, amount input, and confirmation
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Placeholder card */}
            <motion.div
              variants={featureVariants}
              className="bg-wise-background-elevated rounded-[40px] p-8 border-2 border-dashed border-wise-border-neutral flex items-center justify-center min-h-[140px]"
            >
              <div className="text-center gap-2 flex flex-col">
                <p className="text-wise-content-tertiary text-xl font-semibold">
                  Your prototype here
                </p>
                <p className="text-wise-content-secondary">(just ask Claude...)</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* References Section */}
        <h2 className="font-wise text-4xl mb-8">References</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral cursor-pointer"
              onClick={() => router.push(feature.route)}
              whileHover={{
                y: -4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-wise-interactive-accent rounded-2xl p-3">
                  <feature.icon className="w-6 h-6 text-wise-interactive-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-wise-content-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-wise-content-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Footer */}
      <motion.div
        className="border-t border-wise-border-neutral py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-wise-content-tertiary text-sm">
            Built with Next.js, Tailwind CSS, and the Wise design system
          </p>
        </div>
      </motion.div>
    </div>
  );
}
