import { useState, useEffect, useCallback, useContext } from 'react';
import { GameMode, GameResult, AnswerState, CompareGameOptions, CompareQuestion } from '../types';
import { generateCompareQuestion } from '../services/gameService';
import { PlayerDataContext } from '../context/PlayerDataContext';
import { SoundContext } from '../context/SoundContext';

export const useCompareGameLogic = (mode: GameMode, onGameEnd: (result: GameResult) => void, options: CompareGameOptions | null) => {
  const [questions, setQuestions] = useState<(CompareQuestion | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreakInGame, setBestStreakInGame] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('UNANSWERED');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [activeBonus, setActiveBonus] = useState<'2x' | '3x' | null>(null);
  const [bonusRoundsLeft, setBonusRoundsLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const { playerData, addCoins } = useContext(PlayerDataContext);
  const { playCorrect, playIncorrect } = useContext(SoundContext);

  const totalQuestions = options ? options.numQuestions : 10;

  const getNewQuestion = useCallback(() => {
    if (!options) return null;
    return generateCompareQuestion(playerData.unlockedCurrencyIds, options);
  }, [playerData.unlockedCurrencyIds, options]);

  useEffect(() => {
    if (questions.length === 0) {
      setQuestions([getNewQuestion()]);
    }
  }, [getNewQuestion, questions.length]);

  const handleEndGame = useCallback(() => {
    const isPerfect = correctAnswersCount === totalQuestions && totalQuestions >= 10;
    onGameEnd({ score, correctAnswers: correctAnswersCount, totalQuestions, mode, bestStreakInGame, isPerfect });
  }, [score, correctAnswersCount, totalQuestions, mode, bestStreakInGame, onGameEnd]);
  
  const handleAnswer = (answer: string) => {
    if (isAnswering || isPaused || !questions[currentQuestionIndex]) return;
    setIsAnswering(true);
    setSelectedAnswer(answer);

    const currentQuestion = questions[currentQuestionIndex]!;
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      playCorrect();
      setAnswerState('CORRECT');
      
      const baseCoins = 12; // Slightly more coins for a harder mode
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
      setScore(prev => prev + 10 * (activeBonus === '2x' ? 2 : (activeBonus === '3x' ? 3 : 1)));

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
      setSelectedAnswer(null);
      setIsAnswering(false);
    }, 1500);

  };

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    currentQuestion: questions[currentQuestionIndex],
    currentQuestionIndex,
    score,
    streak,
    answerState,
    selectedAnswer,
    handleAnswer,
    totalQuestions,
    isAnswering,
    activeBonus,
    isPaused,
    togglePause,
    correctAnswersCount,
    bestStreakInGame,
  };
};