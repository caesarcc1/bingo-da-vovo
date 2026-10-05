// Trilha sonora aconchegante do Bingo da Vovó
// Toca "Bossa Antigua" (Kevin MacLeod - incompetech.com, sob licença Creative Commons Attribution 4.0)
// Recursos de acessibilidade para idosos:
// 1. Volume inicial suave e discreto (0.14) para não cansar o ouvido
// 2. Abaixa suavemente (ducking) enquanto a voz narra a pedra sorteada
// 3. Pausa/desliga automaticamente quando familiares entram na sala para não atrapalhar conversas
// 4. Fallback automático para sintetizador Web Audio caso o áudio falhe

class MusicSynthesizer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.baseVolume = 0.14; // Volume suave por padrão
    this.currentTheme = 'bossa';
    this.isDucked = false;
    this.isFamilyInRoom = false;
    this.pausedByFamily = false;
    this.fadeInterval = null;
    this.useSynthFallback = false;

    // Web Audio Fallback
    this.synthCtx = null;
    this.synthMasterGain = null;
    this.synthFilter = null;
    this.synthIntervalId = null;
    this.synthStep = 0;
  }

  async init() {
    if (typeof window === 'undefined') return;

    if (!this.audio) {
      try {
        this.audio = new Audio('/audio/bossa.mp3');
        this.audio.loop = true;
        this.audio.volume = this.baseVolume;
        this.audio.preload = 'auto';

        this.audio.addEventListener('error', () => {
          console.warn('[MusicSynthesizer] MP3 não carregou. Ativando sintetizador fallback.');
          this.useSynthFallback = true;
        });
      } catch (err) {
        this.useSynthFallback = true;
      }
    }

    if (this.synthCtx && this.synthCtx.state === 'suspended') {
      try {
        await this.synthCtx.resume();
      } catch (e) {}
    }
  }

  fadeTo(targetVolume, duration = 300) {
    if (!this.audio || this.useSynthFallback) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const steps = 12;
    const stepTime = duration / steps;
    const startVolume = this.audio.volume;
    const diff = targetVolume - startVolume;
    let stepCount = 0;

    this.fadeInterval = setInterval(() => {
      stepCount++;
      const nextVol = Math.max(0, Math.min(1, startVolume + (diff * (stepCount / steps))));
      if (this.audio) this.audio.volume = nextVol;

      if (stepCount >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (this.audio) this.audio.volume = targetVolume;
      }
    }, stepTime);
  }

  async start() {
    await this.init();

    // Se houver parentes na sala, mantém em silêncio para conversarem
    if (this.isFamilyInRoom) {
      this.pausedByFamily = true;
      return;
    }

    this.isPlaying = true;
    this.pausedByFamily = false;

    if (this.audio && !this.useSynthFallback) {
      try {
        this.audio.currentTime = this.audio.currentTime || 0;
        this.audio.volume = this.isDucked ? 0.02 : this.baseVolume;
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (err) {
        // Bloqueio de autoplay inicial do navegador -> ativa fallback do Web Audio
        this.startSynth();
      }
    } else {
      this.startSynth();
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.audio) {
      try {
        this.audio.pause();
      } catch (e) {}
    }
    this.stopSynth();
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  // Reduz volume suavemente enquanto a voz do sorteio fala a pedra
  duck(enable) {
    this.isDucked = enable;
    const target = enable ? 0.02 : this.baseVolume;

    if (this.audio && !this.useSynthFallback && this.isPlaying) {
      this.fadeTo(target, 250);
    } else if (this.synthMasterGain && this.synthCtx) {
      const synthTarget = enable ? this.baseVolume * 0.2 : this.baseVolume;
      this.synthMasterGain.gain.setTargetAtTime(synthTarget, this.synthCtx.currentTime, 0.15);
    }
  }

  setVolume(val) {
    this.baseVolume = Math.max(0, Math.min(1, val));
    if (this.audio && this.isPlaying) {
      this.fadeTo(this.isDucked ? 0.02 : this.baseVolume, 150);
    }
    if (this.synthMasterGain && this.synthCtx) {
      this.synthMasterGain.gain.setValueAtTime(this.baseVolume, this.synthCtx.currentTime);
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
  }

  /**
   * Chamado quando o status de parentes na sala muda.
   * Se houver outro parente na sala, desliga a música para priorizar a voz da família.
   * Se os parentes saírem e a vovó ficar sozinha, religa a música de fundo automaticamente.
   */
  setFamilyInRoom(inRoom) {
    this.isFamilyInRoom = inRoom;
    if (inRoom) {
      if (this.isPlaying) {
        this.pausedByFamily = true;
        this.stop();
      }
    } else {
      if (this.pausedByFamily) {
        this.pausedByFamily = false;
        this.start();
      }
    }
  }

  // ==========================================
  // SINTETIZADOR WEB AUDIO (Plano B Fallback)
  // ==========================================
  initSynth() {
    if (!this.synthCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.synthCtx = new AudioCtx();
        this.synthFilter = this.synthCtx.createBiquadFilter();
        this.synthFilter.type = 'lowpass';
        this.synthFilter.frequency.setValueAtTime(1400, this.synthCtx.currentTime);

        this.synthMasterGain = this.synthCtx.createGain();
        this.synthMasterGain.gain.setValueAtTime(this.baseVolume, this.synthCtx.currentTime);

        this.synthFilter.connect(this.synthMasterGain);
        this.synthMasterGain.connect(this.synthCtx.destination);
      }
    }
  }

  playSynthNote(freq, time, duration, gainAmount = 0.15) {
    if (!this.synthCtx || !this.isPlaying) return;
    try {
      const osc = this.synthCtx.createOscillator();
      const noteGain = this.synthCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      noteGain.gain.setValueAtTime(0.001, time);
      noteGain.gain.linearRampToValueAtTime(gainAmount, time + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(noteGain);
      noteGain.connect(this.synthFilter);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch (e) {}
  }

  tickSynth() {
    if (!this.isPlaying || !this.synthCtx) return;
    const now = this.synthCtx.currentTime;

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 392.00]  // G7
    ];
    const chordIndex = Math.floor(this.synthStep / 4) % chords.length;
    const chord = chords[chordIndex];
    const noteIndex = this.synthStep % 4;

    this.playSynthNote(chord[noteIndex], now, 0.75, 0.12);
    if (noteIndex === 0) {
      this.playSynthNote(chord[0] / 2, now, 0.95, 0.18);
    }
    this.synthStep++;
  }

  startSynth() {
    this.initSynth();
    if (this.synthIntervalId) clearInterval(this.synthIntervalId);
    this.tickSynth();
    this.synthIntervalId = setInterval(() => this.tickSynth(), 480);
  }

  stopSynth() {
    if (this.synthIntervalId) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
  }
}

export const musicSynthesizer = new MusicSynthesizer();
