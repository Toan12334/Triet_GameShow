let audioCtx = null;
let isMuted = false;
let bgmAudio = null;
let bgmVolume = 0.4;
let currentBgmUrl = '';
let isBgmManualPaused = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted) {
  isMuted = muted;
  if (bgmAudio) {
    bgmAudio.muted = muted;
  }
}

export function getSoundMuted() {
  return isMuted;
}

// ================= BACKGROUND MUSIC (BGM) WITH AUTO-LOOP =================

export function playBgm(url, volume = 0.4) {
  if (!url) return;
  bgmVolume = volume;

  // If already playing the same URL and not paused, do nothing
  if (bgmAudio && currentBgmUrl === url && !bgmAudio.paused) {
    return;
  }

  // If already instantiated same URL but paused
  if (bgmAudio && currentBgmUrl === url) {
    bgmAudio.volume = volume;
    bgmAudio.muted = isMuted;
    bgmAudio.play().catch((err) => console.warn('BGM play error:', err));
    isBgmManualPaused = false;
    return;
  }

  // New audio instance
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.src = '';
  }

  try {
    bgmAudio = new Audio(url);
    currentBgmUrl = url;
    bgmAudio.volume = volume;
    bgmAudio.muted = isMuted;
    
    // CRITICAL REQUIREMENT: Auto loop when finished
    bgmAudio.loop = true;
    bgmAudio.addEventListener('ended', () => {
      bgmAudio.currentTime = 0;
      bgmAudio.play().catch((e) => console.warn('BGM loop play error:', e));
    });

    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Auto-play was prevented by browser policy, waiting for user gesture:', err);
      });
    }
    isBgmManualPaused = false;
  } catch (err) {
    console.warn('Error setting up BGM:', err);
  }
}

export function pauseBgm() {
  if (bgmAudio && !bgmAudio.paused) {
    bgmAudio.pause();
    isBgmManualPaused = true;
  }
}

export function resumeBgm() {
  if (bgmAudio && bgmAudio.paused) {
    bgmAudio.muted = isMuted;
    bgmAudio.play().catch((err) => console.warn('BGM resume error:', err));
    isBgmManualPaused = false;
  }
}

export function stopBgm() {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
  isBgmManualPaused = true;
}

export function setBgmVolume(volume) {
  bgmVolume = Math.max(0, Math.min(1, volume));
  if (bgmAudio) {
    bgmAudio.volume = bgmVolume;
  }
}

export function getBgmVolume() {
  return bgmVolume;
}

export function isBgmPlaying() {
  return bgmAudio && !bgmAudio.paused;
}


// Click sound
export function playClick() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Card flip / tile open sound
export function playFlip() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Correct answer chime (Bright Game Show double-chime)
export function playCorrect() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // First note (E5 = 659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second higher note (B5 = 987Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.35, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.5);

    // Third highest note (E6 = 1318Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1318.51, now + 0.25);
    gain3.gain.setValueAtTime(0.4, now + 0.25);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.25);
    osc3.stop(now + 0.7);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Incorrect answer buzzer (Low sawtooth Game Show buzzer)
export function playIncorrect() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(130, now); // C3
    osc2.frequency.setValueAtTime(138, now); // C#3 (Dissonant beat)

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.setValueAtTime(0.3, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Suspense tick for countdown
export function playTick() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Grand Victory Fanfare
export function playFanfare() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { freq: 523.25, time: 0, dur: 0.15 },    // C5
      { freq: 523.25, time: 0.15, dur: 0.15 }, // C5
      { freq: 523.25, time: 0.3, dur: 0.15 },  // C5
      { freq: 659.25, time: 0.45, dur: 0.4 },  // E5
      { freq: 587.33, time: 0.85, dur: 0.15 }, // D5
      { freq: 659.25, time: 1.0, dur: 0.15 },  // E5
      { freq: 783.99, time: 1.15, dur: 0.7 },  // G5
      { freq: 1046.50, time: 1.85, dur: 1.2 }, // C6
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.time);

      gain.gain.setValueAtTime(0, now + n.time);
      gain.gain.linearRampToValueAtTime(0.35, now + n.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}
