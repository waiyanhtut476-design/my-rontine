import React, { useState } from 'react';
import { DayRecord } from '../types';
import { BarChart3, Droplet, Flame, Trophy, Calendar, CheckCircle2, Moon, Copy, Check, Activity, Smile } from 'lucide-react';
import { formatThaiDateShort, parseDateString, THAI_SHORT_DAYS } from '../utils/dateUtils';
import { sounds } from '../utils/audio';

interface WeeklyInsightsProps {
  past7Days: Array<{ dateStr: string; record: DayRecord }>;
  streakCount: number;
}

export const WeeklyInsights: React.FC<WeeklyInsightsProps> = ({ past7Days, streakCount }) => {
  const [copied, setCopied] = useState(false);

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    peaceful: '🌿',
    neutral: '☕',
    tired: '😴',
    stressed: '⚡',
  };

  // Compute daily completion rates
  const dayStats = past7Days.map(({ dateStr, record }) => {
    const totalRoutines = record.routines.length;
    const doneRoutines = record.routines.filter((r) => r.completed).length;

    const totalTasks = record.tasks.length;
    const doneTasks = record.tasks.filter((t) => t.completed).length;

    const totalItems = totalRoutines + totalTasks;
    const doneItems = doneRoutines + doneTasks;
    const percent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    const date = parseDateString(dateStr);
    const dayName = THAI_SHORT_DAYS[date.getDay()];

    return {
      dateStr,
      dayName,
      shortDate: formatThaiDateShort(dateStr),
      percent,
      waterGlasses: record.waterIntake,
      mood: record.mood,
      sleepHours: record.sleepHours || 0,
      highlight: record.dailyHighlight,
      habits: record.habits || [],
    };
  });

  const averagePercent = Math.round(
    dayStats.reduce((acc, curr) => acc + curr.percent, 0) / (dayStats.length || 1)
  );

  const totalWaterWeekly = dayStats.reduce((acc, curr) => acc + curr.waterGlasses, 0);

  const averageSleep = (
    dayStats.reduce((acc, curr) => acc + (curr.sleepHours || 7), 0) / (dayStats.length || 1)
  ).toFixed(1);

  const bestDay = [...dayStats].sort((a, b) => b.percent - a.percent)[0];

  // Habit consistency (count days habit reached target)
  const allHabitTitles = Array.from(
    new Set(dayStats.flatMap((d) => d.habits.map((h) => h.title)))
  );

  const habitConsistency = allHabitTitles.map((title) => {
    const daysAchieved = dayStats.filter((d) => {
      const found = d.habits.find((h) => h.title === title);
      return found && found.current >= found.target;
    }).length;
    return { title, daysAchieved, totalDays: dayStats.length };
  });

  const handleCopySummary = async () => {
    sounds.playPop();
    const summaryText = `📊 สรุปภาพรวมชีวิตประจำวันรอบ 7 วัน (วันสุข)
• ความสำเร็จเฉลี่ย: ${averagePercent}%
• วันที่ทำได้ดีที่สุด: ${bestDay ? `${bestDay.dayName} (${bestDay.percent}%)` : '-'}
• ดื่มน้ำสะสม: ${totalWaterWeekly * 250} มล. (${totalWaterWeekly} แก้ว)
• นอนหลับเฉลี่ย: ${averageSleep} ชม./คืน
• ต่อเนื่อง: ${streakCount} วัน`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>สรุปสถิติรอบ 7 วันที่ผ่านมา</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              มองเห็นพัฒนาการและความสม่ำเสมอในชีวิตประจำวันของคุณ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              title="คัดลอกสรุปสถิติรอบ 7 วัน"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>คัดลอกสรุป</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/70 rounded-xl text-amber-800 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>ทำต่อเนื่อง {streakCount} วัน</span>
            </div>
          </div>
        </div>

        {/* 7-Day Completion Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between gap-2 h-44 px-2 sm:px-6">
            {dayStats.map((item) => {
              const isBest = bestDay && item.dateStr === bestDay.dateStr && item.percent > 0;
              return (
                <div key={item.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  {/* Percent tooltip */}
                  <span className="text-[11px] font-bold text-slate-600 tabular-nums">
                    {item.percent}%
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-28 relative">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        isBest
                          ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                          : item.percent >= 70
                          ? 'bg-emerald-500'
                          : item.percent >= 40
                          ? 'bg-sky-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ height: `${Math.max(item.percent, 8)}%` }}
                    />
                  </div>

                  {/* Day Label & Mood Emoji */}
                  <div className="text-center">
                    <span className="block text-xs font-bold text-slate-800">{item.dayName}</span>
                    <span className="block text-[10px] text-slate-400">{item.shortDate}</span>
                    <span
                      className="block text-xs mt-0.5"
                      title={item.mood ? `อารมณ์: ${item.mood}` : 'ยังไม่ได้ระบุอารมณ์'}
                    >
                      {item.mood ? moodEmojis[item.mood] : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Key Highlights Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Average Success */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold">สำเร็จเฉลี่ย</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {averagePercent}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {averagePercent >= 70 ? 'สม่ำเสมอดีเยี่ยม' : 'ค่อยๆ ปรับทีละนิด'}
          </p>
        </div>

        {/* Card 2: Total Hydration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-sky-600 mb-1">
            <Droplet className="w-4 h-4" />
            <span className="text-xs font-bold">ดื่มน้ำ 7 วัน</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {totalWaterWeekly * 250} <span className="text-xs font-semibold text-slate-500">มล.</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            เฉลี่ย {Math.round(totalWaterWeekly / 7)} แก้ว/วัน
          </p>
        </div>

        {/* Card 3: Average Sleep */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
            <Moon className="w-4 h-4" />
            <span className="text-xs font-bold">การนอนหลับ</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {averageSleep} <span className="text-xs font-semibold text-slate-500">ชม.</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {Number(averageSleep) >= 7 ? 'พักผ่อนเพียงพอ' : 'ควรนอนให้มากขึ้น'}
          </p>
        </div>

        {/* Card 4: Best Day */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-600 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold">วันที่ดีที่สุด</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {bestDay ? `${bestDay.dayName}` : '-'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {bestDay ? `${bestDay.percent}% สำเร็จ` : 'ยังไม่มีข้อมูล'}
          </p>
        </div>
      </div>

      {/* 3. Habit Consistency Breakdown */}
      {habitConsistency.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>ความสม่ำเสมอของนิสัยรอบ 7 วัน</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habitConsistency.map((item) => {
              const consistencyPercent = Math.round((item.daysAchieved / item.totalDays) * 100);
              return (
                <div key={item.title} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {item.daysAchieved} / {item.totalDays} วัน
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${consistencyPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Recent Highlights Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>เรื่องดีๆ ที่บันทึกไว้ในสัปดาห์นี้</span>
        </h4>

        <div className="space-y-2">
          {dayStats
            .filter((d) => d.highlight && d.highlight.trim().length > 0)
            .map((d) => (
              <div
                key={d.dateStr}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-700 shrink-0">
                  {d.shortDate}
                </span>
                <p className="text-slate-700 font-medium">{d.highlight}</p>
              </div>
            ))}

          {dayStats.filter((d) => d.highlight && d.highlight.trim().length > 0).length === 0 && (
            <p className="text-xs text-slate-400 py-4 text-center">
              ยังไม่มีเรื่องดีๆ ที่บันทึกไว้ในรอบ 7 วัน แวะไปที่แท็บ "บันทึกอารมณ์" เพื่อจด 1 เรื่องดีๆ ของคุณได้เลย!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
