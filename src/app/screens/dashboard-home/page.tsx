"use client";

import DashboardHome from './index';
import { Wallet, Send, Plus, ArrowDown, TrendingUp, ArrowRightLeft, ReceiptText, Repeat } from 'lucide-react';
import BackButton from '../../components/BackButton';
import MobileFrame from '../../components/MobileFrame';
import { getRecentTransactions } from '../../utils/transactionData';
import React from 'react';

const getTransactionIcon = (iconName: string) => {
  switch (iconName) {
    case 'ArrowRightLeft':
      return ArrowRightLeft;
    case 'ReceiptText':
      return ReceiptText;
    default:
      return ReceiptText;
  }
};

function DashboardHomeDemoContent() {
  const recentTransactions = getRecentTransactions(5);

  return (
    <MobileFrame>
      <DashboardHome
        title="Home"
        cards={[
          {
            title: "Total balance",
            value: "£10,706.00",
            subtitle: "Available across all balances",
            icon: <Wallet className="w-6 h-6" />
          },
          {
            title: "Main balance",
            value: "£8,450.80",
            subtitle: "GBP balance",
            icon: <ArrowDown className="w-6 h-6" />
          },
          {
            title: "This month",
            value: "£3,240.00",
            subtitle: "Spent so far",
            icon: <TrendingUp className="w-6 h-6" />
          }
        ]}
        quickActions={[
          {
            label: "Send",
            icon: Send,
            onClick: () => alert("Send money clicked"),
            variant: "primary"
          },
          {
            label: "Add money",
            icon: Plus,
            onClick: () => alert("Add money clicked"),
            variant: "secondary"
          },
          {
            label: "Request",
            icon: Repeat,
            onClick: () => alert("Request money clicked"),
            variant: "neutral-grey"
          }
        ]}
        recentItems={recentTransactions.map(transaction => {
          const getAmountPrefix = (type: string) => {
            switch (type) {
              case 'received':
              case 'moved':
                return '+ ';
              case 'sent':
              case 'spent':
              case 'paid':
                return '';
              default:
                return '';
            }
          };

          return {
            title: transaction.title,
            subtitle: `${transaction.subtitle} • ${transaction.date}`,
            amount: `${getAmountPrefix(transaction.type)}${transaction.amount} ${transaction.currency}`,
            icon: transaction.avatar?.type === 'icon' && transaction.avatar.icon
              ? getTransactionIcon(transaction.avatar.icon)
              : undefined,
            onClick: () => alert(`View transaction: ${transaction.title}`)
          };
        })}
        onShowAll={() => alert("Show all transactions")}
        showAllText="See all"
      />
    </MobileFrame>
  );
}

export default function DashboardHomeDemoPage() {
  return (
    <div className="min-h-screen bg-wise-background-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <BackButton href="/screens-list/" label="Screens" />
        <div className="pt-8">
          <DashboardHomeDemoContent />
        </div>
      </div>
    </div>
  );
}
