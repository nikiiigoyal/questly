/**
 * Tiny Web Audio synth for game sounds — no audio files needed, works offline,
 * and licensing-free. The playSound(name) API stays the same if we later swap
 * in recorded assets.
 */

export type SoundName = "tap" | "correct" | "wrong" | "complete";

const MUTE_KEY = "questly-muted";

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(muted: boolean): void {
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

let ctx: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.18
): OscillatorNode {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
  return osc;
}

export function playSound(name: SoundName): void {
  if (isMuted()) return;
  const c = audioContext();
  if (!c) return;
  const t = c.currentTime + 0.01;

  switch (name) {
    case "tap":
      // Soft rounded click.
      tone(c, 520, t, 0.08, "sine", 0.1);
      break;
    case "correct":
      // Bright two-note chime (E5 → B5).
      tone(c, 659.25, t, 0.12);
      tone(c, 987.77, t + 0.09, 0.28);
      break;
    case "wrong": {
      // Gentle descending buzz, not harsh.
      const osc = tone(c, 220, t, 0.25, "triangle", 0.14);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.22);
      break;
    }
    case "complete":
      // Little fanfare arpeggio: C5 E5 G5 C6.
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(c, f, t + i * 0.12, 0.35, "sine", 0.16)
      );
      break;
  }
}
