import React, { useState, useEffect, useRef } from 'react';
import { TaskItem } from '../types';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Coffee,
  Sparkles,
  Plus,
  Minus,
  Headphones,
  Volume2,
} from 'lucide-react';
import { sounds, launchCelebration } from '../utils/audio';
import {
  AmbientSoundType,
  AMBIENT_SOUND_OPTIONS,
  ambientEngine,
} from '../utils/ambientAudio';

export type PomodoroMode = 'focus' | 'short_break' | 'long_break';

interface PomodoroTimerProps {
  tasks: TaskItem[];
  selectedTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  onCompleteTask: (id: string) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onCompleteTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.5);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mode configurations
  const modeConfigs = {
    focus: {
      label: 'โฟกัสทำงาน',
      defaultMinutes: 25,
      color: 'text-rose-600',
      bgActive: 'bg-rose-50 border-rose-300 text-rose-700',
      stroke: '#e11d48',
      icon: Flame,
    },
    short_break: {
      label: 'พักสั้น 5 นาที',
      defaultMinutes: 5,
      color: 'text-sky-600',
      bgActive: 'bg-sky-50 border-sky-300 text-sky-700',
      stroke: '#0284c7',
      icon: Coffee,
    },
    long_break: {
      label: 'พักยาว 15 นาที',
      defaultMinutes: 15,
      color: 'text-indigo-600',
      bgActive: 'bg-indigo-50 border-indigo-300 text-indigo-700',
      stroke: '#6366f1',
      icon: Sparkles,
    },
  };

  // Switch modes
  const handleSwitchMode = (newMode: PomodoroMode) => {
    sounds.playPop();
    setIsRunning(false);
    setMode(newMode);
    const newMinutes = modeConfigs[newMode].defaultMinutes;
    setDurationMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
  };

  // Adjust duration by custom minutes
  const handleSetCustomMinutes = (minutes: number) => {
    sounds.playPop();
    setIsRunning(false);
    setDurationMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer Finished
            clearInterval(timerRef.current!);
            setIsRunning(false);
            sounds.playTimerBell();

            if (mode === 'focus') {
              setSessionsCompleted((c) => c + 1);
              launchCelebration();
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Synchronize Ambient Nature Sound with Timer running state
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      ambientEngine.setVolume(ambientVolume);
      ambientEngine.play(ambientSound);
    } else {
      ambientEngine.stop();
    }

    return () => {
      ambientEngine.stop();
    };
  }, [isRunning, ambientSound, ambientVolume]);

  // Toggle Start / Pause
  const togglePlayPause = () => {
    sounds.playPop();
    // If timer was at 0, reset before playing
    if (timeLeft === 0) {
      setTimeLeft(durationMinutes * 60);
    }
    setIsRunning((prev) => !prev);
  };

  // Reset timer
  const handleReset = () => {
    sounds.playPop();
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  // Time format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Progress Ring calculation
  const totalSeconds = durationMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const currentTask = tasks.find((t) => t.id === selectedTaskId);
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50/80 via-white to-amber-50/50 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">ตัวจับเวลาโฟกัส (Pomodoro)</h3>
              {sessionsCompleted > 0 && (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                  🍅 สำเร็จ {sessionsCompleted} รอบ
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              จดจ่อทีละงาน 25 นาที เพิ่มสมาธิและลดความเหนื่อยล้า
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick mini-status when collapsed */}
          {!isExpanded && (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-xl">
              <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">
                {formattedTime}
              </span>
              <button
                onClick={togglePlayPause}
                className="p-1 rounded-md text-slate-700 hover:text-slate-900"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title={isExpanded ? 'ย่อหน้าต่าง' : 'ขยายหน้าต่าง'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* 1. Mode Switcher Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {(['focus', 'short_break', 'long_break'] as PomodoroMode[]).map((m) => {
                const cfg = modeConfigs[m];
                const isActive = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleSwitchMode(m)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Presets for Focus Mode */}
            {mode === 'focus' && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">ระยะเวลา:</span>
                {[15, 25, 45, 50].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetCustomMinutes(mins)}
                    className={`px-2 py-1 rounded-lg border text-xs font-mono font-medium transition-colors ${
                      durationMinutes === mins
                        ? 'bg-rose-500 border-rose-500 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Focused Task Selector Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-slate-700 shrink-0">🎯 งานที่กำลังทำ:</span>
              {currentTask ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-xs font-semibold truncate ${
                      currentTask.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {currentTask.title}
                  </span>
                  <button
                    onClick={() => onSelectTask(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline shrink-0"
                  >
                    (ปลดล็อค)
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  ยังไม่ได้เลือกงานเฉพาะ (โฟกัสทั่วไป)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {/* Task dropdown selector */}
              {pendingTasks.length > 0 && (
                <select
                  value={selectedTaskId || ''}
                  onChange={(e) => onSelectTask(e.target.value || null)}
                  className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-rose-500 max-w-[180px] truncate"
                >
                  <option value="">-- เลือกงานที่ต้องการโฟกัส --</option>
                  {pendingTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              )}

              {/* Complete task button if task is active and not completed */}
              {currentTask && !currentTask.completed && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    onCompleteTask(currentTask.id);
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                  title="ทำเครื่องหมายว่างานนี้เสร็จแล้ว"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ติ๊กเสร็จสิ้น</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Center Progress Ring & Countdown Display */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Foreground progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={modeConfigs[mode].stroke}
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>

              {/* Text Inside Ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
                  {formattedTime}
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1">
                  {isRunning ? 'กำลังนับถอยหลัง...' : timeLeft === 0 ? 'ครบเวลาแล้ว! 🎉' : 'พร้อมเริ่ม'}
                </span>
              </div>
            </div>

            {/* 4. Action Buttons (Play/Pause, Reset, Micro-adjust) */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="รีเซ็ตเวลา"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${
                  isRunning
                    ? 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                    : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>หยุดชั่วคราว</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>เริ่มโฟกัส</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setTimeLeft((t) => Math.max(0, t - 60));
                  }}
                  disabled={timeLeft < 60}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs disabled:opacity-40"
                  title="ลด 1 นาที"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setTimeLeft((t) => t + 300);
                    setDurationMinutes((d) => d + 5);
                  }}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
                  title="เพิ่ม 5 นาที"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5. Relaxing Nature Ambient Sound Controls */}
            <div className="w-full mt-5 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                  <Headphones className="w-4 h-4 text-rose-500" />
                  <span>เสียงธรรมชาติผ่อนคลายขณะโฟกัส:</span>
                </div>

                {ambientSound !== 'none' && (
                  <div className="flex items-center gap-2 text-xs">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={ambientVolume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setAmbientVolume(val);
                        ambientEngine.setVolume(val);
                      }}
                      className="w-20 sm:w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      title="ปรับระดับเสียง"
                    />
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {Math.round(ambientVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Ambient Sound Selector Buttons */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-2.5">
                {AMBIENT_SOUND_OPTIONS.map((opt) => {
                  const isSelected = ambientSound === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        sounds.playPop();
                        const next = isSelected && opt.id !== 'none' ? 'none' : opt.id;
                        setAmbientSound(next);
                      }}
                      className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20 text-rose-900 shadow-2xs font-bold'
                          : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/60 text-slate-700'
                      }`}
                      title={opt.description}
                    >
                      <span className="text-base sm:text-lg block mb-0.5 leading-none">
                        {opt.emoji}
                      </span>
                      <span className="text-[11px] block truncate leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {ambientSound !== 'none' && (
                <p className="text-[11px] text-rose-700/80 mt-2 text-center sm:text-left">
                  💡 เสียงจะเริ่มบรรเลงอัตโนมัติเมื่อกด "เริ่มโฟกัส" และจะหยุดเมื่อกดหยุดชั่วคราวหรือครบเวลา
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
