interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

interface SwitchGroupProps {
  title: string;
  options: { label: string; checked?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean }[];
  className?: string;
}

export function Switch({ label, checked = false, onChange, disabled = false, name, className = '' }: SwitchProps) {
  const handleChange = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleChange(e);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        name={name}
        disabled={disabled}
        onClick={handleChange}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-wise-interactive-accent focus:ring-offset-2
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        style={{
          backgroundColor: checked 
            ? 'var(--wise-interactive-primary)' 
            : 'var(--wise-interactive-secondary)'
        }}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
          style={{
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
          }}
        />
      </button>
      {label && (
        <span 
          className={`ml-3 text-sm font-medium ${
            disabled ? 'text-wise-disabled-text' : 'text-wise-content-primary'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export function SwitchGroup({ title, options, className = '' }: SwitchGroupProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4 text-wise-content-primary">{title}</h3>
      <div className="space-y-4">
        {options.map((option, index) => (
          <Switch
            key={index}
            label={option.label}
            checked={option.checked}
            onChange={option.onChange}
            disabled={option.disabled}
          />
        ))}
      </div>
    </div>
  );
}