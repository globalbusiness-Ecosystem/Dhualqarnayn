"use client";

import { useEffect, useMemo, useState } from "react";
import { TAFSIR_DATA, type TafsirEntry } from "@/lib/tafsir-data";
import {
  getImams,
  getSurahAyahs,
  getAyahTafsir,
  type TafsirImam,
  type AyahText,
} from "@/lib/tafsir-imams";
import { useLanguage } from "@/contexts/language-context";
import ShareButton from "./ShareButton";
import VoiceSearchButton from "./VoiceSearchButton";

interface Props {
  onBack: () => void;
}

function ImamsTafsirSection({ surah, isAr }: { surah: TafsirEntry; isAr: boolean }) {
  const [imams, setImams] = useState<TafsirImam[] | null>(null);
  const [imamsError, setImamsError] = useState(false);
  const [imamId, setImamId] = useState<number | null>(null);

  const [ayahs, setAyahs] = useState<AyahText[] | null>(null);
  const [ayahsError, setAyahsError] = useState(false);
  const [ayahsLoading, setAyahsLoading] = useState(true);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [tafsirByKey, setTafsirByKey] = useState<Record<string, string>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getImams()
      .then((list) => {
        if (!alive) return;
        setImams(list);
        if (list.length) setImamId(list[0].id);
      })
      .catch(() => alive && setImamsError(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    setAyahsLoading(true);
    setAyahsError(false);
    getSurahAyahs(surah.number)
      .then((list) => alive && setAyahs(list))
      .catch(() => alive && setAyahsError(true))
      .finally(() => alive && setAyahsLoading(false));
    return () => {
      alive = false;
    };
  }, [surah.number]);

  const loadTafsir = (ayahNumber: number) => {
    if (imamId == null) return;
    const key = `${imamId}:${surah.number}:${ayahNumber}`;
    if (tafsirByKey[key]) return;
    setLoadingKey(key);
    setErrorKey(null);
    getAyahTafsir(imamId, surah.number, ayahNumber)
      .then((text) => setTafsirByKey((prev) => ({ ...prev, [key]: text })))
      .catch(() => setErrorKey(key))
      .finally(() => setLoadingKey((k) => (k === key ? null : k)));
  };

  const toggleAyah = (ayahNumber: number) => {
    const next = expanded === ayahNumber ? null : ayahNumber;
    setExpanded(next);
    if (next != null) loadTafsir(next);
  };

  const selectedImam = imams?.find((i) => i.id === imamId) || null;

  return (
    <div>
      {/* Imam picker */}
      <div className="mb-3">
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, marginBottom: 6 }}>
          {isAr ? "اختر الإمام / المصدر" : "Choose a scholar / source"}
        </p>
        {imamsError ? (
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B06A52", fontSize: 11 }}>
            {isAr ? "تعذر تحميل قائمة الأئمة. تحقق من الاتصال." : "Could not load the list of scholars."}
          </p>
        ) : !imams ? (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-8 w-20 rounded-full animate-pulse" style={{ background: "rgba(201,168,76,0.08)" }} />
            ))}
          </div>
        ) : (
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {imams.map((imam) => (
              <button
                key={imam.id}
                onClick={() => {
                  setImamId(imam.id);
                  if (expanded != null) {
                    const key = `${imam.id}:${surah.number}:${expanded}`;
                    if (!tafsirByKey[key]) loadTafsir(expanded);
                  }
                }}
                className="px-3 py-1.5 rounded-full flex-shrink-0 active:scale-95"
                style={{
                  fontFamily: "'Tajawal', sans-serif",
                  fontSize: 11,
                  whiteSpace: "nowrap",
                  background: imamId === imam.id ? "rgba(201,168,76,0.16)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${imamId === imam.id ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.08)"}`,
                  color: imamId === imam.id ? "#C9A84C" : "#6A5A48",
                  fontWeight: imamId === imam.id ? 700 : 400,
                }}
              >
                {imam.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ayah list */}
      {ayahsLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(201,168,76,0.05)" }} />
          ))}
        </div>
      ) : ayahsError ? (
        <div className="py-8 text-center">
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B06A52", fontSize: 12, marginBottom: 10 }}>
            {isAr ? "تعذر تحميل آيات السورة." : "Could not load the surah's verses."}
          </p>
          <button
            onClick={() => {
              setAyahsLoading(true);
              setAyahsError(false);
              getSurahAyahs(surah.number)
                .then(setAyahs)
                .catch(() => setAyahsError(true))
                .finally(() => setAyahsLoading(false));
            }}
            className="px-4 py-2 rounded-xl active:scale-95"
            style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#C9A84C", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            {isAr ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ayahs?.map((ayah) => {
            const key = imamId != null ? `${imamId}:${surah.number}:${ayah.numberInSurah}` : "";
            const isOpen = expanded === ayah.numberInSurah;
            const text = tafsirByKey[key];
            const isLoading = loadingKey === key;
            const hasError = errorKey === key;
            return (
              <div key={ayah.numberInSurah} className="rounded-2xl overflow-hidden"
                style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
                <button onClick={() => toggleAyah(ayah.numberInSurah)}
                  className="w-full flex items-start gap-3 p-3 text-right active:scale-[0.99]">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)" }}>
                    <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 10, fontWeight: 700 }}>
                      {ayah.numberInSurah}
                    </span>
                  </div>
                  <p className="flex-1" style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 16, lineHeight: 1.9, textAlign: "right" }}>
                    {ayah.text}
                  </p>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
                    <p className="pt-3 mb-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 11, fontWeight: 700 }}>
                      {selectedImam ? selectedImam.name : ""}
                    </p>
                    {isLoading ? (
                      <div className="flex flex-col gap-2">
                        <div className="h-3 rounded-full animate-pulse" style={{ background: "rgba(201,168,76,0.08)" }} />
                        <div className="h-3 w-4/5 rounded-full animate-pulse" style={{ background: "rgba(201,168,76,0.08)" }} />
                        <div className="h-3 w-3/5 rounded-full animate-pulse" style={{ background: "rgba(201,168,76,0.08)" }} />
                      </div>
                    ) : hasError ? (
                      <div>
                        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B06A52", fontSize: 12, marginBottom: 8 }}>
                          {isAr ? "تعذر تحميل التفسير لهذه الآية." : "Could not load the tafsir for this verse."}
                        </p>
                        <button onClick={() => loadTafsir(ayah.numberInSurah)}
                          className="px-3 py-1.5 rounded-lg active:scale-95"
                          style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 11, color: "#C9A84C", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                          {isAr ? "إعادة المحاولة" : "Retry"}
                        </button>
                      </div>
                    ) : text ? (
                      <>
                        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#D8C8A8", fontSize: 13.5, lineHeight: 1.9, textAlign: "right" }}>
                          {text}
                        </p>
                        <div className="mt-3">
                          <ShareButton
                            label={isAr ? "مشاركة كصورة" : "Share as image"}
                            data={{
                              kindLabel: selectedImam ? selectedImam.name : (isAr ? "تفسير" : "Tafsir"),
                              arabicText: `${ayah.text}\n\n${text}`,
                              footer: isAr
                                ? `سورة ${surah.nameAr} — آية ${ayah.numberInSurah}`
                                : `${surah.nameEn} — Verse ${ayah.numberInSurah}`,
                            }}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TafsirBrowser({ onBack }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "مكية" | "مدنية">("all");
  const [selected, setSelected] = useState<TafsirEntry | null>(null);
  const [detailTab, setDetailTab] = useState<"summary" | "imams">("summary");

  const selectSurah = (s: TafsirEntry | null) => {
    setDetailTab("summary");
    setSelected(s);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TAFSIR_DATA.filter((s) => {
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (!q) return true;
      return (
        s.nameAr.includes(query.trim()) ||
        s.nameEn.toLowerCase().includes(q) ||
        String(s.number).includes(q)
      );
    });
  }, [query, typeFilter]);

  if (selected) {
    return (
      <div style={{ minHeight: "100vh", paddingBottom: 20 }}>
        <header className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
          style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <button onClick={() => setSelected(null)}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
            </svg>
          </button>
          <div className="flex-1">
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 16, fontWeight: 700 }}>
              {isAr ? `تفسير سورة ${selected.nameAr}` : `Tafsir: ${selected.nameEn}`}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? `سورة رقم ${selected.number} — ${selected.type}` : `Surah ${selected.number} — ${selected.typeEn}`}
            </p>
          </div>
        </header>

        <div className="flex gap-1.5 px-4 pt-3">
          {([
            { k: "summary", l: isAr ? "الملخص" : "Summary" },
            { k: "imams", l: isAr ? "تفسير الأئمة آية بآية" : "Scholars, verse by verse" },
          ] as const).map((t) => (
            <button key={t.k} onClick={() => setDetailTab(t.k)}
              className="flex-1 py-2 rounded-xl text-center active:scale-95"
              style={{
                fontFamily: "'Tajawal', sans-serif", fontSize: 11.5,
                background: detailTab === t.k ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${detailTab === t.k ? "rgba(201,168,76,0.38)" : "rgba(201,168,76,0.08)"}`,
                color: detailTab === t.k ? "#C9A84C" : "#6A5A48",
                fontWeight: detailTab === t.k ? 700 : 400,
              }}>
              {t.l}
            </button>
          ))}
        </div>

        {detailTab === "imams" ? (
          <div className="px-4 py-4">
            <ImamsTafsirSection surah={selected} isAr={isAr} />
          </div>
        ) : (
        <div className="px-4 py-5">
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.9))", border: "1px solid rgba(201,168,76,0.14)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", fontFamily: "'Tajawal', sans-serif", fontSize: 10, color: "#C9A84C" }}>
                {isAr ? selected.type : selected.typeEn}
              </span>
              <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 10, color: "#6A5A48" }}>
                {selected.number} / 114
              </span>
            </div>
            <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>
              سورة {selected.nameAr}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 12, textAlign: "center" }}>
              {selected.nameEn}
            </p>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "rgba(27,107,58,0.06)", border: "1px solid rgba(27,107,58,0.18)" }}>
            <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 16, lineHeight: 2, textAlign: "right" }}>
              {selected.themeAr}
            </p>
            {!isAr && (
              <p className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(27,107,58,0.2)", fontFamily: "'Tajawal', sans-serif", color: "#9AB8A4", fontSize: 13, lineHeight: 1.8 }}>
                {selected.themeEn}
              </p>
            )}
          </div>

          <div className="mt-4">
            <ShareButton
              label={isAr ? "مشاركة كصورة" : "Share as image"}
              data={{
                kindLabel: isAr ? "التفسير الميسر" : "Simplified Tafsir",
                arabicText: `سورة ${selected.nameAr}\n\n${selected.themeAr}`,
                translation: !isAr ? selected.themeEn : undefined,
                footer: isAr ? `سورة رقم ${selected.number}` : `Surah ${selected.number}`,
              }}
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              disabled={selected.number <= 1}
              onClick={() => selectSurah(TAFSIR_DATA.find((s) => s.number === selected.number - 1) || null)}
              className="flex-1 py-2.5 rounded-xl text-center active:scale-95 disabled:opacity-30"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12, fontWeight: 600 }}>
              {isAr ? "السورة السابقة" : "Previous"}
            </button>
            <button
              disabled={selected.number >= 114}
              onClick={() => selectSurah(TAFSIR_DATA.find((s) => s.number === selected.number + 1) || null)}
              className="flex-1 py-2.5 rounded-xl text-center active:scale-95 disabled:opacity-30"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12, fontWeight: 600 }}>
              {isAr ? "السورة التالية" : "Next"}
            </button>
          </div>
        </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="sticky top-0 z-20 px-4 py-3" style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
            </svg>
          </button>
          <div>
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>
              {isAr ? "التفسير الميسر" : "Simplified Tafsir"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? "معاني ١١٤ سورة" : "Meanings of all 114 surahs"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-2"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.14)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" stroke="#C9A84C" strokeWidth="2"/>
            <path d="M21 21l-4.3-4.3" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? "ابحث عن سورة..." : "Search a surah..."}
            className="flex-1 bg-transparent outline-none"
            style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13 }}
          />
          <VoiceSearchButton onResult={(text) => setQuery(text)} />
        </div>

        <div className="flex gap-1.5">
          {([
            { k: "all", l: isAr ? "الكل" : "All" },
            { k: "مكية", l: isAr ? "مكية" : "Meccan" },
            { k: "مدنية", l: isAr ? "مدنية" : "Medinan" },
          ] as const).map((f) => (
            <button key={f.k} onClick={() => setTypeFilter(f.k)}
              className="px-3 py-1.5 rounded-full active:scale-95"
              style={{
                background: typeFilter === f.k ? "rgba(201,168,76,0.16)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${typeFilter === f.k ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.08)"}`,
                fontFamily: "'Tajawal', sans-serif", fontSize: 11,
                color: typeFilter === f.k ? "#C9A84C" : "#6A5A48",
                fontWeight: typeFilter === f.k ? 700 : 400,
              }}>
              {f.l}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-3">
        {filtered.length === 0 ? (
          <p className="text-center py-10" style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 13 }}>
            {isAr ? "لا توجد نتائج" : "No results"}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((s) => (
              <button key={s.number} onClick={() => selectSurah(s)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-right active:scale-95"
                style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)" }}>
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12, fontWeight: 700 }}>{s.number}</span>
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700 }}>سورة {s.nameAr}</p>
                  <p className="line-clamp-1" style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10.5, marginTop: 2 }}>
                    {isAr ? s.themeAr : s.themeEn}
                  </p>
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25, flexShrink: 0 }}>
                  <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
