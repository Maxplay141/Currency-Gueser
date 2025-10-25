import { useState, useEffect, useCallback } from 'react';
import { GameResult, CurrencyStat, PlayerAchievementProgress, AchievementToastInfo, GameMode } from '../types';
import { INITIAL_COINS, DEFAULT_UNLOCKED_CURRENCY_IDS } from '../constants';
import { ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEY = 'currency_guesser_player_data';

const REVIEW_INTERVALS = [
  0,
  1 * 24 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  14 * 24 * 60 * 60 * 1000,
  30 * 24 * 60 * 60 * 1000,
  60 * 24 * 60 * 60 * 1000,
  120 * 24 * 60 * 60 * 1000,
];

export interface PlayerData {
  coins: number;
  unlockedCurrencyIds: string[];
  unlockedThemeIds: string[];
  activeThemeId: string;
  // Game Stats
  gamesPlayed: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  bestStreak: number;
  highestTimedScore: number;
  // Spaced Repetition Stats
  currencyStats: { [currencyId: string]: CurrencyStat };
  // Achievement Stats
  perfectGames: number;
  classicGamesPlayed: number;
  timedGamesPlayed: number;
  mapGamesPlayed: number;
  randomGamesPlayed: number;
  compareGamesPlayed: number;
  timeAttackGamesPlayed: number;
  achievements: { [id: string]: PlayerAchievementProgress };
  unlockedAchievementsToShow: AchievementToastInfo[];
}

export interface PlayerDataActions {
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => void;
    unlockCurrencyPack: (currencyIds: string[]) => void;
    unlockTheme: (themeId: string) => void;
    setActiveTheme: (themeId: string) => void;
    updateStats: (result: GameResult) => void;
    updateCurrencyStats: (currencyId: string, wasCorrect: boolean) => void;
    removeFirstUnlockedAchievement: () => void;
}

const getInitialData = (): PlayerData => {
  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.coins !== undefined && parsed.unlockedCurrencyIds) {
        return {
          coins: parsed.coins,
          unlockedCurrencyIds: parsed.unlockedCurrencyIds,
          unlockedThemeIds: parsed.unlockedThemeIds || ['emerald_sea'],
          activeThemeId: parsed.activeThemeId || 'emerald_sea',
          gamesPlayed: parsed.gamesPlayed || 0,
          totalCorrectAnswers: parsed.totalCorrectAnswers || 0,
          totalQuestionsAnswered: parsed.totalQuestionsAnswered || 0,
          bestStreak: parsed.bestStreak || 0,
          highestTimedScore: parsed.highestTimedScore || 0,
          currencyStats: parsed.currencyStats || {},
          perfectGames: parsed.perfectGames || 0,
          classicGamesPlayed: parsed.classicGamesPlayed || 0,
          timedGamesPlayed: parsed.timedGamesPlayed || 0,
          mapGamesPlayed: parsed.mapGamesPlayed || 0,
          randomGamesPlayed: parsed.randomGamesPlayed || 0,
          compareGamesPlayed: parsed.compareGamesPlayed || 0,
          timeAttackGamesPlayed: parsed.timeAttackGamesPlayed || 0,
          achievements: parsed.achievements || {},
          unlockedAchievementsToShow: [],
        };
      }
    }
  } catch (error) {
    console.error("Failed to load player data from localStorage", error);
  }
  
  return {
    coins: INITIAL_COINS,
    unlockedCurrencyIds: DEFAULT_UNLOCKED_CURRENCY_IDS,
    unlockedThemeIds: ['emerald_sea'],
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
  };
};

export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState<PlayerData>(getInitialData);

  useEffect(() => {
    try {
      const dataToSave = { ...playerData, unlockedAchievementsToShow: [] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save player data to localStorage", error);
    }
  }, [playerData]);

  const checkAndGrantAchievements = useCallback((currentData: PlayerData): { newData: PlayerData, newToasts: AchievementToastInfo[] } => {
    let newToasts: AchievementToastInfo[] = [];
    let updatedData = { ...currentData, achievements: { ...currentData.achievements } };
    let newCoins = 0;
  
    for (const achievement of ACHIEVEMENTS) {
      const progress = updatedData.achievements[achievement.id] || {
        id: achievement.id,
        unlockedTier: -1,
        progress: 0,
        unlockedAt: {},
      };
  
      let currentStatValue = 0;
      if (achievement.stat === 'unlockedCurrencyIds') {
        currentStatValue = updatedData.unlockedCurrencyIds.length;
      } else {
        currentStatValue = (updatedData[achievement.stat as keyof PlayerData] || 0) as number;
      }
  
      progress.progress = currentStatValue;
  
      let lastUnlockedTier = progress.unlockedTier;
      let newTierUnlocked = false;
  
      for (let i = 0; i < achievement.tiers.length; i++) {
        const tier = achievement.tiers[i];
        if (i > lastUnlockedTier && currentStatValue >= tier.goal) {
          progress.unlockedTier = i;
          progress.unlockedAt[i] = Date.now();
          newCoins += tier.reward;
          newToasts.push({ achievement, tier });
          newTierUnlocked = true;
        }
      }
  
      if (newTierUnlocked) {
        updatedData.achievements[achievement.id] = { ...progress };
      }
    }
    
    if (newCoins > 0) {
      updatedData.coins += newCoins;
    }
  
    return { newData: updatedData, newToasts };
  }, []);

  const addCoins = useCallback((amount: number) => {
    setPlayerData(prev => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const spendCoins = useCallback((amount: number) => {
    setPlayerData(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
  }, []);

  const unlockCurrencyPack = useCallback((currencyIds: string[]) => {
    setPlayerData(prev => {
      const newUnlockedIds = [...new Set([...prev.unlockedCurrencyIds, ...currencyIds])];
      let updatedData = { ...prev, unlockedCurrencyIds: newUnlockedIds };
      
      const { newData, newToasts } = checkAndGrantAchievements(updatedData);
      newData.unlockedAchievementsToShow = [...prev.unlockedAchievementsToShow, ...newToasts];

      return newData;
    });
  }, [checkAndGrantAchievements]);

  const unlockTheme = useCallback((themeId: string) => {
    setPlayerData(prev => ({
      ...prev,
      unlockedThemeIds: [...new Set([...prev.unlockedThemeIds, themeId])],
    }));
  }, []);
  
  const setActiveTheme = useCallback((themeId: string) => {
    setPlayerData(prev => ({ ...prev, activeThemeId: themeId }));
  }, []);

  const updateStats = useCallback((result: GameResult) => {
    setPlayerData(prev => {
      let newStats: PlayerData = { ...prev };
      newStats.gamesPlayed += 1;
      newStats.totalCorrectAnswers += result.correctAnswers;
      newStats.totalQuestionsAnswered += result.totalQuestions;
      
      if (result.bestStreakInGame > prev.bestStreak) {
        newStats.bestStreak = result.bestStreakInGame;
      }

      if (result.isPerfect) {
        newStats.perfectGames += 1;
      }

      const modeKey = `${result.mode.toLowerCase()}GamesPlayed` as keyof PlayerData;
      if (modeKey in newStats && typeof newStats[modeKey] === 'number') {
        (newStats[modeKey] as number) += 1;
      }

      if (result.mode === 'TIMED' && result.score > prev.highestTimedScore) {
        newStats.highestTimedScore = result.score;
      }

      const { newData, newToasts } = checkAndGrantAchievements(newStats);
      newData.unlockedAchievementsToShow = [...prev.unlockedAchievementsToShow, ...newToasts];
      
      return newData;
    });
  }, [checkAndGrantAchievements]);
  
  const updateCurrencyStats = useCallback((currencyId: string, wasCorrect: boolean) => {
    setPlayerData(prev => {
      const stats = prev.currencyStats[currencyId] || {
        attempts: 0,
        correct: 0,
        lastSeen: 0,
        correctStreak: 0,
        nextReview: 0,
      };

      const newStats: CurrencyStat = { ...stats };
      newStats.attempts += 1;
      newStats.lastSeen = Date.now();
      
      if (wasCorrect) {
        newStats.correct += 1;
        newStats.correctStreak += 1;
        const intervalIndex = Math.min(newStats.correctStreak, REVIEW_INTERVALS.length - 1);
        newStats.nextReview = Date.now() + REVIEW_INTERVALS[intervalIndex];
      } else {
        newStats.correctStreak = 0;
        newStats.nextReview = Date.now() + (5 * 60 * 1000);
      }

      return {
        ...prev,
        currencyStats: {
          ...prev.currencyStats,
          [currencyId]: newStats,
        },
      };
    });
  }, []);

  const removeFirstUnlockedAchievement = useCallback(() => {
    setPlayerData(prev => ({
        ...prev,
        unlockedAchievementsToShow: prev.unlockedAchievementsToShow.slice(1),
    }));
  }, []);

  const actions: PlayerDataActions = {
    addCoins,
    spendCoins,
    unlockCurrencyPack,
    unlockTheme,
    setActiveTheme,
    updateStats,
    updateCurrencyStats,
    removeFirstUnlockedAchievement,
  };

  return { playerData, actions };
};