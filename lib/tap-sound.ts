// صوت نقر خفيف ونغمة إتمام — مُولَّدة عبر Web Audio API (لا تحتاج ملف صوتي خارجي)

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, startOffset: number, duration: number, gain: number, type: OscillatorType = "sine") {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = audio.currentTime + startOffset;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** نقرة عد خفيفة — تُشغَّل عند كل ضغطة عدّ */
export function playTapSound() {
  try {
    tone(880, 0, 0.07, 0.05, "sine");
  } catch {
    // audio not available — silently ignore
  }
}

/** نغمة إتمام — تُشغَّل عند إكمال العدد المطلوب */
export function playCompleteSound() {
  try {
    tone(660, 0, 0.1, 0.06, "sine");
    tone(880, 0.09, 0.12, 0.06, "sine");
    tone(1100, 0.19, 0.16, 0.06, "sine");
  } catch {
    // audio not available — silently ignore
  }
}

/** إيقاظ سياق الصوت عند أول تفاعل من المستخدم (مطلوب في بعض المتصفحات) */
export function primeAudio() {
  getCtx();
}
