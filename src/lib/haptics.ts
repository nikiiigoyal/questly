import { isMuted } from "./sounds";

/**
 * Gamified tactile haptic vibration patterns (Duolingo-style).
 * Gracefully checks for browser and device support, and respects sound mute settings.
 */

function canVibrate(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator &&
    !isMuted()
  );
}

/** Crisp, satisfying double-tap for correct answers */
export function vibrateSuccess(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([35, 40, 35]);
  } catch {
    // silently ignore device vibration errors
  }
}

/** Dull single buzz for incorrect answers */
export function vibrateError(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([70]);
  } catch {
    // silently ignore
  }
}

/** Rhythmic celebration fanfare when a quest is completed */
export function vibrateCelebration(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate([60, 40, 60, 40, 100, 60, 160]);
  } catch {
    // silently ignore
  }
}

/** Subtle tap for interactive button clicks */
export function vibrateTap(): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(15);
  } catch {
    // silently ignore
  }
}
