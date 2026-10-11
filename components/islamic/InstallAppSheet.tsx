"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useInstallPrompt } from "@/contexts/install-prompt-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4M12 4l-4 4M12 4l4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="#C9A84C" strokeWidth="1.8" />
      <path d="M12 9v6M9 12h6" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MenuDotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6" r="1.6" fill="#C9A84C" />
      <circle cx="12" cy="12" r="1.6" fill="#C9A84C" />
      <circle cx="12" cy="18" r="1.6" fill="#C9A84C" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 4v12M7 12l5 5 5-5M5 20h14"
        stroke="#0D1B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function InstallAppSheet({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const { canInstallDirectly, isInstalled, platform, promptInstall } = useInstallPrompt();
  const [installing, setInstalling] = useState(false);
  const [result, setResult] = useState<"accepted" | "dismissed" | null>(null);

  if (!isOpen) return null;

  const handleInstall = async () => {
    setInstalling(true);
    const accepted = await promptInstall();
    setInstalling(false);
    setResult(accepted ? "accepted" : "dismissed");
    if (accepted) setTimeout(onClose, 1400);
  };

  const steps =
    platform === "ios"
      ? [
          { icon: <ShareIcon />, text: t("install_ios_step1") },
          { icon: <PlusSquareIcon />, text: t("install_ios_step2") },
          { icon: <DownloadIcon />, text: t("install_ios_step3") },
        ]
      : [
          { icon: <MenuDotsIcon />, text: t("install_manual_step1") },
          { icon: <PlusSquareIcon />, text: t("install_manual_step2") },
        ];

  return (
    <>
      <div
        className="fixed inset-0 z-[70]"
        style={{ background: "rgba(1,3,9,0.86)" }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-[28px] overflow-hidden"
        style={{
          maxWidth: 480,
          margin: "0 auto",
          background: "linear-gradient(160deg, #0D2034 0%, #060E18 100%)",
          borderTop: "1px solid rgba(201,168,76,0.18)",
          boxShadow: "0 -16px 48px rgba(0,0,0,0.85)",
          maxHeight: "86vh",
          overflowY: "auto",
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 40, height: 4, borderRadius: 4, background: "rgba(201,168,76,0.25)" }} />
        </div>

        <div className="px-6 pt-3 pb-8 text-center">
          {/* App icon */}
          <div
            className="mx-auto mb-4 flex items-center justify-center rounded-[22px]"
            style={{
              width: 76,
              height: 76,
              background: "linear-gradient(145deg, #15304A, #081220)",
              border: "1px solid rgba(201,168,76,0.28)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ fontFamily: "'Amiri', serif", fontWeight: 700, fontSize: 30, color: "#C9A84C" }}>
              ذ
            </span>
          </div>

          <h2 style={{ fontFamily: "'Amiri', serif", fontWeight: 700, color: "#F5ECD7", fontSize: 20, marginBottom: 6 }}>
            {t("install_title")}
          </h2>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 12.5, lineHeight: 1.7, marginBottom: 22 }}>
            {t("install_subtitle")}
          </p>

          {isInstalled ? (
            <div
              className="flex items-center justify-center gap-2 rounded-2xl py-4"
              style={{ background: "rgba(27,107,58,0.14)", border: "1px solid rgba(27,107,58,0.3)" }}
            >
              <span style={{ color: "#4ADE80", fontSize: 16 }}>✓</span>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 13, fontWeight: 600 }}>
                {t("install_already")}
              </p>
            </div>
          ) : canInstallDirectly ? (
            <>
              <button
                onClick={handleInstall}
                disabled={installing}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 active:scale-95 transition-transform"
                style={{
                  background: "linear-gradient(135deg,#C9A84C,#E2C47A)",
                  boxShadow: "0 10px 28px rgba(201,168,76,0.3)",
                  opacity: installing ? 0.7 : 1,
                }}
              >
                <DownloadIcon />
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#0D1B2A", fontSize: 14.5, fontWeight: 700 }}>
                  {installing ? t("install_installing") : t("install_cta")}
                </span>
              </button>
              {result === "dismissed" && (
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 11, marginTop: 10 }}>
                  {t("install_later_ok")}
                </p>
              )}
            </>
          ) : (
            <div className="text-right" dir="rtl">
              <p
                style={{
                  fontFamily: "'Tajawal', sans-serif",
                  color: "#C9A84C",
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {platform === "ios" ? t("install_ios_heading") : t("install_manual_heading")}
              </p>
              <div className="flex flex-col gap-2.5">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3"
                    style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        width: 30,
                        height: 30,
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        fontFamily: "'Tajawal', sans-serif",
                        color: "#C9A84C",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C0A878", fontSize: 12.5, lineHeight: 1.6 }}>
                        {s.text}
                      </p>
                      {s.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 rounded-2xl py-3 active:scale-95 transition-transform"
            style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}
          >
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 12.5, fontWeight: 600 }}>
              {t("close")}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
