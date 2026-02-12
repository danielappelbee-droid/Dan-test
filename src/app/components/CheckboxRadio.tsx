interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  className?: string;
}

interface RadioProps {
  label: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
}

interface CheckboxGroupProps {
  title: string;
  options: { label: string; checked?: boolean; onChange?: (checked: boolean) => void }[];
  className?: string;
}

interface RadioGroupProps {
  title: string;
  name: string;
  options: { label: string; value: string }[];
  selectedValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

interface HorizontalRadioGroupProps {
  title: string;
  name: string;
  options: { label: string; value: string }[];
  selectedValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Checkbox({ label, checked, onChange, name, className = '' }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked || false}
        onChange={handleChange}
        className="h-5 w-5 rounded checkbox-input"
        style={{ borderColor: 'var(--wise-interactive-secondary)' }}
      />
      <span className="ml-4 text-sm font-medium text-wise-content-primary">{label}</span>
    </label>
  );
}

export function Radio({ label, value, checked, onChange, name, className = '' }: RadioProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked || false}
        onChange={handleChange}
        className="h-5 w-5 radio-input"
        style={{ borderColor: 'var(--wise-interactive-secondary)' }}
      />
      <span className="ml-4 text-sm font-medium text-wise-content-primary">{label}</span>
    </label>
  );
}

export function CheckboxGroup({ title, options, className = '' }: CheckboxGroupProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4 text-wise-content-primary">{title}</h3>
      <div className="space-y-4">
        {options.map((option, index) => (
          <Checkbox
            key={index}
            label={option.label}
            checked={option.checked}
            onChange={option.onChange}
          />
        ))}
      </div>
    </div>
  );
}

export function RadioGroup({ title, name, options, selectedValue, onChange, className = '' }: RadioGroupProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4 text-wise-content-primary">{title}</h3>
      <div className="space-y-4">
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            name={name}
          />
        ))}
      </div>
    </div>
  );
}

export function HorizontalRadioGroup({ title, name, options, selectedValue, onChange, className = '' }: HorizontalRadioGroupProps) {
  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4 text-wise-content-primary">{title}</h3>
      <div className="flex gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <label
              key={option.value}
              className="inline-flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all border cursor-pointer"
              style={{
                backgroundColor: isSelected ? 'var(--wise-interactive-neutral)' : 'transparent',
                borderColor: isSelected ? 'var(--wise-interactive-neutral)' : 'var(--wise-border-neutral)',
                color: 'var(--wise-content-primary)'
              }}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={(e) => handleChange(e.target.value)}
                className="h-5 w-5 radio-input"
                style={{
                  borderColor: isSelected ? 'var(--wise-interactive-neutral-hover)' : 'var(--wise-interactive-secondary)',
                  backgroundColor: isSelected ? 'var(--wise-interactive-neutral-hover)' : 'transparent'
                }}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}