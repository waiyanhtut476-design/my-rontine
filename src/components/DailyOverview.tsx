import React, { useState } from 'react';
import { DayRecord } from '../types';
import { CheckCircle, Droplet, ListTodo, Smile, Trophy, Copy, Check, Share2 } from 'lucide-react';
import { formatThaiDateFull } from '../utils/dateUtils';
import { sounds } from '../utils/audio';

interface DailyOverviewProps {
  record: DayRecord;
  overallPercent: number;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({ record, overallPercent }) => {
  const [copied, setCopied] = useState(false);

  const totalRoutines = record.routines.length;
  const completedRoutines = record.routines.filter((r) => r.completed).length;

  const totalTasks = record.tasks.length;
  const completedTasks = record.tasks.filter((t) => t.completed).length;

  const waterGlasses = record.waterIntake;
  const waterTarget = record.waterTarget || 8;

  // Friendly encouragement text in Thai based on progress
  let feedbackMessage = 'เริ่มต้นวันใหม่ด้วยพลังบวก ค่อยๆ ทำทีละอย่างนะ';
  if (overallPercent === 100) {
    feedbackMessage = 'สุดยอดมากเลย! วันนี้ทำสำเร็จครบทุกเป้าหมายแล้ว 🎉';
  } else if (overallPercent >= 75) {
    feedbackMessage = 'ใกล้ครบแล้ว เก่งมากๆ เลย อีกนิดเดียวเท่านั้น!';
  } else if (overallPercent >= 50) {
    feedbackMessage = 'ทำมาเกินครึ่งทางแล้ว วันนี้ไปได้สวยมาก!';
  } else if (overallPercent > 0) {
    feedbackMessage = 'เริ่มต้นได้ดีมาก ก้าวต่อไปทีละก้าวอย่างสบายใจ';
  }

  const moodLabels: Record<string, { label: string; emoji: string }> = {
    happy: { label: 'มีความสุข', emoji: '😊' },
    peaceful: { label: 'สบายใจ', emoji: '🌿' },
    neutral: { label: 'ทั่วไป ปกติ', emoji: '☕' },
    tired: { label: 'เหนื่อยล้า', emoji: '😴' },
    stressed: { label: 'เครียด กังวล', emoji: '⚡' },
  };

  const currentMood = record.mood ? moodLabels[record.mood] : null;

  const handleCopySummary = async () => {
    sounds.playPop();
    const dateFormatted = formatThaiDateFull(record.date);
    const summaryLines = [
      `🌟 วันสุข - สรุปชีวิตประจำวัน (${dateFormatted})`,
      `📊 ความก้าวหน้าโดยรวม: ${overallPercent}%`,
      `⏰ กิจวัตร: ${completedRoutines}/${totalRoutines} ข้อ`,
      `💧 ดื่มน้ำ: ${waterGlasses * 250} มล. (${waterGlasses}/${waterTarget} แก้ว)`,
      `✅ สิ่งที่ทำเสร็จ: ${completedTasks}/${totalTasks} งาน`,
    ];

    if (currentMood) {
      summaryLines.push(`💖 อารมณ์วันนี้: ${currentMood.label} ${currentMood.emoji}`);
    }
    if (record.energyLevel) {
      summaryLines.push(`⚡ พลังกาย: ระดับ ${record.energyLevel}/5`);
    }
    if (record.dailyHighlight) {
      summaryLines.push(`✨ เรื่องดีๆ วันนี้: "${record.dailyHighlight}"`);
    }

    try {
      await navigator.clipboard.writeText(summaryLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      {/* Progress header & encouragement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">ภาพรวมความก้าวหน้าวันนี้</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{feedbackMessage}</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Copy Summary Button */}
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            title="คัดลอกสรุปประจำวันเพื่อแชร์หรือเก็บเป็นบันทึก"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>แชร์สรุปวันนี้</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {overallPercent}%
            </span>
            <span className="text-xs text-slate-500 font-medium leading-tight">
              สำเร็จ
              <br />
              โดยรวม
            </span>
          </div>
        </div>
      </div>

      {/* Main progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 mb-5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            overallPercent === 100
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-amber-500 to-rose-400'
          }`}
          style={{ width: `${overallPercent}%` }}
        />
      </div>

      {/* 4 Summary stat boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Stat 1: Routines */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">กิจวัตรเวลา</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {completedRoutines}
            </span>
            <span className="text-xs text-slate-400 tabular-nums">/ {totalRoutines}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalRoutines > 0 ? `${Math.round((completedRoutines / totalRoutines) * 100)}% เสร็จแล้ว` : 'ยังไม่มีกิจวัตร'}
          </div>
        </div>

        {/* Stat 2: Water */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-700 mb-1">
            <span className="text-xs font-medium">ดื่มน้ำ</span>
            <Droplet className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {waterGlasses}
            </span>
            <span className="text-xs text-slate-400 tabular-nums">/ {waterTarget} แก้ว</span>
          </div>
          <div className="text-[11px] text-sky-600 mt-1">
            {waterGlasses * 250} / {waterTarget * 250} มล.
          </div>
        </div>

        {/* Stat 3: Tasks */}
        <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-violet-700 mb-1">
            <span className="text-xs font-medium">สิ่งที่ต้องทำ</span>
            <ListTodo className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-400 tabular-nums">/ {totalTasks}</span>
          </div>
          <div className="text-[11px] text-violet-600 mt-1">
            {totalTasks > completedTasks ? `เหลืออีก ${totalTasks - completedTasks} รายการ` : 'เรียบร้อยทั้งหมด'}
          </div>
        </div>

        {/* Stat 4: Mood */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-medium">อารมณ์วันนี้</span>
            <Smile className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center gap-1.5 min-h-[28px]">
            {currentMood ? (
              <>
                <span className="text-xl" role="img" aria-label={currentMood.label}>
                  {currentMood.emoji}
                </span>
                <span className="text-sm font-bold text-slate-900 truncate">
                  {currentMood.label}
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400">ยังไม่ได้บันทึก</span>
            )}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {currentMood ? 'บันทึกแล้ว' : 'แตะเพื่อเลือก'}
          </div>
        </div>
      </div>
    </div>
  );
};
