import React, { createContext, ReactNode } from 'react';
import { usePlayerData, PlayerData, PlayerDataActions } from '../hooks/usePlayerData';
import { AchievementToastInfo, CurrencyStat } from '../types';

export const PlayerDataContext = createContext<{
  playerData: PlayerData;
  addCoins: PlayerDataActions['addCoins'];
  spendCoins: PlayerDataActions['spendCoins'];
  unlockCurrencyPack: PlayerDataActions['unlockCurrencyPack'];
  unlockTheme: PlayerDataActions['unlockTheme'];
  setActiveTheme: PlayerDataActions['setActiveTheme'];
  updateStats: PlayerDataActions['updateStats'];
  updateCurrencyStats: PlayerDataActions['updateCurrencyStats'];
  removeFirstUnlockedAchievement: PlayerDataActions['removeFirstUnlockedAchievement'];
}>({
  playerData: {
    coins: 0,
    unlockedCurrencyIds: [],
    unlockedThemeIds: [],
    activeThemeId: 'emerald_sea',
    gamesPlayed: 0,
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
    bestStreak: 0,
    highestTimedScore: 0,
    currencyStats: {},
    perfectGames: 0,
    classicGamesPlayed: 0,
    timedGamesPlayed: 0,
    mapGamesPlayed: 0,
    randomGamesPlayed: 0,
    compareGamesPlayed: 0,
    timeAttackGamesPlayed: 0,
    achievements: {},
    unlockedAchievementsToShow: [],
  },
  addCoins: () => {},
  spendCoins: () => {},
  unlockCurrencyPack: () => {},
  unlockTheme: () => {},
  setActiveTheme: () => {},
  updateStats: () => {},
  updateCurrencyStats: () => {},
  removeFirstUnlockedAchievement: () => {},
});

interface PlayerDataContextProviderProps {
  children: ReactNode;
}

export const PlayerDataContextProvider: React.FC<PlayerDataContextProviderProps> = ({ children }) => {
  const { playerData, actions } = usePlayerData();

  return (
    <PlayerDataContext.Provider value={{ playerData, ...actions }}>
      {children}
    </PlayerDataContext.Provider>
  );
};