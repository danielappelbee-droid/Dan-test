/**
 * Core Screen: Dashboard Home
 *
 * A multi-card dashboard overview with quick actions and recent activity.
 * Copy this to your prototype and customize as needed.
 *
 * @example
 * ```tsx
 * <DashboardHome
 *   cards={[{ title: "Balance", value: "£10,000", icon: <Wallet /> }]}
 *   quickActions={[{ label: "Send", icon: <Send />, onClick: () => {} }]}
 *   recentItems={[{ title: "Transaction 1", subtitle: "Today", amount: "£100" }]}
 * />
 * ```
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import ListItem from '../../components/ListItem';

export interface DashboardCard {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'neutral-grey';
}

export interface RecentItem {
  title: string;
  subtitle: string;
  amount?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export interface DashboardHomeProps {
  /** Main content cards (balance, stats, etc.) */
  cards: DashboardCard[];
  /** Quick action buttons */
  quickActions?: QuickAction[];
  /** Recent activity items */
  recentItems?: RecentItem[];
  /** Show all items link */
  onShowAll?: () => void;
  /** Show all link text */
  showAllText?: string;
  /** Header title */
  title?: string;
}

export default function DashboardHome({
  cards,
  quickActions = [],
  recentItems = [],
  onShowAll,
  showAllText = "View all",
  title = "Dashboard"
}: DashboardHomeProps) {
  return (
    <div className="min-h-screen bg-wise-background-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-6 pb-32">
          {/* Header */}
          {title && (
            <motion.h1
              className="font-wise text-3xl mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {title}
            </motion.h1>
          )}

          {/* Cards */}
          <div className="space-y-4 mb-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-wise-background-elevated rounded-[32px] p-6 border border-wise-border-neutral"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={card.onClick}
                style={{ cursor: card.onClick ? 'pointer' : 'default' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-wise-content-secondary mb-1">
                      {card.title}
                    </p>
                    <p className="text-3xl font-semibold text-wise-content-primary">
                      {card.value}
                    </p>
                    {card.subtitle && (
                      <p className="text-sm text-wise-content-tertiary mt-1">
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                  {card.icon && (
                    <div className="text-wise-content-tertiary">
                      {card.icon}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <motion.div
              className="grid grid-cols-2 gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant || 'neutral-grey'}
                    size="large"
                    onClick={action.onClick}
                    className="flex items-center justify-center gap-2"
                  >
                    <Icon className="w-5 h-5" />
                    {action.label}
                  </Button>
                );
              })}
            </motion.div>
          )}

          {/* Recent Activity */}
          {recentItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-wise-content-primary">
                  Recent
                </h2>
                {onShowAll && (
                  <button
                    onClick={onShowAll}
                    className="text-sm text-wise-link-content font-semibold hover:underline"
                  >
                    {showAllText}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {recentItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <ListItem
                      key={index}
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
                      currency={{
                        large: item.amount
                      }}
                      rightElement={{
                        type: 'chevron' as const
                      }}
                      onClick={item.onClick}
                      className="px-0"
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
