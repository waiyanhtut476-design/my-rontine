export interface QuoteItem {
  id: number;
  text: string;
  author: string;
  category: 'growth' | 'peace' | 'gratitude' | 'health' | 'courage';
}

export const DAILY_QUOTES: QuoteItem[] = [
  {
    id: 1,
    text: 'ก้าวเล็กๆ ที่ทำอย่างสม่ำเสมอ ย่อมนำไปสู่ความเปลี่ยนแปลงที่ยิ่งใหญ่',
    author: 'ข้อคิดสร้างวินัย',
    category: 'growth',
  },
  {
    id: 2,
    text: 'วันนี้ไม่จำเป็นต้องสมบูรณ์แบบ แค่ใจดีกับตัวเองและทำทีละอย่างก็เก่งมากแล้ว',
    author: 'ความเมตตาต่อตนเอง',
    category: 'peace',
  },
  {
    id: 3,
    text: 'ความสุขมักไม่ได้อยู่ที่เรื่องยิ่งใหญ่ แต่อยู่ในกาแฟอุ่นๆ และรอยยิ้มเล็กๆ ของวันนี้',
    author: 'ความสุขที่เรียบง่าย',
    category: 'gratitude',
  },
  {
    id: 4,
    text: 'การพักผ่อนไม่ใช่การเสียเวลา แต่เป็นการชาร์จพลังเพื่อก้าวต่อไปอย่างมั่นคง',
    author: 'การดูแลตนเอง',
    category: 'health',
  },
  {
    id: 5,
    text: 'อย่าเปรียบเทียบจังหวะชีวิตตัวเองกับใคร ทุกคนมีเส้นทางและเวลาผลิบานของตัวเอง',
    author: 'ความสงบในใจ',
    category: 'peace',
  },
  {
    id: 6,
    text: 'ทุกวันที่ตื่นขึ้นมา คือโอกาสใหม่ในการเริ่มต้นทำสิ่งดีๆ ให้กับตัวเรา',
    author: 'พลังบวกยามเช้า',
    category: 'growth',
  },
  {
    id: 7,
    text: 'หายใจเข้าลึกๆ ยิ้มให้ตัวเองหนึ่งครั้ง แล้วค่อยๆ เดินหน้าไปด้วยความสบายใจ',
    author: 'สติและความผ่อนคลาย',
    category: 'peace',
  },
  {
    id: 8,
    text: 'สิ่งสำคัญไม่ใช่การเดินให้เร็วที่สุด แต่อยู่ที่การไม่หยุดก้าวไปข้างหน้า',
    author: 'ความเพียรพยายาม',
    category: 'courage',
  },
  {
    id: 9,
    text: 'ดื่มน้ำหนึ่งแก้ว ยืดเหยียดร่างกาย แล้วขอบคุณตัวเองที่พยายามมาตลอด',
    author: 'สุขภาพและความรักตัวเอง',
    category: 'health',
  },
  {
    id: 10,
    text: 'ไม่ว่าเมื่อวานจะเป็นอย่างไร วันนี้คือหน้ากระดาษแผ่นใหม่ที่คุณเขียนเองได้',
    author: 'การเริ่มต้นใหม่',
    category: 'growth',
  },
  {
    id: 11,
    text: 'มองหาความสุขในสิ่งรอบตัว แล้วคุณจะพบว่ามีความสุขมากมายซ่อนอยู่ในทุกๆ วัน',
    author: 'พลังแห่งความสำนึกคุณ',
    category: 'gratitude',
  },
  {
    id: 12,
    text: 'ความกล้าหาญไม่ได้แปลว่าไม่กลัว แต่คือการลงมือทำทั้งที่ยังตื่นเต้นอยู่',
    author: 'ความกล้าก้าวข้าม',
    category: 'courage',
  },
  {
    id: 13,
    text: 'ปล่อยวางสิ่งที่เราควบคุมไม่ได้ แล้วทุ่มเทให้กับสิ่งที่เราทำได้ในตอนนี้',
    author: 'ความสมดุลทางอารมณ์',
    category: 'peace',
  },
  {
    id: 14,
    text: 'การดื่มด่ำกับช่วงเวลาปัจจุบัน คือของขวัญที่ดีที่สุดที่คุณมอบให้ชีวิตได้',
    author: 'การอยู่กับปัจจุบัน',
    category: 'peace',
  },
  {
    id: 15,
    text: 'วินัยคือสะพานเชื่อมระหว่างเป้าหมายกับความจริง ค่อยๆ ทำทีละนิดในทุกๆ วัน',
    author: 'วินัยสร้างความสำเร็จ',
    category: 'growth',
  },
];

export function getDailyQuote(dateStr: string): QuoteItem {
  // Deterministic seed based on date string YYYY-MM-DD
  const sum = dateStr
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = sum % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}

export function getRandomQuote(excludeId?: number): QuoteItem {
  const filtered = excludeId !== undefined ? DAILY_QUOTES.filter((q) => q.id !== excludeId) : DAILY_QUOTES;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
