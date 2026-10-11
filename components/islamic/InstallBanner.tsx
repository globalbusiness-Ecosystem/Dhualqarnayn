"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useInstallPrompt } from "@/contexts/install-prompt-context";
import { pi } from "@/lib/pi";

const DISMISS_KEY = "install_banner_dismissed";

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4v12M7 12l5 5 5-5M5 20h14"
        stroke="#0D1B2A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props {
  onInstall: () => void;
}

export default function InstallBanner({ onInstall }: Props) {
  const { t, dir } = useLanguage();
  const { isInstalled } = useInstallPrompt();
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    pi.userState
      .get(DISMISS_KEY)
      .then((record) => {
        if (!cancelled) setDismissed(Boolean(record?.blob?.value));
      })
      .catch(() => {
        if (!cancelled) setDismissed(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isInstalled || dismissed !== false) return null;

  const handleDismiss = () => {
    setDismissed(true);
    pi.userState.set(DISMISS_KEY, { value: true }).catch(() => {});
  };

  return (
    <div
      dir={dir}
      className="mx-4 mb-4 flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(27,107,58,0.1))",
        border: "1px solid rgba(201,168,76,0.22)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: 34,
          height: 34,
          background: "linear-gradient(135deg,#C9A84C,#E2C47A)",
        }}
      >
        <DownloadIcon />
      </div>

      <p
        className="flex-1"
        style={{
          fontFamily: "'Tajawal', sans-serif",
          color: "#E8DCC0",
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {t("install_banner_text")}
      </p>

      <button
        onClick={onInstall}
        className="flex-shrink-0 rounded-lg px-3 py-1.5 active:scale-95 transition-transform"
        style={{ background: "#C9A84C" }}
      >
        <span
          style={{
            fontFamily: "'Tajawal', sans-serif",
            color: "#0D1B2A",
            fontSize: 11.5,
            fontWeight: 700,
          }}
        >
          {t("install_banner_action")}
        </span>
      </button>

      <button
        onClick={handleDismiss}
        aria-label={t("close")}
        className="flex-shrink-0 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
        style={{ width: 22, height: 22 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="#8A7858"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
