'use client';

import React from 'react';
import { Delete } from 'lucide-react';

interface DeviceKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onDone?: () => void;
  type?: 'numeric' | 'alphanumeric';
  className?: string;
}

export function DeviceKeyboard({
  onKeyPress,
  onDelete,
  onDone,
  type = 'numeric',
  className = ''
}: DeviceKeyboardProps) {
  const numericKeys = [
    [
      { value: '1', label: '1' },
      { value: '2', label: '2', sub: 'ABC' },
      { value: '3', label: '3', sub: 'DEF' }
    ],
    [
      { value: '4', label: '4', sub: 'GHI' },
      { value: '5', label: '5', sub: 'JKL' },
      { value: '6', label: '6', sub: 'MNO' }
    ],
    [
      { value: '7', label: '7', sub: 'PQRS' },
      { value: '8', label: '8', sub: 'TUV' },
      { value: '9', label: '9', sub: 'WXYZ' }
    ],
    [
      { value: '.', label: '.' },
      { value: '0', label: '0' },
      { value: 'delete', label: 'delete' }
    ]
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      onDelete();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div
      className={`fixed left-0 right-0 z-30 backdrop-blur-[10px] bottom-0  ${className}`}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
    >
      {/* Done button bar */}
      <div
        className="flex justify-end px-4 py-2.5"
      >
        <button
          onClick={onDone}
          onMouseDown={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
          className="px-3 py-1 rounded-full bg-wise-green-bright text-wise-forest font-semibold text-base"
        >
          Done
        </button>
      </div>

      {/* Keyboard */}
      <div
        className="pt-8 pb-12 bg-gray-100 rounded-t-3xl"
        style={{
          // backgroundColor: 'rgba(209, 213, 219, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex flex-col gap-1.5">
        {numericKeys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 justify-center">
            {row.map((key) => (
              <button
                key={key.value}
                onClick={() => handleKeyPress(key.value)}
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={(e) => e.preventDefault()}
                className={`
                  flex-1 flex-shrink-0 h-12 rounded-md
                  ${key.value === 'delete'
                    ? 'bg-transparent'
                    : 'bg-white border-[0.5px solid rgba(0, 0, 0, 0.08)] shadow-[0 1px 0 rgba(0, 0, 0, 0.04)]'
                  }
                  active:opacity-50
                  transition-opacity
                  flex items-center justify-center
                  relative max-w-[30%]
                `}
              >
                {key.value === 'delete' ? (
                  <Delete className="h-6 w-6 text-black" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-black font-normal text-[24px] leading-none">
                      {key.label}
                    </span>
                      <span className="text-black text-[9px] leading-none mt-1 tracking-wide font-light">
                        {key.sub}
                      </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
