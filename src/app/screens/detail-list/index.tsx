/**
 * Core Screen: Detail List
 *
 * A scrollable list with filtering and detail views.
 * Copy this to your prototype and customize as needed.
 *
 * @example
 * ```tsx
 * <DetailList
 *   title="Transactions"
 *   items={[
 *     { id: "1", title: "Coffee Shop", subtitle: "Today", amount: "-£4.50", icon: Coffee },
 *     { id: "2", title: "Salary", subtitle: "Yesterday", amount: "+£2,500", icon: Banknote }
 *   ]}
 *   onItemClick={(item) => console.log(item)}
 *   onBack={() => {}}
 * />
 * ```
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Search, ChevronLeft } from 'lucide-react';
import ListItem from '../../components/ListItem';
import FormInput from '../../components/FormInput';
import Footer from '../../components/Footer';

export interface ListItemData {
  id: string;
  title: string;
  subtitle?: string;
  amount?: string;
  icon?: LucideIcon;
  badge?: string;
  metadata?: Record<string, any>;
}

export interface DetailListProps {
  /** Page title */
  title: string;
  /** List items to display */
  items: ListItemData[];
  /** Back button handler */
  onBack?: () => void;
  /** Item click handler */
  onItemClick?: (item: ListItemData) => void;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Custom filter function */
  filterFn?: (item: ListItemData, query: string) => boolean;
  /** Show as coming from right */
  animationDirection?: 'left' | 'right';
}

export default function DetailList({
  title,
  items,
  onBack,
  onItemClick,
  searchable = false,
  searchPlaceholder = "Search...",
  filterFn,
  animationDirection = 'right'
}: DetailListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const defaultFilter = (item: ListItemData, query: string) => {
    const searchLower = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      (item.subtitle?.toLowerCase().includes(searchLower) ?? false)
    );
  };

  const filteredItems = searchable
    ? items.filter(item => (filterFn || defaultFilter)(item, searchQuery))
    : items;

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
    },
    exit: {
      x: animationDirection === 'right' ? '-100%' : '100%',
      opacity: 0,
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
      exit="exit"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
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

        {searchable && (
          <div className="mt-4">
            <FormInput
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(value) => setSearchQuery(value as string)}
              icon={Search}
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="space-y-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem
                    avatar={Icon ? {
                      size: 48,
                      type: 'icon' as const,
                      content: <Icon className="h-5 w-5" />
                    } : {
                      size: 48,
                      type: 'initials' as const,
                      content: item.title?.substring(0, 2).toUpperCase() || 'TX'
                    }}
                    content={{
                      largeText: item.title,
                      smallText: item.subtitle
                    }}
                    currency={item.amount ? {
                      large: item.amount,
                      small: item.badge
                    } : undefined}
                    rightElement={{
                      type: 'chevron' as const
                    }}
                    onClick={() => onItemClick?.(item)}
                    className="px-0"
                  />
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-wise-content-secondary">
                {searchQuery ? "No results found" : "No items yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
