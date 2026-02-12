/**
 * Core Screen: Form Screen
 *
 * Input collection with validation and submission.
 * Copy this to your prototype and customize as needed.
 *
 * @example
 * ```tsx
 * <FormScreen
 *   title="Transfer details"
 *   fields={[
 *     { id: "amount", type: "number", label: "Amount", required: true },
 *     { id: "reference", type: "text", label: "Reference", placeholder: "Optional" }
 *   ]}
 *   onSubmit={(values) => console.log(values)}
 *   submitText="Continue"
 * />
 * ```
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { RadioGroup } from '../../components/CheckboxRadio';
import Footer from '../../components/Footer';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  helperText?: string;
  validator?: (value: any) => string | null;
}

export interface FormScreenProps {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Form fields */
  fields: FormField[];
  /** Back button handler */
  onBack?: () => void;
  /** Form submission handler */
  onSubmit: (values: Record<string, any>) => void;
  /** Submit button text */
  submitText?: string;
  /** Initial form values */
  initialValues?: Record<string, any>;
  /** Show skip button */
  showSkip?: boolean;
  /** Skip button handler */
  onSkip?: () => void;
  /** Animation direction */
  animationDirection?: 'left' | 'right';
}

export default function FormScreen({
  title,
  description,
  fields,
  onBack,
  onSubmit,
  submitText = "Continue",
  initialValues = {},
  showSkip = false,
  onSkip,
  animationDirection = 'right'
}: FormScreenProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = values[field.id];

      // Required validation
      if (field.required && (!value || value === '')) {
        newErrors[field.id] = `${field.label} is required`;
      }

      // Custom validator
      if (field.validator && value) {
        const error = field.validator(value);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(values);
    }
  };

  const slideVariants = {
    enter: {
      x: animationDirection === 'right' ? '100%' : '-100%',
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-wise-background-screen flex flex-col"
      variants={slideVariants}
      initial="enter"
      animate="center"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-wise-background-neutral rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-wise-content-primary" />
            </button>
          )}
          <h1 className="font-wise text-2xl">{title}</h1>
        </div>
        {description && (
          <p className="text-wise-content-secondary mt-2">{description}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="space-y-6 mt-4">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {field.type === 'radio' && field.options ? (
                <RadioGroup
                  title={field.label}
                  name={field.id}
                  options={field.options}
                  selectedValue={values[field.id] || ''}
                  onChange={(value) => handleChange(field.id, value)}
                  required={field.required}
                />
              ) : (
                <div>
                  <FormInput
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={values[field.id] || ''}
                    onChange={(value) => handleChange(field.id, value)}
                    options={field.options}
                    rows={field.rows}
                    required={field.required}
                    error={errors[field.id]}
                  />
                  {field.helperText && !errors[field.id] && (
                    <p className="text-sm text-wise-content-tertiary mt-2">
                      {field.helperText}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer with Buttons */}
      <div className="px-6 pb-6 space-y-3">
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmit}
          className="w-full"
        >
          {submitText}
        </Button>
        {showSkip && onSkip && (
          <Button
            variant="neutral-grey"
            size="large"
            onClick={onSkip}
            className="w-full"
          >
            Skip
          </Button>
        )}
      </div>

      <Footer />
    </motion.div>
  );
}
