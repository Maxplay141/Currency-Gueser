import React, { useContext } from 'react';
import { SoundContext } from '../context/SoundContext';

interface GameModeSelectionScreenProps {
  onGoToClassicSelection: () => void;
  onGoToTimedSelection: () => void;
  onGoToMapSelection: () => void;
  onGoToRandomSelection: () => void;
  onGoToCompareSelection: () => void;
  onGoToTimeAttackSelection: () => void;
  onBack: () => void;
}

const GameModeSelectionScreen: React.FC<GameModeSelectionScreenProps> = ({
  onGoToClassicSelection,
  onGoToTimedSelection,
  onGoToMapSelection,
  onGoToRandomSelection,
  onGoToCompareSelection,
  onGoToTimeAttackSelection,
  onBack,
}) => {
  const { playClick } = useContext(SoundContext);

  const handleClassic = () => { playClick(); onGoToClassicSelection(); };
  const handleTimed = () => { playClick(); onGoToTimedSelection(); };
  const handleMap = () => { playClick(); onGoToMapSelection(); };
  const handleRandom = () => { playClick(); onGoToRandomSelection(); };
  const handleCompare = () => { playClick(); onGoToCompareSelection(); };
  const handleTimeAttack = () => { playClick(); onGoToTimeAttackSelection(); };
  const handleBack = () => { playClick(); onBack(); };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-fadeIn text-center">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Select a Mode
        </h1>
        <button
          onClick={handleBack}
          className="bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300 flex-shrink-0"
        >
          &larr; Back to Menu
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mx-auto">
        <button
          onClick={handleClassic}
          className="w-full bg-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Classic
        </button>
        <button
          onClick={handleTimed}
          className="w-full bg-secondary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Timed
        </button>
        <button
          onClick={handleMap}
          className="w-full bg-secondary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Map
        </button>
         <button
          onClick={handleCompare}
          className="w-full bg-secondary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Compare
        </button>
        <button
          onClick={handleTimeAttack}
          className="w-full bg-secondary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Time Attack
        </button>
        <button
          onClick={handleRandom}
          className="w-full rainbow-flow-anim text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Random
        </button>
      </div>
    </div>
  );
};

export default GameModeSelectionScreen;