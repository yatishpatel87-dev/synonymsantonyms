import React, { useState } from 'react';
import { GameLevel, GameMode, LeaderboardEntry } from '../types';
import { Trophy, Medal, X, Trash2, Filter } from 'lucide-react';
import { sound } from '../utils/sound';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  onClearLeaderboard: () => void;
  highlightId?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  onClearLeaderboard,
  highlightId,
}) => {
  const [levelFilter, setLevelFilter] = useState<GameLevel | 'all'>('all');
  const [modeFilter, setModeFilter] = useState<GameMode | 'all'>('all');

  if (!isOpen) return null;

  // Filter entries
  const filtered = entries
    .filter((e) => (levelFilter === 'all' ? true : e.level === levelFilter))
    .filter((e) => (modeFilter === 'all' ? true : e.mode === modeFilter))
    .sort((a, b) => b.score - a.score);

  const top3 = filtered.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Hall of Fame • લીડરબોર્ડ</span>
              </h2>
              <p className="text-xs text-slate-400">Top vocabulary champions and battle scores</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Level:</span>
            {(['all', 'beginner', 'intermediate', 'advanced', 'master'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setLevelFilter(lvl);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Mode:</span>
            {(['all', 'synonym', 'antonym', 'battle'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setModeFilter(m);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition cursor-pointer ${
                  modeFilter === m
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Podium Top 3 View */}
        {top3.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-950/40 border-b border-slate-800/60 flex items-end justify-center gap-3 sm:gap-6 pt-6">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl mb-1">{top3[1].avatar}</div>
                <div className="text-xs font-bold text-white max-w-[90px] truncate">{top3[1].studentName}</div>
                <div className="text-xs text-amber-400 font-mono font-extrabold">{top3[1].score} pts</div>
                <div className="w-20 sm:w-24 h-16 rounded-t-xl bg-slate-800 border-t-2 border-slate-400 flex flex-col items-center justify-center mt-2 shadow-inner">
                  <Medal className="w-5 h-5 text-slate-300" />
                  <span className="text-xs font-bold text-slate-300">2nd</span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-1 animate-bounce">{top3[0].avatar}</div>
                <div className="text-sm font-extrabold text-white max-w-[110px] truncate">{top3[0].studentName}</div>
                <div className="text-sm text-amber-300 font-mono font-extrabold">{top3[0].score} pts</div>
                <div className="w-24 sm:w-28 h-24 rounded-t-xl bg-gradient-to-b from-amber-500 to-amber-600 border-t-2 border-amber-300 flex flex-col items-center justify-center mt-2 shadow-lg text-slate-950">
                  <Trophy className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-xs font-black uppercase">Champion 1st</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl mb-1">{top3[2].avatar}</div>
                <div className="text-xs font-bold text-white max-w-[90px] truncate">{top3[2].studentName}</div>
                <div className="text-xs text-amber-400 font-mono font-extrabold">{top3[2].score} pts</div>
                <div className="w-20 sm:w-24 h-12 rounded-t-xl bg-slate-800 border-t-2 border-amber-700 flex flex-col items-center justify-center mt-2 shadow-inner">
                  <Medal className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-600">3rd</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Leaderboard Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No battles recorded for this filter yet.</p>
              <p className="text-xs text-slate-600 mt-1">Play a 20-question match to claim the crown!</p>
            </div>
          ) : (
            filtered.map((entry, index) => {
              const isHighlight = highlightId && entry.id === highlightId;
              const rank = index + 1;

              return (
                <div
                  key={entry.id}
                  className={`p-3 sm:p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isHighlight
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono">
                      #{rank}
                    </span>
                    <span className="text-2xl">{entry.avatar}</span>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{entry.studentName}</span>
                        {isHighlight && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black uppercase">
                            Your Run
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span className="capitalize text-slate-300 font-medium">{entry.level}</span>
                        <span>•</span>
                        <span className="capitalize text-slate-300">{entry.mode}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-medium">{entry.vocabularyTitleEn}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-extrabold text-amber-400 font-mono">
                      {entry.score}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {entry.accuracy}% acc ({entry.correctCount}/{entry.totalQuestions})
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Clear option */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Persisted locally in your browser storage</span>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset leaderboard scores?')) {
                  onClearLeaderboard();
                }
              }}
              className="flex items-center gap-1 hover:text-rose-400 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Leaderboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
