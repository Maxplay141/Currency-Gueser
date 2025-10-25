import React, { useContext } from 'react';
import { GameResult } from '../types';
import { SoundContext } from '../context/SoundContext';

interface ResultsScreenProps {
  result: GameResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onPlayAgain, onGoHome }) => {
  const { playClick } = useContext(SoundContext);
  
  const getModeName = () => {
    switch(result.mode) {
      case 'CLASSIC':
        return 'Classic';
      case 'TIMED':
        return `Timed ${result.duration}s`;
      case 'MAP':
        return 'Map Mode';
      case 'RANDOM':
        return 'Random Mode';
      case 'COMPARE':
        return 'Compare Mode';
      case 'TIME_ATTACK':
        return 'Time Attack';
      default:
        return 'Game Over';
    }
  }

  const modeName = getModeName();
  const accuracy = result.totalQuestions > 0 ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(0) : 0;

  const handlePlayAgain = () => {
    playClick();
    onPlayAgain();
  };

  const handleGoHome = () => {
    playClick();
    onGoHome();
  };

  return (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
        Game Over
      </h2>
      <p className="text-slate-600 dark:text-gray-400 mb-6">{modeName}</p>

      <div className="grid grid-cols-2 gap-4 text-left mb-8">
        <div className="bg-slate-100 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-gray-400">Final Score</p>
          <p className="text-3xl font-bold text-primary">{result.score}</p>
        </div>
         <div className="bg-slate-100 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-gray-400">Accuracy</p>
          <p className="text-3xl font-bold text-secondary">{accuracy}%</p>
        </div>
        <div className="bg-slate-100 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-gray-400">Correct</p>
          <p className="text-3xl font-bold">{result.correctAnswers}</p>
        </div>
        <div className="bg-slate-100 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-gray-400">Total</p>
          <p className="text-3xl font-bold">{result.totalQuestions}</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handlePlayAgain}
          className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Play Again
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;