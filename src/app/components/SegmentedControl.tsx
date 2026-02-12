"use client";

import { motion } from "motion/react";

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({
  options,
  selectedValue,
  onChange,
  className = ''
}: SegmentedControlProps) {
  const selectedIndex = options.findIndex(option => option.value === selectedValue);
  const isFullWidth = className.includes('w-full');
  const optionCount = options.length;

  // Calculate width and position for dynamic number of options
  const getButtonWidth = () => {
    if (isFullWidth) {
      return `calc((100% - ${(optionCount + 1) * 4}px) / ${optionCount})`;
    }
    return '68px';
  };

  const getPillPosition = () => {
    if (isFullWidth) {
      // For full width, calculate the position based on button width
      const buttonWidth = `((100% - ${(optionCount + 1) * 4}px) / ${optionCount})`;
      if (selectedIndex === 0) {
        return '4px';
      }
      return `calc(${selectedIndex} * (${buttonWidth} + 4px) + 4px)`;
    }
    // For fixed width - each button is 68px + 4px gap
    if (selectedIndex === 0) {
      return '4px';
    }
    return `calc(4px + ${selectedIndex} * 72px)`;
  };

  return (
    <div
      className={`flex gap-1 p-1 rounded-full relative bg-wise-background-neutral ${className}`}
    >
      {/* Animated background pill */}
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: 'white',
          height: 'calc(100% - 8px)',
          top: '4px',
          zIndex: 1,
          width: isFullWidth ? `calc((100% - ${(optionCount + 1) * 4}px) / ${optionCount})` : '68px',
        }}
        initial={false}
        animate={{
          left: getPillPosition(),
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />

      {/* Options */}
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="rounded-full text-sm relative whitespace-nowrap flex items-center justify-center"
            style={{
              color: 'var(--wise-content-primary)',
              fontWeight: isSelected ? 600 : 400,
              zIndex: 2,
              width: getButtonWidth(),
              height: '32px',
              flex: isFullWidth ? 1 : 'none',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface SegmentedControlGroupProps {
  title: string;
  options: SegmentedControlOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControlGroup({
  title,
  options,
  selectedValue,
  onChange,
  className = ''
}: SegmentedControlGroupProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4 text-wise-content-primary">{title}</h3>
      <SegmentedControl
        options={options}
        selectedValue={selectedValue}
        onChange={onChange}
      />
    </div>
  );
}
