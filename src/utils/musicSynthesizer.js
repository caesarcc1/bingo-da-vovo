// Sintetizador de trilha sonora relaxante via Web Audio API
// Projetado especialmente para terceira idade: timbres aveludados, sem frequências estridentes

class MusicSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTheme = 'calmo'; // 'calmo' | 'alegre' | 'classico'
    this.volume = 0.25; // volume confortável
    this.masterGain = null;
    this.filter = null;
    this.intervalId = null;
    this.step = 0;
    this.isDucked = false; // reduz volume quando a voz fala
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        // Filtro passa-baixa para dar um som aveludado e vintage, sem incomodar o ouvido
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(950, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.filter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      const target = this.isDucked ? this.volume * 0.35 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
  }

  // Reduz volume suavemente enquanto a voz narra a pedra
  duck(enable) {
    this.isDucked = enable;
    if (this.masterGain && this.ctx) {
      const target = enable ? this.volume * 0.35 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.2);
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.step = 0;
  }

  playNote(freq, time, duration, gainAmount = 0.15) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle'; // timbre doce e macio
      osc.frequency.setValueAtTime(freq, time);

      // Envelope suave (ataque macio e release progressivo)
      noteGain.gain.setValueAtTime(0.001, time);
      noteGain.gain.linearRampToValueAtTime(gainAmount, time + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(noteGain);
      noteGain.connect(this.filter);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch (e) {}
  }

  tick() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.currentTheme === 'calmo') {
      // Progressão suave estilo Bossa/MPB acústica (Cmaj7 -> Am7 -> Dm7 -> G7)
      const chordPool = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C E G B)
        [220.00, 261.63, 329.63, 392.00], // Am7 (A C E G)
        [293.66, 349.23, 440.00, 523.25], // Dm7 (D F A C)
        [196.00, 246.94, 293.66, 392.00]  // G7 (G B D F)
      ];
      const chordIndex = Math.floor(this.step / 4) % chordPool.length;
      const chord = chordPool[chordIndex];
      const noteIndex = this.step % 4;

      // Arpejo delicado e aconchegante
      this.playNote(chord[noteIndex], now, 0.7, 0.12);
      if (noteIndex === 0) {
        // Baixo acústico suave
        this.playNote(chord[0] / 2, now, 0.9, 0.18);
      }
    } else if (this.currentTheme === 'alegre') {
      // Melodia animada e festiva em tom maior
      const melody = [
        { f: 261.63, b: 130.81 }, // Dó
        { f: 329.63, b: null },   // Mi
        { f: 392.00, b: 196.00 }, // Sol
        { f: 440.00, b: null },   // Lá
        { f: 523.25, b: 130.81 }, // Dó agudo
        { f: 392.00, b: null },   // Sol
        { f: 349.23, b: 174.61 }, // Fá
        { f: 293.66, b: null }    // Ré
      ];
      const cur = melody[this.step % melody.length];
      this.playNote(cur.f, now, 0.35, 0.14);
      if (cur.b) {
        this.playNote(cur.b, now, 0.45, 0.16);
      }
    } else if (this.currentTheme === 'classico') {
      // Valsinha clássica (1 - 2 - 3)
      const waltzChords = [
        { bass: 130.81, chord: [261.63, 329.63, 392.00] }, // C
        { bass: 174.61, chord: [261.63, 349.23, 440.00] }, // F
        { bass: 196.00, chord: [246.94, 293.66, 392.00] }  // G
      ];
      const wIndex = Math.floor(this.step / 3) % waltzChords.length;
      const beat = this.step % 3;
      const w = waltzChords[wIndex];

      if (beat === 0) {
        // Tempo 1: Baixo
        this.playNote(w.bass, now, 0.55, 0.2);
      } else {
        // Tempos 2 e 3: Acordes suaves
        w.chord.forEach(f => this.playNote(f, now, 0.4, 0.08));
      }
    }

    this.step++;
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Ritmo tranquilo (a cada 450ms no calmo/alegre, 500ms na valsa)
    const intervalTime = this.currentTheme === 'classico' ? 520 : 440;
    this.intervalId = setInterval(() => this.tick(), intervalTime);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }
}

export const musicSynthesizer = new MusicSynthesizer();
