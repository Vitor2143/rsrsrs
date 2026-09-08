/* audio.js — 8-bit blips synthesised on the fly. No files, no library.
   Owns its own mute flag; the UI just flips Chip.on. */

const Chip = (() => {
  let ctx = null;
  const api = {
    on: true,

    blip(freq, dur = 0.09, type = 'square', gain = 0.055) {
      if (!api.on) return;
      // The context can only be created after a user gesture, so build it lazily.
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(gain, ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(amp).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    },

    /* notes: [[frequency, delayMs], ...] */
    jingle(notes) {
      notes.forEach(([f, t]) => setTimeout(() => api.blip(f, 0.14), t));
    },
  };
  return api;
})();
