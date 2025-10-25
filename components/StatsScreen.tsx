import React, { useContext } from 'react';
import { PlayerDataContext } from '../context/PlayerDataContext';
import { SoundContext } from '../context/SoundContext';

interface StatsScreenProps {
  onGoHome: () => void;
}

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const BullseyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 10-7.072 7.072m7.072-7.072a5 5 0 00-7.072 7.072m7.072-7.072L12 12m0 0l-3.536 3.536M12 12l3.536 3.536M12 12l3.536-3.536M12 12l-3.536-3.536" />
    </svg>
);
const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0112 2a8.003 8.003 0 0110.014 1.014C24.5 5 24 8 24 10c2 1 2.657 1.343 2.657 1.343a8 8 0 01-9.343 7.314z" />
    </svg>
);
const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18zM10 17l.01 0" />
    </svg>
);
const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.7 16.95l.001-.001M16.3 16.95l.001-.001M12 20.956V19.5M12 3.5v1.456M4.222 6.222l1.414 1.414M18.364 18.364l-1.414-1.414M19.778 6.222l-1.414 1.414M5.636 18.364l1.414-1.414" />
    </svg>
);


const StatsCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; className?: string }> = ({ label, value, icon, className }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between ${className}`}>
        <div className="flex justify-between items-start text-primary">
            <h3 className="text-lg font-semibold text-slate-600 dark:text-gray-400">{label}</h3>
            {icon}
        </div>
        <p className="text-4xl font-bold text-slate-800 dark:text-gray-200 mt-2">{value}</p>
    </div>
);

const StatsScreen: React.FC<StatsScreenProps> = ({ onGoHome }) => {
  const { playerData } = useContext(PlayerDataContext);
  const { playClick } = useContext(SoundContext);

  const handleGoHome = () => {
    playClick();
    onGoHome();
  };

  const accuracy = playerData.totalQuestionsAnswered > 0
    ? ((playerData.totalCorrectAnswers / playerData.totalQuestionsAnswered) * 100).toFixed(0) + '%'
    : 'N/A';

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <header className="flex justify-between items-center mb-8 mt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Player Statistics
        </h1>
        <button
          onClick={handleGoHome}
          className="bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
        >
          &larr; Back to Menu
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard label="Games Played" value={playerData.gamesPlayed} icon={<ChartBarIcon />} />
        <StatsCard label="Correct Answers" value={playerData.totalCorrectAnswers} icon={<CheckCircleIcon />} />
        <StatsCard label="Overall Accuracy" value={accuracy} icon={<BullseyeIcon />} />
        <StatsCard label="Best Streak" value={playerData.bestStreak} icon={<FireIcon />} />
        <StatsCard label="Highest Timed Score" value={playerData.highestTimedScore} icon={<TrophyIcon />} />
        <StatsCard label="Currencies Discovered" value={playerData.unlockedCurrencyIds.length} icon={<GlobeIcon />} />
      </div>
    </div>
  );
};

export default StatsScreen;