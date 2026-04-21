export type Difficulty = 'none' | 'easy' | 'medium' | 'hard';

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  isPredefined?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface TimerConfig {
  categoryId: string;
  subcategoryId?: string;
  durationSeconds: number;
  alertEnabled: boolean;
  notificationEnabled: boolean;
  unlockDifficulty: Difficulty;
}

export interface FocusSession {
  id: string;
  startedAt: number;
  endedAt?: number;
  durationSeconds: number;
  completed: boolean;
  categoryId: string;
  subcategoryId?: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  categoryId?: string;
  sessionId?: string;
}

export interface DailyReport {
  dateKey: string;
  totalSeconds: number;
  byCategory: Record<string, number>;
}

export interface UserSettings {
  backgroundColor: string;
  timerTextColor: string;
  isMuted: boolean;
  torchEnabled: boolean;
  dndEnabled: boolean;
  animationEnabled: boolean;
}
