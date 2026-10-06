import React, { useState } from 'react';
import { RoutineItem, TimeOfDay } from '../types';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Plus,
  Trash2,
  Check,
  Clock,
  Sparkles,
  Droplets,
  Bed,
  Utensils,
  Target,
  Eye,
  Flame,
  CheckCircle,
  Smartphone,
  BookHeart,
  Edit3,
  CheckCheck,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface RoutineSectionProps {
  routines: RoutineItem[];
  onToggleRoutine: (id: string) => void;
  onDeleteRoutine: (id: string) => void;
  onOpenAddModal: (timeOfDay?: TimeOfDay) => void;
  onEditRoutine: (routine: RoutineItem) => void;
  onCompletePeriod: (period: TimeOfDay) => void;
}

export const RoutineSection: React.FC<RoutineSectionProps> = ({
  routines,
  onToggleRoutine,
  onDeleteRoutine,
  onOpenAddModal,
  onEditRoutine,
  onCompletePeriod,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  const periodConfig: Record<
    TimeOfDay,
    { label: string; icon: React.ElementType; color: string; bg: string; border: string }
  > = {
    morning: {
      label: 'เช้า',
      icon: Sun,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200/60',
    },
    afternoon: {
      label: 'กลางวัน',
      icon: SunMedium,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200/60',
    },
    evening: {
      label: 'เย็น',
      icon: Sunset,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200/60',
    },
    night: {
      label: 'ก่อนนอน',
      icon: Moon,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200/60',
    },
  };

  const getRoutineIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Droplets':
        return Droplets;
      case 'Bed':
        return Bed;
      case 'Utensils':
        return Utensils;
      case 'Target':
        return Target;
      case 'Eye':
        return Eye;
      case 'Flame':
        return Flame;
      case 'CheckCircle':
        return CheckCircle;
      case 'Smartphone':
        return Smartphone;
      case 'BookHeart':
        return BookHeart;
      case 'Moon':
        return Moon;
      default:
        return Sparkles;
    }
  };

  const periods: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];

  const handleToggle = (id: string) => {
    sounds.playPop();
    onToggleRoutine(id);
  };

  const totalCompleted = routines.filter((r) => r.completed).length;
  const totalCount = routines.length;
  const routinePercent = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Top action bar: Filter & Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>ตารางกิจวัตรประจำวัน</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            สร้างวินัยที่ดีทีละก้าว แบ่งตามช่วงเวลาอย่างลงตัว
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Progress pill */}
          <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-xl font-semibold">
            เสร็จ {totalCompleted}/{totalCount} ({routinePercent}%)
          </span>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterPeriod === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด
            </button>
            {periods.map((p) => {
              const cfg = periodConfig[p];
              return (
                <button
                  key={p}
                  onClick={() => setFilterPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterPeriod === p
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Add routine button */}
          <button
            onClick={() => onOpenAddModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มกิจวัตร</span>
          </button>
        </div>
      </div>

      {/* Routine Cards by Period */}
      <div className="space-y-4">
        {periods
          .filter((p) => filterPeriod === 'all' || filterPeriod === p)
          .map((period) => {
            const cfg = periodConfig[period];
            const PeriodIcon = cfg.icon;
            const periodRoutines = routines
              .filter((r) => r.timeOfDay === period)
              .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
            const completedCount = periodRoutines.filter((r) => r.completed).length;

            return (
              <div
                key={period}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs"
              >
                {/* Period Section Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.border} border flex items-center justify-center`}
                    >
                      <PeriodIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">ช่วง{cfg.label}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>สำเร็จ {completedCount} จาก {periodRoutines.length} ข้อ</span>
                        {periodRoutines.length > 0 && completedCount === periodRoutines.length && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> ครบแล้ว
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {periodRoutines.length > 0 && completedCount < periodRoutines.length && (
                      <button
                        onClick={() => onCompletePeriod(period)}
                        className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 px-2 py-1 rounded-lg transition-colors font-medium"
                        title="ทำเครื่องหมายว่าสำเร็จทั้งหมดในรอบนี้"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">ทำครบช่วงนี้</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenAddModal(period)}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่ม</span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {periodRoutines.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    ยังไม่มีกิจวัตรในช่วงนี้ แตะ "เพิ่ม" เพื่อเริ่มสร้างกิจวัตรของคุณ
                  </div>
                ) : (
                  <div className="space-y-2">
                    {periodRoutines.map((routine) => {
                      const IconComp = getRoutineIcon(routine.icon);
                      const isDone = routine.completed;

                      return (
                        <div
                          key={routine.id}
                          className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                            isDone
                              ? 'bg-slate-50/70 border-slate-200/50 text-slate-400'
                              : 'bg-white hover:bg-slate-50/50 border-slate-200/80 text-slate-800'
                          }`}
                        >
                          <div
                            onClick={() => handleToggle(routine.id)}
                            className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          >
                            {/* Checkbox */}
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                                isDone
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            {/* Routine Icon */}
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isDone
                                  ? 'bg-slate-100 text-slate-400'
                                  : 'bg-slate-100/80 text-slate-600'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                            </div>

                            {/* Title & Time */}
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isDone ? 'line-through text-slate-400' : 'text-slate-800'
                                }`}
                              >
                                {routine.title}
                              </p>
                              {routine.time && (
                                <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                                  {routine.time} น.
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditRoutine(routine);
                              }}
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                              title="แก้ไขกิจวัตรนี้"
                              aria-label="แก้ไขกิจวัตรนี้"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteRoutine(routine.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="ลบกิจวัตรนี้"
                              aria-label="ลบกิจวัตรนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
