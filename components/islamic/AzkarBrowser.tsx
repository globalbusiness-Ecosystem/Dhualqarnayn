"use client";

import { useEffect, useMemo, useState } from "react";
import { AZKAR_CATEGORIES, AZKAR, toArabicDigits, type Zikr } from "@/lib/azkar-data";
import { azkarProgressStore, markCategoryCompleted, todayKey, type AzkarProgress } from "@/lib/azkar-store";
import { playTapSound, playCompleteSound, primeAudio } from "@/lib/tap-sound";
import ShareButton from "./ShareButton";

interface Props {
  onBack: () => void;
}

export default function AzkarBrowser({ onBack }: Props) {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [progress, setProgress] = useState<AzkarProgress>(azkarProgressStore.getState());
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => {
    azkarProgressStore.load();
    return azkarProgressStore.subscribe(setProgress);
  }, []);

  const favorites = progress.favorites;

  const toggleFavorite = (id: number) => {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    azkarProgressStore.update({ favorites: next });
  };

  const tap = (id: number, target: number) => {
    primeAudio();
    setCounts((prev) => {
      const next = (prev[id] ?? 0) + 1;
      if (next >= target) {
        playCompleteSound();
        return { ...prev, [id]: target };
      }
      playTapSound();
      return { ...prev, [id]: next };
    });
  };

  const resetZikr = (id: number) => {
    primeAudio();
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };
  const today = todayKey();

  const filtered: Zikr[] = useMemo(() => {
    let list = AZKAR;
    if (showFavOnly) list = list.filter((z) => favorites.includes(z.id));
    if (activeCat) list = list.filter((z) => z.categoryId === activeCat);
    if (search.trim()) {
      const q = search.trim();
      list = list.filter((z) => z.text.includes(q) || z.source.includes(q));
    }
    return list;
  }, [activeCat, search, showFavOnly, favorites]);

  const showingList = activeCat !== null || search.trim().length > 0 || showFavOnly;
  const activeCategory = AZKAR_CATEGORIES.find((c) => c.id === activeCat);
  const categoryCompletedToday = activeCategory ? progress.completedToday[activeCategory.id] === today : false;

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      <div
        className="sticky top-0 z-20"
        style={{ background: "rgba(5,12,22,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(201,168,76,0.18)" }}
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => {
              if (showingList) {
                setActiveCat(null);
                setSearch("");
              } else {
                onBack();
              }
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 active:scale-90 transition-transform"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.22)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 21, fontWeight: 700, lineHeight: 1 }}>
              {activeCategory ? activeCategory.name : "الأذكار"}
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 10.5, marginTop: 2 }}>
              {activeCategory ? activeCategory.desc : "أذكار مأثورة صحيحة من القرآن والسنة"}
            </p>
          </div>
          <div
            style={{
              width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.26)", fontSize: 17,
            }}
          >
            {activeCategory ? activeCategory.icon : "۞"}
          </div>
        </div>

        <div className="px-4 pb-3 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 rounded-xl flex-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.16)", height: 38 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCat(null); }}
              placeholder="ابحث في الأذكار..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Tajawal', sans-serif", color: "#E8D5A8", fontSize: 12.5, direction: "rtl", textAlign: "right" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "rgba(201,168,76,0.5)", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>
          <button
            onClick={() => { setShowFavOnly((v) => !v); setActiveCat(null); setSearch(""); }}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            style={{
              background: showFavOnly ? "rgba(232,201,106,0.16)" : "rgba(201,168,76,0.08)",
              border: `1px solid ${showFavOnly ? "rgba(232,201,106,0.5)" : "rgba(201,168,76,0.2)"}`,
            }}
            aria-label="عرض المفضلة فقط"
          >
            <span style={{ fontSize: 15, color: showFavOnly ? "#E8C96A" : "rgba(201,168,76,0.5)" }}>★</span>
          </button>
        </div>
      </div>

      {!showingList && (
        <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
          <p style={{ fontFamily: "'Amiri', serif", color: "rgba(201,168,76,0.4)", fontSize: 13, lineHeight: 1.7, flex: 1 }}>
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
          </p>
          {progress.streak > 0 && (
            <span className="px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(27,107,58,0.12)", border: "1px solid rgba(27,107,58,0.3)" }}>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#3FAE6E", fontSize: 10.5, fontWeight: 700 }}>
                🔥 {toArabicDigits(progress.streak)} يوم
              </span>
            </span>
          )}
        </div>
      )}

      {!showingList && (
        <div className="px-4 py-4 grid grid-cols-2 gap-2.5">
          {AZKAR_CATEGORIES.map((cat) => {
            const count = AZKAR.filter((z) => z.categoryId === cat.id).length;
            const doneToday = progress.completedToday[cat.id] === today;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="relative text-right rounded-2xl p-4 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))", border: `1px solid ${doneToday ? `${cat.accent}50` : `${cat.accent}20`}` }}
              >
                {doneToday && (
                  <span className="absolute top-2.5 left-2.5" style={{ color: cat.accent, fontSize: 13 }}>✓</span>
                )}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${cat.accent}10`, border: `1px solid ${cat.accent}22`, fontSize: 15 }}>
                  {cat.icon}
                </div>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: cat.accent, fontSize: 12.5, fontWeight: 700 }}>{cat.name}</p>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A5040", fontSize: 10, marginTop: 2 }}>{toArabicDigits(count)} أذكار</p>
              </button>
            );
          })}
        </div>
      )}

      {showingList && (
        <div className="px-4 py-4 pb-24 flex flex-col gap-3">
          {activeCategory && !categoryCompletedToday && (
            <button
              onClick={() => markCategoryCompleted(activeCategory.id)}
              className="w-full py-2.5 rounded-xl text-center active:scale-95 transition-transform"
              style={{ background: `${activeCategory.accent}12`, border: `1px solid ${activeCategory.accent}38` }}
            >
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: activeCategory.accent, fontSize: 12, fontWeight: 700 }}>
                ✓ تحديد «{activeCategory.name}» كمكتملة اليوم
              </span>
            </button>
          )}
          {activeCategory && categoryCompletedToday && (
            <div className="w-full py-2.5 rounded-xl text-center" style={{ background: "rgba(27,107,58,0.1)", border: "1px solid rgba(27,107,58,0.3)" }}>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#3FAE6E", fontSize: 12, fontWeight: 700 }}>
                ✓ أتممت هذا الذكر اليوم، بارك الله فيك
              </span>
            </div>
          )}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#3A2E18", fontSize: 14 }}>
                {showFavOnly ? "لم تُضف أذكاراً للمفضلة بعد" : "لا توجد نتائج"}
              </p>
            </div>
          )}
          {filtered.map((z) => {
            const cat = AZKAR_CATEGORIES.find((c) => c.id === z.categoryId);
            const accent = cat?.accent ?? "#C9A84C";
            const current = counts[z.id] ?? 0;
            const done = z.count > 1 && current >= z.count;
            const isFav = favorites.includes(z.id);
            return (
              <div key={z.id} className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.9))", border: `1px solid ${done ? `${accent}3A` : "rgba(201,168,76,0.09)"}` }}>
                <div className="p-4" style={{ direction: "rtl" }}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {cat && (
                      <span className="px-2 py-0.5 rounded-md" style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 9.5, fontWeight: 700, background: `${accent}14`, color: accent, border: `1px solid ${accent}2A` }}>
                        {cat.icon} {cat.name}
                      </span>
                    )}
                    <button onClick={() => toggleFavorite(z.id)} className="mr-auto" style={{ fontSize: 15, color: isFav ? "#E8C96A" : "rgba(201,168,76,0.25)" }} aria-label="إضافة للمفضلة">
                      {isFav ? "★" : "☆"}
                    </button>
                  </div>

                  <p style={{ fontFamily: "'Amiri', serif", color: "#E8D5A8", fontSize: 16, lineHeight: 2 }}>{z.text}</p>

                  {z.virtue && (
                    <p className="mt-2.5" style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 11, lineHeight: 1.7 }}>
                      <span style={{ color: accent, fontWeight: 700 }}>الفضل: </span>{z.virtue}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A5040", fontSize: 10.5 }}>{z.source}</span>
                      <ShareButton
                        compact
                        data={{
                          kindLabel: "ذِكر مأثور",
                          arabicText: z.text,
                          translation: z.virtue,
                          footer: z.source,
                          accent,
                        }}
                      />
                    </div>
                    {z.count <= 1 && (
                      <span className="px-2 py-0.5 rounded-md" style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 9.5, background: "rgba(255,255,255,0.03)", color: "#8A7858", border: "1px solid rgba(201,168,76,0.1)" }}>
                        مرة واحدة
                      </span>
                    )}
                  </div>
                  {z.count > 1 && (
                    <button
                      onClick={() => tap(z.id, z.count)}
                      className="relative w-full mt-3 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
                      style={{
                        padding: "14px 16px",
                        background: done ? `linear-gradient(135deg, ${accent}22, ${accent}12)` : "rgba(255,255,255,0.025)",
                        border: `1.5px solid ${accent}${done ? "55" : "22"}`,
                      }}
                      aria-label="مساحة العد — اضغط للعدّ"
                    >
                      <div className="absolute inset-0" style={{ background: `${accent}10`, width: `${Math.min(current / z.count, 1) * 100}%`, transition: "width 0.18s ease" }} />
                      <div className="relative flex items-center justify-between">
                        <span style={{ fontFamily: "'Tajawal', sans-serif", color: done ? accent : "#8A7858", fontSize: 11.5, fontWeight: 600 }}>
                          {done ? "أحسنت، تم الإكمال ✓ — اضغط لإعادة العد" : "مساحة العد — اضغط هنا"}
                        </span>
                        <span style={{ fontFamily: "'Tajawal', sans-serif", color: accent, fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>
                          {toArabicDigits(current)}<span style={{ color: `${accent}60`, fontSize: 14, fontWeight: 400 }}> / {toArabicDigits(z.count)}</span>
                        </span>
                      </div>
                      <div className="relative rounded-full overflow-hidden mt-2" style={{ height: 4, background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(current / z.count, 1) * 100}%`, background: `linear-gradient(90deg, ${accent}70, ${accent})`, transition: "width 0.18s ease" }} />
                      </div>
                    </button>
                  )}
                  {done && (
                    <button onClick={(e) => { e.stopPropagation(); resetZikr(z.id); }} className="w-full mt-2 py-1.5 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.08)" }}>
                      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 10.5 }}>إعادة العد من الصفر</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
