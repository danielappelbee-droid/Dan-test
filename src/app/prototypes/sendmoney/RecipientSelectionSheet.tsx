import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import ListItem from '../../components/ListItem';
import { getAllRecipients, RecipientProfile } from '../../utils/recipientData';

interface RecipientSelectionSheetProps {
  onRecipientSelect?: (recipient: RecipientProfile) => void;
}

export const RecipientSelectionSheet: React.FC<RecipientSelectionSheetProps> = ({
  onRecipientSelect
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'my-accounts'>('all');

  const recentRecipients = getAllRecipients().slice(0, 6);
  const allRecipients = getAllRecipients();
  const filteredRecipients = allRecipients.slice(6);

  const handleRecipientClick = (recipient: RecipientProfile) => {
    if (onRecipientSelect) {
      onRecipientSelect(recipient);
    }
  };

  return (
    <div className="h-[700px] overflow-y-auto">
      <div className="text-center mb-6 pt-8">
        <h1 className="font-wise text-wise-content-primary" style={{ fontSize: '2rem', lineHeight: '0.9' }}>
          WHO ARE YOU<br />SENDING TO?
        </h1>
      </div>

      <div>
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-wise-content-primary mb-4">
            Recents
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {recentRecipients.map((recipient) => {
              const badges = recipient.badges?.map(badge => {
                if (badge.flag) {
                  return { type: 'flag' as const, src: badge.flag, alt: 'Flag' };
                } else if (badge.type === 'image' && badge.src) {
                  return { type: 'image' as const, src: badge.src, alt: 'Bank' };
                } else if (badge.icon && badge.iconVariant === 'wise') {
                  return { type: 'icon' as const, iconVariant: 'wise' as const };
                } else if (badge.icon) {
                  return {
                    type: 'icon' as const,
                    iconVariant: badge.iconVariant || 'todo' as const
                  };
                }
                return null;
              }).filter((badge): badge is NonNullable<typeof badge> => badge !== null) || [];

              return (
                <button
                  key={recipient.id}
                  onClick={() => handleRecipientClick(recipient)}
                  className="flex flex-col items-center p-3 hover:bg-wise-background-neutral rounded-xl transition-colors"
                >
                  <div className="mb-3">
                    <Avatar
                      size={72}
                      type={recipient.avatar ? 'image' : 'initials'}
                      src={recipient.avatar}
                      content={recipient.initials}
                      alt={recipient.name}
                      badges={badges}
                    />
                  </div>
                  <div className="text-center w-full">
                    <p className="font-semibold text-wise-content-primary text-sm mb-1 truncate">
                      {recipient.name}
                    </p>
                    <p className="text-wise-content-tertiary text-xs truncate">
                      {recipient.handle || `•• ${recipient.accountNumber}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant={activeTab === 'all' ? 'neutral-grey' : 'neutral-grey'}
              size="small"
              onClick={() => setActiveTab('all')}
              className={activeTab === 'all' ?
                'bg-wise-interactive-neutral-grey-light border-wise-border-neutral' :
                'bg-transparent border-transparent text-wise-content-tertiary'
              }
            >
              All
            </Button>

            <Button
              variant={activeTab === 'my-accounts' ? 'neutral-grey' : 'neutral-grey'}
              size="small"
              onClick={() => setActiveTab('my-accounts')}
              className={activeTab === 'my-accounts' ?
                'bg-wise-interactive-neutral-grey-light border-wise-border-neutral' :
                'bg-transparent border-transparent text-wise-content-tertiary'
              }
            >
              My accounts
            </Button>

            <div className="ml-auto">
              <Button
                variant="neutral-grey"
                size="small"
                iconOnly
                onClick={() => console.log('Search clicked')}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            {filteredRecipients.map((recipient) => {
              const badges = recipient.badges?.map(badge => {
                if (badge.flag) {
                  return { type: 'flag' as const, src: badge.flag, alt: 'Flag' };
                } else if (badge.type === 'image' && badge.src) {
                  return { type: 'image' as const, src: badge.src, alt: 'Bank' };
                } else if (badge.icon && badge.iconVariant === 'wise') {
                  return { type: 'icon' as const, iconVariant: 'wise' as const };
                } else if (badge.icon) {
                  return {
                    type: 'icon' as const,
                    iconVariant: badge.iconVariant || 'todo' as const
                  };
                }
                return null;
              }).filter((badge): badge is NonNullable<typeof badge> => badge !== null) || [];

              return (
                <ListItem
                  key={recipient.id}
                  avatar={{
                    size: 48,
                    type: recipient.avatar ? 'image' : 'initials',
                    src: recipient.avatar,
                    content: recipient.initials,
                    alt: recipient.name,
                    badges: badges
                  }}
                  content={{
                    largeText: recipient.name,
                    smallText: recipient.handle || `•• ${recipient.accountNumber}`
                  }}
                  rightElement={{
                    type: 'chevron'
                  }}
                  onClick={() => handleRecipientClick(recipient)}
                  className="px-0"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
