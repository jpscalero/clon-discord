import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Zap,
  Music,
  Trophy,
  Radio,
  Sliders,
  PartyPopper,
  Flame,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

/**
 * Motor sintetizador procedural de audio Web Audio API.
 * Genera sonidos de alta fidelidad 100% en el cliente sin depender de archivos de audio externos.
 */
class ProceduralAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;

  private init(): { ctx: AudioContext; master: GainNode } {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return { ctx: this.ctx, master: this.masterGain! };
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * 1. Airhorn:
   * Doble onda diente de sierra con vibrato rápido y ráfagas rítmicas icónicas de estadio.
   */
  public playAirhorn() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;

    // Ráfagas staccato de estadio + bocinazo final extendido
    const blasts = [
      { start: 0, dur: 0.085 },
      { start: 0.11, dur: 0.085 },
      { start: 0.22, dur: 0.085 },
      { start: 0.33, dur: 0.75 },
    ];

    blasts.forEach(({ start, dur }) => {
      const t = now + start;

      // Doble onda diente de sierra (sawtooth) ligeramente desafinada + armónico de quinta
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc3.type = 'sawtooth';

      // Frecuencias: Sib4 (~466.16 Hz), detune (+6 Hz), y Fa5 (~698.46 Hz)
      osc1.frequency.setValueAtTime(466.16, t);
      osc2.frequency.setValueAtTime(472.0, t);
      osc3.frequency.setValueAtTime(698.46, t);

      // LFO de vibrato rápido a 30 Hz para la agresividad de bocina neumática
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(30, t);
      lfoGain.gain.setValueAtTime(14, t);
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Envolvente de volumen (ADSR)
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.001, t);
      env.gain.linearRampToValueAtTime(0.55, t + 0.015);

      if (dur > 0.5) {
        // Ligera caída de tono y decaimiento al final del blast largo
        osc1.frequency.setValueAtTime(466.16, t + dur - 0.2);
        osc1.frequency.exponentialRampToValueAtTime(380, t + dur);
        env.gain.setValueAtTime(0.55, t + dur - 0.15);
        env.gain.exponentialRampToValueAtTime(0.001, t + dur);
      } else {
        env.gain.setValueAtTime(0.55, t + dur - 0.02);
        env.gain.exponentialRampToValueAtTime(0.001, t + dur);
      }

      // Filtro paso-banda para dar resonancia de campana de bronce
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1150, t);
      filter.Q.setValueAtTime(1.9, t);

      osc1.connect(env);
      osc2.connect(env);
      osc3.connect(env);
      env.connect(filter);
      filter.connect(master);

      osc1.start(t);
      osc2.start(t);
      osc3.start(t);
      lfo.start(t);

      const stopTime = t + dur + 0.05;
      osc1.stop(stopTime);
      osc2.stop(stopTime);
      osc3.stop(stopTime);
      lfo.stop(stopTime);
    });
  }

  /**
   * 2. Tada:
   * Acorde mayor arpegiado brillante con decaimiento brillante.
   */
  public playTada() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;

    // Arpegio brillante Do mayor: Do5 -> Mi5 -> Sol5 -> Do6 + brillos armónicos
    const notes = [
      { freq: 523.25, time: 0, dur: 0.12 },
      { freq: 659.25, time: 0.09, dur: 0.12 },
      { freq: 783.99, time: 0.18, dur: 0.14 },
      { freq: 1046.5, time: 0.28, dur: 0.95 },
      // Armónicos brillantes superiores
      { freq: 1318.51, time: 0.3, dur: 0.85 }, // Mi6
      { freq: 2093.0, time: 0.32, dur: 0.7 },  // Do7 campana
    ];

    notes.forEach(({ freq, time, dur }) => {
      const t = now + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = freq > 1200 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.42, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(gain);
      gain.connect(master);

      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  }

  /**
   * 3. Laser:
   * Barrido de frecuencia descendente exponencial (Pew Pew clásico).
   */
  public playLaser() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;

    // Ráfaga doble de láser
    [0, 0.14].forEach((offset) => {
      const t = now + offset;
      const dur = 0.13;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Barrido exponencial descendente desde 2400 Hz hasta 85 Hz
      osc.frequency.setValueAtTime(2400, t);
      osc.frequency.exponentialRampToValueAtTime(85, t + dur);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(master);

      osc.start(t);
      osc.stop(t + dur + 0.01);
    });
  }

  /**
   * 4. GG / Level Up:
   * Escala pentatónica ascendente en sintetizador chiptune 8-bit retro.
   */
  public playLevelUp() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;

    // Escala ascendente arcade: Do4, Mi4, Sol4, La4, Do5, Re5, Mi5, Sol5, Do6 sostenido
    const notes = [
      { freq: 261.63, dur: 0.06 },
      { freq: 329.63, dur: 0.06 },
      { freq: 392.0, dur: 0.06 },
      { freq: 440.0, dur: 0.06 },
      { freq: 523.25, dur: 0.06 },
      { freq: 587.33, dur: 0.06 },
      { freq: 659.25, dur: 0.06 },
      { freq: 783.99, dur: 0.08 },
      { freq: 1046.5, dur: 0.55 },
    ];

    let currentOffset = 0;
    notes.forEach(({ freq, dur }, idx) => {
      const t = now + currentOffset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // Chiptune clásico
      osc.frequency.setValueAtTime(freq, t);

      // Vibrato retro en la última nota
      if (idx === notes.length - 1) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(9, t);
        lfoGain.gain.setValueAtTime(12, t);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + dur);
      }

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.setValueAtTime(0.3, t + dur * 0.75);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(master);

      osc.start(t);
      osc.stop(t + dur + 0.01);

      currentOffset += dur * 0.88;
    });
  }

  /**
   * 5. Ba-Dum-Tss:
   * Dos golpes graves con decaimiento de tono seguidos por un platillo de ruido blanco.
   */
  public playBaDumTss() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;

    // 1. "Ba" (bombo grave a t = 0)
    const kick1 = ctx.createOscillator();
    const kick1Gain = ctx.createGain();
    kick1.type = 'sine';
    kick1.frequency.setValueAtTime(140, now);
    kick1.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    kick1Gain.gain.setValueAtTime(0.7, now);
    kick1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    kick1.connect(kick1Gain);
    kick1Gain.connect(master);
    kick1.start(now);
    kick1.stop(now + 0.14);

    // 2. "Dum" (tom a t = 0.16)
    const t2 = now + 0.16;
    const kick2 = ctx.createOscillator();
    const kick2Gain = ctx.createGain();
    kick2.type = 'sine';
    kick2.frequency.setValueAtTime(175, t2);
    kick2.frequency.exponentialRampToValueAtTime(55, t2 + 0.13);
    kick2Gain.gain.setValueAtTime(0.75, t2);
    kick2Gain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.14);
    kick2.connect(kick2Gain);
    kick2Gain.connect(master);
    kick2.start(t2);
    kick2.stop(t2 + 0.15);

    // 3. "Tss" (platillo crash de ruido blanco filtrado a t = 0.38)
    const t3 = now + 0.38;
    const crashDur = 0.8;
    const bufferSize = Math.floor(ctx.sampleRate * crashDur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(5400, t3);

    const crashGain = ctx.createGain();
    crashGain.gain.setValueAtTime(0.65, t3);
    crashGain.gain.exponentialRampToValueAtTime(0.001, t3 + crashDur);

    whiteNoise.connect(highpass);
    highpass.connect(crashGain);
    crashGain.connect(master);

    whiteNoise.start(t3);
    whiteNoise.stop(t3 + crashDur);
  }

  /**
   * 6. Applause:
   * Ráfaga modulada de ruido blanco filtrado simulando aplausos multitudinarios.
   */
  public playApplause() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;
    const dur = 2.4;

    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Filtro pasa-banda para imitar el impacto percusivo de las palmas
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, now);
    filter.Q.setValueAtTime(0.75, now);

    // Envolvente de volumen: crescendo suave, sostenido y desvanecimiento
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.42, now + 0.35);
    gain.gain.setValueAtTime(0.44, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    // LFO que modula la amplitud para generar la textura de aplausos irregulares
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(9.5, now);
    lfoGain.gain.setValueAtTime(0.12, now);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    whiteNoise.start(now);
    lfo.start(now);
    whiteNoise.stop(now + dur);
    lfo.stop(now + dur);
  }

  /**
   * 7. Headshot Dink:
   * Impacto metálico nítido en alta frecuencia característico de CS2 / Valorant.
   */
  public playHeadshot() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(2350, now);
    osc2.frequency.setValueAtTime(3450, now);

    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(master);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.15);
    osc2.stop(now + 0.15);
  }

  /**
   * 8. Spike Planted:
   * Secuencia de bips rítmicos agudos de detonador seguidos por caída sub-bass.
   */
  public playSpikePlanted() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;

    [0, 0.12, 0.24].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(960, now + offset);
      gain.gain.setValueAtTime(0.35, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + offset);
      osc.stop(now + offset + 0.09);
    });

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(120, now + 0.36);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.7);
    subGain.gain.setValueAtTime(0.55, now + 0.36);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    sub.connect(subGain);
    subGain.connect(master);
    sub.start(now + 0.36);
    sub.stop(now + 0.76);
  }

  /**
   * 9. ACE Fanfare:
   * Cadencia épica ascendente y triunfal al eliminar a toda la escuadra enemiga (1v5).
   */
  public playAce() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;
    const freqs = [330, 440, 554.37, 659.25, 880];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.28, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  }

  /**
   * 10. Tactical Timeout Buzzer:
   * Bocinazo grave y penetrante de interrupción reglamentaria de torneo.
   */
  public playTimeoutBuzzer() {
    const { ctx, master } = this.init();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.setValueAtTime(210, now + 0.35);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.95);
  }
}

// Instancia singleton del sintetizador procedural
const synthInstance = new ProceduralAudioSynth();

interface SoundboardItem {
  id: string;
  name: string;
  description: string;
  hotkey: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
  play: () => void;
  durationMs: number;
}

export const SoundboardModal: React.FC = () => {
  const { isSoundboardOpen, toggleSoundboard } = useChatStore();
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(80);
  const activeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const soundList: SoundboardItem[] = [
    {
      id: 'airhorn',
      name: 'Airhorn',
      description: 'Doble sierra con vibrato rápido y estocadas de estadio',
      hotkey: '1',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 hover:border-amber-400',
      badge: 'Estadio',
      durationMs: 1150,
      play: () => synthInstance.playAirhorn(),
    },
    {
      id: 'tada',
      name: 'Tada Fanfare',
      description: 'Acorde mayor arpegiado brillante con brillo cristalino',
      hotkey: '2',
      icon: <PartyPopper className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 hover:border-emerald-400',
      badge: 'Celebración',
      durationMs: 1250,
      play: () => synthInstance.playTada(),
    },
    {
      id: 'laser',
      name: 'Laser Blaster',
      description: 'Barrido de frecuencia descendente exponencial Pew-Pew',
      hotkey: '3',
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 hover:border-cyan-400',
      badge: 'Sci-Fi',
      durationMs: 350,
      play: () => synthInstance.playLaser(),
    },
    {
      id: 'level_up',
      name: 'GG / Level Up',
      description: 'Escala pentatónica chiptune retro arcade de victoria',
      hotkey: '4',
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      color: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/40 hover:border-yellow-400',
      badge: 'Chiptune',
      durationMs: 850,
      play: () => synthInstance.playLevelUp(),
    },
    {
      id: 'badumtss',
      name: 'Ba-Dum-Tss',
      description: 'Doble percusión grave y platillo crash de ruido blanco',
      hotkey: '5',
      icon: <Music className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40 hover:border-purple-400',
      badge: 'Comedia',
      durationMs: 1100,
      play: () => synthInstance.playBaDumTss(),
    },
    {
      id: 'applause',
      name: 'Applause',
      description: 'Ráfaga modulada de ruido filtrado simulando aplausos',
      hotkey: '6',
      icon: <Radio className="w-5 h-5 text-rose-400" />,
      color: 'from-rose-500/20 to-pink-600/20 border-rose-500/40 hover:border-rose-400',
      badge: 'Público',
      durationMs: 2400,
      play: () => synthInstance.playApplause(),
    },
    {
      id: 'headshot',
      name: 'Headshot Dink',
      description: 'Impacto metálico nítido en alta frecuencia (CS2 / VCT)',
      hotkey: '7',
      icon: <Zap className="w-5 h-5 text-red-400" />,
      color: 'from-red-500/20 to-rose-600/20 border-red-500/40 hover:border-red-400',
      badge: 'Esports',
      durationMs: 200,
      play: () => synthInstance.playHeadshot(),
    },
    {
      id: 'spike_planted',
      name: 'Spike Planted',
      description: 'Detonador rítmico con caída sub-bass (Valorant)',
      hotkey: '8',
      icon: <Flame className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-green-600/20 border-emerald-500/40 hover:border-emerald-400',
      badge: 'VCT Bomb',
      durationMs: 800,
      play: () => synthInstance.playSpikePlanted(),
    },
    {
      id: 'ace',
      name: 'ACE Fanfare',
      description: 'Campana triunfal épica de eliminación de escuadra 1v5',
      hotkey: '9',
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      color: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/40 hover:border-yellow-400',
      badge: 'VCT ACE',
      durationMs: 900,
      play: () => synthInstance.playAce(),
    },
    {
      id: 'timeout_buzzer',
      name: 'Timeout Horn',
      description: 'Bocinazo oficial de interrupción táctica de torneo',
      hotkey: '0',
      icon: <Radio className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500/20 to-red-600/20 border-orange-500/40 hover:border-orange-400',
      badge: 'Timeout',
      durationMs: 950,
      play: () => synthInstance.playTimeoutBuzzer(),
    },
  ];

  const triggerSound = useCallback((sound: SoundboardItem) => {
    sound.play();
    setActiveSoundId(sound.id);

    if (activeTimerRef.current) {
      clearTimeout(activeTimerRef.current);
    }

    activeTimerRef.current = setTimeout(() => {
      setActiveSoundId(null);
    }, sound.durationMs);
  }, []);

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    synthInstance.setVolume(newVal / 100);
  };

  // Atajos de teclado mientras el modal está abierto
  useEffect(() => {
    if (!isSoundboardOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleSoundboard();
        return;
      }

      const match = soundList.find((s) => s.hotkey === e.key);
      if (match) {
        e.preventDefault();
        triggerSound(match);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (activeTimerRef.current) {
        clearTimeout(activeTimerRef.current);
      }
    };
  }, [isSoundboardOpen, toggleSoundboard, triggerSound, soundList]);

  if (!isSoundboardOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#313338] border border-[#3f4147] rounded-xl shadow-2xl flex flex-col overflow-hidden text-[#dbdee1] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="px-6 py-4 bg-[#2b2d31] border-b border-[#232428] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-discord-blurple/20 flex items-center justify-center text-discord-blurple">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg leading-tight">Soundboard Pro</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-discord-blurple text-white px-2 py-0.5 rounded-full">
                  Web Audio Synthesizer
                </span>
              </div>
              <p className="text-xs text-[#949ba4]">
                Audio procedural sintetizado en el cliente con cero latencia y sin descargas
              </p>
            </div>
          </div>

          <button
            onClick={toggleSoundboard}
            className="p-1.5 rounded-md hover:bg-[#35373c] text-[#949ba4] hover:text-white transition-colors"
            title="Cerrar modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Control de Volumen y Atajos */}
        <div className="px-6 py-3 bg-[#2b2d31]/50 border-b border-[#232428] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-discord-blurple" />
            <span className="font-semibold text-white/90">Volumen Maestro</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVolumeChange(volume === 0 ? 80 : 0)}
                className="text-[#949ba4] hover:text-white transition-colors"
                title={volume === 0 ? 'Activar sonido' : 'Silenciar'}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4 text-discord-red" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-28 accent-discord-blurple cursor-pointer h-1.5 bg-[#1e1f22] rounded-lg"
              />
              <span className="font-mono text-[11px] text-[#949ba4] w-8">{volume}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#949ba4]">
            <span className="text-[11px]">Pulsa números</span>
            <kbd className="px-1.5 py-0.5 bg-[#1e1f22] text-white border border-[#3f4147] rounded text-[10px] font-mono">1-6</kbd>
            <span className="text-[11px]">para disparar rápido</span>
          </div>
        </div>

        {/* Rejilla de sonidos */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto custom-scrollbar">
          {soundList.map((sound) => {
            const isPlaying = activeSoundId === sound.id;

            return (
              <button
                key={sound.id}
                onClick={() => triggerSound(sound)}
                className={`relative group flex flex-col p-3.5 rounded-xl border bg-gradient-to-br ${sound.color} transition-all duration-200 text-left outline-none ${
                  isPlaying
                    ? 'ring-2 ring-discord-green scale-[1.02] shadow-[0_0_20px_rgba(35,165,90,0.35)]'
                    : 'hover:scale-[1.01] hover:bg-opacity-80 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-lg bg-[#1e1f22]/70 backdrop-blur border border-white/5">
                    {sound.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-black/40 text-[#dbdee1]">
                      {sound.badge}
                    </span>
                    <kbd className="w-5 h-5 flex items-center justify-center bg-discord-card border border-white/10 rounded text-[10px] font-mono font-bold text-white shadow-sm">
                      {sound.hotkey}
                    </kbd>
                  </div>
                </div>

                <h3 className="text-white font-bold text-sm tracking-wide group-hover:text-discord-blurple transition-colors">
                  {sound.name}
                </h3>
                <p className="text-[11px] text-[#949ba4] leading-relaxed mt-1 line-clamp-2">
                  {sound.description}
                </p>

                {/* Indicador de reproducción activa */}
                {isPlaying && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-discord-green font-bold">
                    <span className="w-2 h-2 rounded-full bg-discord-green animate-ping" />
                    <span>Reproduciendo...</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Pie de modal */}
        <div className="px-6 py-3.5 bg-[#2b2d31] border-t border-[#232428] flex items-center justify-between text-xs text-[#949ba4]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-discord-green" />
            <span>Motor de Síntesis Analógica Reactivo listo</span>
          </div>

          <button
            onClick={toggleSoundboard}
            className="px-4 py-1.5 bg-discord-blurple hover:bg-discord-blurple-hover text-white font-semibold rounded-md transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
