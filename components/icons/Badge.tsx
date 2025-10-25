import React from 'react';
import { AchievementTier } from '../../types';

interface BadgeProps {
  tier: AchievementTier['tier'];
  unlocked: boolean;
  size?: number;
}

const tierColors: Record<AchievementTier['tier'], { base: string, shadow: string, highlight: string }> = {
  Bronze: { base: '#CD7F32', shadow: '#8C5A23', highlight: '#E5A46A' },
  Silver: { base: '#C0C0C0', shadow: '#8E8E8E', highlight: '#F0F0F0' },
  Gold: { base: '#FFD700', shadow: '#B39700', highlight: '#FFF08A' },
  Platinum: { base: '#E5E4E2', shadow: '#A8A9AD', highlight: '#FFFFFF' },
};


const BadgeIcon: React.FC<BadgeProps> = ({ tier, unlocked, size = 64 }) => {
  const colors = tierColors[tier];

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors.highlight, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: colors.base, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {unlocked ? (
        <>
          <path d="M12 2L4 5V12.1C4 16.2 7.5 21.5 12 22C16.5 21.5 20 16.2 20 12.1V5L12 2Z" fill={`url(#grad-${tier})`} />
          <path d="M12 2L4 5V12.1C4 16.2 7.5 21.5 12 22" fill={colors.shadow} fillOpacity="0.2" />
        </>
      ) : (
        <path d="M12 2L4 5V12.1C4 16.2 7.5 21.5 12 22C16.5 21.5 20 16.2 20 12.1V5L12 2Z" fill="#9ca3af" />
      )}
    </svg>
  );
};

export default BadgeIcon;
