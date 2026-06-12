"use client";

const TABS = [
  { id: "home",   label: "الرئيسية" },
  { id: "quran",  label: "القرآن"   },
  { id: "prayer", label: "الصلاة"   },
  { id: "dhikr",  label: "الذكر"    },
  { id: "more",   label: "المزيد"   },
];

const ICONS: Record<string, (a: boolean) => React.ReactNode> = {
  home: (a) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        fill={a ? "rgba(201,168,76,0.15)" : "none"} stroke={a ? "#C9A84C" : "#5A4830"} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10" stroke={a ? "#C9A84C" : "#5A4830"} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  quran: (a) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={a ? "#C9A84C" : "#5A4830"} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        fill={a ? "rgba(201,168,76,0.09)" : "none"} stroke={a ? "#C9A84C" : "#5A4830"} strokeWidth="1.8"/>
      <path d="M9 7h7M9 11h5" stroke={a ? "#C9A84C" : "#5A4830"} strokeWidth="1.2" strokeLinecap="round" opacity={a ? 0.75 : 0.45}/>
    </svg>
  ),
  prayer: (a) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9"
        fill={a ? "rgba(201,168,76,0.08)" : "none"} stroke={a ? "#C9A84C" : "#5A4830"} strokeWidth="1.8"/>
      <path d="M12 7v5l3.5 3.5" stroke={a ? "#C9A84C" : "#5A4830"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dhikr: (a) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i}
          cx={12 + 7.5 * Math.cos((i * Math.PI * 2) / 10)}
          cy={12 + 7.5 * Math.sin((i * Math.PI * 2) / 10)}
          r={a && i < 4 ? 2.1 : 1.6}
          fill={a ? (i < 4 ? "#C9A84C" : "rgba(201,168,76,0.26)") : (i < 4 ? "#5A4830" : "#3A2E1A")}/>
      ))}
      <circle cx="12" cy="12" r="2.6" fill={a ? "#C9A84C" : "#5A4830"} opacity={a ? 0.88 : 0.55}/>
    </svg>
  ),
  more: (a) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="2" fill={a ? "#C9A84C" : "#5A4830"}/>
      <circle cx="12" cy="12" r="2" fill={a ? "#C9A84C" : "#5A4830"}/>
      <circle cx="19" cy="12" r="2" fill={a ? "#C9A84C" : "#5A4830"}/>
    </svg>
  ),
};

interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        maxWidth: 480, margin: "0 auto",
        background: "rgba(4,9,18,0.98)",
        borderTop: "1px solid rgba(201,168,76,0.1)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        paddingBottom: "env(safe-area-inset-bottom, 4px)",
      }}>
      <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }}/>
      <div className="flex items-center justify-around px-1 pt-1.5 pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-2xl transition-all active:scale-90`}
              style={{
                minWidth: 52,
                background: isActive ? "rgba(201,168,76,0.07)" : "transparent",
                border: `1px solid ${isActive ? "rgba(201,168,76,0.14)" : "transparent"}`,
              }}>
              {ICONS[tab.id](isActive)}
              <span style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 9.5,
                color: isActive ? "#C9A84C" : "#5A4830",
                fontWeight: isActive ? 700 : 400,
                transition: "color 0.2s",
              }}>{tab.label}</span>
              {isActive && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C9A84C", boxShadow: "0 0 5px #C9A84C", marginTop: 1 }}/>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
