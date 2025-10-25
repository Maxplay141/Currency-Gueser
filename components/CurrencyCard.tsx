import React from 'react';
import { Currency } from '../types';

interface CurrencyCardProps {
  currency: Currency;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({ currency }) => {
  const isCoin = currency.type === 'coin';

  // The image is now the primary visual, with no extra containers or backgrounds.
  const imageClasses = `object-contain w-full shadow-lg`;

  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
        <img
            src={currency.imageUrl}
            alt={`${currency.name} ${currency.type}`}
            className={`${imageClasses} ${isCoin ? 'aspect-square rounded-full' : 'aspect-[2/1] rounded-lg'}`}
        />
        <p className="font-semibold text-sm text-center text-slate-700 dark:text-gray-300 capitalize">{currency.type}</p>
    </div>
  );
};

export default CurrencyCard;