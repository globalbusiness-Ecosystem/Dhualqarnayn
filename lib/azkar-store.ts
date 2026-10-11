// حفظ تفضيلات الأذكار وعداد الذكر على حساب المستخدم في Pi (لا يُستخدم أي تخزين محلي للمتصفح)

import { pi } from "@/lib/pi";

export interface AzkarProgress {
  favorites: number[];
  /** تاريخ آخر يوم اكتملت فيه كل فئة، بصيغة YYYY-MM-DD */
  completedToday: Record<string, string>;
  /** أطول وأحدث تسلسل أيام متتالية اكتمل فيها ذكر الصباح والمساء معاً */
  streak: number;
  lastStreakDate: string | null;
}

export interface DhikrCounterState {
  selectedIndex: number;
  lifetimeCount: number;
  sessions: number;
}

const DEFAULT_PROGRESS: AzkarProgress = {
  favorites: [],
  completedToday: {},
  streak: 0,
  lastStreakDate: null,
};

const DEFAULT_COUNTER: DhikrCounterState = {
  selectedIndex: 0,
  lifetimeCount: 0,
  sessions: 0,
};

type Listener<T> = (value: T) => void;

/** كاتب متزامن بسيط: يمنع الكتابة قبل التحميل، ويُدمج العمليات المتتالية، ويعيد المحاولة بتأخير عند الفشل (تحديد المعدل). */
class SlotStore<T extends Record<string, any>> {
  private key: string;
  private defaults: T;
  private state: T;
  private loaded = false;
  private loadPromise: Promise<void> | null = null;
  private pendingSave: T | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelay = 1500;
  private listeners = new Set<Listener<T>>();

  constructor(key: string, defaults: T) {
    this.key = key;
    this.defaults = defaults;
    this.state = defaults;
  }

  private notify() {
    for (const l of this.listeners) l(this.state);
  }

  subscribe(l: Listener<T>): () => void {
    this.listeners.add(l);
    l(this.state);
    return () => this.listeners.delete(l);
  }

  async load(): Promise<T> {
    if (this.loaded) return this.state;
    if (this.loadPromise) {
      await this.loadPromise;
      return this.state;
    }
    this.loadPromise = (async () => {
      try {
        const record = await pi.userState.get(this.key);
        if (record?.blob) {
          this.state = { ...this.defaults, ...(record.blob as T) };
        }
      } catch {
        // تعذر التحميل — نبدأ من الوضع الافتراضي، لا نفقد أي شيء لأنه لم يُحفظ شيء بعد
      } finally {
        this.loaded = true;
        this.notify();
      }
    })();
    await this.loadPromise;
    return this.state;
  }

  getState(): T {
    return this.state;
  }

  update(patch: Partial<T>) {
    this.state = { ...this.state, ...patch };
    this.notify();
    this.scheduleSave();
  }

  private scheduleSave() {
    this.pendingSave = this.state;
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => this.flush(), 700);
  }

  private async flush() {
    this.saveTimer = null;
    if (!this.loaded || !this.pendingSave) return;
    const toSave = this.pendingSave;
    this.pendingSave = null;
    try {
      await pi.userState.set(this.key, toSave);
      this.retryDelay = 1500;
    } catch {
      // تحديد المعدل أو خطأ شبكة — أعد المحاولة بتأخير متزايد دون فقد أي تغييرات
      this.pendingSave = toSave;
      this.retryDelay = Math.min(this.retryDelay * 1.6, 15000);
      this.saveTimer = setTimeout(() => this.flush(), this.retryDelay);
    }
  }
}

export const azkarProgressStore = new SlotStore<AzkarProgress>("azkar.progress", DEFAULT_PROGRESS);
export const dhikrCounterStore = new SlotStore<DhikrCounterState>("azkar.counter", DEFAULT_COUNTER);

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** يُسجّل اكتمال فئة أذكار اليوم، ويحدّث تسلسل الأيام عند اكتمال الصباح والمساء معاً. */
export function markCategoryCompleted(categoryId: string) {
  const state = azkarProgressStore.getState();
  const today = todayKey();
  const completedToday = { ...state.completedToday, [categoryId]: today };

  let streak = state.streak;
  let lastStreakDate = state.lastStreakDate;
  const morningDone = completedToday["morning"] === today;
  const eveningDone = completedToday["evening"] === today;
  if (morningDone && eveningDone && lastStreakDate !== today) {
    const continuedFromYesterday = lastStreakDate === yesterdayKey();
    streak = continuedFromYesterday ? streak + 1 : 1;
    lastStreakDate = today;
  }

  azkarProgressStore.update({ completedToday, streak, lastStreakDate });
}
