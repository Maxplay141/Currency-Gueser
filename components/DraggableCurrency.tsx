
import React from 'react';
import { Currency } from '../types';

interface DraggableCurrencyProps {
  currency: Currency;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const DraggableCurrency: React.FC<DraggableCurrencyProps> = ({ currency, isDragging, setIsDragging }) => {
  const isCoin = currency.type === 'coin';

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', currency.id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => setIsDragging(true), 0);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const containerClasses = `relative bg-black/10 dark:bg-white/5 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300 cursor-grab active:cursor-grabbing`;
  const imageClasses = `object-contain transition-transform duration-500 ease-in-out pointer-events-none`;

  return (
    <div 
      className={`transition-opacity duration-300 ${isDragging ? 'opacity-30' : 'opacity-100'}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
        <div
        className={`${containerClasses} ${isCoin ? 'w-32 h-32' : 'w-64 aspect-[2/1]'} animate-fadeIn`}
        >
        <img
            src={currency.imageUrl}
            alt="Currency"
            className={`${imageClasses} ${isCoin ? 'rounded-full w-full h-full p-2' : 'w-full h-full'}`}
        />
        {isCoin && (
            <div className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-white/20 opacity-50 animate-shine"></div>
            </div>
        )}
        </div>
    </div>
  );
};

export default DraggableCurrency;
