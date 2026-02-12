"use client";

import DetailList from './index';
import { ArrowRightLeft, ReceiptText } from 'lucide-react';
import BackButton from '../../components/BackButton';
import MobileFrame from '../../components/MobileFrame';
import { useRouter } from 'next/navigation';
import { getAllTransactions } from '../../utils/transactionData';

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

function DetailListDemoContent() {
  const router = useRouter();
  const transactions = getAllTransactions();

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

  const items = transactions.map(transaction => ({
    id: transaction.id,
    title: transaction.title,
    subtitle: `${transaction.subtitle} • ${transaction.date}`,
    amount: `${getAmountPrefix(transaction.type)}${transaction.amount} ${transaction.currency}`,
    icon: transaction.avatar?.type === 'icon' && transaction.avatar.icon
      ? getTransactionIcon(transaction.avatar.icon)
      : undefined,
    badge: transaction.convertedAmount && transaction.convertedCurrency
      ? `${transaction.convertedAmount} ${transaction.convertedCurrency}`
      : undefined
  }));

  return (
    <MobileFrame>
      <DetailList
        title="Transactions"
        searchable
        searchPlaceholder="Search transactions..."
        items={items}
        onItemClick={(item) => alert(`View transaction: ${item.title}`)}
        onBack={() => router.back()}
      />
    </MobileFrame>
  );
}

export default function DetailListDemoPage() {
  return (
    <div className="min-h-screen bg-wise-background-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <BackButton href="/screens-list/" label="Screens" />
        <div className="pt-8">
          <DetailListDemoContent />
        </div>
      </div>
    </div>
  );
}
