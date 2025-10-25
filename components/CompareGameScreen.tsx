import React from 'react';
import { GameMode, GameResult, CompareGameOptions, AnswerState, Currency } from '../types';
import { useCompareGameLogic } from '../hooks/useCompareGameLogic';
import CurrencyImage from './CurrencyImage';
import OptionButton from './OptionButton';
import GameHeader from './GameHeader';
import PauseMenu from './PauseMenu';

interface CompareGameScreenProps {
  mode: GameMode;
  onGameEnd: (result: GameResult) => void;
  onGoHome: () => void;
  onGoToShop: () => void;
  options: CompareGameOptions | null;
}

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19V5M14 19V5" />
    </svg>
);

const ImageOptionButton: React.FC<{
    currency: Currency;
    onClick: () => void;
    isDisabled: boolean;
    answerState: AnswerState;
    isSelected: boolean;
    isCorrect: boolean;
}> = ({ currency, onClick, isDisabled, answerState, isSelected, isCorrect }) => {
    
    const getBorderClasses = () => {
        if (answerState !== 'UNANSWERED') {
            if (isCorrect) return 'ring-4 ring-green-500/80';
            if (isSelected && !isCorrect) return 'ring-4 ring-red-500/80 animate-shake';
            return 'opacity-50';
        }
        return 'hover:ring-4 hover:ring-secondary/50';
    };

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`transition-all duration-300 rounded-2xl ${getBorderClasses()}`}
        >
            <CurrencyImage currency={currency} answerState={'UNANSWERED'} />
        </button>
    )
}

const CompareGameScreen: React.FC<CompareGameScreenProps> = ({ mode, onGameEnd, onGoHome, onGoToShop, options }) => {
  
  const {
    currentQuestion,
    currentQuestionIndex,
    score,
    streak,
    answerState,
    selectedAnswer,
    handleAnswer,
    totalQuestions,
    isAnswering,
    activeBonus,
    isPaused,
    togglePause,
    correctAnswersCount,
    bestStreakInGame
  } = useCompareGameLogic(mode, onGameEnd, options);

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

  const [c1, c2] = currentQuestion.currencies;

  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col items-center justify-between pt-20 pb-8 px-4 animate-fadeIn relative">
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
        totalQuestions={totalQuestions}
        score={score}
        timer={0}
        streak={streak}
        activeBonus={activeBonus}
      />

      <div className="flex-grow w-full flex flex-col items-center justify-center my-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{currentQuestion.questionText}</h2>
        <div className="flex items-center justify-center gap-4 md:gap-8">
            { currentQuestion.type === 'COUNTRY_MATCH' ? (
                <>
                    <CurrencyImage currency={c1} answerState={answerState} />
                    <CurrencyImage currency={c2} answerState={answerState} />
                </>
            ) : (
                <>
                  <ImageOptionButton
                    currency={c1}
                    onClick={() => handleAnswer(c1.id)}
                    isDisabled={isAnswering}
                    answerState={answerState}
                    isSelected={selectedAnswer === c1.id}
                    isCorrect={c1.id === currentQuestion.correctAnswer}
                  />
                  <ImageOptionButton
                    currency={c2}
                    onClick={() => handleAnswer(c2.id)}
                    isDisabled={isAnswering}
                    answerState={answerState}
                    isSelected={selectedAnswer === c2.id}
                    isCorrect={c2.id === currentQuestion.correctAnswer}
                  />
                </>
            )}
        </div>
      </div>
      
      {currentQuestion.type === 'COUNTRY_MATCH' && currentQuestion.options && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {currentQuestion.options.map((optionText) => (
            <OptionButton
                key={optionText}
                option={{name: optionText} as Currency}
                isCorrect={optionText === currentQuestion.correctAnswer}
                isSelected={optionText === selectedAnswer}
                answerState={answerState}
                isDisabled={isAnswering}
                onClick={() => handleAnswer(optionText)}
            />
            ))}
        </div>
      )}
      
      {isPaused && <PauseMenu onResume={togglePause} onLeave={() => onGameEnd({score, correctAnswers: correctAnswersCount, totalQuestions: currentQuestionIndex, mode, bestStreakInGame: bestStreakInGame, isPerfect: false})} />}
    </div>
  );
};

export default CompareGameScreen;