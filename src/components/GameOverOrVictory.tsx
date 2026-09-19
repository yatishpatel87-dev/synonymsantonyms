import React, { useState } from 'react';
import { RoundResult } from '../types';
import { Certificate } from './Certificate';
import { Trophy, RotateCcw, Award, CheckCircle2, XCircle, Clock, Zap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../utils/sound';

interface GameOverOrVictoryProps {
  result: RoundResult;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverOrVictory: React.FC<GameOverOrVictoryProps> = ({
  result,
  onPlayAgain,
  onOpenLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'review'>('certificate');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const isCompletedAll = result.questionsAnswered.length >= result.totalQuestions;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          <span>{result.avatar}</span>
          <span>Battle Concluded • પરિણામ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          {isCompletedAll ? 'Battle Completed! (યુદ્ધ વિજય)' : 'Game Over (પ્રયાસ પૂર્ણ)'}
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
          {result.studentName}, your vocabulary prowess has been evaluated across 20 tactical trials!
        </p>
      </div>

      {/* Primary Score & Vocabulary Rating Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-lg">
              {result.avatar}
            </div>
            <div>
              <div className="text-xl font-bold text-white">{result.studentName}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Level: <span className="text-amber-400 font-semibold uppercase">{result.level}</span> • Mode:{' '}
                <span className="text-sky-400 font-semibold uppercase">{result.mode}</span>
              </div>
            </div>
          </div>

          {/* Vocabulary Level Badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950/80 border border-amber-500/30">
            <span className="text-3xl">{result.vocabularyTitle.badgeIcon}</span>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Assessed Vocabulary Rank</div>
              <div className="text-base sm:text-lg font-bold text-amber-300">
                {result.vocabularyTitle.en}
              </div>
              <div className="text-xs text-amber-400/80 font-medium">{result.vocabularyTitle.gu}</div>
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Final Score</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{result.score}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Accuracy</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{result.accuracy}%</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Cleared</div>
            <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
              {result.correctCount}/{result.totalQuestions}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Best Streak</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>{result.bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation: Certificate vs Review */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('certificate');
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'certificate'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificate of Achievement (પ્રમાણપત્ર)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('review');
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'review'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Review 20 Questions (અભ્યાસ વિશ્લેષણ)</span>
        </button>
      </div>

      {/* Tab 1: Certificate Display */}
      {activeTab === 'certificate' && (
        <div className="animate-fade-in mb-8">
          <Certificate result={result} />
        </div>
      )}

      {/* Tab 2: Question Review List */}
      {activeTab === 'review' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Questions Review (પ્રશ્નોત્તરી વિશ્લેષણ)</h3>
            <span className="text-xs text-slate-400">
              {result.correctCount} Correct • {result.wrongCount} Incorrect
            </span>
          </div>

          {result.questionsAnswered.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            const isCorrect = item.isCorrect;

            return (
              <div
                key={item.question.id}
                className={`border rounded-xl p-4 transition ${
                  isCorrect
                    ? 'border-emerald-500/30 bg-emerald-950/20'
                    : 'border-rose-500/30 bg-rose-950/20'
                }`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    sound.playClick();
                    setExpandedIndex(isExpanded ? null : idx);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="text-white font-bold">{item.question.targetWord}</span>
                      <span className="text-xs text-slate-400 ml-2 font-medium">
                        ({item.question.type.toUpperCase()})
                      </span>
                      <span className="text-xs text-amber-300 ml-2">
                        - {item.question.gujaratiMeaning}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {item.timeSpentSeconds}s
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fade-in">
                    <div>
                      <strong>Your Answer:</strong>{' '}
                      <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {item.userAnswer === 'TIME_EXPIRED' ? 'Time Expired (સમય પૂરો)' : item.userAnswer}
                      </span>
                    </div>
                    <div>
                      <strong>Correct Answer:</strong>{' '}
                      <span className="text-emerald-300 font-bold">{item.question.correctAnswer}</span>
                    </div>
                    <div>
                      <strong>Example Sentence:</strong>{' '}
                      <span className="italic text-slate-400">&ldquo;{item.question.exampleSentence}&rdquo;</span>
                    </div>
                    <div className="pt-1 flex flex-wrap gap-x-4 text-slate-400">
                      <span>Synonyms: {item.question.allSynonyms.join(', ')}</span>
                      <span>Antonyms: {item.question.allAntonyms.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Global Actions Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          id="play-again-btn"
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Play Another Battle (નવું યુદ્ધ રમો)</span>
        </button>

        <button
          type="button"
          id="show-leaderboard-btn"
          onClick={() => {
            sound.playClick();
            onOpenLeaderboard();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>View Leaderboard (લીડરબોર્ડ)</span>
        </button>
      </div>
    </div>
  );
};
