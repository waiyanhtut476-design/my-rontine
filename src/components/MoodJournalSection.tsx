import React, { useState } from 'react';
import { MoodType, WeatherType } from '../types';
import {
  Heart,
  Sparkles,
  Moon,
  Zap,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Check,
  Plus,
  BookOpen,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface MoodJournalSectionProps {
  mood?: MoodType;
  energyLevel?: number; // 1 to 5
  weather?: WeatherType;
  moodTags?: string[];
  dailyHighlight?: string;
  journalNote?: string;
  sleepHours: number;
  onUpdateMood: (mood: MoodType) => void;
  onUpdateEnergy: (energy: number) => void;
  onUpdateWeather: (weather: WeatherType) => void;
  onToggleMoodTag: (tag: string) => void;
  onUpdateHighlight: (highlight: string) => void;
  onUpdateJournal: (note: string) => void;
  onUpdateSleepHours: (hours: number) => void;
}

export const MoodJournalSection: React.FC<MoodJournalSectionProps> = ({
  mood,
  energyLevel = 3,
  weather = 'sunny',
  moodTags = [],
  dailyHighlight = '',
  journalNote = '',
  sleepHours = 7,
  onUpdateMood,
  onUpdateEnergy,
  onUpdateWeather,
  onToggleMoodTag,
  onUpdateHighlight,
  onUpdateJournal,
  onUpdateSleepHours,
}) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const moods: Array<{ type: MoodType; label: string; emoji: string; desc: string }> = [
    { type: 'happy', label: 'มีความสุข', emoji: '😊', desc: 'ร่าเริง แจ่มใส มีพลัง' },
    { type: 'peaceful', label: 'สบายใจ', emoji: '🌿', desc: 'ผ่อนคลาย สงบนิ่ง สมดุล' },
    { type: 'neutral', label: 'ทั่วไป ปกติ', emoji: '☕', desc: 'เรื่อยๆ ราบรื่น เป็นวันปกติ' },
    { type: 'tired', label: 'เหนื่อยล้า', emoji: '😴', desc: 'หมดพลัง ต้องการพักผ่อน' },
    { type: 'stressed', label: 'เครียด กังวล', emoji: '⚡', desc: 'มีเรื่องต้องคิด หรือกดดัน' },
  ];

  const weatherOptions: Array<{ type: WeatherType; label: string; icon: React.ElementType; color: string }> = [
    { type: 'sunny', label: 'แดดสดใส', icon: Sun, color: 'text-amber-500' },
    { type: 'cloudy', label: 'มีเมฆมาก', icon: Cloud, color: 'text-slate-500' },
    { type: 'rainy', label: 'ฝนตกพรำ', icon: CloudRain, color: 'text-sky-500' },
    { type: 'cool', label: 'ลมเย็นสบาย', icon: Wind, color: 'text-teal-500' },
  ];

  const popularTags = [
    'งานสำเร็จลุล่วง',
    'ออกกำลังกาย',
    'นอนเต็มอิ่ม',
    'กินของอร่อย',
    'ได้คุยกับเพื่อน',
    'อ่านหนังสือ',
    'ได้พักผ่อน',
    'รู้สึกเพลีย',
    'งานค่อนข้างยุ่ง',
    'อากาศดีมาก',
  ];

  const handleSelectMood = (selected: MoodType) => {
    sounds.playPop();
    onUpdateMood(selected);
  };

  const handleSelectEnergy = (lvl: number) => {
    sounds.playPop();
    onUpdateEnergy(lvl);
  };

  const handleSelectWeather = (w: WeatherType) => {
    sounds.playPop();
    onUpdateWeather(w);
  };

  return (
    <div className="space-y-4">
      {/* 1. Mood Picker Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>ความรู้สึก & อารมณ์วันนี้</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              รับรู้อารมณ์ของตนเองอย่างอ่อนโยน ไม่มีถูกไม่มีผิด
            </p>
          </div>
          <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            บันทึกอัตโนมัติ 💾
          </span>
        </div>

        {/* 5 Mood Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4">
          {moods.map((item) => {
            const isSelected = mood === item.type;
            return (
              <button
                key={item.type}
                onClick={() => handleSelectMood(item.type)}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20 shadow-xs'
                    : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200/70 text-slate-700'
                }`}
              >
                <span className="text-3xl mb-1 transition-transform hover:scale-110" role="img" aria-label={item.label}>
                  {item.emoji}
                </span>
                <span className="text-xs font-bold text-slate-900">{item.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Mood Tags */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-600">
              สิ่งที่ส่งผลต่อความรู้สึกในวันนี้:
            </label>
            <span className="text-[10px] text-slate-400">เลือกได้หลายข้อ</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {popularTags.map((tag) => {
              const isTagSelected = moodTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleMoodTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    isTagSelected
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}

            {/* Custom tags added by user that are not in popularTags */}
            {moodTags
              .filter((t) => !popularTags.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleMoodTag(tag)}
                  className="px-2.5 py-1 rounded-lg text-xs transition-colors bg-rose-100 text-rose-800 border border-rose-200 font-semibold"
                >
                  #{tag} ✕
                </button>
              ))}

            {/* Add custom tag input */}
            <div className="flex items-center gap-1 ml-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customTagInput.trim()) {
                    e.preventDefault();
                    onToggleMoodTag(customTagInput.trim());
                    setCustomTagInput('');
                  }
                }}
                placeholder="+ แท็กของคุณเอง"
                className="px-2 py-0.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-rose-400 w-28"
              />
              {customTagInput.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleMoodTag(customTagInput.trim());
                    setCustomTagInput('');
                  }}
                  className="p-1 bg-rose-500 text-white rounded-md text-xs hover:bg-rose-600"
                  title="เพิ่มแท็ก"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sleep Hours & Energy & Weather Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Sleep Hours */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">เวลานอนหลับ</h4>
              <p className="text-[10px] text-slate-500">เป้าหมาย 7-8 ชม.</p>
            </div>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {[5, 6, 7, 7.5, 8, 9].map((hrs) => (
              <button
                key={hrs}
                onClick={() => {
                  sounds.playPop();
                  onUpdateSleepHours(hrs);
                }}
                className={`px-2 py-1 text-xs rounded-lg font-semibold transition-all ${
                  sleepHours === hrs
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                {hrs}h
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">ระดับพลังงานกาย</h4>
              <p className="text-[10px] text-slate-500">ความสดชื่นกระปรี้กระเปร่า</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleSelectEnergy(lvl)}
                className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all ${
                  energyLevel === lvl
                    ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ⚡ {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">สภาพอากาศวันนี้</h4>
              <p className="text-[10px] text-slate-500">บรรยากาศรอบตัว</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 py-1">
            {weatherOptions.map((w) => {
              const Icon = w.icon;
              const isSelected = weather === w.type;
              return (
                <button
                  key={w.type}
                  onClick={() => handleSelectWeather(w.type)}
                  className={`py-1 px-1 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title={w.label}
                >
                  <Icon className={`w-3.5 h-3.5 mx-auto ${w.color}`} />
                  <span className="text-[9px] block truncate mt-0.5">{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Daily Highlight (Gratitude / 1 Good Thing) */}
      <div className="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 rounded-2xl border border-amber-200/70 p-5 shadow-xs">
        <div className="pb-3 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">1 เรื่องดีๆ ของวันนี้ (Daily Gratitude)</h4>
              <p className="text-xs text-slate-500">
                เรื่องเล็กๆ ที่ทำให้ยิ้มได้ หรือเรื่องที่รู้สึกขอบคุณในวันนี้
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <input
            type="text"
            value={dailyHighlight}
            onChange={(e) => onUpdateHighlight(e.target.value)}
            placeholder="เช่น วันนี้ได้กินข้าวพร้อมหน้าครอบครัว, ทำงานโปรเจกต์เสร็จทันเวลา..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 4. Daily Journal / Notes */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">บันทึกช่วยจำ & ความในใจประจำวัน</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              พื้นที่ส่วนตัวสำหรับทบทวนสิ่งที่เกิดขึ้น จดไอเดีย หรือระบายความรู้สึก
            </p>
          </div>
          <span className="text-[11px] text-slate-400 self-end sm:self-auto tabular-nums">
            {journalNote.length} ตัวอักษร
          </span>
        </div>

        {/* Prompt starters */}
        <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">เริ่มต้นเขียน:</span>
          {[
            'วันนี้ฉันภูมิใจที่ได้...',
            'สิ่งที่ทำให้จิตใจสงบคือ...',
            'บทเรียนสำคัญวันนี้คือ...',
            'เป้าหมายที่อยากทำต่อพรุ่งนี้...',
          ].map((promptText) => (
            <button
              key={promptText}
              type="button"
              onClick={() => {
                const updated = journalNote.trim()
                  ? `${journalNote}\n${promptText} `
                  : `${promptText} `;
                onUpdateJournal(updated);
              }}
              className="px-2.5 py-1 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80 rounded-lg whitespace-nowrap transition-colors"
            >
              {promptText}
            </button>
          ))}
        </div>

        <div>
          <textarea
            value={journalNote}
            onChange={(e) => onUpdateJournal(e.target.value)}
            rows={4}
            placeholder="เขียนอะไรสั้นๆ เกี่ยวกับวันนี้ได้เลย..."
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-800 placeholder:text-slate-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
