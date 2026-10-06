import React from 'react';
import { HabitItem } from '../types';
import { WaterTracker } from './WaterTracker';
import {
  Activity,
  BookOpen,
  Moon,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Flame,
  Minus,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { sounds, launchCelebration } from '../utils/audio';

interface HabitsSectionProps {
  habits: HabitItem[];
  waterIntake: number;
  waterTarget: number;
  onUpdateWater: (glasses: number) => void;
  onUpdateHabitCurrent: (id: string, newCurrent: number) => void;
  onDeleteHabit: (id: string) => void;
  onOpenAddHabitModal: () => void;
  onEditHabit: (habit: HabitItem) => void;
}

export const HabitsSection: React.FC<HabitsSectionProps> = ({
  habits,
  waterIntake,
  waterTarget,
  onUpdateWater,
  onUpdateHabitCurrent,
  onDeleteHabit,
  onOpenAddHabitModal,
  onEditHabit,
}) => {
  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return Activity;
      case 'BookOpen':
        return BookOpen;
      case 'Moon':
        return Moon;
      case 'Flame':
        return Flame;
      default:
        return Sparkles;
    }
  };

  const handleStep = (habit: HabitItem, amount: number) => {
    sounds.playPop();
    const next = Math.max(0, habit.current + amount);
    onUpdateHabitCurrent(habit.id, next);
    if (next >= habit.target && habit.current < habit.target) {
      launchCelebration();
    }
  };

  const handleSetCompleted = (habit: HabitItem) => {
    sounds.playPop();
    const next = habit.current >= habit.target ? 0 : habit.target;
    onUpdateHabitCurrent(habit.id, next);
    if (next >= habit.target) {
      launchCelebration();
    }
  };

  // Filter out water from generic habits if present since WaterTracker handles it directly
  const otherHabits = habits.filter((h) => !h.title.includes('ดื่มน้ำ'));

  return (
    <div className="space-y-5">
      {/* 1. Dedicated Water Hydration Card */}
      <WaterTracker
        waterIntake={waterIntake}
        waterTarget={waterTarget}
        onUpdateWater={onUpdateWater}
      />

      {/* 2. Habits List Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span>เป้าหมายนิสัย & สุขภาพ</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ติดตามพฤติกรรมเชิงบวกเพื่อชีวิตที่สมดุลในทุกๆ วัน
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium px-2.5 py-1 bg-slate-50 border border-slate-200/70 rounded-lg">
              สำเร็จ {otherHabits.filter((h) => h.current >= h.target).length} / {otherHabits.length}
            </span>
            <button
              onClick={onOpenAddHabitModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มนิสัยใหม่</span>
            </button>
          </div>
        </div>

        {/* Habit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
          {otherHabits.map((habit) => {
            const IconComp = getHabitIcon(habit.icon);
            const isFinished = habit.current >= habit.target;
            const progress = Math.min(Math.round((habit.current / habit.target) * 100), 100);

            return (
              <div
                key={habit.id}
                className={`p-4 rounded-xl border transition-all ${
                  isFinished
                    ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                    : 'bg-white hover:bg-slate-50/40 border-slate-200/80'
                }`}
              >
                {/* Header: Icon, Title, and Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isFinished
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{habit.title}</h4>
                        {isFinished && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-semibold shrink-0">
                            ครบเป้า
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        เป้าหมาย {habit.target} {habit.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditHabit(habit)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="แก้ไขนิสัยนี้"
                      aria-label="แก้ไขนิสัยนี้"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="ลบนิสัยนี้"
                      aria-label="ลบนิสัยนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 tabular-nums">
                      {habit.current} / {habit.target} {habit.unit}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        isFinished ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFinished ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStep(habit, habit.target > 20 ? -5 : -1)}
                      disabled={habit.current <= 0}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="ลดจำนวน"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStep(habit, habit.target > 20 ? 5 : 1)}
                      className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                      title="เพิ่ม"
                    >
                      +{habit.target > 20 ? 5 : 1}
                    </button>
                    {habit.target > 20 && (
                      <button
                        onClick={() => handleStep(habit, 15)}
                        className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                        title="เพิ่ม 15"
                      >
                        +15
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleSetCompleted(habit)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isFinished
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isFinished ? 'ทำครบแล้ว' : 'ติ๊กสำเร็จ'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
