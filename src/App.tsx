/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DayRecord, TimeOfDay, TaskItem, HabitItem, RoutineItem, MoodType, AppSettings, WeatherType } from './types';
import {
  getTodayDateString,
} from './utils/dateUtils';
import {
  loadDayRecord,
  saveDayRecord,
  loadSettings,
  saveSettings,
  calculateStreak,
  loadPast7DaysRecords,
  resetAllData,
} from './utils/storage';
import { launchCelebration, sounds } from './utils/audio';
import { auth, signInWithGoogle, logOut } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  saveDayRecordToFirestore,
  loadDayRecordFromFirestore,
  saveUserProfileToFirestore,
  subscribeToDayRecord,
} from './utils/firebaseSync';

import { Header } from './components/Header';
import { DateCarousel } from './components/DateCarousel';
import { DailyQuoteCard } from './components/DailyQuoteCard';
import { DailyOverview } from './components/DailyOverview';
import { RoutineSection } from './components/RoutineSection';
import { HabitsSection } from './components/HabitsSection';
import { TasksSection } from './components/TasksSection';
import { MoodJournalSection } from './components/MoodJournalSection';
import { WeeklyInsights } from './components/WeeklyInsights';
import { MobileBottomNav } from './components/MobileBottomNav';

import { AddRoutineModal } from './components/AddRoutineModal';
import { EditRoutineModal } from './components/EditRoutineModal';
import { AddTaskModal } from './components/AddTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { AddHabitModal } from './components/AddHabitModal';
import { EditHabitModal } from './components/EditHabitModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<string>('routines');
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [dayRecord, setDayRecord] = useState<DayRecord>(() => loadDayRecord(getTodayDateString()));
  const [streakCount, setStreakCount] = useState<number>(() => calculateStreak());
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals state
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);
  const [addRoutinePeriod, setAddRoutinePeriod] = useState<TimeOfDay>('morning');
  const [editingRoutine, setEditingRoutine] = useState<RoutineItem | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load record whenever selected date changes
  useEffect(() => {
    const record = loadDayRecord(selectedDate);
    // Sync water target with settings if needed
    if (settings.dailyWaterTarget && record.waterTarget !== settings.dailyWaterTarget) {
      record.waterTarget = settings.dailyWaterTarget;
    }
    setDayRecord(record);

    // If user is logged in, also check cloud record
    if (user) {
      loadDayRecordFromFirestore(user.uid, selectedDate).then((cloudRec) => {
        if (cloudRec) {
          setDayRecord(cloudRec);
          saveDayRecord(cloudRec);
        }
      });
    }
  }, [selectedDate, settings.dailyWaterTarget, user]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Save user profile
        saveUserProfileToFirestore(currentUser.uid, {
          displayName: currentUser.displayName || settings.userName || 'คุณ',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || undefined,
        });

        // Sync day record from Firestore
        setIsSyncing(true);
        try {
          const cloudRecord = await loadDayRecordFromFirestore(currentUser.uid, selectedDate);
          if (cloudRecord) {
            setDayRecord(cloudRecord);
            saveDayRecord(cloudRecord);
          } else {
            // Push current local day record to cloud
            const localRecord = loadDayRecord(selectedDate);
            await saveDayRecordToFirestore(currentUser.uid, localRecord);
          }
        } catch (e) {
          console.warn('Initial cloud sync error:', e);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, [selectedDate, settings.userName]);

  // Real-time listener when authenticated
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToDayRecord(user.uid, selectedDate, (record) => {
      if (record) {
        setDayRecord(record);
        saveDayRecord(record);
      }
    });
    return () => unsubscribe();
  }, [user, selectedDate]);

  // Compute daily completion percentage
  const overallPercent = useMemo(() => {
    let totalPoints = 0;
    let earnedPoints = 0;

    // Routines (1 point each)
    if (dayRecord.routines.length > 0) {
      totalPoints += dayRecord.routines.length;
      earnedPoints += dayRecord.routines.filter((r) => r.completed).length;
    }

    // Tasks (1 point each)
    if (dayRecord.tasks.length > 0) {
      totalPoints += dayRecord.tasks.length;
      earnedPoints += dayRecord.tasks.filter((t) => t.completed).length;
    }

    // Water (1 point if completed target)
    totalPoints += 1;
    if (dayRecord.waterIntake >= (dayRecord.waterTarget || 8)) {
      earnedPoints += 1;
    }

    // Habits (1 point each)
    dayRecord.habits.forEach((h) => {
      totalPoints += 1;
      if (h.current >= h.target) {
        earnedPoints += 1;
      }
    });

    if (totalPoints === 0) return 0;
    return Math.min(Math.round((earnedPoints / totalPoints) * 100), 100);
  }, [dayRecord]);

  // Helper to update and persist day record locally and to Firestore
  const updateRecord = useCallback((updater: (prev: DayRecord) => DayRecord) => {
    setDayRecord((prev) => {
      const next = updater(prev);
      saveDayRecord(next);
      setStreakCount(calculateStreak());

      if (user) {
        setIsSyncing(true);
        saveDayRecordToFirestore(user.uid, next)
          .catch((e) => console.error('Cloud save failed:', e))
          .finally(() => setIsSyncing(false));
      }

      return next;
    });
  }, [user]);

  // Routine Handlers
  const handleToggleRoutine = (id: string) => {
    updateRecord((prev) => {
      const targetRoutine = prev.routines.find((r) => r.id === id);
      const willBeCompleted = targetRoutine ? !targetRoutine.completed : false;
      const nextRoutines = prev.routines.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      );
      if (willBeCompleted && nextRoutines.length > 0 && nextRoutines.every((r) => r.completed) && settings.enableConfetti) {
        launchCelebration();
      }
      return { ...prev, routines: nextRoutines };
    });
  };

  const handleDeleteRoutine = (id: string) => {
    updateRecord((prev) => ({
      ...prev,
      routines: prev.routines.filter((r) => r.id !== id),
    }));
  };

  const handleAddRoutine = (routineData: Omit<RoutineItem, 'id' | 'completed'>) => {
    const newItem: RoutineItem = {
      ...routineData,
      id: `routine_${selectedDate}_${Date.now()}`,
      completed: false,
    };
    updateRecord((prev) => ({
      ...prev,
      routines: [...prev.routines, newItem],
    }));
  };

  const handleSaveEditedRoutine = (updated: RoutineItem) => {
    updateRecord((prev) => ({
      ...prev,
      routines: prev.routines.map((r) => (r.id === updated.id ? updated : r)),
    }));
    setEditingRoutine(null);
  };

  const handleCompletePeriod = (period: TimeOfDay) => {
    sounds.playPop();
    updateRecord((prev) => {
      const nextRoutines = prev.routines.map((r) =>
        r.timeOfDay === period ? { ...r, completed: true } : r
      );
      if (nextRoutines.length > 0 && nextRoutines.every((r) => r.completed) && settings.enableConfetti) {
        launchCelebration();
      }
      return { ...prev, routines: nextRoutines };
    });
  };

  // Water & Habit Handlers
  const handleUpdateWater = (glasses: number) => {
    updateRecord((prev) => {
      const nextGlasses = Math.max(0, glasses);
      // Update in habits array as well if a water habit is tracked
      const updatedHabits = prev.habits.map((h) =>
        h.title.includes('ดื่มน้ำ') ? { ...h, current: nextGlasses } : h
      );
      return {
        ...prev,
        waterIntake: nextGlasses,
        habits: updatedHabits,
      };
    });
  };

  const handleUpdateHabitCurrent = (id: string, newCurrent: number) => {
    updateRecord((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, current: newCurrent } : h)),
    }));
  };

  const handleDeleteHabit = (id: string) => {
    updateRecord((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  };

  const handleAddHabit = (habitData: Omit<HabitItem, 'id' | 'current'>) => {
    const newHabit: HabitItem = {
      ...habitData,
      id: `habit_${selectedDate}_${Date.now()}`,
      current: 0,
    };
    updateRecord((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  };

  const handleSaveEditedHabit = (updated: HabitItem) => {
    updateRecord((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === updated.id ? updated : h)),
    }));
    setEditingHabit(null);
  };

  // Task Handlers
  const handleToggleTask = (id: string) => {
    updateRecord((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const handleDeleteTask = (id: string) => {
    updateRecord((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const handleAddTask = (taskData: Omit<TaskItem, 'id' | 'completed'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task_${selectedDate}_${Date.now()}`,
      completed: false,
    };
    updateRecord((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const handleSaveEditedTask = (updated: TaskItem) => {
    updateRecord((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
    setEditingTask(null);
  };

  const handleClearCompletedTasks = () => {
    sounds.playPop();
    updateRecord((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => !t.completed),
    }));
  };

  // Mood & Reflection Handlers
  const handleUpdateMood = (mood: MoodType) => {
    updateRecord((prev) => ({ ...prev, mood }));
  };

  const handleUpdateEnergy = (energyLevel: number) => {
    updateRecord((prev) => ({ ...prev, energyLevel }));
  };

  const handleUpdateWeather = (weather: WeatherType) => {
    updateRecord((prev) => ({ ...prev, weather }));
  };

  const handleToggleMoodTag = (tag: string) => {
    sounds.playPop();
    updateRecord((prev) => {
      const currentTags = prev.moodTags || [];
      const nextTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return { ...prev, moodTags: nextTags };
    });
  };

  const handleUpdateHighlight = (dailyHighlight: string) => {
    updateRecord((prev) => ({ ...prev, dailyHighlight }));
  };

  const handleUpdateJournal = (journalNote: string) => {
    updateRecord((prev) => ({ ...prev, journalNote }));
  };

  const handleUpdateSleepHours = (sleepHours: number) => {
    updateRecord((prev) => ({ ...prev, sleepHours }));
  };

  // Settings Handlers
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetAllData = () => {
    resetAllData();
    const today = getTodayDateString();
    setSelectedDate(today);
    const blank = loadDayRecord(today);
    setDayRecord(blank);
    setStreakCount(1);
  };

  // Weekly data for insights tab
  const past7Days = useMemo(() => {
    return loadPast7DaysRecords();
  }, [dayRecord, selectedDate]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col pb-20 md:pb-12">
      {/* 1. Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={streakCount}
        overallPercent={overallPercent}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={logOut}
        isSyncing={isSyncing}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5">
        {/* Date Selector Banner */}
        <DateCarousel
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          userName={settings.userName}
        />

        {/* Daily Inspirational Quote & Positive Affirmation */}
        {settings.showDailyQuote !== false && (
          <DailyQuoteCard selectedDate={selectedDate} />
        )}

        {/* Daily Summary Metrics */}
        <DailyOverview record={dayRecord} overallPercent={overallPercent} />

        {/* Tab Content Panels */}
        {activeTab === 'routines' && (
          <RoutineSection
            routines={dayRecord.routines}
            onToggleRoutine={handleToggleRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onOpenAddModal={(period) => {
              if (period) setAddRoutinePeriod(period);
              setIsAddRoutineOpen(true);
            }}
            onEditRoutine={setEditingRoutine}
            onCompletePeriod={handleCompletePeriod}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsSection
            habits={dayRecord.habits}
            waterIntake={dayRecord.waterIntake}
            waterTarget={dayRecord.waterTarget || settings.dailyWaterTarget || 8}
            onUpdateWater={handleUpdateWater}
            onUpdateHabitCurrent={handleUpdateHabitCurrent}
            onDeleteHabit={handleDeleteHabit}
            onOpenAddHabitModal={() => setIsAddHabitOpen(true)}
            onEditHabit={setEditingHabit}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksSection
            tasks={dayRecord.tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
            onEditTask={setEditingTask}
            onClearCompletedTasks={handleClearCompletedTasks}
          />
        )}

        {activeTab === 'mood' && (
          <MoodJournalSection
            mood={dayRecord.mood}
            energyLevel={dayRecord.energyLevel}
            weather={dayRecord.weather}
            moodTags={dayRecord.moodTags}
            dailyHighlight={dayRecord.dailyHighlight}
            journalNote={dayRecord.journalNote}
            sleepHours={dayRecord.sleepHours}
            onUpdateMood={handleUpdateMood}
            onUpdateEnergy={handleUpdateEnergy}
            onUpdateWeather={handleUpdateWeather}
            onToggleMoodTag={handleToggleMoodTag}
            onUpdateHighlight={handleUpdateHighlight}
            onUpdateJournal={handleUpdateJournal}
            onUpdateSleepHours={handleUpdateSleepHours}
          />
        )}

        {activeTab === 'insights' && (
          <WeeklyInsights past7Days={past7Days} streakCount={streakCount} />
        )}
      </main>

      {/* 3. Mobile Navigation Bar (Fixed bottom for thumb zone) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. Modals */}
      <AddRoutineModal
        isOpen={isAddRoutineOpen}
        onClose={() => setIsAddRoutineOpen(false)}
        onAdd={handleAddRoutine}
        defaultTimeOfDay={addRoutinePeriod}
      />

      <EditRoutineModal
        isOpen={!!editingRoutine}
        routine={editingRoutine}
        onClose={() => setEditingRoutine(null)}
        onSave={handleSaveEditedRoutine}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAdd={handleAddTask}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
      />

      <AddHabitModal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        onAdd={handleAddHabit}
      />

      <EditHabitModal
        isOpen={!!editingHabit}
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={handleSaveEditedHabit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetAllData={handleResetAllData}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={logOut}
      />
    </div>
  );
}
