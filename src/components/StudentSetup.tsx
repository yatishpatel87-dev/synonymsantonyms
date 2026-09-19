import React, { useState, useEffect } from 'react';
import { GameLevel, GameMode, StudentProfile } from '../types';
import { Trophy, Swords, Zap, BookOpen, Clock, Heart, Sparkles, ChevronRight, Award } from 'lucide-react';
import { sound } from '../utils/sound';

interface StudentSetupProps {
  onStartBattle: (profile: StudentProfile, level: GameLevel, mode: GameMode) => void;
  onOpenLeaderboard: () => void;
}

const AVATARS = ['🎓', '🦁', '🦉', '⚡', '🚀', '🌟', '🦅', '🐯'];

const LEVELS: { id: GameLevel; labelEn: string; labelGu: string; desc: string; icon: string; difficultyColor: string }[] = [
  {
    id: 'beginner',
    labelEn: 'Beginner',
    labelGu: 'પ્રાથમિક સ્તર',
    desc: 'Foundational daily vocabulary & clear meanings',
    icon: '🌱',
    difficultyColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-400',
  },
  {
    id: 'intermediate',
    labelEn: 'Intermediate',
    labelGu: 'મધ્યમ સ્તર',
    desc: 'Standard school, college & competitive exams',
    icon: '⚔️',
    difficultyColor: 'border-sky-500/40 bg-sky-500/10 text-sky-400 hover:border-sky-400',
  },
  {
    id: 'advanced',
    labelEn: 'Advanced',
    labelGu: 'ઉચ્ચ સ્તર',
    desc: 'Nuanced scholastic & contextual vocabulary',
    icon: '🔥',
    difficultyColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:border-amber-400',
  },
  {
    id: 'master',
    labelEn: 'Master',
    labelGu: 'પ્રવીણ સ્તર',
    desc: 'High-level literary, GRE & IELTS vocabulary',
    icon: '👑',
    difficultyColor: 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:border-rose-400',
  },
];

const MODES: { id: GameMode; labelEn: string; labelGu: string; desc: string; icon: React.ReactNode; badgeColor: string }[] = [
  {
    id: 'synonym',
    labelEn: 'Synonym Battle',
    labelGu: 'સમાનાર્થી યુદ્ધ',
    desc: 'Find words with identical or similar meanings',
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    badgeColor: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300',
  },
  {
    id: 'antonym',
    labelEn: 'Antonym Battle',
    labelGu: 'વિરોધી યુદ્ધ',
    desc: 'Find words with exactly opposite meanings',
    icon: <Zap className="w-5 h-5 text-rose-400" />,
    badgeColor: 'border-rose-500/50 bg-rose-950/40 text-rose-300',
  },
  {
    id: 'battle',
    labelEn: 'Mixed Battle (સમાનાર્થી/વિરોધી)',
    labelGu: 'મિશ્ર યુદ્ધ (Mixed Mode)',
    desc: 'Dynamic random shift between Synonym & Antonym!',
    icon: <Swords className="w-5 h-5 text-amber-400" />,
    badgeColor: 'border-amber-500/50 bg-amber-950/40 text-amber-300',
  },
];

export const StudentSetup: React.FC<StudentSetupProps> = ({ onStartBattle, onOpenLeaderboard }) => {
  const [name, setName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🎓');
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>('beginner');
  const [selectedMode, setSelectedMode] = useState<GameMode>('battle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Load previous student name if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vocab_last_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.avatar) setSelectedAvatar(parsed.avatar);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg('કૃપા કરીને વિદ્યાર્થીનું નામ દાખલ કરો (Please enter student name)');
      sound.playWrong();
      return;
    }

    try {
      localStorage.setItem('vocab_last_student', JSON.stringify({ name: cleanName, avatar: selectedAvatar }));
    } catch {
      // Ignore
    }

    sound.playClick();
    onStartBattle(
      {
        name: cleanName,
        avatar: selectedAvatar,
      },
      selectedLevel,
      selectedMode
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <Swords className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>English & Gujarati Vocabulary Arena</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          ↔️ Synonym–Antonym Battle
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          સમાનાર્થી અને વિરોધી શબ્દોનું જ્ઞાન યુદ્ધ • 20 Questions • Timer • 3 Lives • Instant Certificate & Leaderboard
        </p>
      </div>

      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleStart} className="space-y-8">
          {/* Section 1: Student Profile */}
          <div>
            <label htmlFor="student-name-input" className="block text-sm font-semibold text-slate-200 mb-2">
              1. Student Name (વિદ્યાર્થીનું નામ) <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <input
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. Aarav Patel / પ્રિયા શર્મા"
                  maxLength={35}
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-500 px-4 py-3 rounded-xl outline-none transition text-base"
                />
              </div>

              {/* Avatar Selector */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av);
                      sound.playClick();
                    }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition ${
                      selectedAvatar === av
                        ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={`Avatar ${av}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
            {errorMsg && <p className="text-rose-400 text-xs mt-2 font-medium">{errorMsg}</p>}
          </div>

          {/* Section 2: Mode Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-200">
                2. Select Game Mode (મોડ પસંદ કરો)
              </label>
              <span className="text-xs text-slate-400">Synonym અથવા Antonym પસંદ કરો</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setSelectedMode(mode.id);
                      sound.playClick();
                    }}
                    className={`relative text-left p-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? `${mode.badgeColor} ring-2 ring-offset-2 ring-offset-slate-900 ring-current shadow-lg`
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {mode.icon}
                      <span className="font-bold text-sm text-white">{mode.labelEn}</span>
                    </div>
                    <div className="text-xs font-medium opacity-90 text-amber-300/90 mb-1">
                      {mode.labelGu}
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">{mode.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Level Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              3. Select Level (સ્તર પસંદ કરો)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl.id);
                      sound.playClick();
                    }}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? `${lvl.difficultyColor} ring-2 ring-offset-2 ring-offset-slate-900 ring-current shadow-lg`
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{lvl.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 uppercase">
                        {lvl.labelEn}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white">{lvl.labelGu}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rules / Game Specifications Badge Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>20</strong> Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span><strong>15s</strong> Timer / Q</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 shrink-0 fill-rose-500/20" />
              <span><strong>3</strong> Lives (❤️❤️❤️)</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official Certificate</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              id="start-battle-btn"
              className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Start Vocabulary Battle (યુદ્ધ શરૂ કરો)</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              id="view-leaderboard-btn"
              onClick={() => {
                sound.playClick();
                onOpenLeaderboard();
              }}
              className="w-full sm:w-auto py-4 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard (વિજેતાઓ)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
