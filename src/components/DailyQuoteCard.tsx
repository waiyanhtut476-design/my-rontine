import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw, Copy, Check, Heart, Sparkles } from 'lucide-react';
import { QuoteItem, getDailyQuote, getRandomQuote } from '../utils/quotes';
import { sounds } from '../utils/audio';

interface DailyQuoteCardProps {
  selectedDate: string;
}

export const DailyQuoteCard: React.FC<DailyQuoteCardProps> = ({ selectedDate }) => {
  const [currentQuote, setCurrentQuote] = useState<QuoteItem>(() => getDailyQuote(selectedDate));
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Update quote when date changes
  useEffect(() => {
    setCurrentQuote(getDailyQuote(selectedDate));
    setCopied(false);
    setIsLiked(false);
  }, [selectedDate]);

  const handleShuffle = () => {
    sounds.playPop();
    const next = getRandomQuote(currentQuote.id);
    setCurrentQuote(next);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      sounds.playPop();
      await navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleToggleLike = () => {
    sounds.playPop();
    setIsLiked((prev) => !prev);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-amber-100/40 rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-xs relative overflow-hidden">
      {/* Decorative background quote watermark */}
      <Quote
        className="absolute -right-2 -bottom-3 w-24 h-24 text-amber-200/35 pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Header tag and action buttons */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-200/60">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>ข้อคิดพลังบวกประจำวัน</span>
            <span aria-hidden="true" className="text-amber-300">·</span>
            <span className="text-[11px] font-normal text-amber-700">{currentQuote.author}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-amber-800 border border-amber-200/60 text-xs transition-colors flex items-center gap-1"
              title="คัดลอกข้อคิด"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] text-emerald-700 font-semibold hidden sm:inline">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">คัดลอก</span>
                </>
              )}
            </button>

            {/* Favorite button */}
            <button
              onClick={handleToggleLike}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white/80 hover:bg-white text-amber-800 border-amber-200/60'
              }`}
              title={isLiked ? 'ถูกใจแล้ว' : 'กดถูกใจ'}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Shuffle button */}
            <button
              onClick={handleShuffle}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-amber-800 border border-amber-200/60 text-xs transition-colors flex items-center gap-1"
              title="สุ่มข้อคิดใหม่"
            >
              <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-300" />
              <span className="text-[10px] hidden sm:inline">เปลี่ยน</span>
            </button>
          </div>
        </div>

        {/* Quote Prose */}
        <div className="pt-1">
          <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed italic">
            "{currentQuote.text}"
          </p>
        </div>
      </div>
    </div>
  );
};
