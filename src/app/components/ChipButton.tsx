interface ChipButtonOption {
  label: string;
  value: string;
}

interface ChipButtonGroupProps {
  options: ChipButtonOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  fullWidth?: boolean;
}

export default function ChipButtonGroup({
  options,
  selectedValue,
  onChange,
  name,
  className = '',
  fullWidth = false
}: ChipButtonGroupProps) {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <label
            key={option.value}
            className={`${fullWidth ? 'flex-1' : 'inline-flex'} items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all border cursor-pointer relative`}
            style={{
              backgroundColor: isSelected ? 'var(--wise-interactive-neutral)' : 'transparent',
              borderColor: isSelected ? 'var(--wise-interactive-neutral)' : 'var(--wise-border-neutral)',
              color: 'var(--wise-content-primary)',
              display: 'flex'
            }}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(e) => handleChange(e.target.value)}
              className="h-5 w-5 radio-input flex-shrink-0"
              style={{
                borderColor: isSelected ? 'var(--wise-interactive-neutral-hover)' : 'var(--wise-interactive-secondary)',
                backgroundColor: isSelected ? 'var(--wise-interactive-neutral-hover)' : 'transparent'
              }}
            />
            <span className="flex-1 text-center">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
