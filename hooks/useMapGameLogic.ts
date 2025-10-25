import { useState, useEffect, useCallback, useContext } from 'react';
import { GameMode, MapQuestion, GameResult, AnswerState, ClassicGameOptions } from '../types';
import { generateMapQuestion } from '../services/gameService';
import { PlayerDataContext } from '../context/PlayerDataContext';
import { SoundContext } from '../context/SoundContext';

export const useMapGameLogic = (onGameEnd: (result: GameResult) => void, options: ClassicGameOptions) => {
  const [questions, setQuestions] = useState<(MapQuestion | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreakInGame, setBestStreakInGame] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('UNANSWERED');
  const [isAnswering, setIsAnswering] = useState(false);
  const [activeBonus, setActiveBonus] = useState<'2x' | '3x' | null>(null);
  const [bonusRoundsLeft, setBonusRoundsLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [correctCountry, setCorrectCountry] = useState<string | null>(null);
  const [incorrectCountry, setIncorrectCountry] = useState<string | null>(null);
  
  const { playerData, addCoins, updateCurrencyStats } = useContext(PlayerDataContext);
  const { playCorrect, playIncorrect } = useContext(SoundContext);

  const totalQuestions = options.numQuestions;

  const getNewQuestion = useCallback(() => {
    return generateMapQuestion(playerData.unlockedCurrencyIds, playerData.currencyStats, options);
  }, [playerData.unlockedCurrencyIds, playerData.currencyStats, options]);

  const handleEndGame = useCallback(() => {
    const isPerfect = correctAnswersCount === totalQuestions && totalQuestions >= 10;
    onGameEnd({ score, correctAnswers: correctAnswersCount, totalQuestions, mode: 'MAP', bestStreakInGame, isPerfect });
  }, [score, correctAnswersCount, totalQuestions, bestStreakInGame, onGameEnd]);
  
  useEffect(() => {
    if (questions.length === 0) {
      setQuestions([getNewQuestion()]);
    }
  }, [getNewQuestion, questions.length]);

  const handleDropOnCountry = (countryCode: string) => {
    if (isAnswering || isPaused || !questions[currentQuestionIndex]) return;
    setIsAnswering(true);
    
    const currentQuestion = questions[currentQuestionIndex]!;
    const isCorrect = countryCode === currentQuestion.correctAnswer.countryCode;
    
    updateCurrencyStats(currentQuestion.correctAnswer.id, isCorrect);

    if (isCorrect) {
      playCorrect();
      setAnswerState('CORRECT');
      setCorrectCountry(countryCode);
      
      const baseCoins = 15;
      let multiplier = 1;
      if (bonusRoundsLeft > 0 && activeBonus) {
        multiplier = activeBonus === '2x' ? 2 : 3;
      }
      const coinsEarned = baseCoins * multiplier;
      addCoins(coinsEarned);

      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreakInGame(prev => Math.max(prev, newStreak));
      setCorrectAnswersCount(prev => prev + 1);
      setScore(prev => prev + 15 * (activeBonus === '2x' ? 2 : (activeBonus === '3x' ? 3 : 1)));

      let nextBonus = activeBonus;
      let nextRoundsLeft = bonusRoundsLeft > 0 ? bonusRoundsLeft - 1 : 0;
      
      if (newStreak >= 10) {
        nextBonus = '3x';
        nextRoundsLeft = 10;
      } else if (newStreak >= 5) {
        nextBonus = '2x';
        nextRoundsLeft = 5;
      }
      
      if (nextRoundsLeft === 0) {
        nextBonus = null;
      }

      setActiveBonus(nextBonus);
      setBonusRoundsLeft(nextRoundsLeft);

    } else {
      playIncorrect();
      setAnswerState('INCORRECT');
      setCorrectCountry(currentQuestion.correctAnswer.countryCode);
      setIncorrectCountry(countryCode);
      setStreak(0);
      setActiveBonus(null);
      setBonusRoundsLeft(0);
    }

    setTimeout(() => {
      if (currentQuestionIndex >= totalQuestions - 1) {
        handleEndGame();
        return;
      }
      setQuestions(prev => [...prev, getNewQuestion()]);
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerState('UNANSWERED');
      setIsAnswering(false);
      setCorrectCountry(null);
      setIncorrectCountry(null);
    }, 2500);
  };
  
  const currentQuestion = questions[currentQuestionIndex];

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    currentQuestion,
    currentQuestionIndex,
    score,
    streak,
    answerState,
    handleDropOnCountry,
    totalQuestions,
    isAnswering,
    activeBonus,
    isPaused,
    togglePause,
    correctCountry,
    incorrectCountry,
    correctAnswersCount,
    bestStreakInGame,
  };
};