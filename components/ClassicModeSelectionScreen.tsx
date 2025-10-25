import React, { useState, useContext } from 'react';
import { ClassicGameOptions, Region, Difficulty } from '../types';
import { SoundContext } from '../context/SoundContext';

interface ClassicModeSelectionScreenProps {
  onStartGame: (options: ClassicGameOptions) => void;
  onBack: () => void;
}

const NUM_QUESTIONS_OPTIONS: (number | string)[] = [5, 10, 'Custom'];
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

const ClassicModeSelectionScreen: React.FC<ClassicModeSelectionScreenProps> = ({ onStartGame, onBack }) => {
  const [selectedNumQuestions, setSelectedNumQuestions] = useState<number | null>(null);
  const [customNumQuestions, setCustomNumQuestions] = useState<string>('15');
  const [showCustomNumInput, setShowCustomNumInput] = useState(false);
  
  const [selectedType, setSelectedType] = useState<'coin' | 'banknote' | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All Regions' | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const { playClick } = useContext(SoundContext);

  const handleSelectNumQuestions = (num: number | string) => {
    playClick();
    setSelectedType(null);
    setSelectedRegion(null);
    setSelectedDifficulty(null);

    if (num === 'Custom') {
      setShowCustomNumInput(true);
      const parsedValue = parseInt(customNumQuestions, 10);
      if (!isNaN(parsedValue) && parsedValue >= 5 && parsedValue <= 100) {
        setSelectedNumQuestions(parsedValue);
      } else {
        setSelectedNumQuestions(null);
      }
    } else if (typeof num === 'number') {
      setShowCustomNumInput(false);
      setSelectedNumQuestions(num);
    }
  };

  const handleCustomNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 3) return;
    setCustomNumQuestions(value);
    const parsedValue = parseInt(value, 10);
    if (value === '') {
      setSelectedNumQuestions(null);
      return;
    }
    if (!isNaN(parsedValue) && parsedValue >= 5 && parsedValue <= 100) {
      setSelectedNumQuestions(parsedValue);
    } else {
      setSelectedNumQuestions(null);
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
    if (selectedNumQuestions && selectedType && selectedRegion && selectedDifficulty) {
      playClick();
      onStartGame({ 
        numQuestions: selectedNumQuestions,
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
            Classic Setup
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
                <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300 mb-4">1. Number of Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {NUM_QUESTIONS_OPTIONS.map(num => (
                        <SelectionButton
                            key={num}
                            label={typeof num === 'number' ? `${num} Questions` : num}
                            onClick={() => handleSelectNumQuestions(num)}
                            isActive={
                                (showCustomNumInput && num === 'Custom') ||
                                (!showCustomNumInput && selectedNumQuestions === num)
                            }
                        />
                    ))}
                </div>
                {showCustomNumInput && (
                    <div className="mt-4 animate-fadeIn">
                        <h3 className="text-lg font-semibold text-slate-600 dark:text-gray-400 mb-2 text-center">Set custom number (5-100)</h3>
                        <div className="w-full max-w-xs mx-auto">
                            <input
                                type="number"
                                value={customNumQuestions}
                                onChange={handleCustomNumChange}
                                className="w-full text-center p-3 rounded-lg shadow-md bg-white dark:bg-gray-700 border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="5"
                                max="100"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </section>

            {selectedNumQuestions && (
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
                disabled={!selectedNumQuestions || !selectedType || !selectedRegion || !selectedDifficulty}
                className="w-full bg-accent text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed"
            >
                Start Game
            </button>
        </div>
    </div>
  );
};

export default ClassicModeSelectionScreen;