import React from 'react';
import { GameMode, GameResult, TimeAttackGameOptions } from '../types';
import CurrencyImage from './CurrencyImage';
import OptionButton from './OptionButton';
import GameHeader from './GameHeader';
import PauseMenu from './PauseMenu';
import { useTimeAttackLogic } from '../hooks/useTimeAttackLogic';

interface TimeAttackGameScreenProps {
  mode: GameMode;
  onGameEnd: (result: GameResult) => void;
  onGoHome: () => void;
  onGoToShop: () => void;
  options: TimeAttackGameOptions | null;
}

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19V5M14 19V5" />
    </svg>
);

const TimeAttackGameScreen: React.FC<TimeAttackGameScreenProps> = ({ mode, onGameEnd, onGoHome, onGoToShop, options }) => {

  const {
    currentQuestion,
    currentQuestionIndex,
    score,
    streak,
    timer,
    answerState,
    selectedAnswer,
    handleAnswer,
    isAnswering,
    activeBonus,
    isPaused,
    togglePause,
    correctAnswersCount,
    bestStreakInGame
  } = useTimeAttackLogic(mode, onGameEnd, options);

  if (currentQuestion === undefined) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
    );
  }

  if (currentQuestion === null) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
                <h2 className="text-3xl font-bold text-primary mb-4">More Currencies Needed!</h2>
                <p className="text-slate-600 dark:text-gray-400 mb-2">
                    You don't have enough unlocked currencies for this game mode.
                </p>
                <p className="text-slate-600 dark:text-gray-400 mb-8">
                    Visit the shop to buy new currency packs or try a different setting!
                </p>
                 <div className="flex flex-col space-y-4">
                    <button
                        onClick={onGoToShop}
                        className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Go to Shop
                    </button>
                    <button
                        onClick={onGoHome}
                        className="w-full bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                    >
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
  }


  return (
    <div className="w-full max-w-2xl mx-auto h-screen flex flex-col items-center justify-between pt-20 pb-8 px-4 animate-fadeIn relative">
       <button
        onClick={togglePause}
        className="absolute top-4 left-4 z-20 p-2 rounded-full bg-slate-200/50 dark:bg-gray-700/50 text-slate-800 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Pause game"
      >
        <PauseIcon />
      </button>

      <GameHeader
        mode={mode}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={Infinity}
        score={score}
        timer={timer}
        streak={streak}
        activeBonus={activeBonus}
      />

      <CurrencyImage currency={currentQuestion.correctAnswer} answerState={answerState} />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isCorrect={option.id === currentQuestion.correctAnswer.id}
            isSelected={option.id === selectedAnswer?.id}
            answerState={answerState}
            isDisabled={isAnswering}
            onClick={() => handleAnswer(option)}
          />
        ))}
      </div>
      
      {isPaused && <PauseMenu onResume={togglePause} onLeave={() => onGameEnd({score, correctAnswers: correctAnswersCount, totalQuestions: currentQuestionIndex, mode, bestStreakInGame: bestStreakInGame, isPerfect: false})} />}
    </div>
  );
};

export default TimeAttackGameScreen;