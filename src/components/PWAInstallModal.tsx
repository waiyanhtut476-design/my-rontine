import React from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with App Logo Preview */}
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Showcase */}
          <div className="mx-auto w-24 h-24 rounded-2xl shadow-xl overflow-hidden border-2 border-white/40 bg-white mb-3 p-0.5 transform hover:scale-105 transition-transform">
            <img
              src="/apple-touch-icon.png"
              alt="วันสุข App Icon"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">เพิ่มแอป "วันสุข" ลงหน้าจอโฮม</h3>
          <p className="text-xs text-amber-100 mt-1 max-w-xs mx-auto">
            ใช้งานเต็มจอ รวดเร็ว เสมือนแอปแท้บน iOS & Android โดยไม่ต้องโหลดจาก Store
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {isInstalled ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">แอป "วันสุข" ติดตั้งอยู่บนหน้าจอของคุณแล้ว</p>
              <p className="text-xs text-emerald-700">คุณสามารถเปิดใช้งานจากไอคอนบนหน้าจอหลักได้ตลอดเวลา</p>
            </div>
          ) : isInstallable ? (
            /* Android / Chrome 1-Click Install */
            <div className="space-y-3">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>แตะเพื่อติดตั้งลงหน้าจอโฮมทันที</span>
              </button>
              <p className="text-[11px] text-center text-slate-400">
                ระบบจะสร้างไอคอน "วันสุข" สวยงามบนหน้าจอ Android / คอมพิวเตอร์ของคุณ
              </p>
            </div>
          ) : null}

          {/* iOS Safari Step-by-Step Instructions */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">
                🍏
              </span>
              <span>วิธีเพิ่มลงหน้าจอโฮมสำหรับ iPhone / iPad (iOS Safari)</span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-600 pl-1">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  เปิดหน้านี้ด้วย <strong>Safari</strong> แล้วแตะปุ่ม <strong>แชร์ (Share)</strong>{' '}
                  <Share2 className="w-3.5 h-3.5 inline text-sky-600" /> ที่แถบด้านล่างของหน้าจอ
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  เลื่อนรายการลงมา แล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  แตะ <strong>"เพิ่ม" (Add)</strong> ที่มุมขวาบน จะได้ไอคอน "วันสุข" สวยงามบนหน้าจอโฮมทันที
                </span>
              </li>
            </ol>
          </div>

          {/* Android Chrome Instructions */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">
                🤖
              </span>
              <span>วิธีเพิ่มลงหน้าจอโฮมสำหรับ Android (Chrome)</span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-600 pl-1">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  แตะที่ปุ่มเมนู <strong>จุดสามจุด (⋮)</strong> ที่มุมขวาบนของ Google Chrome
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  เลือก <strong>"เพิ่มลงในหน้าจอหลัก" (Add to Home screen)</strong> หรือ <strong>"ติดตั้งแอป" (Install app)</strong>
                </span>
              </li>
            </ol>
          </div>

          {/* Download Raw Logo Assets Option */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>ต้องการไฟล์ภาพโลโก้เก็บไว้?</span>
            <div className="flex items-center gap-2">
              <a
                href="/apple-touch-icon.png"
                download="wansook-logo-ios.png"
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                title="ดาวน์โหลดรูปไอคอน iOS 180x180"
              >
                โหลด iOS (180px)
              </a>
              <a
                href="/pwa-512x512.png"
                download="wansook-logo-512.png"
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                title="ดาวน์โหลดรูปไอคอน Android 512x512"
              >
                โหลด Android (512px)
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
