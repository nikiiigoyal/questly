/**
 * Player progress persisted in localStorage — no backend needed for the MVP.
 */

export type Progress = {
  xp: number;
  streak: number;
  lastActive: string | null; // YYYY-MM-DD
  questsDone: string[];
};

const KEY = "questly-progress";

const toDay = (d: Date) => d.toISOString().slice(0, 10);

export function loadProgress(): Progress {
  if (typeof window === "undefined") {
    return { xp: 0, streak: 0, lastActive: null, questsDone: [] };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw new Error("no progress yet");
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      xp: parsed.xp ?? 0,
      streak: parsed.streak ?? 0,
      lastActive: parsed.lastActive ?? null,
      questsDone: parsed.questsDone ?? [],
    };
  } catch {
    return { xp: 0, streak: 0, lastActive: null, questsDone: [] };
  }
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function recordQuestComplete(xpEarned: number, topic: string): Progress {
  const p = loadProgress();
  const today = toDay(new Date());
  const yesterday = toDay(new Date(Date.now() - 86_400_000));

  if (p.lastActive !== today) {
    p.streak = p.lastActive === yesterday ? p.streak + 1 : 1;
  }
  p.lastActive = today;
  p.xp += xpEarned;
  if (!p.questsDone.includes(topic)) p.questsDone.push(topic);

  saveProgress(p);
  return p;
}
