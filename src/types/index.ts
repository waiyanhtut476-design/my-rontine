export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface RoutineItem {
  id: string;
  timeOfDay: TimeOfDay;
  title: string;
  time: string; // e.g., '07:00'
  icon?: string;
  completed: boolean;
}

export type TaskPriority = 'high' | 'normal' | 'low';
export type TaskCategory = 'work' | 'personal' | 'health' | 'shopping' | 'home';

export interface TaskItem {
  id: string;
  title: string;
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  dueTime?: string;
  note?: string;
  pomodorosCompleted?: number;
}

export interface HabitItem {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: string;
  color: string;
}

export type MoodType = 'happy' | 'peaceful' | 'neutral' | 'tired' | 'stressed';

export interface MoodData {
  type: MoodType;
  label: string;
  emoji: string;
  description?: string;
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'cool';

export interface DayRecord {
  date: string; // YYYY-MM-DD
  routines: RoutineItem[];
  tasks: TaskItem[];
  habits: HabitItem[];
  waterIntake: number; // in glasses (e.g., 6 / 8)
  waterTarget: number; // default 8
  sleepHours: number; // e.g. 7.5
  mood?: MoodType;
  energyLevel?: number; // 1 to 5
  weather?: WeatherType;
  moodTags?: string[];
  dailyHighlight?: string; // 1 good thing today
  journalNote?: string;
}

export interface AppSettings {
  userName: string;
  dailyWaterTarget: number;
  enableSounds: boolean;
  enableConfetti: boolean;
  showDailyQuote?: boolean;
}
