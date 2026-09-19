/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameLevel, GameMode, LeaderboardEntry, Question, RoundResult, StudentProfile } from './types';
import { generateQuestionSet } from './data/wordBank';
import { StudentSetup } from './components/StudentSetup';
import { BattleArena } from './components/BattleArena';
import { GameOverOrVictory } from './components/GameOverOrVictory';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Swords, Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from './utils/sound';

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    studentName: 'Aarav Patel',
    avatar: '🦁',
    level: 'master',
    mode: 'battle',
    score: 3450,
    accuracy: 95,
    correctCount: 19,
    totalQuestions: 20,
    vocabularyTitleEn: 'Grand Vocabulary Master',
    vocabularyTitleGu: 'શબ્દ સમ્રાટ (Grand Master)',
    date: 'Sep 18, 2026',
  },
  {
    id: 'seed-2',
    studentName: 'Priya Sharma',
    avatar: '🎓',
    level: 'advanced',
    mode: 'synonym',
    score: 2980,
    accuracy: 90,
    correctCount: 18,
    totalQuestions: 20,
    vocabularyTitleEn: 'Grand Vocabulary Master',
    vocabularyTitleGu: 'શબ્દ સમ્રાટ (Grand Master)',
    date: 'Sep 17, 2026',
  },
  {
    id: 'seed-3',
    studentName: 'Devansh Joshi',
    avatar: '⚡',
    level: 'intermediate',
    mode: 'antonym',
    score: 2620,
    accuracy: 85,
    correctCount: 17,
    totalQuestions: 20,
    vocabularyTitleEn: 'Vocabulary Champion',
    vocabularyTitleGu: 'શબ્દવીર (Champion)',
    date: 'Sep 16, 2026',
  },
  {
    id: 'seed-4',
    studentName: 'Ananya Desai',
    avatar: '🦉',
    level: 'beginner',
    mode: 'battle',
    score: 2410,
    accuracy: 80,
    correctCount: 16,
    totalQuestions: 20,
    vocabularyTitleEn: 'Vocabulary Champion',
    vocabularyTitleGu: 'શબ્દવીર (Champion)',
    date: 'Sep 15, 2026',
  },
];

export default function App() {
  const [screen, setScreen] = useState<'setup' | 'battle' | 'result'>('setup');
  const [profile, setProfile] = useState<StudentProfile>({ name: '', avatar: '🎓' });
  const [level, setLevel] = useState<GameLevel>('beginner');
  const [mode, setMode] = useState<GameMode>('battle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [recentHighlightId, setRecentHighlightId] = useState<string | undefined>(undefined);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vocab_battle_leaderboard');
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      } else {
        setLeaderboard(INITIAL_LEADERBOARD);
        localStorage.setItem('vocab_battle_leaderboard', JSON.stringify(INITIAL_LEADERBOARD));
      }
    } catch {
      setLeaderboard(INITIAL_LEADERBOARD);
    }
  }, []);

  const handleStartBattle = (studentProfile: StudentProfile, chosenLevel: GameLevel, chosenMode: GameMode) => {
    setProfile(studentProfile);
    setLevel(chosenLevel);
    setMode(chosenMode);

    // Generate exactly 20 randomized questions
    const qSet = generateQuestionSet(chosenLevel, chosenMode);
    setQuestions(qSet);
    setScreen('battle');
  };

  const handleFinishBattle = (result: RoundResult) => {
    setRoundResult(result);
    setScreen('result');

    // Save entry into Leaderboard
    const newEntry: LeaderboardEntry = {
      id: result.certificateId,
      studentName: result.studentName,
      avatar: result.avatar,
      level: result.level,
      mode: result.mode,
      score: result.score,
      accuracy: result.accuracy,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      vocabularyTitleEn: result.vocabularyTitle.en,
      vocabularyTitleGu: result.vocabularyTitle.gu,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setRecentHighlightId(newEntry.id);
    setLeaderboard((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('vocab_battle_leaderboard', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleClearLeaderboard = () => {
    setLeaderboard([]);
    try {
      localStorage.removeItem('vocab_battle_leaderboard');
    } catch {
      // Ignore
    }
  };

  const handlePlayAgain = () => {
    if (profile.name) {
      // Regenerate 20 questions and re-enter battle
      const qSet = generateQuestionSet(level, mode);
      setQuestions(qSet);
      setScreen('battle');
    } else {
      setScreen('setup');
    }
  };

  const handleToggleSound = () => {
    const active = sound.toggleSound();
    setSoundActive(active);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Universal Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            onClick={() => {
              if (screen !== 'battle' || window.confirm('Return to home menu?')) {
                sound.playClick();
                setScreen('setup');
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition">
              <Swords className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-400 transition">
                ↔️ Synonym–Antonym Battle
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 font-medium">
                (સમાનાર્થી–વિરોધી યુદ્ધ)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsLeaderboardOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Leaderboard</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title={soundActive ? 'Sound On' : 'Sound Muted'}
            >
              {soundActive ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col justify-center">
        {screen === 'setup' && (
          <StudentSetup
            onStartBattle={handleStartBattle}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}

        {screen === 'battle' && (
          <BattleArena
            profile={profile}
            level={level}
            mode={mode}
            questions={questions}
            onFinishBattle={handleFinishBattle}
            onQuitToMenu={() => setScreen('setup')}
          />
        )}

        {screen === 'result' && roundResult && (
          <GameOverOrVictory
            result={roundResult}
            onPlayAgain={handlePlayAgain}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}
      </main>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        onClearLeaderboard={handleClearLeaderboard}
        highlightId={recentHighlightId}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Synonym–Antonym Battle • English & Gujarati Vocabulary Master</p>
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>20 Questions • 3 Lives • Speed Multipliers • Verified Certificates</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
