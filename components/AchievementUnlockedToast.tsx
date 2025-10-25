import React, { useEffect, useState } from 'react';
import { AchievementToastInfo } from '../types';
import BadgeIcon from './icons/Badge';

interface AchievementUnlockedToastProps {
  info: AchievementToastInfo;
  onClose: () => void;
}

const CoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const AchievementUnlockedToast: React.FC<AchievementUnlockedToastProps> = ({ info, onClose }) => {
  const [animationClass, setAnimationClass] = useState('animate-fadeIn');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass('animate-[fadeOut_0.5s_ease-out_forwards]');
      setTimeout(onClose, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!info) return null;

  const { achievement, tier } = info;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center ${animationClass} relative overflow-hidden`}>
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        <h2 className="text-sm font-bold uppercase text-amber-500 tracking-widest mb-4">
          Achievement Unlocked!
        </h2>
        
        <div className="flex justify-center mb-4">
            <BadgeIcon tier={tier.tier} unlocked={true} size={80} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-gray-200">
          {achievement.name} <span className="text-primary">{`(${tier.tier})`}</span>
        </h3>
        <p className="text-slate-600 dark:text-gray-400 mt-2 mb-6">
          {tier.description || achievement.description}
        </p>

        <div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="font-semibold text-lg">Reward:</p>
          <div className="flex items-center gap-1">
            <CoinIcon />
            <span className="font-bold text-lg text-amber-500">{tier.reward}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AchievementUnlockedToast;
