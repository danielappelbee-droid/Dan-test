import React from 'react';
import Avatar from './Avatar';
import Button from './Button';

interface Task {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  avatar: {
    type: 'initials' | 'icon' | 'image';
    content?: string;
    src?: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  onButtonClick?: () => void;
  onTaskClick?: () => void;
}

interface TasksProps {
  tasks: Task[];
  className?: string;
}

export default function Tasks({ tasks, className = '' }: TasksProps) {
  if (tasks.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {tasks.map((task, index) => {
        const isMainCard = index === 0;
        const isEmpty = !task.title && !task.subtitle && !task.buttonText;
        const zIndex = tasks.length - index;
        const offsetY = index === 0 ? 0 : index * 40 + 20;
        
        return (
          <div
            key={task.id}
            className={`absolute inset-x-0 rounded-[20px] transition-colors ${
              isMainCard && !isEmpty ? 'cursor-pointer p-4' : 'p-3'
            }`}
            style={{
              zIndex,
              top: `${offsetY}px`,
              border: '1px solid',
              borderColor: isMainCard ? 'var(--wise-interactive-neutral-grey)' : '#E5E7E3',
              backgroundColor: isMainCard ? 'var(--wise-interactive-neutral-grey)' : '#E5E7E3',
              minHeight: isEmpty ? '90px' : 'auto',
              transform: isEmpty ? 'scale(0.95)' : 'none'
            }}
            onMouseEnter={isMainCard && !isEmpty ? (e) => {
              e.currentTarget.style.backgroundColor = 'var(--wise-interactive-neutral-grey-light)';
              e.currentTarget.style.borderColor = 'var(--wise-border-neutral)';
            } : undefined}
            onMouseLeave={isMainCard && !isEmpty ? (e) => {
              e.currentTarget.style.backgroundColor = 'var(--wise-interactive-neutral-grey)';
              e.currentTarget.style.borderColor = 'var(--wise-interactive-neutral-grey)';
            } : undefined}
            onClick={isMainCard && !isEmpty ? task.onTaskClick : undefined}
          >
            {!isEmpty && (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Avatar
                    size={48}
                    type={task.avatar.type}
                    content={task.avatar.type === 'icon' && task.avatar.icon ? 
                      React.createElement(task.avatar.icon, { className: "h-5 w-5" }) : 
                      task.avatar.content
                    }
                    src={task.avatar.src}
                    badges={[{ type: 'icon', iconVariant: 'todo' }]}
                    className="list-item-complete-avatar"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-wise-content-primary text-base mb-1">
                    {task.title}
                  </h3>
                  <p className="text-wise-content-secondary text-sm mb-3">
                    {task.subtitle}
                  </p>
                  {isMainCard && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={(e) => {
                        e?.stopPropagation();
                        task.onButtonClick?.();
                      }}
                      className="relative z-10"
                    >
                      {task.buttonText}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      <div style={{ height: `${88 + (tasks.length - 1) * 40}px` }} />
    </div>
  );
}