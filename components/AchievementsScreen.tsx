import React, { useContext } from 'react';
import { PlayerDataContext } from '../context/PlayerDataContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { Achievement, PlayerAchievementProgress } from '../types';
import BadgeIcon from './icons/Badge';

interface AchievementsScreenProps {
  onGoHome: () => void;
}

const AchievementItem: React.FC<{ achievement: Achievement, progressData: PlayerAchievementProgress | undefined }> = ({ achievement, progressData }) => {
  const unlockedTierIndex = progressData ? progressData.unlockedTier : -1;
  
  const currentProgressValue = progressData ? (
    achievement.stat === 'unlockedCurrencyIds' ? progressData.progress : progressData.progress
  ) : 0;
  
  const nextTier = unlockedTierIndex < achievement.tiers.length - 1 ? achievement.tiers[unlockedTierIndex + 1] : null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col justify-between animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-gray-200">{achievement.name}</h3>
        <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">{achievement.description}</p>
      </div>
      <div className="mt-4">
        <div className="flex justify-around items-end">
          {achievement.tiers.map((tier, index) => (
            <div key={tier.tier} className="flex flex-col items-center text-center w-1/4">
              <BadgeIcon tier={tier.tier} unlocked={unlockedTierIndex >= index} size={48} />
              <span className={`text-xs font-semibold mt-1 ${unlockedTierIndex >= index ? 'text-primary' : 'text-slate-400 dark:text-gray-500'}`}>{tier.tier}</span>
              <span className="text-xs text-slate-400 dark:text-gray-500">{tier.goal}</span>
            </div>
          ))}
        </div>
        {nextTier && (
          <div className="mt-4">
            <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{`${currentProgressValue} / ${nextTier.goal}`}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((currentProgressValue / nextTier.goal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onGoHome }) => {
  const { playerData } = useContext(PlayerDataContext);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <header className="flex justify-between items-center mb-8 mt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Achievements
        </h1>
        <button
        onClick={onGoHome}
        className="bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
        >
        &larr; Back to Menu
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map(ach => (
          <AchievementItem key={ach.id} achievement={ach} progressData={playerData.achievements[ach.id]} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsScreen;
