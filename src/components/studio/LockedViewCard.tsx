import React from 'react';
import { Icon } from '../Icons';

interface LockedViewCardProps {
  iconType: 'gauge' | 'target' | 'zap' | 'file-text';
  badgeVariant?: 'default' | 'target' | 'ai';
  title: string;
  description: React.ReactNode;
  actionText: string;
  actionIcon?: 'zap' | 'file-text' | 'layers';
  onAction: () => void;
  isDisabled?: boolean;
}

export const LockedViewCard: React.FC<LockedViewCardProps> = ({
  iconType,
  badgeVariant = 'default',
  title,
  description,
  actionText,
  actionIcon,
  onAction,
  isDisabled = false,
}) => {
  const badgeClass = badgeVariant === 'default' ? 'locked-icon-badge' : `locked-icon-badge ${badgeVariant}`;

  return (
    <div className="locked-view-card">
      <div className={badgeClass}>
        <Icon type={iconType} size={32} />
      </div>
      <h3 className="locked-title">{title}</h3>
      <p className="locked-desc">{description}</p>
      <div className="locked-actions">
        <button
          type="button"
          className="studio-btn studio-btn-primary"
          onClick={onAction}
          disabled={isDisabled}
        >
          {actionIcon && <Icon type={actionIcon} size={14} />} {actionText}
        </button>
      </div>
    </div>
  );
};
