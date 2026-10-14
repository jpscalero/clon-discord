/**
 * Motor de Audio WebRTC / Web Audio API
 * Implementa:
 * - Histéresis VAD con Schmitt Trigger (-40dB / -52dB)
 * - Hangover time de 350ms
 * - Rampas de ganancia de 20ms (prevención de clicks/pops al mutear)
 * - Análisis RMS de volumen en tiempo real
 */

export interface AudioEngineCallbacks {
  onSpeakingChange: (speaking: boolean) => void;
  onVolumeChange: (volumeDb: number, normalized: number) => void;
  onError: (error: string) => void;
}

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  private isSpeaking = false;
  private isMuted = false;
  private hangoverTimer: NodeJS.Timeout | null = null;
  private animationFrameId: number | null = null;

  // Parámetros de Histéresis VAD
  private activationThresholdDb = -40;   // dBFS para comenzar a hablar
  private deactivationThresholdDb = -52; // dBFS para cortar la voz
  private hangoverTimeMs = 350;          // Tiempo de gracia para evitar parpadeos

  private callbacks: AudioEngineCallbacks;

  constructor(callbacks: AudioEngineCallbacks) {
    this.callbacks = callbacks;
    this.setupDeviceChangeListener();
  }

  public async startMicrophone(): Promise<boolean> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioCtx = new AudioContext({ latencyHint: 'interactive' });
      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.gainNode = this.audioCtx.createGain();
      this.analyserNode = this.audioCtx.createAnalyser();

      this.analyserNode.fftSize = 512;
      this.analyserNode.smoothingTimeConstant = 0.2;

      // Cadena: Source -> Gain (para muting suave) -> Analyser
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);

      this.startVADLoop();
      return true;
    } catch (err: any) {
      this.callbacks.onError(err.message || 'No se pudo acceder al micrófono');
      return false;
    }
  }

  public setMuted(muted: boolean) {
    if (!this.gainNode || !this.audioCtx) return;
    this.isMuted = muted;

    const now = this.audioCtx.currentTime;
    const fadeDuration = 0.02; // Rampa de 20ms anti-clicks

    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    if (muted) {
      // Rampa suave a 0
      this.gainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
      if (this.isSpeaking) {
        this.isSpeaking = false;
        this.callbacks.onSpeakingChange(false);
      }
    } else {
      // Rampa suave a 1
      this.gainNode.gain.linearRampToValueAtTime(1.0, now + fadeDuration);
    }
  }

  private startVADLoop() {
    if (!this.analyserNode) return;
    const dataArray = new Float32Array(this.analyserNode.fftSize);

    const checkLevel = () => {
      if (!this.analyserNode) return;

      this.analyserNode.getFloatTimeDomainData(dataArray);

      // Calcular RMS
      let sumSquares = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sumSquares += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sumSquares / dataArray.length);
      const db = rms > 0.00001 ? 20 * Math.log10(rms) : -120;
      const normalized = Math.max(0, Math.min(1, (db + 60) / 45));

      this.callbacks.onVolumeChange(Math.round(db), normalized);

      // Evaluación de VAD con histéresis si no está muteado
      if (!this.isMuted) {
        if (!this.isSpeaking) {
          if (db >= this.activationThresholdDb) {
            this.isSpeaking = true;
            this.clearHangover();
            this.callbacks.onSpeakingChange(true);
          }
        } else {
          if (db >= this.deactivationThresholdDb) {
            this.clearHangover();
          } else {
            if (!this.hangoverTimer) {
              this.hangoverTimer = setTimeout(() => {
                this.isSpeaking = false;
                this.hangoverTimer = null;
                this.callbacks.onSpeakingChange(false);
              }, this.hangoverTimeMs);
            }
          }
        }
      }

      this.animationFrameId = requestAnimationFrame(checkLevel);
    };

    this.animationFrameId = requestAnimationFrame(checkLevel);
  }

  private clearHangover() {
    if (this.hangoverTimer) {
      clearTimeout(this.hangoverTimer);
      this.hangoverTimer = null;
    }
  }

  private setupDeviceChangeListener() {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = async () => {
        console.log('[AudioEngine] Cambio de hardware detectado.');
      };
    }
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.clearHangover();
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.isSpeaking = false;
    this.callbacks.onSpeakingChange(false);
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public getAudioContext(): AudioContext | null {
    return this.audioCtx;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export class AudioEngineManager {
  private instance: AudioEngine | null = null;

  public async start(onVolume?: (energyDb: number, isSpeaking: boolean) => void): Promise<boolean> {
    if (this.instance) {
      this.instance.stop();
    }
    let currentSpeaking = false;
    this.instance = new AudioEngine({
      onSpeakingChange: (speaking) => {
        currentSpeaking = speaking;
      },
      onVolumeChange: (volumeDb) => {
        if (onVolume) {
          onVolume(volumeDb, currentSpeaking);
        }
      },
      onError: (err) => {
        console.warn('[AudioEngineManager] Error:', err);
      },
    });
    return await this.instance.startMicrophone();
  }

  public stop() {
    if (this.instance) {
      this.instance.stop();
      this.instance = null;
    }
  }

  public setMuted(muted: boolean) {
    if (this.instance) {
      this.instance.setMuted(muted);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.instance?.getAnalyser() || null;
  }

  public getAudioContext(): AudioContext | null {
    return this.instance?.getAudioContext() || null;
  }

  public getIsSpeaking(): boolean {
    return this.instance?.getIsSpeaking() || false;
  }

  public getIsMuted(): boolean {
    return this.instance?.getIsMuted() || false;
  }
}

export const audioEngine = new AudioEngineManager();

