import React, { useState, useRef, useEffect, useCallback } from 'react';
import CurrencyDropdown from './CurrencyDropdown';
import { formatInputAmount } from '../utils/currencyService';

interface SendReceiveInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  currencyValue?: string;
  onCurrencyChange?: (value: string) => void;
  onCurrencyClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  hasBeenFocused?: boolean;
  readOnly?: boolean;
  className?: string;
}

const SendReceiveInput = React.memo(function SendReceiveInput({
  label,
  value = '0',
  onChange,
  currencyValue = 'USD',
  onCurrencyChange,
  onCurrencyClick,
  onFocus,
  onBlur,
  hasBeenFocused = false,
  readOnly = false,
  className = ''
}: SendReceiveInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [fontSize, setFontSize] = useState('3.25rem');
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const lastExternalValue = useRef(value);
  const ignoreNextUpdate = useRef(false);

  const removeCommas = useCallback((num: string): string => {
    return num.replace(/,/g, '');
  }, []);

  const removeLeadingZeros = useCallback((val: string): string => {
    if (!val || val === '' || val === '0' || val === '0.') return val;
    
    if (val.includes('.')) {
      const [integerPart, decimalPart] = val.split('.');
      const cleanInteger = integerPart.replace(/^0+/, '') || '0';
      return `${cleanInteger}.${decimalPart}`;
    }
    
    return val.replace(/^0+/, '') || '0';
  }, []);

  const normalizeDecimalPlaces = useCallback((val: string): string => {
    if (!val || val === '' || val === '0') return '0';
    
    if (val.includes('.')) {
      const [integerPart, decimalPart] = val.split('.');
      
      // If decimal part is exactly "00", remove it
      if (decimalPart === '00') {
        return integerPart;
      }
      
      // Keep the decimal part as-is during editing, don't trim trailing zeros
      return `${integerPart}.${decimalPart}`;
    }
    
    return val;
  }, []);

  const formatValue = useCallback((val: string): string => {
    if (!val || val === '' || val === '0') return '0';
    const cleanValue = removeCommas(val);
    const withoutLeadingZeros = removeLeadingZeros(cleanValue);
    const numericValue = parseFloat(withoutLeadingZeros);
    if (isNaN(numericValue)) return '0';
    const normalized = normalizeDecimalPlaces(withoutLeadingZeros);
    return formatInputAmount(normalized);
  }, [removeCommas, removeLeadingZeros, normalizeDecimalPlaces]);

  const calculateFontSize = useCallback(() => {
    if (!containerRef.current || !measureRef.current) return;

    const container = containerRef.current;
    const availableWidth = container.offsetWidth;
    if (availableWidth <= 0) return;

    const baseFontSize = 52;
    const currentText = displayValue || '0';
    
    measureRef.current.style.fontSize = `${baseFontSize}px`;
    measureRef.current.textContent = currentText;
    
    let currentFontSize = baseFontSize;
    let textWidth = measureRef.current.offsetWidth;
    
    while (textWidth > availableWidth && currentFontSize > 19.2) {
      currentFontSize -= 1.6;
      measureRef.current.style.fontSize = `${currentFontSize}px`;
      textWidth = measureRef.current.offsetWidth;
    }
    
    setFontSize(`${currentFontSize / 16}rem`);
  }, [displayValue]);

  useEffect(() => {
    const formatted = formatValue(value);
    setDisplayValue(formatted);
    lastExternalValue.current = value;
  }, [formatValue, value]);

  useEffect(() => {
    if (!isFocused && !ignoreNextUpdate.current && value !== lastExternalValue.current) {
      const formatted = formatValue(value);
      setDisplayValue(formatted);
      lastExternalValue.current = value;
    }
    ignoreNextUpdate.current = false;
  }, [value, isFocused, formatValue]);

  useEffect(() => {
    calculateFontSize();
  }, [displayValue, calculateFontSize]);

  useEffect(() => {
    const handleResize = () => calculateFontSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateFontSize]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    ignoreNextUpdate.current = true;
    
    if (inputValue === '') {
      setDisplayValue('0');
      if (onChange) {
        onChange('0');
      }
      return;
    }

    const cleanValue = removeCommas(inputValue);
    if (!/^[0-9]*\.?[0-9]*$/.test(cleanValue)) {
      return;
    }
    
    // Limit decimal places to 2
    if (cleanValue.includes('.')) {
      const parts = cleanValue.split('.');
      if (parts[1] && parts[1].length > 2) {
        return;
      }
    }
    
    const withoutLeadingZeros = removeLeadingZeros(cleanValue);
    const formattedValue = formatInputAmount(withoutLeadingZeros);
    setDisplayValue(formattedValue);
    
    if (onChange) {
      onChange(withoutLeadingZeros);
    }
  }, [onChange, removeCommas, removeLeadingZeros]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
    
    if (!hasBeenFocused) {
      setDisplayValue('');
      if (onChange) {
        onChange('0');
      }
    } else {
      const cleanValue = removeCommas(displayValue);
      if (cleanValue === '0' || cleanValue === '') {
        setDisplayValue('');
      }
    }
  }, [displayValue, removeCommas, onChange, hasBeenFocused, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
    
    if (displayValue === '' || displayValue === '.') {
      setDisplayValue('0');
      if (onChange) {
        onChange('0');
      }
    } else {
      const cleanValue = removeCommas(displayValue);
      let processedValue = removeLeadingZeros(cleanValue);
      
      // Auto-format single decimal to two decimal places
      if (processedValue.includes('.')) {
        const parts = processedValue.split('.');
        if (parts[1] && parts[1].length === 1) {
          processedValue = `${processedValue}0`;
        }
      }
      
      const formattedValue = formatValue(processedValue);
      setDisplayValue(formattedValue);
      if (onChange) {
        onChange(processedValue);
      }
    }
  }, [displayValue, onChange, removeCommas, removeLeadingZeros, formatValue, onBlur]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanValue = removeCommas(pastedText);
    
    // Validate pasted content
    if (!/^[0-9]*\.?[0-9]*$/.test(cleanValue)) {
      return;
    }
    
    // Limit decimal places to 2
    if (cleanValue.includes('.')) {
      const parts = cleanValue.split('.');
      if (parts[1] && parts[1].length > 2) {
        return;
      }
    }
    
    const withoutLeadingZeros = removeLeadingZeros(cleanValue);
    
    // Auto-format single decimal on paste
    let processedValue = withoutLeadingZeros;
    if (processedValue.includes('.')) {
      const parts = processedValue.split('.');
      if (parts[1] && parts[1].length === 1) {
        processedValue = `${processedValue}0`;
      }
    }
    
    const numericValue = parseFloat(processedValue);
    
    if (!isNaN(numericValue)) {
      ignoreNextUpdate.current = true;
      const formattedValue = formatValue(processedValue);
      setDisplayValue(formattedValue);
      if (onChange) {
        onChange(processedValue);
      }
    }
  }, [removeCommas, removeLeadingZeros, formatValue, onChange]);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-wise-content-secondary">
        {label}
      </label>
      
      <div className="flex items-center gap-4 h-16">
        <CurrencyDropdown
          value={currencyValue}
          onChange={onCurrencyChange}
          disableDropdown={!!onCurrencyClick}
          onButtonClick={onCurrencyClick}
        />
        
        <div ref={containerRef} className="flex-1 relative h-full flex items-center">
          <span
            ref={measureRef}
            className="absolute invisible font-wise font-extrabold whitespace-nowrap pointer-events-none"
            style={{ fontSize: '3.25rem', left: '-9999px' }}
          >
            {displayValue}
          </span>
          
          <input
            ref={inputRef}
            type="text"
            inputMode={readOnly ? "none" : "decimal"}
            value={displayValue}
            onChange={handleInputChange}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly={readOnly}
            className="w-full bg-transparent text-right font-wise font-extrabold text-wise-content-primary h-full"
            style={{ 
              fontSize,
              lineHeight: '1',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
            placeholder="0"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
});

export default SendReceiveInput;