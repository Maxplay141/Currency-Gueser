
import React, { useContext } from 'react';
import { SoundContext } from '../context/SoundContext';

interface AdaptiveModeSelectionScreenProps {
  onStartGame: () => void;
  onBack: () => void;
}

const AdaptiveModeSelectionScreen: React.FC<AdaptiveModeSelectionScreenProps> = ({ onStartGame, onBack }) => {
  const { playClick } = useContext(SoundContext);

  const handleStart = () => {
    playClick();
    onStartGame();
  };
  
  const handleBack = () => {
    playClick();
    onBack();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-fadeIn">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Adaptive Mode
            </h1>
            <button
            onClick={handleBack}
            className="bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300 flex-shrink-0"
            >
            &larr; Back to Menu
            </button>
        </header>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300 mb-4">Master Your Collection!</h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 mb-6">
                This mode uses a smart learning system to help you practice currencies you struggle with. The more you play, the smarter it gets!
            </p>
            <p className="text-lg text-slate-600 dark:text-gray-400 mb-8">
                Ready to become a currency expert?
            </p>
            <button
                onClick={handleStart}
                className="w-full max-w-xs mx-auto bg-accent text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
                Start Studying
            </button>
        </div>
    </div>
  );
};

export default AdaptiveModeSelectionScreen;
