// Efeitos sonoros gerados dinamicamente via Web Audio API (100% offline e sem arquivos externos)

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  /**
   * Som gostoso de colocar feijãozinho na cartela (Pop orgânico suave)
   */
  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime;
      // Frequência rápida de drop (efeito pop de estalo suave)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, startTime);
      osc.frequency.exponentialRampToValueAtTime(140, startTime + 0.12);

      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.14);
    } catch (e) {
      // Ignora silenciosamente se o navegador bloquear áudio antes do primeiro clique
    }
  }

  /**
   * Som sutil ao desmarcar uma pedra
   */
  playUnmark() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, startTime);
      osc.frequency.exponentialRampToValueAtTime(90, startTime + 0.1);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.11);
    } catch (e) {}
  }

  /**
   * Sininho de prêmio ao atingir um marco de números marcados
   */
  playMilestone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [659.25, 783.99, 987.77, 1318.51];
      let t = this.ctx.currentTime;
      notes.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
        t += 0.11;
      });
    } catch (e) {}
  }

  /**
   * Sino suave quando uma nova pedra é sorteada do globo
   */
  playBallDrawn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, startTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, startTime + 0.15); // E5

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    } catch (e) {}
  }

  /**
   * Fanfarra triunfante e festiva de BINGO!
   */
  playBingoFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.50, d: 0.4 }  // C6
      ];

      let curTime = this.ctx.currentTime;
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, curTime);

        gain.gain.setValueAtTime(0.35, curTime);
        gain.gain.exponentialRampToValueAtTime(0.01, curTime + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(curTime);
        osc.stop(curTime + n.d + 0.05);

        curTime += n.d * 0.9;
      });
    } catch (e) {}
  }
}

export const soundFX = new SoundFX();
