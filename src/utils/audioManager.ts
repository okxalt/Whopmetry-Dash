// Audio Manager for Whopmetry Dash
export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain nodes for volume control
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      
      // Connect to destination
      this.musicGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.audioContext.destination);
      
      // Set initial volumes
      this.musicGain.gain.value = 0.3;
      this.sfxGain.gain.value = 0.5;
      
      this.isInitialized = true;
      console.log('Audio Manager initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }


  public async loadSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Generate procedural sounds since we don't have audio files
    await this.generateProceduralSounds();
  }

  private async generateProceduralSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Generate jump sound
    const jumpBuffer = this.generateTone(800, 0.1, 'sine');
    this.sounds.set('jump', jumpBuffer);

    // Generate coin collect sound
    const coinBuffer = this.generateTone(1200, 0.2, 'triangle');
    this.sounds.set('coin', coinBuffer);

    // Generate death sound
    const deathBuffer = this.generateTone(200, 0.5, 'sawtooth');
    this.sounds.set('death', deathBuffer);

    // Generate background music
    const musicBuffer = this.generateBackgroundMusic();
    this.sounds.set('music', musicBuffer);
  }

  private generateTone(frequency: number, duration: number, waveType: OscillatorType): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      switch (waveType) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'triangle':
          value = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1;
          break;
        case 'sawtooth':
          value = 2 * (frequency * t - Math.floor(frequency * t + 0.5));
          break;
      }
      
      // Apply envelope
      const envelope = Math.exp(-t * 5);
      data[i] = value * envelope * 0.3;
    }

    return buffer;
  }

  private generateBackgroundMusic(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const duration = 10; // 10 seconds loop
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Simple melody
    const melody = [440, 494, 523, 587, 659, 698, 784, 880]; // A4 to A5
    const noteDuration = sampleRate * 0.5;

    for (let i = 0; i < length; i++) {
      const noteIndex = Math.floor(i / noteDuration) % melody.length;
      const frequency = melody[noteIndex];
      const t = (i % noteDuration) / sampleRate;
      
      // Generate chord (root + fifth)
      const root = Math.sin(2 * Math.PI * frequency * t);
      const fifth = Math.sin(2 * Math.PI * frequency * 1.5 * t);
      
      // Apply envelope
      const envelope = Math.sin(t * Math.PI / 0.5) * 0.1;
      data[i] = (root + fifth * 0.5) * envelope;
    }

    return buffer;
  }

  public playSound(soundName: string, volume: number = 1): void {
    if (!this.audioContext || !this.sfxGain) return;

    const sound = this.sounds.get(soundName);
    if (!sound) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = sound;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(this.sfxGain);
    source.start();
  }

  public playMusic(loop: boolean = true): void {
    if (!this.audioContext || !this.musicGain) return;

    const music = this.sounds.get('music');
    if (!music) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = music;
    source.loop = loop;
    source.connect(this.musicGain);
    source.start();
  }

  public stopMusic(): void {
    // Note: In a real implementation, you'd need to track the music source
    // and call stop() on it. For simplicity, we'll just set volume to 0.
    if (this.musicGain) {
      this.musicGain.gain.value = 0;
    }
  }

  public setMusicVolume(volume: number): void {
    if (this.musicGain) {
      this.musicGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public setSfxVolume(volume: number): void {
    if (this.sfxGain) {
      this.sfxGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public resumeAudioContext(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();