// Pure Web Audio API Ambient Nature & Focus Sound Synthesizer
// 100% offline, zero network requests, lightweight and non-intrusive.

export type AmbientSoundType = 'none' | 'rain' | 'waves' | 'breeze' | 'focus';

export interface AmbientSoundOption {
  id: AmbientSoundType;
  label: string;
  emoji: string;
  description: string;
}

export const AMBIENT_SOUND_OPTIONS: AmbientSoundOption[] = [
  { id: 'none', label: 'ปิดเสียง', emoji: '🔇', description: 'โฟกัสแบบเงียบสงบ' },
  { id: 'rain', label: 'เสียงฝนตก', emoji: '🌧️', description: 'เสียงเม็ดฝนพรำนุ่มนวล' },
  { id: 'waves', label: 'คลื่นทะเล', emoji: '🌊', description: 'จังหวะคลื่นซัดหาดทราย' },
  { id: 'breeze', label: 'ลมธรรมชาติ', emoji: '🌲', description: 'สายลมพัดผ่านแมกไม้' },
  { id: 'focus', label: 'คลื่นสมาธิ', emoji: '🧘', description: 'เสียงหม่นโทนอุ่นลึก' },
];

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentType: AmbientSoundType = 'none';
  private volume: number = 0.5; // 0 to 1

  // Active nodes cleanup references
  private activeSources: Array<{ stop?: () => void; disconnect: () => void }> = [];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create a 5-second seamless noise buffer
  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.ctx!.sampleRate * 5;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink/Brown noise approximation for pleasant warmth
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }

  public stop() {
    this.activeSources.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // Ignore
      }
    });
    this.activeSources = [];
    this.currentType = 'none';
  }

  public play(type: AmbientSoundType) {
    this.stop();
    if (type === 'none') return;

    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentType = type;

    try {
      if (type === 'rain') {
        this.startRainSound();
      } else if (type === 'waves') {
        this.startWavesSound();
      } else if (type === 'breeze') {
        this.startBreezeSound();
      } else if (type === 'focus') {
        this.startFocusDroneSound();
      }
    } catch (e) {
      console.warn('Could not start ambient sound:', e);
    }
  }

  // 1. Rain Synthesizer
  private startRainSound() {
    const buffer = this.createNoiseBuffer();
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to sound like soft rainfall
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.28, this.ctx!.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start();
    this.activeSources.push(noise, filter, gain);
  }

  // 2. Ocean Waves Synthesizer (LFO modulated swell)
  private startWavesSound() {
    const buffer = this.createNoiseBuffer();
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx!.currentTime);

    // Wave swell LFO
    const swellGain = this.ctx!.createGain();
    swellGain.gain.setValueAtTime(0.15, this.ctx!.currentTime);

    const lfo = this.ctx!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx!.currentTime); // One wave every 8 seconds

    const lfoGain = this.ctx!.createGain();
    lfoGain.gain.setValueAtTime(0.18, this.ctx!.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(swellGain.gain);

    noise.connect(filter);
    filter.connect(swellGain);
    swellGain.connect(this.masterGain!);

    noise.start();
    lfo.start();

    this.activeSources.push(noise, lfo, filter, swellGain, lfoGain);
  }

  // 3. Forest Breeze Synthesizer
  private startBreezeSound() {
    const buffer = this.createNoiseBuffer();
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx!.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.22, this.ctx!.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start();
    this.activeSources.push(noise, filter, gain);
  }

  // 4. Deep Focus Warm Drone (Binaural meditation harmonics)
  private startFocusDroneSound() {
    const osc1 = this.ctx!.createOscillator();
    const osc2 = this.ctx!.createOscillator();
    const osc3 = this.ctx!.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(136.1, this.ctx!.currentTime); // Ohm frequency

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(140.1, this.ctx!.currentTime); // +4Hz binaural theta beat

    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(272.2, this.ctx!.currentTime); // Warm harmonic

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx!.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc1.start();
    osc2.start();
    osc3.start();

    this.activeSources.push(osc1, osc2, osc3, filter, gain);
  }
}

export const ambientEngine = new AmbientSoundEngine();
