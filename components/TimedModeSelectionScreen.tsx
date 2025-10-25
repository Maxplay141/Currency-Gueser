import React, { useState, useContext } from 'react';
import { TimedGameOptions, Region, Difficulty } from '../types';
import { SoundContext } from '../context/SoundContext';

interface TimedModeSelectionScreenProps {
  onStartGame: (options: TimedGameOptions) => void;
  onBack: () => void;
}

const DURATIONS: (number | string)[] = [30, 60, 'Custom'];
const TYPES: ('coin' | 'banknote')[] = ['coin', 'banknote'];
const REGIONS: (Region | 'All Regions')[] = ['All Regions', 'Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];


const SelectionButton: React.FC<{ label: string; onClick: () => void; isActive: boolean; }> = ({ label, onClick, isActive }) => {
  const baseClasses = "w-full text-center p-3 rounded-lg shadow-md transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed";
  const activeClasses = "bg-primary text-white scale-105 ring-4 ring-primary/50";
  const inactiveClasses = "bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 hover:scale-105";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="font-semibold text-lg">{label}</span>
    </button>
  );
}

const TimedModeSelectionScreen: React.FC<TimedModeSelectionScreenProps> = ({ onStartGame, onBack }) => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState<string>('90');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedType, setSelectedType] = useState<'coin' | 'banknote' | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All Regions' | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const { playClick } = useContext(SoundContext);
  
  const handleSelectDuration = (duration: number | string) => {
    playClick();
    // Reset subsequent selections
    setSelectedType(null);
    setSelectedRegion(null);
    setSelectedDifficulty(null);

    if (duration === 'Custom') {
      setShowCustomInput(true);
      const parsedValue = parseInt(customDuration, 10);
      if (!isNaN(parsedValue) && parsedValue >= 10 && parsedValue <= 300) {
        setSelectedDuration(parsedValue);
      } else {
        setSelectedDuration(null);
      }
    } else if (typeof duration === 'number') {
      setShowCustomInput(false);
      setSelectedDuration(duration);
    }
  };

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 3) return;
    setCustomDuration(value);

    const parsedValue = parseInt(value, 10);
    if (value === '') {
      setSelectedDuration(null);
      return;
    }

    if (!isNaN(parsedValue) && parsedValue >= 10 && parsedValue <= 300) {
      setSelectedDuration(parsedValue);
    } else {
      setSelectedDuration(null);
    }
  };

  const handleSelectType = (type: 'coin' | 'banknote') => {
    playClick();
    setSelectedType(type);
    setSelectedRegion(null);
    setSelectedDifficulty(null);
  };

  const handleSelectRegion = (region: Region | 'All Regions') => {
    playClick();
    setSelectedRegion(region);
    setSelectedDifficulty(null);
  };
  
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    playClick();
    setSelectedDifficulty(difficulty);
  };

  const handleStart = () => {
    if (selectedDuration && selectedType && selectedRegion && selectedDifficulty) {
      playClick();
      onStartGame({
        duration: selectedDuration,
        currencyType: selectedType,
        region: selectedRegion,
        difficulty: selectedDifficulty
      });
    }
  };
  
  const handleBack = () => {
    playClick();
    onBack();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-fadeIn">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Timed Setup
            </h1>
            <button
            onClick={handleBack}
            className="bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300 flex-shrink-0"
            >
            &larr; Back
            </button>
        </header>

        <div className="space-y-10">
            <section>
                <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300 mb-4">1. Choose Duration</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DURATIONS.map(duration => (
                    <SelectionButton
                        key={duration}
                        label={typeof duration === 'number' ? `${duration} seconds` : duration}
                        onClick={() => handleSelectDuration(duration)}
                        isActive={
                          (showCustomInput && duration === 'Custom') ||
                          (!showCustomInput && selectedDuration === duration)
                        }
                    />
                  ))}
                </div>
                {showCustomInput && (
                  <div className="mt-4 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-gray-400 mb-2 text-center">Set custom time (10-300s)</h3>
                    <div 
                      className="w-full max-w-xs mx-auto p-3 rounded-lg shadow-md bg-white dark:bg-gray-700 border-2 border-primary focus-within:ring-2 focus-within:ring-primary
                                 flex justify-center items-baseline space-x-1"
                    >
                      <input
                        type="number"
                        value={customDuration}
                        onChange={handleCustomDurationChange}
                        className="bg-transparent text-right focus:outline-none font-semibold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{width: `${customDuration.length + 1}ch`}}
                        min="10"
                        max="300"
                        autoFocus
                      />
                      <span className="text-slate-500 dark:text-gray-400 font-semibold text-lg">
                        s
                      </span>
                    </div>
                  </div>
                )}
            </section>

            {selectedDuration && (
              <section className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300 mb-4">2. Choose a Type</h2>
                  <div className="grid grid-cols-2 gap-4">
                      {TYPES.map(type => (
                          <SelectionButton
                              key={type}
                              label={type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                              onClick={() => handleSelectType(type)}
                              isActive={selectedType === type}
                          />
                      ))}
                  </div>
              </section>
            )}

            {selectedType && (
                <section className="animate-fadeIn">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300 mb-4">3. Choose a Region</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {REGIONS.map(region => (
                            <SelectionButton
                                key={region}
                                label={region}
                                onClick={() => handleSelectRegion(region)}
                                isActive={selectedRegion === region}
                            />
                        ))}
                    </div>
                </section>
            )}

            {selectedRegion && (
                 <section className="animate-fadeIn">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300 mb-4">4. Select Difficulty</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {DIFFICULTIES.map(difficulty => (
                            <SelectionButton
                                key={difficulty}
                                label={difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                                onClick={() => handleSelectDifficulty(difficulty)}
                                isActive={selectedDifficulty === difficulty}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>

        <div className="mt-12">
            <button
                onClick={handleStart}
                disabled={!selectedDuration || !selectedType || !selectedRegion || !selectedDifficulty}
                className="w-full bg-accent text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed"
            >
                Start Game
            </button>
        </div>
    </div>
  );
};

export default TimedModeSelectionScreen;