import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import {
  formatThaiDateFull,
  getDayLabel,
  getSurroundingDays,
  getTodayDateString,
  getTimeGreeting,
  parseDateString,
  formatDateToString,
} from '../utils/dateUtils';

interface DateCarouselProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  userName: string;
}

export const DateCarousel: React.FC<DateCarouselProps> = ({
  selectedDate,
  onSelectDate,
  userName,
}) => {
  const days = getSurroundingDays(selectedDate, 3);
  const todayStr = getTodayDateString();
  const isSelectedToday = selectedDate === todayStr;
  const timeGreeting = getTimeGreeting();

  const handlePrevDay = () => {
    const d = parseDateString(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(formatDateToString(d));
  };

  const handleNextDay = () => {
    const d = parseDateString(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(formatDateToString(d));
  };

  const handleJumpToday = () => {
    onSelectDate(todayStr);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
      {/* Top row: Greeting & Full Thai Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{timeGreeting.greeting}, {userName || 'คุณ'}!</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-700 font-semibold">{getDayLabel(selectedDate)}</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {formatThaiDateFull(selectedDate)}
          </h1>
        </div>

        {/* Action: Today shortcut */}
        <div className="flex items-center gap-2">
          {!isSelectedToday && (
            <button
              onClick={handleJumpToday}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 rounded-lg transition-colors whitespace-nowrap"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>กลับมาวันนี้</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
              title="วันก่อนหน้า"
              aria-label="วันก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
              title="วันถัดไป"
              aria-label="วันถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Date selector pills/carousel */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-3 overflow-x-auto pb-1">
        {days.map((item) => {
          const isSelected = item.isSelected;
          const isToday = item.isToday;

          return (
            <button
              key={item.dateStr}
              onClick={() => onSelectDate(item.dateStr)}
              className={`flex-1 min-w-[46px] max-w-[80px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/50'
              }`}
            >
              <span
                className={`text-[11px] font-medium leading-none ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {item.dayShort}
              </span>
              <span className="text-base sm:text-lg font-bold tabular-nums mt-1 leading-none">
                {item.dayNum}
              </span>
              {isToday && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                    isSelected ? 'bg-amber-400' : 'bg-amber-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
