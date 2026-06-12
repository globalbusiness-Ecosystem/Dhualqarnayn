"use client";

import { useState } from "react";
import SidebarMenu from "./SidebarMenu";

export default function AppHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleBell = () => {
    setBellActive(true);
    setShowNotif((v) => !v);
    setTimeout(() => setBellActive(false), 600);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          maxWidth: 480,
          margin: "0 auto",
          background: "rgba(3,8,18,0.98)",
          borderBottom: "1px solid rgba(201,168,76,0.11)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 2px 28px rgba(0,0,0,0.7)",
        }}
      >
        {/* Top gold line */}
        <div style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.08) 10%, rgba(201,168,76,0.6) 38%, #E8D070 50%, rgba(201,168,76,0.6) 62%, rgba(201,168,76,0.08) 90%, transparent 100%)",
        }} />

        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة"
            className="flex flex-col items-center justify-center gap-[5px] rounded-xl active:scale-90 transition-transform"
            style={{
              width: 42, height: 42,
              background: "rgba(201,168,76,0.05)",
              border: "1px solid rgba(201,168,76,0.14)",
            }}
          >
            <span style={{ display: "block", width: 18, height: 1.5, background: "#C9A84C", borderRadius: 2 }} />
            <span style={{ display: "block", width: 13, height: 1.5, background: "rgba(201,168,76,0.45)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 18, height: 1.5, background: "#C9A84C", borderRadius: 2 }} />
          </button>

          {/* Center logo */}
          <div className="flex flex-col items-center" dir="rtl">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div style={{ width: 22, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35))" }} />
              <svg width="7" height="7" viewBox="0 0 10 10">
                <polygon points="5,0.8 6.2,3.8 9.8,4 7,6.2 8,9.5 5,7.8 2,9.5 3,6.2 0.2,4 3.8,3.8" fill="#C9A84C" opacity="0.75" />
              </svg>
              <div style={{ width: 22, height: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.35), transparent)" }} />
            </div>
            <h1
              className="gold-shimmer"
              style={{
                fontFamily: "'Amiri', serif",
                fontWeight: 700,
                fontSize: 25,
                lineHeight: 1.15,
              }}
            >
              ذو القرنين
            </h1>
            <p style={{
              fontFamily: "'Tajawal', sans-serif",
              color: "rgba(201,168,76,0.55)",
              fontSize: 10,
              marginTop: 1,
              letterSpacing: "0.02em",
            }}>
              بوابتك الإسلامية الشاملة
            </p>
          </div>

          {/* Bell */}
          <div className="relative">
            <button
              onClick={handleBell}
              aria-label="الإشعارات"
              className="flex items-center justify-center rounded-xl active:scale-90 transition-all"
              style={{
                width: 42, height: 42,
                background: bellActive ? "rgba(201,168,76,0.1)" : "rgba(201,168,76,0.05)",
                border: `1px solid ${bellActive ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.14)"}`,
                transform: bellActive ? "rotate(-12deg)" : "rotate(0)",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                  stroke={bellActive ? "#C9A84C" : "#8A7040"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute flex items-center justify-center rounded-full" style={{
                top: 4, right: 4, width: 14, height: 14,
                background: "linear-gradient(135deg,#C9A84C,#E8C96A)",
                color: "#0D1B2A", fontSize: 7.5, fontWeight: 900,
                fontFamily: "'Tajawal',sans-serif",
                boxShadow: "0 0 7px rgba(201,168,76,0.6)",
              }}>٣</span>
            </button>

            {showNotif && (
              <div className="absolute top-12 z-50 rounded-2xl overflow-hidden"
                style={{
                  width: 248,
                  background: "rgba(5,10,20,0.99)",
                  border: "1px solid rgba(201,168,76,0.18)",
                  boxShadow: "0 14px 42px rgba(0,0,0,0.8)",
                  transform: "translateX(calc(-100% + 42px))",
                }}>
                <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                  <p style={{ fontFamily: "'Tajawal',sans-serif", color: "#C9A84C", fontSize: 12, fontWeight: 700 }}>الإشعارات</p>
                </div>
                {[
                  { text: "حان وقت صلاة الظهر", time: "الآن" },
                  { text: "ذكر اليوم: سبحان الله وبحمده", time: "منذ ١ س" },
                  { text: "آية جديدة متاحة", time: "منذ ٣ س" },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-3" style={{ borderBottom: i < 2 ? "1px solid rgba(201,168,76,0.05)" : "none" }}>
                    <p style={{ fontFamily: "'Tajawal',sans-serif", color: "#C0A878", fontSize: 11.5, lineHeight: 1.5 }}>{n.text}</p>
                    <p style={{ fontFamily: "'Tajawal',sans-serif", color: "#7A6848", fontSize: 9, marginTop: 2 }}>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
