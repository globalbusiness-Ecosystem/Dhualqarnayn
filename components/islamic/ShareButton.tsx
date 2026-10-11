"use client";

import { useState } from "react";
import { generateShareImage, type ShareImageOptions } from "@/lib/share-image";

interface ShareButtonProps {
  data: ShareImageOptions;
  label?: string;
  compact?: boolean;
}

export default function ShareButton({ data, label = "مشاركة", compact }: ShareButtonProps) {
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [failed, setFailed] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const b = await generateShareImage(data);
      if (!b) {
        setFailed(true);
        return;
      }
      setBlob(b);
      setPreviewUrl(URL.createObjectURL(b));
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function doShare() {
    if (!blob) return;
    const file = new File([blob], "dhualqarnayn.png", { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: "ذو القرنين" });
        return;
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }
    const a = document.createElement("a");
    a.href = previewUrl!;
    a.download = "dhualqarnayn.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function close() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setBlob(null);
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={busy}
        className={`flex items-center gap-1 ${compact ? "px-2 py-1.5" : "px-3 py-1.5"} rounded-lg active:scale-90 transition-transform`}
        style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.09)", opacity: busy ? 0.6 : 1 }}
      >
        {busy ? (
          <div style={{ width: 10, height: 10, border: "2px solid rgba(201,168,76,0.25)", borderTop: "2px solid #C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
        )}
        <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 9.5, color: "rgba(201,168,76,0.4)" }}>
          {label}
        </span>
      </button>

      {failed && !previewUrl && (
        <span style={{ display: "none" }} />
      )}

      {previewUrl && (
        <div
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: "rgba(2,6,12,0.85)", backdropFilter: "blur(6px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex flex-col items-center gap-4"
            style={{ maxWidth: 360 }}
          >
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(201,168,76,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="صورة للمشاركة" className="w-full h-auto block" />
            </div>
            <div className="flex items-center gap-2.5 w-full">
              <button
                onClick={close}
                className="flex-1 py-3 rounded-xl text-center active:scale-95 transition-transform"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 13 }}>إغلاق</span>
              </button>
              <button
                onClick={doShare}
                className="flex-1 py-3 rounded-xl text-center active:scale-95 transition-transform"
                style={{ background: "rgba(201,168,76,0.16)", border: "1px solid rgba(201,168,76,0.4)" }}
              >
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13, fontWeight: 700 }}>
                  مشاركة / تنزيل
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
