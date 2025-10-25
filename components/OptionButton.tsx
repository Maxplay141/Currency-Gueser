import React, { useContext } from 'react';
import { Currency, AnswerState } from '../types';
import { SoundContext } from '../context/SoundContext';

interface OptionButtonProps {
  option: Currency;
  onClick: (option: Currency) => void;
  isDisabled: boolean;
  answerState: AnswerState;
  isSelected: boolean;
  isCorrect: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ option, onClick, isDisabled, answerState, isSelected, isCorrect }) => {
  const { playClick } = useContext(SoundContext);
  
  const getButtonClasses = () => {
    const baseClasses = "w-full text-left p-4 rounded-lg shadow-md transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed";

    if (answerState !== 'UNANSWERED') {
      if (isCorrect) {
        return `${baseClasses} bg-green-500 text-white scale-105 ring-4 ring-green-500/50`;
      }
      if (isSelected && !isCorrect) {
        return `${baseClasses} bg-red-500 text-white animate-shake`;
      }
      return `${baseClasses} bg-slate-200 dark:bg-gray-700 opacity-60`;
    }

    return `${baseClasses} bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 hover:scale-105`;
  };

  const handleClick = () => {
    if(!isDisabled) {
      playClick();
      onClick(option);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={getButtonClasses()}
    >
      <span className="font-semibold text-lg">{option.name}</span>
    </button>
  );
};

export default OptionButton;