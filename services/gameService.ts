import { Currency, Question, ClassicGameOptions, MapQuestion, TimedGameOptions, Region, Difficulty, CurrencyStat, CompareQuestion, CompareQuestionType, CompareGameOptions } from '../types';
import { CURRENCIES, REGION_VIEWBOXES } from '../constants';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

type FilterOptions = {
  currencyType?: 'coin' | 'banknote';
  region?: Region | 'All Regions';
  difficulty: Difficulty;
}

const getFilteredCurrencyPool = (unlockedCurrencyIds: string[], options: FilterOptions): Currency[] => {
  const availableCurrencies = CURRENCIES.filter(c => unlockedCurrencyIds.includes(c.id));
  
  let questionPool = availableCurrencies;
  
  if (options.currencyType) {
    questionPool = questionPool.filter(c => c.type === options.currencyType);
  }

  if (options.region && options.region !== 'All Regions') {
    questionPool = questionPool.filter(c => c.region === options.region);
  }

  const difficultyMap: Record<Difficulty, number[]> = {
    'EASY': [1],
    'MEDIUM': [1, 2],
    'HARD': [1, 2, 3]
  };
  const allowedPopularities = difficultyMap[options.difficulty];
  questionPool = questionPool.filter(c => allowedPopularities.includes(c.popularity));

  return questionPool;
};

const getWeightedCorrectAnswer = (questionPool: Currency[], currencyStats: { [id: string]: CurrencyStat }): Currency | null => {
    if (questionPool.length === 0) return null;

    const now = Date.now();
    const weightedPool = questionPool.map(currency => {
      const stats = currencyStats[currency.id];
      let weight = 10; // Base weight

      if (!stats || stats.attempts === 0) {
        // High priority for new, unseen currencies
        weight = 100;
      } else {
        const isDue = now >= stats.nextReview;
        const successRate = stats.attempts > 0 ? stats.correct / stats.attempts : 0.5;
        // High weight if due for review, moderate weight based on poor success rate
        weight = (isDue ? 50 : 5) + ((1 - successRate) * 50);
      }
      // Slightly boost less popular currencies to ensure they appear
      if (currency.popularity === 3) weight *= 1.2;
      if (currency.popularity === 1) weight *= 0.8;
      
      return { currency, weight };
    });

    const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight === 0) {
      return questionPool[Math.floor(Math.random() * questionPool.length)];
    }
    let random = Math.random() * totalWeight;

    for (const item of weightedPool) {
        random -= item.weight;
        if (random <= 0) {
            return item.currency;
        }
    }
    
    // Fallback in case of rounding errors or empty pool
    return questionPool[Math.floor(Math.random() * questionPool.length)];
}


export const generateQuestion = (unlockedCurrencyIds: string[], currencyStats: { [id: string]: CurrencyStat }, options: ClassicGameOptions | TimedGameOptions): Question | null => {
  let questionPool = getFilteredCurrencyPool(unlockedCurrencyIds, options);
  
  if (questionPool.length < 4) {
    return null; 
  }

  const correctAnswer = getWeightedCorrectAnswer(questionPool, currencyStats);
  if (!correctAnswer) return null;
  
  questionPool = questionPool.filter(c => c.id !== correctAnswer.id);
  
  const distractors = shuffleArray(questionPool).slice(0, 3);
  const questionOptions = shuffleArray([correctAnswer, ...distractors]);
  
  return {
    correctAnswer,
    options: questionOptions,
    image: correctAnswer.imageUrl,
  };
};

export const generateMapQuestion = (unlockedCurrencyIds: string[], currencyStats: { [id: string]: CurrencyStat }, mapOptions: ClassicGameOptions): MapQuestion | null => {
    let questionPool = getFilteredCurrencyPool(unlockedCurrencyIds, mapOptions);

    if (questionPool.length === 0) {
        return null;
    }

    const correctAnswer = getWeightedCorrectAnswer(questionPool, currencyStats);
    if (!correctAnswer) return null;

    return {
        correctAnswer
    };
};

export const generateCompareQuestion = (unlockedCurrencyIds: string[], options: CompareGameOptions): CompareQuestion | null => {
  const questionPool = getFilteredCurrencyPool(unlockedCurrencyIds, { difficulty: options.difficulty });
  if (questionPool.length < 2) return null;

  const questionType: CompareQuestionType = Math.random() > 0.5 ? 'COUNTRY_MATCH' : 'REGION_ODD_ONE_OUT';

  if (questionType === 'COUNTRY_MATCH') {
    const [c1, c2] = shuffleArray(questionPool).slice(0, 2);
    if (c1.countryName === c2.countryName) { // Reshuffle if countries are the same (e.g. Euro)
      return generateCompareQuestion(unlockedCurrencyIds, options);
    }
    const subject = Math.random() > 0.5 ? c1 : c2;
    return {
      type: 'COUNTRY_MATCH',
      currencies: [c1, c2],
      questionText: `Which country uses the ${subject.name}?`,
      options: shuffleArray([c1.countryName, c2.countryName]),
      correctAnswer: subject.countryName,
    };
  } else { // REGION_ODD_ONE_OUT
    const regions = Object.keys(REGION_VIEWBOXES).filter(r => r !== 'All Regions') as Region[];
    const randomRegion = regions[Math.floor(Math.random() * regions.length)];
    
    const inRegionPool = questionPool.filter(c => c.region === randomRegion);
    const outOfRegionPool = questionPool.filter(c => c.region !== randomRegion);

    if (inRegionPool.length < 1 || outOfRegionPool.length < 1) {
      // Not enough variety, try again with a different question type
      return generateCompareQuestion(unlockedCurrencyIds, { ...options, difficulty: options.difficulty });
    }

    const inRegionCurrency = inRegionPool[Math.floor(Math.random() * inRegionPool.length)];
    const outOfRegionCurrency = outOfRegionPool[Math.floor(Math.random() * outOfRegionPool.length)];

    const currencies = shuffleArray([inRegionCurrency, outOfRegionCurrency]) as [Currency, Currency];

    return {
      type: 'REGION_ODD_ONE_OUT',
      currencies,
      questionText: `Which of these is NOT from ${randomRegion}?`,
      correctAnswer: outOfRegionCurrency.id,
    };
  }
};