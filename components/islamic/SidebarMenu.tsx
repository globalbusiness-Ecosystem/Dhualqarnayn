"use client";

interface SidebarMenuProps { isOpen: boolean; onClose: () => void; }

const ITEMS = [
  { label: "القرآن الكريم",    sub: "تلاوة وتفسير وحفظ",          accent: "#C9A84C", active: true },
  { label: "الأحاديث النبوية", sub: "البخاري ومسلم والترمذي",      accent: "#228B4A" },
  { label: "مواقيت الصلاة",   sub: "الأوقات الدقيقة لمنطقتك",    accent: "#C9A84C" },
  { label: "اتجاه القبلة",    sub: "البوصلة الإسلامية الدقيقة",   accent: "#228B4A" },
  { label: "الأذكار والأدعية", sub: "أذكار الصباح والمساء",        accent: "#C9A84C" },
  { label: "التاريخ الإسلامي", sub: "سيرة وحضارة وفتوحات",         accent: "#228B4A" },
  { label: "التقويم الهجري",  sub: "المناسبات الإسلامية",          accent: "#C9A84C" },
  { label: "الإعدادات",        sub: "تخصيص التطبيق",               accent: "#7A6030" },
];

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50"
          style={{ background: "rgba(1,3,9,0.84)" }}
          onClick={onClose}
        />
      )}
      <aside className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 286,
          background: "linear-gradient(155deg, #0D2034 0%, #060E18 100%)",
          borderLeft: "1px solid rgba(201,168,76,0.14)",
          transform: isOpen ? "translateX(0)" : "translateX(110%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: isOpen ? "-16px 0 48px rgba(0,0,0,0.85)" : "none",
        }}>
        {/* Header */}
        <div className="px-5 pt-7 pb-4" style={{ borderBottom: "1px solid rgba(201,168,76,0.09)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div style={{ width: 20, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.45))" }}/>
                <svg width="6" height="6" viewBox="0 0 10 10">
                  <polygon points="5,0.8 6.2,3.8 9.8,4 7,6.2 8,9.5 5,7.8 2,9.5 3,6.2 0.2,4 3.8,3.8" fill="#C9A84C" opacity="0.65"/>
                </svg>
                <div style={{ width: 20, height: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.45), transparent)" }}/>
              </div>
              <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                ذو القرنين
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 10, marginTop: 2 }}>
                القائمة الرئيسية
              </p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", color: "#8A7858", fontSize: 13 }}>
              ✕
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 no-scrollbar">
          {ITEMS.map((item, i) => (
            <button key={i}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-right transition-all active:scale-95"
              style={{
                background: item.active ? `${item.accent}0E` : "transparent",
                border: `1px solid ${item.active ? `${item.accent}22` : "transparent"}`,
              }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{
                  background: item.active ? `${item.accent}10` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${item.active ? `${item.accent}1E` : "rgba(201,168,76,0.06)"}`,
                }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.active ? item.accent : "rgba(201,168,76,0.25)" }}/>
              </div>
              <div className="flex-1 text-right">
                <p style={{
                  fontFamily: "'Tajawal', sans-serif",
                  fontWeight: item.active ? 600 : 400,
                  color: item.active ? item.accent : "#9A8870",
                  fontSize: 13,
                }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 1 }}>
                  {item.sub}
                </p>
              </div>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: item.active ? 0.5 : 0.2, flexShrink: 0 }}>
                <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          ))}
        </nav>

        {/* Pi Network badge */}
        <div className="mx-4 mb-8">
          <div className="py-3 px-4 rounded-2xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(27,107,58,0.14), rgba(6,11,20,0.97))",
              border: "1px solid rgba(27,107,58,0.28)",
            }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(27,107,58,0.2)",
                border: "1px solid rgba(27,107,58,0.38)",
                color: "#4ADE80", fontSize: 18, fontWeight: 700, fontFamily: "serif",
              }}>π</div>
            <div className="flex-1">
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 12, fontWeight: 600 }}>Pi Network</p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10 }}>متاح على شبكة Pi</p>
            </div>
            <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80", display: "block" }}/>
          </div>
        </div>
      </aside>
    </>
  );
}
