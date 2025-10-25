import React, { useContext } from 'react';
import { Difficulty, CompareGameOptions } from '../types';
import { SoundContext } from '../context/SoundContext';

interface CompareModeSelectionScreenProps {
  onStartGame: (options: CompareGameOptions) => void;
  onBack: () => void;
}

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

const SelectionButton: React.FC<{ label: string; onClick: () => void; }> = ({ label, onClick }) => {
  const baseClasses = "w-full text-center p-4 rounded-lg shadow-md transition-all duration-300 transform bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 hover:scale-105";
  return (
    <button onClick={onClick} className={baseClasses}>
      <span className="font-semibold text-lg">{label}</span>
    </button>
  );
}

const CompareModeSelectionScreen: React.FC<CompareModeSelectionScreenProps> = ({ onStartGame, onBack }) => {
  const { playClick } = useContext(SoundContext);

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    playClick();
    onStartGame({ difficulty, numQuestions: 10 });
  };
  
  const handleBack = () => {
    playClick();
    onBack();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-fadeIn">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Compare Mode
            </h1>
            <button
            onClick={handleBack}
            className="bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300 flex-shrink-0"
            >
            &larr; Back
            </button>
        </header>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300 mb-4">Which is Which?</h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 mb-8">
                Test your knowledge by comparing two currencies. Can you spot the difference or match them to their home country?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                    {DIFFICULTIES.map(difficulty => (
                    <SelectionButton
                        key={difficulty}
                        label={difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                        onClick={() => handleSelectDifficulty(difficulty)}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default CompareModeSelectionScreen;