import React, { useState, useEffect, useCallback, useContext } from 'react';
import { GameMode, Screen, GameResult, ClassicGameOptions, TimedGameOptions, Region, Difficulty, AchievementToastInfo, CompareGameOptions, TimeAttackGameOptions } from './types';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import MapGameScreen from './components/MapGameScreen';
import ResultsScreen from './components/ResultsScreen';
import ThemeToggle from './components/ThemeToggle';
import CollectionScreen from './components/CollectionScreen';
import ShopScreen from './components/ShopScreen';
import LoadingScreen from './components/LoadingScreen';
import { PlayerDataContextProvider, PlayerDataContext } from './context/PlayerDataContext';
import { THEMES } from './constants';
import CoinDisplay from './components/CoinDisplay';
import { SoundContextProvider } from './context/SoundContext';
import SoundToggle from './components/SoundToggle';
import ClassicModeSelectionScreen from './components/ClassicModeSelectionScreen';
import TimedModeSelectionScreen from './components/TimedModeSelectionScreen';
import MapModeSelectionScreen from './components/MapModeSelectionScreen';
import RandomModeSelectionScreen from './components/RandomModeSelectionScreen';
import StatsScreen from './components/StatsScreen';
import AchievementUnlockedToast from './components/AchievementUnlockedToast';
import AchievementsScreen from './components/AchievementsScreen';
import GameModeSelectionScreen from './components/GameModeSelectionScreen';
import { MusicContextProvider } from './context/MusicContext';
import MusicToggle from './components/MusicToggle';
import CompareModeSelectionScreen from './components/CompareModeSelectionScreen';
import CompareGameScreen from './components/CompareGameScreen';
import TimeAttackSelectionScreen from './components/TimeAttackSelectionScreen';
import TimeAttackGameScreen from './components/TimeAttackGameScreen';


const ThemedApp: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [gameMode, setGameMode] = useState<GameMode>('CLASSIC');
  const [classicOptions, setClassicOptions] = useState<ClassicGameOptions | null>(null);
  const [timedOptions, setTimedOptions] = useState<TimedGameOptions | null>(null);
  const [mapOptions, setMapOptions] = useState<ClassicGameOptions | null>(null);
  const [compareOptions, setCompareOptions] = useState<CompareGameOptions | null>(null);
  const [timeAttackOptions, setTimeAttackOptions] = useState<TimeAttackGameOptions | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRandomGame, setIsRandomGame] = useState(false);
  const [currentAchievementToast, setCurrentAchievementToast] = useState<AchievementToastInfo | null>(null);

  const { playerData, updateStats, removeFirstUnlockedAchievement } = useContext(PlayerDataContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const activeTheme = THEMES.find(t => t.id === playerData.activeThemeId);
    if (activeTheme) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', activeTheme.colors.primary);
      root.style.setProperty('--color-secondary', activeTheme.colors.secondary);
      root.style.setProperty('--color-accent', activeTheme.colors.accent);
      root.style.setProperty('--color-bg-light', activeTheme.colors.bgLight);
      root.style.setProperty('--color-bg-dark', activeTheme.colors.bgDark);
    }
  }, [playerData.activeThemeId]);

  useEffect(() => {
    if (!currentAchievementToast && playerData.unlockedAchievementsToShow.length > 0) {
      const firstToast = playerData.unlockedAchievementsToShow[0];
      setCurrentAchievementToast(firstToast);
    }
  }, [playerData.unlockedAchievementsToShow, currentAchievementToast]);

  const handleToastClose = useCallback(() => {
    setCurrentAchievementToast(null);
    removeFirstUnlockedAchievement();
  }, [removeFirstUnlockedAchievement]);


  const startGame = useCallback((mode: GameMode, options: ClassicGameOptions | TimedGameOptions | CompareGameOptions | TimeAttackGameOptions) => {
    setGameMode(mode);
    setClassicOptions(null);
    setTimedOptions(null);
    setMapOptions(null);
    setCompareOptions(null);
    setTimeAttackOptions(null);

    if (mode === 'CLASSIC' && 'numQuestions' in options) {
      setClassicOptions(options as ClassicGameOptions);
    } else if (mode === 'TIMED' && 'duration' in options) {
      setTimedOptions(options as TimedGameOptions);
    } else if (mode === 'MAP' && 'numQuestions' in options) {
      setMapOptions(options as ClassicGameOptions);
    } else if (mode === 'COMPARE' && 'numQuestions' in options) {
      setCompareOptions(options as CompareGameOptions);
    } else if (mode === 'TIME_ATTACK' && 'duration' in options) {
      setTimeAttackOptions(options as TimeAttackGameOptions);
    }
    setScreen('GAME');
  }, []);

  const startRandomGame = useCallback((difficulty: Difficulty) => {
    setIsRandomGame(true);
    const gameModes: GameMode[] = ['CLASSIC', 'TIMED', 'MAP'];
    const chosenMode = gameModes[Math.floor(Math.random() * gameModes.length)];

    const currencyTypes: ('coin' | 'banknote')[] = ['coin', 'banknote'];
    const chosenCurrencyType = currencyTypes[Math.floor(Math.random() * currencyTypes.length)];

    const regions: (Region | 'All Regions')[] = ['All Regions', 'Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
    const chosenRegion = regions[Math.floor(Math.random() * regions.length)];

    if (chosenMode === 'TIMED') {
        const durations = [30, 60, 90, 120];
        const chosenDuration = durations[Math.floor(Math.random() * durations.length)];
        const options: TimedGameOptions = {
            duration: chosenDuration,
            currencyType: chosenCurrencyType,
            region: chosenRegion,
            difficulty: difficulty
        };
        startGame(chosenMode, options);
    } else { 
        const numQuestionsOptions = [10, 15, 20];
        const chosenNumQuestions = numQuestionsOptions[Math.floor(Math.random() * numQuestionsOptions.length)];
        const options: ClassicGameOptions = {
            numQuestions: chosenNumQuestions,
            currencyType: chosenCurrencyType,
            region: chosenRegion,
            difficulty: difficulty
        };
        startGame(chosenMode, options);
    }
  }, [startGame]);

  const endGame = useCallback((result: GameResult) => {
    const finalResult = isRandomGame ? { ...result, mode: 'RANDOM' as GameMode } : result;
    updateStats(finalResult);
    setGameResult(finalResult);
    setScreen('RESULTS');
    setIsRandomGame(false);
  }, [updateStats, isRandomGame]);

  const goToHome = useCallback(() => {
    setGameResult(null);
    setIsRandomGame(false);
    setScreen('HOME');
  }, []);
  
  const goToCollection = useCallback(() => {
    setScreen('COLLECTION');
  }, []);

  const goToShop = useCallback(() => {
    setScreen('SHOP');
  }, []);

  const goToStats = useCallback(() => {
    setScreen('STATS');
  }, []);

  const goToAchievements = useCallback(() => {
    setScreen('ACHIEVEMENTS');
  }, []);
  
  const goToGameModeSelection = useCallback(() => {
    setScreen('GAME_MODE_SELECTION');
  }, []);

  const goToClassicSelection = useCallback(() => {
    setScreen('CLASSIC_SELECTION');
  }, []);
  
  const goToTimedSelection = useCallback(() => {
    setScreen('TIMED_SELECTION');
  }, []);
  
  const goToMapSelection = useCallback(() => {
    setScreen('MAP_SELECTION');
  }, []);

  const goToRandomSelection = useCallback(() => {
    setScreen('RANDOM_SELECTION');
  }, []);

  const goToCompareSelection = useCallback(() => {
    setScreen('COMPARE_SELECTION');
  }, []);

  const goToTimeAttackSelection = useCallback(() => {
    setScreen('TIME_ATTACK_SELECTION');
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (isRandomGame && gameResult) {
      // This logic might need refinement if Random can pick new modes
      const originalOptions = gameMode === 'TIMED' ? timedOptions : (gameMode === 'MAP' ? mapOptions : classicOptions);
      if(originalOptions) {
        startRandomGame(originalOptions.difficulty);
        return;
      }
    }
    
    if (gameMode === 'CLASSIC' && classicOptions) {
      startGame('CLASSIC', classicOptions);
    } else if (gameMode === 'TIMED' && timedOptions) {
      startGame('TIMED', timedOptions);
    } else if (gameMode === 'MAP' && mapOptions) {
      startGame('MAP', mapOptions);
    } else if (gameMode === 'COMPARE' && compareOptions) {
      startGame('COMPARE', compareOptions);
    } else if (gameMode === 'TIME_ATTACK' && timeAttackOptions) {
      startGame('TIME_ATTACK', timeAttackOptions);
    }
  }, [gameMode, classicOptions, timedOptions, mapOptions, compareOptions, timeAttackOptions, startGame, isRandomGame, gameResult, startRandomGame]);


  const renderScreen = () => {
    switch (screen) {
      case 'GAME_MODE_SELECTION':
        return <GameModeSelectionScreen onGoToClassicSelection={goToClassicSelection} onGoToTimedSelection={goToTimedSelection} onGoToMapSelection={goToMapSelection} onGoToRandomSelection={goToRandomSelection} onGoToCompareSelection={goToCompareSelection} onGoToTimeAttackSelection={goToTimeAttackSelection} onBack={goToHome} />;
      case 'CLASSIC_SELECTION':
        return <ClassicModeSelectionScreen onStartGame={(options) => startGame('CLASSIC', options)} onBack={goToGameModeSelection} />;
      case 'TIMED_SELECTION':
        return <TimedModeSelectionScreen onStartGame={(options) => startGame('TIMED', options)} onBack={goToGameModeSelection} />;
      case 'MAP_SELECTION':
        return <MapModeSelectionScreen onStartGame={(options) => startGame('MAP', options)} onBack={goToGameModeSelection} />;
      case 'RANDOM_SELECTION':
        return <RandomModeSelectionScreen onStartGame={startRandomGame} onBack={goToGameModeSelection} />;
      case 'COMPARE_SELECTION':
        return <CompareModeSelectionScreen onStartGame={(options) => startGame('COMPARE', options)} onBack={goToGameModeSelection} />;
      case 'TIME_ATTACK_SELECTION':
        return <TimeAttackSelectionScreen onStartGame={(options) => startGame('TIME_ATTACK', options)} onBack={goToGameModeSelection} />;
      case 'GAME':
        if (gameMode === 'MAP' && mapOptions) {
          return <MapGameScreen mode={gameMode} onGameEnd={endGame} onGoHome={goToHome} onGoToShop={goToShop} mapOptions={mapOptions} />;
        }
        if (gameMode === 'COMPARE' && compareOptions) {
          return <CompareGameScreen mode={gameMode} onGameEnd={endGame} onGoHome={goToHome} onGoToShop={goToShop} options={compareOptions} />;
        }
        if (gameMode === 'TIME_ATTACK' && timeAttackOptions) {
          return <TimeAttackGameScreen mode={gameMode} onGameEnd={endGame} onGoHome={goToHome} onGoToShop={goToShop} options={timeAttackOptions} />;
        }
        return <GameScreen mode={gameMode} onGameEnd={endGame} onGoHome={goToHome} onGoToShop={goToShop} classicOptions={classicOptions} timedOptions={timedOptions} />;
      case 'RESULTS':
        return gameResult && <ResultsScreen result={gameResult} onPlayAgain={handlePlayAgain} onGoHome={goToHome} />;
      case 'COLLECTION':
        return <CollectionScreen onGoHome={goToHome} />;
      case 'SHOP':
        return <ShopScreen onGoHome={goToHome} />;
      case 'STATS':
        return <StatsScreen onGoHome={goToHome} />;
      case 'ACHIEVEMENTS':
        return <AchievementsScreen onGoHome={goToHome} />;
      case 'HOME':
      default:
        return <HomeScreen onGoToGameModeSelection={goToGameModeSelection} onGoToCollection={goToCollection} onGoToShop={goToShop} onGoToStats={goToStats} onGoToAchievements={goToAchievements} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  const mainClasses = ['GAME', 'RESULTS'].includes(screen)
    ? 'min-h-screen flex items-center justify-center'
    : 'min-h-screen flex items-center justify-center p-4';
    
  const showHeaderControls = [
    'HOME', 'SHOP', 'GAME_MODE_SELECTION', 'CLASSIC_SELECTION', 
    'TIMED_SELECTION', 'MAP_SELECTION', 'RANDOM_SELECTION', 'STATS', 
    'ACHIEVEMENTS', 'COMPARE_SELECTION', 'TIME_ATTACK_SELECTION'
  ].includes(screen);

  return (
    <div className="bg-theme-light dark:bg-theme-dark text-slate-800 dark:text-gray-200 min-h-screen font-sans antialiased transition-colors duration-300 relative">
      {showHeaderControls && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <CoinDisplay coins={playerData.coins} />
          </div>
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <MusicToggle />
            <SoundToggle />
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </>
      )}
       {currentAchievementToast && <AchievementUnlockedToast info={currentAchievementToast} onClose={handleToastClose} />}
      <main className={mainClasses}>
        {renderScreen()}
      </main>
    </div>
  );
}


const App: React.FC = () => {
  return (
    <PlayerDataContextProvider>
      <SoundContextProvider>
        <MusicContextProvider>
          <ThemedApp />
        </MusicContextProvider>
      </SoundContextProvider>
    </PlayerDataContextProvider>
  );
};


export default App;