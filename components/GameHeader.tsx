
import React from 'react';
import { GameMode } from '../types';

interface GameHeaderProps {
  mode: GameMode;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  timer: number;
  streak: number;
  activeBonus: '2x' | '3x' | null;
}

const GameHeader: React.FC<GameHeaderProps> = ({ mode, currentQuestionIndex, totalQuestions, score, timer, streak, activeBonus }) => {
  const renderGameStatus = () => {
    switch(mode) {
      case 'CLASSIC':
      case 'MAP':
        return (
          <>
            <div className="text-xs text-slate-500 dark:text-gray-400 uppercase">Question</div>
            <div className="text-2xl font-bold">{currentQuestionIndex + 1} / {totalQuestions}</div>
          </>
        );
      case 'TIMED':
        return (
          <>
            <div className="text-xs text-slate-500 dark:text-gray-400 uppercase">Time</div>
            <div className="text-2xl font-bold text-secondary">{timer}</div>
          </>
        );
      // FIX: Removed 'ADAPTIVE' case as it's not a valid GameMode, which was causing a type error. The 'ADAPTIVE' mode appears to be deprecated.
      default:
        return null;
    }
  }

  return (
    <div className="w-full flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg">
      <div className="text-center">
        <div className="text-xs text-slate-500 dark:text-gray-400 uppercase">Score</div>
        <div className="text-2xl font-bold text-primary">{score}</div>
      </div>
      
      <div className="text-center">
        {renderGameStatus()}
      </div>

      <div className="text-center">
        <div className="text-xs text-slate-500 dark:text-gray-400 uppercase">Streak</div>
        <div className="text-2xl font-bold text-accent flex items-center justify-center relative">
            {streak > 0 && <span className="mr-1">🔥</span>}
            {streak}
            {activeBonus && (
                <span className="absolute -top-4 text-xs font-bold text-white bg-accent px-2 py-0.5 rounded-full animate-pulsate">
                    {activeBonus} COINS!
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
