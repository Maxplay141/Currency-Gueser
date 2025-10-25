
import React from 'react';
import { Currency, AnswerState } from '../types';

interface CurrencyImageProps {
  currency: Currency;
  answerState: AnswerState;
}

const CurrencyImage: React.FC<CurrencyImageProps> = ({ currency, answerState }) => {
  const isCoin = currency.type === 'coin';
  const isCorrect = answerState === 'CORRECT';

  const containerClasses = `relative bg-black/10 dark:bg-white/5 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300 perspective-1000`;
  const imageClasses = `object-contain transition-transform duration-500 ease-in-out`;

  return (
    <div
      className={`${containerClasses} ${isCoin ? 'w-64 h-64 md:w-80 md:h-80' : 'w-full max-w-lg aspect-[2/1]'} ${isCorrect ? 'animate-pulseCorrect' : ''}`}
    >
      <img
        key={currency.id}
        src={currency.imageUrl}
        alt="Currency"
        className={`${imageClasses} ${isCoin ? 'rounded-full w-full h-full p-4' : 'w-full h-full'} animate-fadeIn`}
      />
      {isCoin && (
         <div className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-white/20 opacity-50 animate-shine"></div>
        </div>
      )}
    </div>
  );
};

export default CurrencyImage;