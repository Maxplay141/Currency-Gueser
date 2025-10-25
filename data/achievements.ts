import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'totalCorrect',
    name: 'Knowledge Seeker',
    description: 'Answer questions correctly.',
    stat: 'totalCorrectAnswers',
    tiers: [
      { tier: 'Bronze', goal: 25, reward: 50, description: 'Answer 25 questions correctly.' },
      { tier: 'Silver', goal: 100, reward: 100, description: 'Answer 100 questions correctly.' },
      { tier: 'Gold', goal: 250, reward: 250, description: 'Answer 250 questions correctly.' },
      { tier: 'Platinum', goal: 500, reward: 500, description: 'Answer 500 questions correctly.' },
    ],
  },
  {
    id: 'bestStreak',
    name: 'On Fire!',
    description: 'Achieve a high answer streak in a single game.',
    stat: 'bestStreak',
    tiers: [
      { tier: 'Bronze', goal: 10, reward: 75, description: 'Get a 10-answer streak.' },
      { tier: 'Silver', goal: 20, reward: 150, description: 'Get a 20-answer streak.' },
      { tier: 'Gold', goal: 30, reward: 300, description: 'Get a 30-answer streak.' },
      { tier: 'Platinum', goal: 50, reward: 600, description: 'Get a 50-answer streak.' },
    ],
  },
  {
    id: 'currenciesDiscovered',
    name: 'Collector',
    description: 'Unlock unique currencies.',
    stat: 'unlockedCurrencyIds',
    tiers: [
      { tier: 'Bronze', goal: 25, reward: 100, description: 'Discover 25 unique currencies.' },
      { tier: 'Silver', goal: 50, reward: 200, description: 'Discover 50 unique currencies.' },
      { tier: 'Gold', goal: 100, reward: 400, description: 'Discover 100 unique currencies.' },
      { tier: 'Platinum', goal: 200, reward: 800, description: 'Discover all 200+ currencies.' },
    ],
  },
  {
    id: 'perfectGames',
    name: 'Perfectionist',
    description: 'Finish a game with 100% accuracy (min. 10 questions).',
    stat: 'perfectGames',
    tiers: [
      { tier: 'Bronze', goal: 1, reward: 100, description: 'Get 1 perfect game.' },
      { tier: 'Silver', goal: 5, reward: 250, description: 'Get 5 perfect games.' },
      { tier: 'Gold', goal: 10, reward: 500, description: 'Get 10 perfect games.' },
      { tier: 'Platinum', goal: 25, reward: 1000, description: 'Get 25 perfect games.' },
    ],
  },
  {
    id: 'classicGamesPlayed',
    name: 'Classic Veteran',
    description: 'Play Classic Mode games.',
    stat: 'classicGamesPlayed',
    tiers: [
      { tier: 'Bronze', goal: 5, reward: 50, description: 'Play 5 Classic games.' },
      { tier: 'Silver', goal: 25, reward: 100, description: 'Play 25 Classic games.' },
      { tier: 'Gold', goal: 50, reward: 200, description: 'Play 50 Classic games.' },
    ],
  },
  {
    id: 'timedGamesPlayed',
    name: 'Time Lord',
    description: 'Play Timed Mode games.',
    stat: 'timedGamesPlayed',
    tiers: [
      { tier: 'Bronze', goal: 5, reward: 50, description: 'Play 5 Timed games.' },
      { tier: 'Silver', goal: 25, reward: 100, description: 'Play 25 Timed games.' },
      { tier: 'Gold', goal: 50, reward: 200, description: 'Play 50 Timed games.' },
    ],
  },
  {
    id: 'mapGamesPlayed',
    name: 'Globetrotter',
    description: 'Play Map Mode games.',
    stat: 'mapGamesPlayed',
    tiers: [
      { tier: 'Bronze', goal: 5, reward: 50, description: 'Play 5 Map games.' },
      { tier: 'Silver', goal: 25, reward: 100, description: 'Play 25 Map games.' },
      { tier: 'Gold', goal: 50, reward: 200, description: 'Play 50 Map games.' },
    ],
  },
  {
    id: 'compareGamesPlayed',
    name: 'Critical Thinker',
    description: 'Play Compare Mode games.',
    stat: 'compareGamesPlayed',
    tiers: [
      { tier: 'Bronze', goal: 5, reward: 60, description: 'Play 5 Compare games.' },
      { tier: 'Silver', goal: 25, reward: 120, description: 'Play 25 Compare games.' },
      { tier: 'Gold', goal: 50, reward: 240, description: 'Play 50 Compare games.' },
    ],
  },
    {
    id: 'timeAttackGamesPlayed',
    name: 'Adrenaline Junkie',
    description: 'Play Time Attack games.',
    stat: 'timeAttackGamesPlayed',
    tiers: [
      { tier: 'Bronze', goal: 5, reward: 60, description: 'Play 5 Time Attack games.' },
      { tier: 'Silver', goal: 25, reward: 120, description: 'Play 25 Time Attack games.' },
      { tier: 'Gold', goal: 50, reward: 240, description: 'Play 50 Time Attack games.' },
    ],
  },
];