
import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { GameMode, Question, GameResult, AnswerState, Currency, TimeAttackGameOptions, TimedGameOptions } from '../types';
import { generateQuestion } from '../services/gameService';
import { PlayerDataContext } from '../context/PlayerDataContext';
import { SoundContext } from '../context/SoundContext';

export const useTimeAttackLogic = (mode: GameMode, onGameEnd: (result: GameResult) => void, options: TimeAttackGameOptions | null) => {
  const [questions, setQuestions] = useState<(Question | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreakInGame, setBestStreakInGame] = useState(0);
  const [timer, setTimer] = useState(options ? options.duration : 0);
  const [answerState, setAnswerState] = useState<AnswerState>('UNANSWERED');
  const [selectedAnswer, setSelectedAnswer] = useState<Currency | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [activeBonus, setActiveBonus] = useState<'2x' | '3x' | null>(null);
  const [bonusRoundsLeft, setBonusRoundsLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerIntervalRef = useRef<number | null>(null);
  const { playerData, addCoins, updateCurrencyStats } = useContext(PlayerDataContext);
  const { playCorrect, playIncorrect } = useContext(SoundContext);

  const getNewQuestion = useCallback(() => {
    if (!options) return null;
    // We can reuse the TimedGameOptions type for filtering, as it has the same properties needed.
    return generateQuestion(playerData.unlockedCurrencyIds, playerData.currencyStats, { ...options, currencyType: 'coin', region: 'All Regions' });
  }, [playerData.unlockedCurrencyIds, playerData.currencyStats, options]);
  
  useEffect(() => {
    if (questions.length === 0) {
      setQuestions([getNewQuestion()]);
    }
  }, [getNewQuestion, questions.length]);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerIntervalRef.current = window.setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          stopTimer();
          const finalQuestionCount = currentQuestionIndex + (answerState === 'UNANSWERED' ? 0 : 1);
          onGameEnd({
            score,
            correctAnswers: correctAnswersCount,
            totalQuestions: finalQuestionCount,
            mode,
            duration: options ? options.duration : 0,
            bestStreakInGame,
            isPerfect: false,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onGameEnd, score, correctAnswersCount, currentQuestionIndex, stopTimer, options, bestStreakInGame, answerState, mode]);

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [isPaused, startTimer, stopTimer]);

  const handleAnswer = (answer: Currency) => {
    if (isAnswering || isPaused || !questions[currentQuestionIndex]) return;
    setIsAnswering(true);
    setSelectedAnswer(answer);

    const currentQuestion = questions[currentQuestionIndex]!;
    const isCorrect = answer.id === currentQuestion.correctAnswer.id;
    
    updateCurrencyStats(currentQuestion.correctAnswer.id, isCorrect);

    if (isCorrect) {
      playCorrect();
      setAnswerState('CORRECT');
      setTimer(prev => prev + 2); // Add time for correct answer
      
      const baseCoins = 10;
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
      setTimer(prev => Math.max(0, prev - 10)); // Penalty for wrong answer
      setAnswerState('INCORRECT');
      setStreak(0);
      setActiveBonus(null);
      setBonusRoundsLeft(0);
    }

    setTimeout(() => {
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
    timer,
    answerState,
    selectedAnswer,
    handleAnswer,
    isAnswering,
    activeBonus,
    isPaused,
    togglePause,
    correctAnswersCount,
    bestStreakInGame,
  };
};
