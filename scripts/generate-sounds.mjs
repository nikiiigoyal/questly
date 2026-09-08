/**
 * One-time generator for the game's sound effects.
 * Run with:  node scripts/generate-sounds.mjs
 * Writes 16-bit mono WAV files into public/sounds/.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;

function synth(duration, fn) {
  const n = Math.round(duration * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / SR);
  return out;
}

// Fast attack, exponential decay envelope.
const env = (t, attack, decay) => (t < attack ? t / attack : Math.exp(-(t - attack) / decay));
const sine = (f, t) => Math.sin(2 * Math.PI * f * t);

function render(name, samples) {
  const clipped = Float32Array.from(samples, (v) => Math.tanh(v * 1.3));
  let peak = 0;
  for (const v of clipped) peak = Math.max(peak, Math.abs(v));
  const pcm = new Int16Array(clipped.length);
  for (let i = 0; i < clipped.length; i++) {
    pcm[i] = Math.round((clipped[i] / peak) * 0.85 * 32767);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length * 2, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length * 2, 40);
  writeFileSync(`public/sounds/${name}.wav`, Buffer.concat([header, Buffer.from(pcm.buffer)]));
  console.log("wrote public/sounds/" + name + ".wav");
}

mkdirSync("public/sounds", { recursive: true });

// tap — soft round pop, quick downward sweep
render(
  "tap",
  synth(0.09, (t) => {
    const f = 620 - 260 * (t / 0.09);
    return sine(f, t) * env(t, 0.004, 0.028) * 0.55;
  })
);

// correct — bright two-note bell (E5 → B5) with a little sparkle
render(
  "correct",
  synth(0.55, (t) => {
    let v = 0;
    v += sine(659.25, t) * env(t, 0.004, 0.09) * 0.6;
    v += sine(659.25 * 2, t) * env(t, 0.004, 0.05) * 0.14;
    const t2 = t - 0.1;
    if (t2 >= 0) {
      v += sine(987.77, t2) * env(t2, 0.004, 0.16) * 0.7;
      v += sine(987.77 * 2, t2) * env(t2, 0.004, 0.08) * 0.18;
      v += sine(1975.53, t2) * env(t2, 0.002, 0.05) * 0.08;
    }
    return v;
  })
);

// wrong — gentle descending "uh-oh", not harsh
render(
  "wrong",
  synth(0.32, (t) => {
    const f = 230 - 100 * (t / 0.32);
    return (sine(f, t) * 0.55 + sine(f * 0.5, t) * 0.3) * env(t, 0.006, 0.11);
  })
);

// complete — little fanfare: C5 E5 G5 C6 with a shimmering final chord
render(
  "complete",
  synth(1.5, (t) => {
    let v = 0;
    for (const [f, start] of [
      [523.25, 0],
      [659.25, 0.12],
      [783.99, 0.24],
      [1046.5, 0.36],
    ]) {
      const tt = t - start;
      if (tt < 0) continue;
      const isLast = start === 0.36;
      const decay = isLast ? 0.45 : 0.12;
      v += sine(f, tt) * env(tt, 0.005, decay) * 0.5;
      v += sine(f * 2, tt) * env(tt, 0.005, decay * 0.6) * 0.12;
      if (isLast) v += sine(f * 1.5, tt) * env(tt, 0.01, 0.3) * 0.1;
    }
    return v;
  })
);
