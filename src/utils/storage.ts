import { DayRecord, AppSettings, RoutineItem, TaskItem, HabitItem } from '../types';
import { getTodayDateString, formatDateToString, parseDateString } from './dateUtils';

const STORAGE_KEY_PREFIX = 'wansook_day_';
const SETTINGS_KEY = 'wansook_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  userName: 'คุณ',
  dailyWaterTarget: 8,
  enableSounds: true,
  enableConfetti: true,
  showDailyQuote: true,
};

export const DEFAULT_ROUTINES_TEMPLATE: Omit<RoutineItem, 'id' | 'completed'>[] = [
  { timeOfDay: 'morning', title: 'ดื่มน้ำเปล่า 1 แก้วหลังตื่นนอน', time: '06:30', icon: 'Droplets' },
  { timeOfDay: 'morning', title: 'เก็บที่นอน & ยืดเหยียดร่างกาย', time: '06:45', icon: 'Bed' },
  { timeOfDay: 'morning', title: 'ทานอาหารเช้าที่มีประโยชน์', time: '07:30', icon: 'Utensils' },
  { timeOfDay: 'morning', title: 'วางแผน 3 สิ่งสำคัญประจำวัน', time: '08:30', icon: 'Target' },

  { timeOfDay: 'afternoon', title: 'ทานอาหารกลางวันตรงเวลา', time: '12:00', icon: 'Utensils' },
  { timeOfDay: 'afternoon', title: 'พักสายตาและลุกเดินผ่อนคลาย', time: '13:00', icon: 'Eye' },
  { timeOfDay: 'afternoon', title: 'ดื่มน้ำแก้วที่ 4 เติมความสดชื่น', time: '14:30', icon: 'Droplets' },

  { timeOfDay: 'evening', title: 'ออกกำลังกาย / เดิน 30 นาที', time: '17:30', icon: 'Flame' },
  { timeOfDay: 'evening', title: 'ทานอาหารเย็นเบาๆ มีประโยชน์', time: '18:30', icon: 'Utensils' },
  { timeOfDay: 'evening', title: 'สรุปสิ่งที่ทำเสร็จ & เคลียร์งาน', time: '20:00', icon: 'CheckCircle' },

  { timeOfDay: 'night', title: 'พักหน้าจอก่อนเข้านอน', time: '21:30', icon: 'Smartphone' },
  { timeOfDay: 'night', title: 'จดบันทึก 1 เรื่องดีๆ ของวัน', time: '22:00', icon: 'BookHeart' },
  { timeOfDay: 'night', title: 'เข้านอนพักผ่อนตรงเวลา', time: '22:30', icon: 'Moon' },
];

export const DEFAULT_HABITS_TEMPLATE: Omit<HabitItem, 'id' | 'current'>[] = [
  { title: 'ดื่มน้ำสะอาด', target: 8, unit: 'แก้ว', icon: 'Droplet', color: 'blue' },
  { title: 'ออกกำลังกาย / ขยับตัว', target: 30, unit: 'นาที', icon: 'Activity', color: 'emerald' },
  { title: 'อ่านหนังสือ / เรียนรู้', target: 20, unit: 'นาที', icon: 'BookOpen', color: 'amber' },
  { title: 'นอนหลับพักผ่อน', target: 8, unit: 'ชม.', icon: 'Moon', color: 'indigo' },
];

export function createBlankDayRecord(dateStr: string): DayRecord {
  return {
    date: dateStr,
    routines: DEFAULT_ROUTINES_TEMPLATE.map((r, idx) => ({
      ...r,
      id: `routine_${dateStr}_${idx}_${Date.now()}`,
      completed: false,
    })),
    tasks: [
      {
        id: `task_${dateStr}_1`,
        title: 'จัดเตรียมแผนและงานสำคัญวันนี้',
        priority: 'high',
        category: 'work',
        completed: false,
        dueTime: '10:00',
      },
      {
        id: `task_${dateStr}_2`,
        title: 'จัดโต๊ะและพื้นที่ทำงานให้เป็นระเบียบ',
        priority: 'normal',
        category: 'home',
        completed: false,
      },
      {
        id: `task_${dateStr}_3`,
        title: 'ซื้อผลไม้หรือเครื่องดื่มเพื่อสุขภาพ',
        priority: 'low',
        category: 'shopping',
        completed: false,
      },
    ],
    habits: DEFAULT_HABITS_TEMPLATE.map((h, idx) => ({
      ...h,
      id: `habit_${dateStr}_${idx}`,
      current: 0,
    })),
    waterIntake: 0,
    waterTarget: 8,
    sleepHours: 7,
    mood: undefined,
    dailyHighlight: '',
    journalNote: '',
  };
}

export function loadDayRecord(dateStr: string): DayRecord {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${dateStr}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading day record:', e);
  }

  // If no record exists, create a default one
  const newRecord = createBlankDayRecord(dateStr);
  // If it's today, maybe pre-check 1-2 morning routines for a welcoming feel
  const today = getTodayDateString();
  if (dateStr === today) {
    if (newRecord.routines.length > 0) {
      newRecord.routines[0].completed = true; // morning water completed
    }
    if (newRecord.habits.length > 0) {
      newRecord.habits[0].current = 2; // 2 glasses of water
      newRecord.waterIntake = 2;
    }
    newRecord.mood = 'peaceful';
    newRecord.dailyHighlight = 'เริ่มต้นวันใหม่ด้วยกาแฟหอมกรุ่นและบรรยากาศสดชื่น';
  }
  saveDayRecord(newRecord);
  return newRecord;
}

export function saveDayRecord(record: DayRecord): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${record.date}`, JSON.stringify(record));
  } catch (e) {
    console.error('Error saving day record:', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

// Compute streak of consecutive days with activity
export function calculateStreak(): number {
  const todayStr = getTodayDateString();
  let currentDate = parseDateString(todayStr);
  let streak = 0;

  for (let i = 0; i < 30; i++) {
    const checkStr = formatDateToString(currentDate);
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${checkStr}`);
    if (raw) {
      const rec: DayRecord = JSON.parse(raw);
      const hasCompletedRoutines = rec.routines.some(r => r.completed);
      const hasCompletedTasks = rec.tasks.some(t => t.completed);
      const hasHabitProgress = rec.habits.some(h => h.current > 0);
      const hasMood = !!rec.mood;

      if (hasCompletedRoutines || hasCompletedTasks || hasHabitProgress || hasMood) {
        streak++;
      } else if (i > 0) {
        // Break in streak
        break;
      }
    } else if (i > 0) {
      break;
    }

    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Minimum friendly streak for display if user is active today
  return Math.max(streak, 1);
}

// Load past 7 days records for weekly insights
export function loadPast7DaysRecords(): Array<{ dateStr: string; record: DayRecord }> {
  const today = parseDateString(getTodayDateString());
  const list = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateToString(d);
    list.push({
      dateStr,
      record: loadDayRecord(dateStr),
    });
  }
  return list;
}

// Reset all data for a clean slate
export function resetAllData(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(STORAGE_KEY_PREFIX) || key === SETTINGS_KEY)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Error resetting data:', e);
  }
}
