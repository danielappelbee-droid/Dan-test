import { useState } from 'react';
import { ChevronDown, Search, Upload, Calendar, Clock, Eye, EyeOff, CircleX } from 'lucide-react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'textarea' | 'select' | 'search' | 'file' | 'range' | 'phone' | 'datepicker';
  placeholder?: string;
  value?: string | number | { countryCode: string; phoneNumber: string } | { day: number | string; month: number | string; year: number | string };
  onChange?: (value: string | number | { countryCode: string; phoneNumber: string } | { day: number | string; month: number | string; year: number | string }) => void;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  className?: string;
}

interface CountryCode {
  code: string;
  country: string;
}

const countryCodes: CountryCode[] = [
  { code: '+1', country: 'United States' },
  { code: '+1', country: 'Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+31', country: 'Netherlands' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+45', country: 'Denmark' },
  { code: '+358', country: 'Finland' },
  { code: '+41', country: 'Switzerland' },
  { code: '+43', country: 'Austria' },
  { code: '+32', country: 'Belgium' },
  { code: '+351', country: 'Portugal' },
  { code: '+353', country: 'Ireland' },
  { code: '+30', country: 'Greece' },
  { code: '+48', country: 'Poland' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+36', country: 'Hungary' },
  { code: '+40', country: 'Romania' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+385', country: 'Croatia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+421', country: 'Slovakia' },
  { code: '+370', country: 'Lithuania' },
  { code: '+371', country: 'Latvia' },
  { code: '+372', country: 'Estonia' },
  { code: '+7', country: 'Russia' },
  { code: '+380', country: 'Ukraine' },
  { code: '+375', country: 'Belarus' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+86', country: 'China' },
  { code: '+91', country: 'India' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+54', country: 'Argentina' },
  { code: '+56', country: 'Chile' },
  { code: '+57', country: 'Colombia' },
  { code: '+58', country: 'Venezuela' },
  { code: '+51', country: 'Peru' },
  { code: '+27', country: 'South Africa' },
  { code: '+20', country: 'Egypt' },
  { code: '+234', country: 'Nigeria' },
  { code: '+254', country: 'Kenya' },
];

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  options,
  rows = 5,
  min = 0,
  max = 100,
  className = ''
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const baseInputClasses = 'w-full px-5 py-4 rounded-[10px] outline-none transition-all duration-200 ease-in-out';



  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (onChange) {
      onChange(type === 'number' || type === 'range' ? Number(e.target.value) : e.target.value);
    }
  };

  const handlePhoneChange = (field: 'countryCode' | 'phoneNumber', newValue: string) => {
    if (onChange) {
      const currentValue = value as { countryCode: string; phoneNumber: string } || { countryCode: '+44', phoneNumber: '' };
      onChange({
        ...currentValue,
        [field]: newValue
      });
    }
  };

  const handleDatePickerChange = (field: 'day' | 'month' | 'year', newValue: number | string) => {
    if (onChange) {
      const currentValue = value as { day: number | string; month: number | string; year: number | string } || { day: '', month: '', year: '' };
      const updatedValue = {
        ...currentValue,
        [field]: newValue
      };
      
      if (field === 'month' || field === 'year') {
        const monthNum = typeof updatedValue.month === 'string' ? parseInt(updatedValue.month) : updatedValue.month;
        const yearNum = typeof updatedValue.year === 'string' ? parseInt(updatedValue.year) : updatedValue.year;
        const dayNum = typeof updatedValue.day === 'string' ? parseInt(updatedValue.day) : updatedValue.day;
        
        if (monthNum && yearNum && dayNum) {
          const maxDays = getDaysInMonth(monthNum, yearNum);
          if (dayNum > maxDays) {
            updatedValue.day = maxDays;
          }
        }
      }
      
      onChange(updatedValue);
    }
  };

  const handleClearSearch = () => {
    if (onChange) {
      onChange('');
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'phone':
        const phoneValue = value as { countryCode: string; phoneNumber: string } || { countryCode: '+44', phoneNumber: '' };
        return (
          <div className="flex gap-3">
            <div className="relative flex-shrink-0" style={{ minWidth: '140px' }}>
              <select
                value={phoneValue.countryCode}
                onChange={(e) => handlePhoneChange('countryCode', e.target.value)}
                className="w-full px-3 py-4 rounded-[10px] appearance-none bg-wise-background-screen text-wise-content-primary pr-10"
                style={{ border: '1px solid var(--wise-interactive-secondary)' }}
              >
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-wise-content-tertiary" />
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type="tel"
                placeholder={placeholder || "Enter phone"}
                value={phoneValue.phoneNumber}
                onChange={(e) => handlePhoneChange('phoneNumber', e.target.value)}
                className={baseInputClasses}
              />
            </div>
          </div>
        );

      case 'datepicker':
        const dateValue = value as { day: number | string; month: number | string; year: number | string } || { day: '', month: '', year: '' };
        const monthNum = typeof dateValue.month === 'string' && dateValue.month !== '' ? parseInt(dateValue.month) : dateValue.month;
        const yearNum = typeof dateValue.year === 'string' && dateValue.year !== '' ? parseInt(dateValue.year) : dateValue.year;
        const maxDays = monthNum && yearNum ? getDaysInMonth(monthNum as number, yearNum as number) : 31;
        
        return (
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                value={dateValue.day}
                onChange={(e) => handleDatePickerChange('day', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-4 rounded-[10px] appearance-none bg-wise-background-screen pr-10"
                style={{ 
                  border: '1px solid var(--wise-interactive-secondary)',
                  color: dateValue.day === '' ? 'var(--wise-content-tertiary)' : 'var(--wise-content-primary)'
                }}
              >
                <option value="" style={{ color: 'var(--wise-content-tertiary)' }}>Day</option>
                {Array.from({ length: maxDays }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day} style={{ color: 'var(--wise-content-primary)' }}>{day}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-wise-content-tertiary" />
              </div>
            </div>
            
            <div className="relative flex-2" style={{ minWidth: '160px' }}>
              <select
                value={dateValue.month}
                onChange={(e) => handleDatePickerChange('month', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-4 rounded-[10px] appearance-none bg-wise-background-screen pr-10"
                style={{ 
                  border: '1px solid var(--wise-interactive-secondary)',
                  color: dateValue.month === '' ? 'var(--wise-content-tertiary)' : 'var(--wise-content-primary)'
                }}
              >
                <option value="" style={{ color: 'var(--wise-content-tertiary)' }}>Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month} style={{ color: 'var(--wise-content-primary)' }}>{getMonthName(month)}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-wise-content-tertiary" />
              </div>
            </div>
            
            <div className="relative flex-1">
              <select
                value={dateValue.year}
                onChange={(e) => handleDatePickerChange('year', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-4 rounded-[10px] appearance-none bg-wise-background-screen pr-10"
                style={{ 
                  border: '1px solid var(--wise-interactive-secondary)',
                  color: dateValue.year === '' ? 'var(--wise-content-tertiary)' : 'var(--wise-content-primary)'
                }}
              >
                <option value="" style={{ color: 'var(--wise-content-tertiary)' }}>Year</option>
                {getYears().map(year => (
                  <option key={year} value={year} style={{ color: 'var(--wise-content-primary)' }}>{year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-wise-content-tertiary" />
              </div>
            </div>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            placeholder={placeholder}
            value={value as string || ''}
            onChange={handleChange}
            rows={rows}
            className={`${baseInputClasses} resize-vertical`}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              value={value as string || ''}
              onChange={handleChange}
              className={`${baseInputClasses} bg-wise-background-screen appearance-none pr-14 ${!value ? 'text-wise-content-tertiary' : 'text-wise-content-primary'}`}
            >
              <option value="" className="text-wise-content-tertiary">{placeholder || 'Choose an option'}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value} className="text-wise-content-primary">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-wise-content-tertiary" />
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="relative">
            <input
              type="text"
              placeholder={placeholder}
              value={value as string || ''}
              onChange={handleChange}
              className={`${baseInputClasses} pl-14 ${value ? 'pr-14' : ''}`}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <Search className="h-5 w-5 text-wise-content-tertiary" />
            </div>
            {value && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-5 text-wise-interactive-primary hover:text-wise-content-primary transition-colors"
              >
                <CircleX className="h-5 w-5" />
              </button>
            )}
          </div>
        );

      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              value={value as string || ''}
              onChange={handleChange}
              className={`${baseInputClasses} pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-5 text-wise-content-tertiary hover:text-wise-content-primary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        );

      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id={`file-${label}`}
            />
            <label
              htmlFor={`file-${label}`}
              className="flex items-center justify-between w-full px-5 py-4 rounded-[10px] border transition-all duration-200 ease-in-out cursor-pointer"
              style={{ borderColor: 'var(--wise-interactive-secondary)' }}
            >
              <span className="text-wise-content-tertiary">No file chosen</span>
              <div className="btn-base btn-primary btn-small flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Choose File
              </div>
            </label>
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              placeholder={placeholder}
              value={value as string || ''}
              onChange={handleChange}
              className={`${baseInputClasses} pr-14 date-input`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <Calendar className="h-5 w-5 text-wise-content-tertiary" />
            </div>
          </div>
        );

      case 'time':
        return (
          <div className="relative">
            <input
              type="time"
              placeholder={placeholder}
              value={value as string || ''}
              onChange={handleChange}
              className={`${baseInputClasses} pr-14`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <Clock className="h-5 w-5 text-wise-content-tertiary" />
            </div>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={placeholder}
            value={value as string || ''}
            onChange={handleChange}
            className={baseInputClasses}
          />
        );

      case 'range':
        return (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-wise-content-primary">{label}: {value as number}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={value as number || 50}
              onChange={handleChange}
              className="w-full h-3 bg-wise-background-neutral rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        );

      default:
        return (
          <input
            type={type}
            placeholder={placeholder}
            value={value as string || ''}
            onChange={handleChange}
            className={baseInputClasses}
          />
        );
    }
  };

  if (type === 'range') {
    return <div className={className}>{renderInput()}</div>;
  }

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-wise-content-primary mb-2">
        {label}
      </label>
      {renderInput()}
    </div>
  );
}