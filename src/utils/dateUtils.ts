// Thai Date & Time utilities

export const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
export const THAI_SHORT_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_SHORT_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export function getTodayDateString(): string {
  const now = new Date();
  return formatDateToString(now);
}

export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatThaiDateFull(dateStr: string): string {
  const date = parseDateString(dateStr);
  const dayName = THAI_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = THAI_MONTHS[date.getMonth()];
  const yearBE = date.getFullYear() + 543;
  return `วัน${dayName}ที่ ${dayNum} ${monthName} ${yearBE}`;
}

export function formatThaiDateShort(dateStr: string): string {
  const date = parseDateString(dateStr);
  const dayNum = date.getDate();
  const monthShort = THAI_SHORT_MONTHS[date.getMonth()];
  return `${dayNum} ${monthShort}`;
}

export function getDayLabel(dateStr: string): string {
  const todayStr = getTodayDateString();
  const today = parseDateString(todayStr);
  const target = parseDateString(dateStr);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'วันนี้';
  if (diffDays === -1) return 'เมื่อวาน';
  if (diffDays === 1) return 'พรุ่งนี้';
  return `วัน${THAI_DAYS[target.getDay()]}`;
}

export function getSurroundingDays(centerDateStr: string, radius = 3): Array<{
  dateStr: string;
  dayShort: string;
  dayNum: number;
  isToday: boolean;
  isSelected: boolean;
}> {
  const center = parseDateString(centerDateStr);
  const todayStr = getTodayDateString();
  const days = [];

  for (let i = -radius; i <= radius; i++) {
    const d = new Date(center);
    d.setDate(center.getDate() + i);
    const dateStr = formatDateToString(d);
    days.push({
      dateStr,
      dayShort: THAI_SHORT_DAYS[d.getDay()],
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
      isSelected: dateStr === centerDateStr,
    });
  }

  return days;
}

export function getTimeGreeting(): { greeting: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: 'สวัสดีตอนเช้า', icon: 'Sun' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'สวัสดีตอนบ่าย', icon: 'SunMedium' };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: 'สวัสดีตอนเย็น', icon: 'Sunset' };
  } else {
    return { greeting: 'ราตรีสวัสดิ์ / ดึกแล้วอย่าลืมพักผ่อน', icon: 'Moon' };
  }
}
