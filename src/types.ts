export type GameMode = 'synonym' | 'antonym' | 'battle';

export type GameLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';

export interface VocabularyWord {
  id: string;
  word: string;
  gujaratiMeaning: string;
  partOfSpeech: string; // e.g., 'Noun', 'Adjective', 'Verb'
  exampleSentence: string;
  synonyms: string[]; // Correct synonyms
  antonyms: string[]; // Correct antonyms
  distractors: string[]; // Other words for options
  level: GameLevel;
}

export interface Question {
  id: string;
  type: 'synonym' | 'antonym';
  targetWord: string;
  gujaratiMeaning: string;
  partOfSpeech: string;
  exampleSentence: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  allSynonyms: string[];
  allAntonyms: string[];
}

export interface StudentProfile {
  name: string;
  avatar: string;
}

export interface RoundResult {
  studentName: string;
  avatar: string;
  level: GameLevel;
  mode: GameMode;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  bestStreak: number;
  timeRemainingBonusTotal: number;
  vocabularyTitle: {
    en: string;
    gu: string;
    badgeColor: string;
    badgeIcon: string;
  };
  completedAt: string;
  certificateId: string;
  questionsAnswered: {
    question: Question;
    userAnswer: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }[];
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  avatar: string;
  level: GameLevel;
  mode: GameMode;
  score: number;
  accuracy: number;
  correctCount: number;
  totalQuestions: number;
  vocabularyTitleEn: string;
  vocabularyTitleGu: string;
  date: string;
}
