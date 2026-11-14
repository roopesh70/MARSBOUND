class MarsAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private windGain: GainNode | null = null;
  private windOsc: AudioBufferSourceNode | null = null;
  private roverOsc: OscillatorNode | null = null;
  private roverGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.startWindAtmosphere();
    } catch {
      // Audio might fail if user hasn't interacted with page yet
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.windGain && this.ctx) {
      this.windGain.gain.setValueAtTime(muted ? 0 : 0.05, this.ctx.currentTime);
    }
    if (this.roverGain && this.ctx && muted) {
      this.roverGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  private startWindAtmosphere() {
    if (!this.ctx || this.isMuted) return;
    try {
      // Generate pink/brown noise buffer for thin Martian wind
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.8;
      }

      this.windOsc = this.ctx.createBufferSource();
      this.windOsc.buffer = buffer;
      this.windOsc.loop = true;

      // Bandpass filter to simulate thin CO2 atmosphere howling
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.windOsc.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      this.windOsc.start();
    } catch {
      // Ignore audio start errors before user gesture
    }
  }

  public playScanBeep() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Ignore
    }
  }

  public playDiscoveryFound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C - E - G - C arpeggio
      freqs.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + index * 0.08);
        osc.stop(this.ctx.currentTime + index * 0.08 + 0.45);
      });
    } catch {
      // Ignore
    }
  }

  public playWarningBeep() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }

  public playSampleCollect() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    } catch {
      // Ignore
    }
  }

  public playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Ignore
    }
  }

  public playBuildPlace() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // Ignore
    }
  }

  public playDustDevilGust() {
    if (!this.ctx || this.isMuted) return;
    try {
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Ignore
    }
  }

  public updateRoverEngine(speedRatio: number, isDriving: boolean) {
    if (!this.ctx || this.isMuted) return;
    try {
      if (!isDriving) {
        if (this.roverGain) {
          this.roverGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        return;
      }

      if (!this.roverOsc) {
        this.roverOsc = this.ctx.createOscillator();
        this.roverOsc.type = 'sawtooth';
        this.roverGain = this.ctx.createGain();
        this.roverGain.gain.setValueAtTime(0, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, this.ctx.currentTime);

        this.roverOsc.connect(filter);
        filter.connect(this.roverGain);
        this.roverGain.connect(this.ctx.destination);
        this.roverOsc.start();
      }

      if (this.roverOsc && this.roverGain) {
        const targetFreq = 50 + speedRatio * 180;
        this.roverOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
        this.roverGain.gain.setTargetAtTime(0.04 + speedRatio * 0.05, this.ctx.currentTime, 0.05);
      }
    } catch {
      // Ignore
    }
  }
}

export const audioService = new MarsAudioService();
