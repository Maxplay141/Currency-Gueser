

export interface Currency {
  id: string;
  name: string;
  type: 'coin' | 'banknote';
  imageUrl: string;
  region: 'Europe' | 'Asia' | 'North America' | 'South America' | 'Africa' | 'Oceania';
  popularity: 1 | 2 | 3; // 1: Easy, 2: Medium, 3: Hard
  countryCode: string;
  countryName: string;
}

export type GameMode = 'CLASSIC' | 'TIMED' | 'MAP' | 'RANDOM' | 'COMPARE' | 'TIME_ATTACK';

export interface Question {
  correctAnswer: Currency;
  options: Currency[];
  image: string;
}

export interface MapQuestion {
  correctAnswer: Currency;
}

export type CompareQuestionType = 'COUNTRY_MATCH' | 'REGION_ODD_ONE_OUT';

export interface CompareQuestion {
  type: CompareQuestionType;
  currencies: [Currency, Currency];
  questionText: string;
  options?: string[]; // Country names for COUNTRY_MATCH
  correctAnswer: string; // Country name or currency ID
}


export type Screen = 'HOME' | 'GAME_MODE_SELECTION' | 'CLASSIC_SELECTION' | 'TIMED_SELECTION' | 'MAP_SELECTION' | 'RANDOM_SELECTION' | 'GAME' | 'RESULTS' | 'COLLECTION' | 'SHOP' | 'STATS' | 'ACHIEVEMENTS' | 'COMPARE_SELECTION' | 'TIME_ATTACK_SELECTION';

export interface GameResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  mode: GameMode;
  duration?: number;
  bestStreakInGame: number;
  isPerfect: boolean;
}

export type AnswerState = 'UNANSWERED' | 'CORRECT' | 'INCORRECT';

export interface Theme {
  id: string;
  name: string;
  price: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bgLight: string;
    bgDark: string;
  };
}

export interface CurrencyPack {
  id: string;
  name: string;
  description: string;
  price: number;
  currencyIds: string[];
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Region = 'Europe' | 'Asia' | 'North America' | 'South America' | 'Africa' | 'Oceania';

export interface ClassicGameOptions {
  currencyType: 'coin' | 'banknote';
  region: Region | 'All Regions';
  difficulty: Difficulty;
  numQuestions: number;
}

export interface TimedGameOptions {
  duration: number;
  currencyType: 'coin' | 'banknote';
  region: Region | 'All Regions';
  difficulty: Difficulty;
}

export interface CompareGameOptions {
  difficulty: Difficulty;
  numQuestions: number;
}

export interface TimeAttackGameOptions {
  difficulty: Difficulty;
  duration: number;
}

export interface CurrencyStat {
  attempts: number;
  correct: number;
  lastSeen: number;
  correctStreak: number;
  nextReview: number;
}

// Achievement Types
export type AchievementStat = 'totalCorrectAnswers' | 'bestStreak' | 'unlockedCurrencyIds' | 'perfectGames' | 'classicGamesPlayed' | 'timedGamesPlayed' | 'mapGamesPlayed' | 'randomGamesPlayed' | 'compareGamesPlayed' | 'timeAttackGamesPlayed';

export interface AchievementTier {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  goal: number;
  reward: number;
  description?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  stat: AchievementStat;
  tiers: AchievementTier[];
}

export interface PlayerAchievementProgress {
  id: string;
  unlockedTier: number; // Index of the highest unlocked tier. -1 if none.
  progress: number;
  unlockedAt: { [tierIndex: number]: number };
}

export interface AchievementToastInfo {
  achievement: Achievement;
  tier: AchievementTier;
}