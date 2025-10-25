import React, { useContext } from 'react';
import { SoundContext } from '../context/SoundContext';

interface HomeScreenProps {
  onGoToGameModeSelection: () => void;
  onGoToCollection: () => void;
  onGoToShop: () => void;
  onGoToStats: () => void;
  onGoToAchievements: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onGoToGameModeSelection, onGoToCollection, onGoToShop, onGoToStats, onGoToAchievements }) => {
  const { playClick } = useContext(SoundContext);

  const handlePlay = () => { playClick(); onGoToGameModeSelection(); };
  const handleGoToCollection = () => { playClick(); onGoToCollection(); };
  const handleGoToStats = () => { playClick(); onGoToStats(); };
  const handleGoToShop = () => { playClick(); onGoToShop(); };
  const handleGoToAchievements = () => { playClick(); onGoToAchievements(); };

  const buttonClasses = "w-full bg-accent text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center";

  return (
    <div className="text-center flex flex-col items-center animate-fadeIn">
      <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
        Currency Guesser
      </h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mt-2 mb-12 max-w-md">
        Get to know the money of the world! Now with adaptive learning in every mode.
      </p>
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={handlePlay}
          className="w-full bg-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 text-2xl"
        >
          Play
        </button>
        <div className="grid grid-cols-2 gap-4 pt-4">
            <button onClick={handleGoToCollection} className={buttonClasses}>
              Collection
            </button>
             <button onClick={handleGoToStats} className={buttonClasses}>
              Stats
            </button>
            <button onClick={handleGoToShop} className={buttonClasses}>
              Shop
            </button>
            <button onClick={handleGoToAchievements} className={buttonClasses}>
              Achievements
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;