"use client";

import { useMemo, useState } from "react";

interface IslamicEvent { month: number; day: number; title: string; desc: string; accent: string; kind: string; }

const ISLAMIC_EVENTS: IslamicEvent[] = [
  { month: 1, day: 1, title: "رأس السنة الهجرية", desc: "بداية السنة الهجرية الجديدة، ذكرى هجرة النبي ﷺ من مكة إلى المدينة المنورة.", accent: "#C9A84C", kind: "مناسبة" },
  { month: 1, day: 10, title: "يوم عاشوراء", desc: "يُستحب صيامه؛ فيه نجّى الله تعالى موسى عليه السلام وقومه من فرعون.", accent: "#228B4A", kind: "عبادة" },
  { month: 3, day: 12, title: "المولد النبوي الشريف", desc: "ذكرى مولد سيدنا محمد ﷺ في مكة المكرمة عام الفيل.", accent: "#C9A84C", kind: "مناسبة" },
  { month: 7, day: 27, title: "الإسراء والمعراج", desc: "ذكرى رحلة الإسراء من المسجد الحرام إلى المسجد الأقصى، ثم المعراج إلى السماوات العلى.", accent: "#228B4A", kind: "مناسبة" },
  { month: 8, day: 15, title: "ليلة النصف من شعبان", desc: "ليلة فضيلة يُستحب فيها الدعاء والاستغفار قبل دخول شهر رمضان.", accent: "#C9A84C", kind: "فضيلة" },
  { month: 9, day: 1, title: "بداية شهر رمضان المبارك", desc: "بداية شهر الصيام المبارك، شهر القرآن والمغفرة والرحمة.", accent: "#228B4A", kind: "عبادة" },
  { month: 9, day: 17, title: "ذكرى غزوة بدر الكبرى", desc: "أول معركة فاصلة نصر الله فيها المسلمين على المشركين في السنة الثانية للهجرة.", accent: "#8A6D2E", kind: "تاريخ" },
  { month: 9, day: 21, title: "من الليالي الوترية لليلة القدر", desc: "من العشر الأواخر التي يُتحرى فيها ليلة القدر، خير من ألف شهر.", accent: "#C9A84C", kind: "فضيلة" },
  { month: 9, day: 23, title: "من الليالي الوترية لليلة القدر", desc: "من الليالي الوترية المحتملة في العشر الأواخر من رمضان.", accent: "#C9A84C", kind: "فضيلة" },
  { month: 9, day: 25, title: "من الليالي الوترية لليلة القدر", desc: "من الليالي الوترية المحتملة في العشر الأواخر من رمضان.", accent: "#C9A84C", kind: "فضيلة" },
  { month: 9, day: 27, title: "ليلة القدر (الأرجح عند أكثر العلماء)", desc: "الليلة التي رجّحها كثير من أهل العلم أنها ليلة القدر، خير من ألف شهر.", accent: "#C9A84C", kind: "فضيلة" },
  { month: 9, day: 29, title: "من الليالي الوترية لليلة القدر", desc: "آخر الليالي الوترية المحتملة في رمضان لليلة القدر.", accent: "#C9A84C", kind: "فضيلة" },
  { month: 10, day: 1, title: "عيد الفطر المبارك", desc: "عيد المسلمين بعد إتمام صيام شهر رمضان المبارك، وإخراج زكاة الفطر.", accent: "#228B4A", kind: "عيد" },
  { month: 12, day: 8, title: "يوم التروية", desc: "أول أيام مناسك الحج، يتوجه فيه الحجاج إلى منى.", accent: "#8A6D2E", kind: "حج" },
  { month: 12, day: 9, title: "يوم عرفة", desc: "ركن الحج الأعظم، ويُستحب صيامه لغير الحاج لتكفير ذنوب سنتين.", accent: "#C9A84C", kind: "عبادة" },
  { month: 12, day: 10, title: "عيد الأضحى المبارك", desc: "عيد المسلمين ويوم النحر في مناسك الحج.", accent: "#228B4A", kind: "عيد" },
  { month: 12, day: 11, title: "أول أيام التشريق", desc: "من أيام ذكر الله والأكل والشرب، يُحرم صيامها.", accent: "#8A6D2E", kind: "حج" },
  { month: 12, day: 12, title: "ثاني أيام التشريق", desc: "من أيام التشريق المباركة بعد عيد الأضحى.", accent: "#8A6D2E", kind: "حج" },
  { month: 12, day: 13, title: "ثالث أيام التشريق", desc: "آخر أيام التشريق وختام أيام الحج.", accent: "#8A6D2E", kind: "حج" },
];

const WEEKDAYS = ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];

function toArNum(n: number | string) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

const hijriNumeric = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", { day: "numeric", month: "numeric", year: "numeric" });
const hijriArabicFull = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" });
const hijriArabicMonthYear = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", { month: "long", year: "numeric" });
const gregorianMonthYear = new Intl.DateTimeFormat("ar-SA", { month: "long", year: "numeric" });
const gregorianFull = new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric", weekday: "long" });

function getHijriParts(d: Date) {
  const parts = hijriNumeric.formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { day: get("day"), month: get("month"), year: get("year") };
}

function findEvent(month: number, day: number) {
  return ISLAMIC_EVENTS.find((e) => e.month === month && e.day === day);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function HijriCalendar({ onBack }: { onBack?: () => void }) {
  const [viewDate, setViewDate] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState<Date>(() => new Date());
  const today = useMemo(() => new Date(), []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const leadingBlanks = (firstWeekday + 1) % 7;

  const cells = useMemo(() => {
    const arr: { date: Date; hDay: number; hMonth: number; event?: IslamicEvent }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const h = getHijriParts(date);
      arr.push({ date, hDay: h.day, hMonth: h.month, event: findEvent(h.month, h.day) });
    }
    return arr;
  }, [year, month]);

  const firstHijri = cells[0] ? hijriArabicMonthYear.format(cells[0].date) : "";
  const lastHijri = cells[cells.length - 1] ? hijriArabicMonthYear.format(cells[cells.length - 1].date) : "";
  const hijriLabel = firstHijri === lastHijri ? firstHijri : `${firstHijri} – ${lastHijri}`;

  const upcoming = useMemo(() => {
    const list: { date: Date; event: IslamicEvent; daysAway: number }[] = [];
    const seen = new Set<string>();
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 380; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const h = getHijriParts(d);
      const ev = findEvent(h.month, h.day);
      if (ev && !seen.has(ev.title)) {
        seen.add(ev.title);
        list.push({ date: d, event: ev, daysAway: i });
      }
      if (list.length >= 8) break;
    }
    return list;
  }, []);

  const selectedHijri = getHijriParts(selected);
  const selectedEvent = findEvent(selectedHijri.month, selectedHijri.day);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => { const d = new Date(); d.setDate(1); setViewDate(d); setSelected(new Date()); };

  return (
    <div style={{ minHeight: "100vh", background: "#050C16", color: "#F5ECD7" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        {onBack && (
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className="flex-1">
          <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 20, fontWeight: 700 }}>التقويم الهجري</h2>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, marginTop: 2 }}>المناسبات والأشهر الإسلامية المباركة</p>
        </div>
        <button onClick={goToday}
          className="px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex-shrink-0"
          style={{ background: "rgba(27,107,58,0.12)", border: "1px solid rgba(27,107,58,0.3)", color: "#4ADE80", fontFamily: "'Tajawal', sans-serif", fontSize: 10.5 }}>
          اليوم
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Month navigator */}
        <div className="flex items-center justify-between mb-4 rounded-2xl p-3.5"
          style={{ background: "rgba(10,18,32,0.75)", border: "1px solid rgba(201,168,76,0.14)" }}>
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
            style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="text-center">
            <p style={{ fontFamily: "'Amiri', serif", color: "#E2C47A", fontSize: 16, fontWeight: 700 }}>{hijriLabel} هـ</p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 11, marginTop: 2 }}>{gregorianMonthYear.format(viewDate)} م</p>
          </div>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
            style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* Weekday row */}
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center" style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 10 }}>{w}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
          {cells.map((c) => {
            const isToday = isSameDay(c.date, today);
            const isSelected = isSameDay(c.date, selected);
            return (
              <button key={c.date.toISOString()} onClick={() => setSelected(c.date)}
                className="aspect-square flex flex-col items-center justify-center rounded-xl relative active:scale-90 transition-transform"
                style={{
                  background: isSelected ? "rgba(201,168,76,0.16)" : c.event ? `${c.event.accent}0E` : "rgba(255,255,255,0.015)",
                  border: isSelected ? "1.5px solid rgba(201,168,76,0.55)" : isToday ? "1px solid rgba(74,222,128,0.45)" : "1px solid rgba(201,168,76,0.05)",
                }}>
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: isToday ? "#4ADE80" : "#5A4A38", fontSize: 8.5, position: "absolute", top: 3 }}>
                  {toArNum(c.date.getDate())}
                </span>
                <span style={{ fontFamily: "'Amiri', serif", color: isSelected ? "#E2C47A" : "#C8B890", fontSize: 14, fontWeight: 700, marginTop: 3 }}>
                  {toArNum(c.hDay)}
                </span>
                {c.event && (
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.event.accent, position: "absolute", bottom: 4 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        <div className="mt-4 rounded-2xl p-4" style={{
          background: selectedEvent ? `linear-gradient(140deg, ${selectedEvent.accent}10, rgba(8,14,26,0.97))` : "rgba(10,18,32,0.75)",
          border: `1px solid ${selectedEvent ? `${selectedEvent.accent}30` : "rgba(201,168,76,0.12)"}`,
        }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 10.5 }}>{gregorianFull.format(selected)}</p>
          <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700, marginTop: 4 }}>{hijriArabicFull.format(selected)} هـ</p>
          {selectedEvent ? (
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${selectedEvent.accent}20` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full" style={{ background: `${selectedEvent.accent}18`, color: selectedEvent.accent, fontFamily: "'Tajawal', sans-serif", fontSize: 9.5 }}>
                  {selectedEvent.kind}
                </span>
              </div>
              <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700 }}>{selectedEvent.title}</p>
              <p className="mt-1.5" style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 12, lineHeight: 1.7 }}>{selectedEvent.desc}</p>
            </div>
          ) : (
            <p className="mt-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A38", fontSize: 11.5 }}>لا توجد مناسبة إسلامية مسجلة في هذا اليوم.</p>
          )}
        </div>

        {/* Upcoming events */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="section-bar" style={{ height: 18 }} />
              <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 16, fontWeight: 700 }}>المناسبات القادمة</h3>
            </div>
            <div className="ornament-line flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            {upcoming.map((u, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: "rgba(10,18,32,0.72)", border: "1px solid rgba(201,168,76,0.08)" }}>
                <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: `${u.event.accent}12`, border: `1px solid ${u.event.accent}28` }}>
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: u.event.accent, fontSize: 13, fontWeight: 700 }}>
                    {u.daysAway === 0 ? "اليوم" : toArNum(u.daysAway)}
                  </span>
                  {u.daysAway > 0 && <span style={{ fontFamily: "'Tajawal', sans-serif", color: u.event.accent, fontSize: 7.5, opacity: 0.8 }}>يوم</span>}
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#E2D8B8", fontSize: 12.5, fontWeight: 600 }}>{u.event.title}</p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 10, marginTop: 1 }}>{gregorianFull.format(u.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
