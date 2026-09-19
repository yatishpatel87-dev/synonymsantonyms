import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameLevel, GameMode, Question, RoundResult, StudentProfile } from '../types';
import { Heart, Clock, Zap, Volume2, VolumeX, ArrowRight, CheckCircle2, XCircle, BookOpen, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { getVocabularyRank } from '../data/wordBank';

interface BattleArenaProps {
  profile: StudentProfile;
  level: GameLevel;
  mode: GameMode;
  questions: Question[];
  onFinishBattle: (result: RoundResult) => void;
  onQuitToMenu: () => void;
}

const QUESTION_TIMER_SECONDS = 15;

export const BattleArena: React.FC<BattleArenaProps> = ({
  profile,
  level,
  mode,
  questions,
  onFinishBattle,
  onQuitToMenu,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalTimeBonus, setTotalTimeBonus] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.isEnabled());

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMER_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Answering state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [shakeCard, setShakeCard] = useState<boolean>(false);

  // History tracking for certificate & review
  const [answerHistory, setAnswerHistory] = useState<{
    question: Question;
    userAnswer: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }[]>([]);

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;

  // Complete game round
  const completeGame = useCallback((finalLives: number, updatedHistory: typeof answerHistory, finalScore: number, finalBestStreak: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const correctCount = updatedHistory.filter((h) => h.isCorrect).length;
    const totalAnswered = updatedHistory.length || 1;
    const accuracy = Math.round((correctCount / totalAnswered) * 100);
    const vocabRank = getVocabularyRank(accuracy, finalScore);
    const certId = 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    if (finalLives > 0 && correctCount >= 10) {
      sound.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    onFinishBattle({
      studentName: profile.name,
      avatar: profile.avatar,
      level,
      mode,
      score: finalScore,
      totalQuestions: questions.length,
      correctCount,
      wrongCount: totalAnswered - correctCount,
      accuracy,
      bestStreak: finalBestStreak,
      timeRemainingBonusTotal: totalTimeBonus,
      vocabularyTitle: vocabRank,
      completedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      certificateId: certId,
      questionsAnswered: updatedHistory,
    });
  }, [level, mode, onFinishBattle, profile.avatar, profile.name, questions.length, totalTimeBonus]);

  // Handle Timeout (life loss)
  const handleTimeout = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsTimeout(true);
    sound.playHeartLost();

    setShakeCard(true);
    setTimeout(() => setShakeCard(false), 500);

    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);

    const updatedHistory = [
      ...answerHistory,
      {
        question: currentQ,
        userAnswer: 'TIME_EXPIRED',
        isCorrect: false,
        timeSpentSeconds: QUESTION_TIMER_SECONDS,
      },
    ];
    setAnswerHistory(updatedHistory);

    if (newLives <= 0) {
      setTimeout(() => {
        completeGame(newLives, updatedHistory, score, bestStreak);
      }, 1800);
    }
  }, [answerHistory, bestStreak, completeGame, currentQ, isAnswered, lives, score]);

  // Question Timer
  useEffect(() => {
    if (isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(QUESTION_TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 5 && prev > 1) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, handleTimeout]);

  // Handle Option Selection
  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsAnswered(true);
    setSelectedAnswer(option);

    const timeSpent = QUESTION_TIMER_SECONDS - timeLeft;
    const isCorrect = option === currentQ.correctAnswer;

    let newScore = score;
    let newLives = lives;
    let newStreak = streak;
    let currentBest = bestStreak;

    if (isCorrect) {
      sound.playCorrect();
      // Confetti burst for high streaks or correct answer
      confetti({
        particleCount: streak >= 3 ? 40 : 20,
        spread: 50,
        origin: { y: 0.7 },
      });

      // Streak calculation
      newStreak = streak + 1;
      if (newStreak > currentBest) {
        currentBest = newStreak;
        setBestStreak(currentBest);
      }
      setStreak(newStreak);

      // Multiplier: 1.0x -> 1.2x (3+) -> 1.5x (5+) -> 2.0x (8+)
      let multiplier = 1.0;
      if (newStreak >= 8) multiplier = 2.0;
      else if (newStreak >= 5) multiplier = 1.5;
      else if (newStreak >= 3) multiplier = 1.2;

      // Speed bonus
      const speedBonus = timeLeft * 3;
      setTotalTimeBonus((prev) => prev + speedBonus);

      const questionPoints = Math.round((100 + speedBonus) * multiplier);
      newScore = score + questionPoints;
      setScore(newScore);
    } else {
      sound.playWrong();
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);

      newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      if (newLives > 0) {
        sound.playHeartLost();
      }
    }

    const updatedHistory = [
      ...answerHistory,
      {
        question: currentQ,
        userAnswer: option,
        isCorrect,
        timeSpentSeconds: timeSpent,
      },
    ];
    setAnswerHistory(updatedHistory);

    // If out of lives, conclude
    if (newLives <= 0) {
      setTimeout(() => {
        completeGame(newLives, updatedHistory, newScore, currentBest);
      }, 2000);
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    sound.playClick();
    if (isLastQuestion || lives <= 0) {
      completeGame(lives, answerHistory, score, bestStreak);
    } else {
      setIsAnswered(false);
      setSelectedAnswer(null);
      setIsTimeout(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Keyboard shortcut for 1, 2, 3, 4 or Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAnswered) {
        const key = e.key;
        if (['1', '2', '3', '4'].includes(key)) {
          const index = parseInt(key) - 1;
          if (currentQ?.options[index]) {
            handleSelectOption(currentQ.options[index]);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, isAnswered]);

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const isSynonymQuestion = currentQ.type === 'synonym';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Top Navigation & Status Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl mb-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Student & Level Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
              {profile.avatar}
            </div>
            <div>
              <div className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                <span>{profile.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                  {level}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Question <span className="text-amber-400 font-bold">{currentIndex + 1}</span> of {questions.length}
              </div>
            </div>
          </div>

          {/* Lives (❤️❤️❤️) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            {[1, 2, 3].map((heartIndex) => {
              const active = heartIndex <= lives;
              return (
                <span
                  key={heartIndex}
                  className={`text-xl transition-all duration-300 transform ${
                    active ? 'scale-100' : 'scale-90 opacity-25 grayscale'
                  }`}
                  title={active ? 'Active Life' : 'Lost Life'}
                >
                  ❤️
                </span>
              );
            })}
          </div>

          {/* Score & Streak */}
          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-bounce">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{streak} Streak!</span>
              </div>
            )}
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Score</div>
              <div className="text-xl font-extrabold text-amber-400 tracking-tight font-mono">{score}</div>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                const newState = sound.toggleSound();
                setSoundEnabled(newState);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
              title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Animated Progress Bar across 20 questions */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5 px-0.5">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Battle Progress</span>
            </span>
            <span className="text-amber-400 font-mono font-bold">
              {currentIndex + 1} / {questions.length} ({Math.round(progressPercent)}%)
            </span>
          </div>

          <div className="relative w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            {/* Animated Fill Bar */}
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 ease-out relative shadow-[0_0_12px_rgba(251,191,36,0.5)]"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Shimmer / light-sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>

            {/* Step division markers for 20 questions */}
            <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
              {Array.from({ length: 19 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-px h-full ${
                    i + 1 <= currentIndex ? 'bg-slate-900/40' : 'bg-slate-800/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div
        className={`relative bg-slate-900 border transition-all duration-300 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden ${
          shakeCard
            ? 'animate-shake border-rose-500/80 shadow-rose-950/40'
            : timeLeft <= 5 && !isAnswered
            ? 'border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/30'
            : 'border-slate-800'
        }`}
      >
        {/* Question Type Banner (Synonym or Antonym) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
              isSynonymQuestion
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            <span className="text-base">{isSynonymQuestion ? '✨' : '⚡'}</span>
            <span>
              {isSynonymQuestion ? 'SYNONYM (સમાનાર્થી શબ્દ શોધો)' : 'ANTONYM (વિરોધી શબ્દ શોધો)'}
            </span>
          </div>

          {/* Countdown Timer Badge with Subtle Pulse under 5s */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-bold font-mono transition-all duration-300 ${
              timeLeft <= 5 && !isAnswered
                ? 'bg-rose-950 border-rose-500 text-rose-200 animate-subtle-pulse'
                : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}
          >
            <Clock
              className={`w-4 h-4 transition-colors ${
                timeLeft <= 5 && !isAnswered ? 'text-rose-400' : 'text-amber-400'
              }`}
            />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Target Word Section */}
        <div className="text-center my-6 py-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 px-4">
          <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-center gap-2">
            <span>Target Word</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {currentQ.partOfSpeech}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-wide mb-2 uppercase">
            {currentQ.targetWord}
          </h2>

          <div className="text-amber-300 font-medium text-base sm:text-lg mb-2">
            અર્થ: <span className="font-semibold text-amber-200">{currentQ.gujaratiMeaning}</span>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm italic max-w-xl mx-auto">
            &ldquo;{currentQ.exampleSentence}&rdquo;
          </p>
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTrueCorrect = isAnswered && option === currentQ.correctAnswer;
            const isWrongChoice = isAnswered && isSelected && !isTrueCorrect;

            let btnStyle =
              'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800/40 hover:text-white';

            if (isAnswered) {
              if (isTrueCorrect) {
                btnStyle =
                  'bg-emerald-950/90 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-900/30';
              } else if (isWrongChoice) {
                btnStyle =
                  'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500/40 shadow-lg shadow-rose-900/30';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-800/50 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={option}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`group relative text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 text-base sm:text-lg font-semibold cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    {idx + 1}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isTrueCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-scale" />
                )}
                {isAnswered && isWrongChoice && (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 animate-scale" />
                )}
              </button>
            );
          })}
        </div>

        {/* Timeout / Life Loss Warning */}
        {isTimeout && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-sm flex items-center gap-3 my-4 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold">સમય સમાપ્ત! (Time Out!)</p>
              <p className="text-xs text-rose-300">
                તમે 1 Life ગુમાવી દીધી. સાચો ઉત્તર: <strong>{currentQ.correctAnswer}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Explanation & Advance Footer */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="text-xs sm:text-sm text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                <BookOpen className="w-4 h-4" />
                <span>Explanation (સમજૂતી):</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                <span>
                  <strong>Synonyms:</strong> {currentQ.allSynonyms.join(', ')}
                </span>
                <span>
                  <strong>Antonyms:</strong> {currentQ.allAntonyms.join(', ')}
                </span>
              </div>
            </div>

            <button
              type="button"
              id="next-question-btn"
              onClick={handleNextQuestion}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
            >
              <span>{isLastQuestion ? 'Complete Battle (પરિણામ જુઓ)' : 'Next Question (આગળ વધો)'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>

      {/* Arena Footer: Quit & Helper Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-4 px-2">
        <span>Keyboard shortcut: Press 1, 2, 3, 4 to select • Enter for Next</span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('શું તમે યુદ્ધ છોડીને મુખ્ય મેનુ પર પાછા જવા માંગો છો? (Quit to menu?)')) {
              onQuitToMenu();
            }
          }}
          className="hover:text-rose-400 transition underline cursor-pointer"
        >
          Quit Game (છોડો)
        </button>
      </div>
    </div>
  );
};
