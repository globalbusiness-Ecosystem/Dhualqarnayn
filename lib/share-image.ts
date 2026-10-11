// Generates a branded, shareable PNG image for a piece of religious content
// (Quran verse, hadith, zikr, or dua) drawn on an in-memory canvas.
// Uses the app's own Amiri/Tajawal fonts and dark navy/gold identity.

export interface ShareImageOptions {
  kindLabel: string; // e.g. "آية قرآنية", "حديث نبوي شريف"
  arabicText: string;
  translation?: string;
  footer: string; // e.g. "سورة البقرة ٢:٢٥٥" or "رواه البخاري"
  accent?: string; // hex accent color, defaults to gold
}

const WIDTH = 1080;
const HEIGHT = 1350;

async function ensureFontsReady() {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load("700 56px Amiri"),
      document.fonts.load("400 56px Amiri"),
      document.fonts.load("700 28px Tajawal"),
      document.fonts.load("400 24px Tajawal"),
    ]);
    await document.fonts.ready;
  } catch {
    // Fonts may already be loaded or unavailable — proceed with fallback.
  }
}

/** Wraps Arabic (or any) text into lines that fit maxWidth, honoring RTL word order. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateShareImage(opts: ShareImageOptions): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  await ensureFontsReady();

  const accent = opts.accent ?? "#C9A84C";
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, "#0D1B2A");
  bg.addColorStop(1, "#050C16");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Decorative outer frame
  const margin = 44;
  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, WIDTH - margin * 2, HEIGHT - margin * 2);
  ctx.strokeStyle = `${accent}22`;
  ctx.lineWidth = 1;
  ctx.strokeRect(margin + 10, margin + 10, WIDTH - (margin + 10) * 2, HEIGHT - (margin + 10) * 2);

  // Corner diamonds
  const drawDiamond = (x: number, y: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  };
  [margin, WIDTH - margin].forEach((x) => {
    [margin, HEIGHT - margin].forEach((y) => drawDiamond(x, y, 10));
  });

  // Kind label pill (top)
  ctx.textAlign = "center";
  ctx.font = "700 26px Tajawal, sans-serif";
  ctx.fillStyle = accent;
  ctx.fillText(opts.kindLabel, WIDTH / 2, 170);

  // Decorative divider under label
  ctx.strokeStyle = `${accent}44`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 90, 200);
  ctx.lineTo(WIDTH / 2 + 90, 200);
  ctx.stroke();

  // Main Arabic text (RTL, centered, word-wrapped)
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  const textMaxWidth = WIDTH - margin * 2 - 140;
  let fontSize = 52;
  let lines: string[] = [];
  // Shrink font until the text fits within the available vertical space.
  const maxTextHeight = opts.translation ? 560 : 760;
  while (fontSize > 28) {
    ctx.font = `700 ${fontSize}px Amiri, serif`;
    lines = wrapText(ctx, opts.arabicText, textMaxWidth);
    const totalHeight = lines.length * fontSize * 1.9;
    if (totalHeight <= maxTextHeight) break;
    fontSize -= 2;
  }
  ctx.font = `700 ${fontSize}px Amiri, serif`;
  ctx.fillStyle = "#F0E2C2";
  const lineHeight = fontSize * 1.9;
  const textStartY = 340;
  lines.forEach((line, i) => {
    ctx.fillText(line, WIDTH / 2, textStartY + i * lineHeight);
  });

  let cursorY = textStartY + lines.length * lineHeight + 20;

  // Translation (LTR, italic, smaller)
  if (opts.translation) {
    ctx.direction = "ltr";
    ctx.font = "italic 400 26px Tajawal, sans-serif";
    ctx.fillStyle = "#9CA8B0";
    const trMaxWidth = WIDTH - margin * 2 - 180;
    const trLines = wrapText(ctx, opts.translation, trMaxWidth).slice(0, 6);
    cursorY += 30;
    trLines.forEach((line, i) => {
      ctx.fillText(line, WIDTH / 2, cursorY + i * 36);
    });
  }

  // Footer / source
  ctx.direction = "rtl";
  ctx.font = "700 24px Tajawal, sans-serif";
  ctx.fillStyle = `${accent}CC`;
  ctx.fillText(opts.footer, WIDTH / 2, HEIGHT - 150);

  // App branding
  ctx.font = "700 34px Amiri, serif";
  ctx.fillStyle = accent;
  ctx.fillText("ذو القرنين", WIDTH / 2, HEIGHT - 90);
  ctx.direction = "ltr";
  ctx.font = "400 18px Tajawal, sans-serif";
  ctx.fillStyle = "rgba(201,168,76,0.5)";
  ctx.fillText("Dhualqarnayn — Your Complete Islamic Gateway", WIDTH / 2, HEIGHT - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}
