import React, { useState } from 'react';
import { X, AlertCircle, Copy, Check, ExternalLink, ShieldAlert, KeyRound } from 'lucide-react';

interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorCode?: string;
  errorMessage?: string;
  domain?: string;
}

export const AuthErrorModal: React.FC<AuthErrorModalProps> = ({
  isOpen,
  onClose,
  errorCode = '',
  errorMessage = '',
  domain = typeof window !== 'undefined' ? window.location.hostname : '',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isUnauthorizedDomain = errorCode.includes('unauthorized-domain');
  const isPopupBlocked = errorCode.includes('popup-blocked');
  const isPopupClosed = errorCode.includes('popup-closed-by-user');

  const handleCopyDomain = () => {
    if (domain) {
      navigator.clipboard.writeText(domain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">แจ้งเตือนการเข้าสู่ระบบ Google</h3>
              <p className="text-[11px] text-rose-600 font-medium">{errorCode || 'Auth Error'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-700 leading-relaxed">
          {isUnauthorizedDomain ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  สาเหตุ: โดเมนยังไม่ได้รับอนุญาตใน Firebase Console
                </p>
                <p className="text-amber-800 text-[11px]">
                  เมื่อนำเว็บขึ้นโฮสติ้งใหม่ (เช่น Vercel) จำเป็นต้องเพิ่มชื่อโดเมนลงใน <b>Authorized domains</b> ของ Firebase เพื่อความปลอดภัยในการล็อกอิน Google
                </p>
              </div>

              {/* Domain Copy Box */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  โดเมนปัจจุบันของคุณที่ต้องนำไปเพิ่ม:
                </label>
                <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200 font-mono text-xs">
                  <span className="flex-1 font-bold text-slate-800 truncate">{domain}</span>
                  <button
                    onClick={handleCopyDomain}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 active:scale-95 transition-all shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกโดเมน</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step instructions */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 text-[11px]">วิธีแก้ไข (ทำเพียงครั้งเดียว):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                  <li>ไปที่ <b>Firebase Console</b> ของคุณ</li>
                  <li>เลือกเมนู <b>Authentication</b> &rarr; <b>Settings</b> &rarr; <b>Authorized domains</b></li>
                  <li>คลิก <b>Add domain</b> แล้ววาง <code>{domain}</code> ลงไป</li>
                  <li>กดยืนยัน แล้วกลับมากด Login ด้วย Gmail อีกครั้งได้ทันที!</li>
                </ol>
              </div>
            </div>
          ) : isPopupBlocked ? (
            <div className="space-y-2">
              <p className="font-bold text-slate-900">เบราว์เซอร์บล็อกหน้าต่าง Pop-up</p>
              <p>โปรดเปิดใช้งานอนุญาตให้แสดง Pop-up ในการตั้งค่าของเบราว์เซอร์ เพื่อให้หน้าต่างเข้าสู่ระบบของ Google สามารถเปิดขึ้นมาได้</p>
            </div>
          ) : isPopupClosed ? (
            <div className="space-y-2">
              <p className="font-bold text-slate-900">ยกเลิกการเข้าสู่ระบบ</p>
              <p>หน้าต่างเข้าสู่ระบบ Google ถูกปิดก่อนทำรายการเสร็จสิ้น คุณสามารถคลิกเข้าสู่ระบบใหม่ได้ทุกเมื่อ</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-bold text-slate-900">เกิดข้อผิดพลาดในการเชื่อมต่อ:</p>
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 font-mono text-[11px] break-all text-slate-700">
                {errorMessage || 'Unknown authentication error'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500">
            *คุณยังสามารถใช้งาน บันทึกกิจวัตร และสำรองข้อมูลลงเครื่องได้ตามปกติ
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
