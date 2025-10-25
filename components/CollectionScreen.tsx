import React, { useMemo, useContext, useState, useEffect } from 'react';
import { CURRENCIES } from '../constants';
import { Currency } from '../types';
import CurrencyCard from './CurrencyCard';
import { PlayerDataContext } from '../context/PlayerDataContext';
import { SoundContext } from '../context/SoundContext';

interface CollectionScreenProps {
  onGoHome: () => void;
}

const CurrencyPair: React.FC<{ name: string; items: Currency[] }> = ({ name, items }) => {
  const sortedItems = [...items].sort((a, b) => {
    if (a.type === 'banknote') return -1;
    if (b.type === 'banknote') return 1;
    return 0;
  });

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl shadow-md w-full flex flex-col items-center transition-transform duration-200 ease-in-out hover:scale-105 animate-fadeIn">
      <h3 className="text-xl font-semibold text-slate-700 dark:text-gray-300 mb-3">{name}</h3>
      <div className="flex justify-center items-center gap-3 w-full">
        {sortedItems.map(currency => (
          <CurrencyCard key={currency.id} currency={currency} />
        ))}
      </div>
    </div>
  );
};

const SelectionButton: React.FC<{ label: string; onClick: () => void; isActive: boolean; small?: boolean; }> = ({ label, onClick, isActive, small }) => {
  const baseClasses = `transition-all duration-200 ease-in-out rounded-full font-semibold shadow-sm transform hover:scale-105`;
  const sizeClasses = small ? 'px-4 py-1.5 text-sm' : 'px-5 py-2';
  const activeClasses = `bg-primary text-white`;
  const inactiveClasses = `bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600`;

  return (
    <button onClick={onClick} className={`${baseClasses} ${sizeClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {label}
    </button>
  );
};


const CollectionScreen: React.FC<CollectionScreenProps> = ({ onGoHome }) => {
  const { playerData } = useContext(PlayerDataContext);
  const { playClick } = useContext(SoundContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'coin' | 'banknote'>('all');
  const [sortOrder, setSortOrder] = useState<'region' | 'popularity'>('region');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const unlockedCurrencies = useMemo(() => {
    return CURRENCIES.filter(c => playerData.unlockedCurrencyIds.includes(c.id));
  }, [playerData.unlockedCurrencyIds]);

  const groupedCurrencies = useMemo(() => {
    const filtered = unlockedCurrencies.filter(c => {
      if (filterType === 'all') return true;
      return c.type === filterType;
    });

    const acc: Record<string, Record<string, Currency[]>> = {};
    const groupingKey = sortOrder;
    
    const currencyPairsByName: Record<string, Currency[]> = {};
    filtered.forEach(currency => {
        if (!currencyPairsByName[currency.name]) {
            currencyPairsByName[currency.name] = [];
        }
        currencyPairsByName[currency.name].push(currency);
    });

    const sortedPairs = Object.entries(currencyPairsByName).sort(([nameA], [nameB]) => nameA.localeCompare(nameB));

    sortedPairs.forEach(([name, items]) => {
        const firstItem = items[0];
        let groupName: string;

        if (groupingKey === 'popularity') {
            groupName = firstItem.popularity === 1 ? '1: Easy' : firstItem.popularity === 2 ? '2: Medium' : '3: Hard';
        } else {
            groupName = firstItem.region;
        }

        if (!acc[groupName]) {
            acc[groupName] = {};
        }
        acc[groupName][name] = items;
    });

    return acc;
  }, [unlockedCurrencies, sortOrder, filterType]);
  
  const groups = Object.keys(groupedCurrencies).sort();
  
  const handleGoHome = () => {
    playClick();
    onGoHome();
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn">
       <div className="px-4 md:px-8 pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8 text-center">
            Collection
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-gray-400">Filter:</span>
                <SelectionButton label="All" onClick={() => { playClick(); setFilterType('all'); }} isActive={filterType === 'all'} small />
                <SelectionButton label="Coins" onClick={() => { playClick(); setFilterType('coin'); }} isActive={filterType === 'coin'} small />
                <SelectionButton label="Banknotes" onClick={() => { playClick(); setFilterType('banknote'); }} isActive={filterType === 'banknote'} small />
            </div>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-gray-400">Sort by:</span>
                <SelectionButton label="Region" onClick={() => { playClick(); setSortOrder('region'); }} isActive={sortOrder === 'region'} small />
                <SelectionButton label="Popularity" onClick={() => { playClick(); setSortOrder('popularity'); }} isActive={sortOrder === 'popularity'} small />
            </div>
          </div>
       </div>

       <div className="sticky top-0 z-10 bg-theme-light/95 dark:bg-theme-dark/95 backdrop-blur-sm px-4 md:px-8 pt-4 pb-2">
        <header className="flex justify-end items-center">
          <button
            onClick={handleGoHome}
            className={`transition-all duration-300 font-bold rounded-lg flex-shrink-0 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 ${
              isScrolled
                ? 'w-12 h-12 bg-white/80 dark:bg-gray-800/80 shadow-md'
                : 'py-2 px-4 bg-gray-200 dark:bg-gray-600'
            }`}
            aria-label="Back to Menu"
          >
            <span className="text-2xl">&larr;</span>
            {!isScrolled && <span className="ml-2">Back to Menu</span>}
          </button>
        </header>

        {sortOrder === 'region' && groups.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 animate-fadeIn pt-4">
              <span className="self-center mr-2 font-semibold text-slate-600 dark:text-gray-400">Jump to:</span>
              {groups.map(region => (
                <a 
                  key={region} 
                  href={`#region-${region.replace(/\s+/g, '-')}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(`region-${region.replace(/\s+/g, '-')}`);
                    if (element) {
                      const yOffset = -120; 
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({top: y, behavior: 'smooth'});
                    }
                    playClick();
                  }}
                  className="px-4 py-1.5 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-full text-sm font-semibold shadow-sm hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-200 transform hover:scale-105"
                >
                  {region}
                </a>
              ))}
            </div>
          )}
      </div>

      <div className="px-4 md:px-8 pb-8">
        {unlockedCurrencies.length === 0 ? (
          <div className="text-center py-16">
              <p className="text-xl text-slate-500 dark:text-gray-400">Your collection is empty.</p>
          </div>
        ) : (
          <div className="space-y-12 pt-8">
            {groups.map(group => (
            <section key={group} id={`region-${group.replace(/\s+/g, '-')}`} className="scroll-mt-36">
                <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-300 mb-6 border-b-2 border-primary/30 pb-3">
                {group}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(groupedCurrencies[group]).map(([name, items]) => (
                    <CurrencyPair key={name} name={name} items={items} />
                ))}
                </div>
            </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionScreen;