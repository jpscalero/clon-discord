import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Headphones,
  PhoneOff,
  Sparkles,
  ShieldCheck,
  Signal,
  Activity,
  Radio,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { AudioSpectrumCanvas } from './AudioSpectrumCanvas';
import { AudioQualityMode } from '../../types';

export const VoiceStudioHUD: React.FC = () => {
  const {
    voiceSession,
    guilds,
    toggleMute,
    toggleDeafen,
    leaveVoiceChannel,
    toggleSoundboard,
    audioQuality,
    setAudioQuality,
  } = useChatStore();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState({
    pingMs: 14,
    jitterMs: 1.2,
    packetLoss: 0.0,
    bitrateActual: 384,
  });

  // Si no hay sesión de voz activa, no se muestra el HUD flotante
  if (!voiceSession) return null;

  const currentGuild = guilds.find((g) => g.id === voiceSession.guildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === voiceSession.channelId);

  // Simulación orgánica de fluctuaciones leves de telemetría de red RTC
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const pingBase = voiceSession.latencyMs || 14;
        const pingDelta = (Math.random() - 0.5) * 3;
        const newPing = Math.max(8, Math.min(32, Math.round(pingBase + pingDelta)));

        const jitter = Number((1.1 + Math.random() * 0.9).toFixed(1));
        const actualBitrate =
          audioQuality === 'hifi' ? 384 : audioQuality === 'broadcast' ? 128 : 64;

        return {
          pingMs: newPing,
          jitterMs: jitter,
          packetLoss: 0.0,
          bitrateActual: actualBitrate,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [voiceSession.latencyMs, audioQuality]);

  const qualityOptions: { mode: AudioQualityMode; label: string; bitrate: string; desc: string }[] = [
    {
      mode: 'standard',
      label: 'Standard',
      bitrate: '64 kbps',
      desc: 'Bajo consumo de datos y ancho de banda optimizado',
    },
    {
      mode: 'broadcast',
      label: 'Broadcast',
      bitrate: '128 kbps',
      desc: 'Voz cristalina para streaming y podcasts',
    },
    {
      mode: 'hifi',
      label: 'Hi-Fi Studio',
      bitrate: '384 kbps',
      desc: 'Opus Fullband Stereo sin compresión audible',
    },
  ];

  return (
    <aside
      aria-label="Estudio de Voz y Telemetría RTC"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl bg-[#1e1f22]/95 backdrop-blur-xl border border-[#3f4147]/80 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-[#dbdee1] transition-all duration-300 animate-slideUp"
    >
      {/* Barra Principal del HUD */}
      <div className="p-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Sección Izquierda: Estado RTC y Canal */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#2b2d31] flex items-center justify-center border border-white/5">
              <Signal className="w-5 h-5 text-discord-green animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-discord-green rounded-full border-2 border-[#1e1f22]" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm truncate max-w-[150px]">
                {currentChannel?.name || 'Canal de Voz'}
              </span>
              <span className="text-[10px] font-semibold bg-discord-green/20 text-discord-green px-1.5 py-0.5 rounded-full">
                RTC Conectado
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#949ba4]">
              <span>{currentGuild?.name || 'Servidor'}</span>
              <span>•</span>
              <span className="font-mono text-white/90">{telemetry.pingMs} ms</span>
            </div>
          </div>
        </div>

        {/* Sección Central: Mini Espectrograma de Audio en Tiempo Real */}
        <div className="flex-1 min-w-[180px] max-w-xs px-2 flex flex-col justify-center">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#949ba4] mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-discord-blurple" />
              <span>FFT ANALYZER</span>
            </span>
            <span className={voiceSession.isMuted ? 'text-discord-red font-semibold' : 'text-discord-green font-semibold'}>
              {voiceSession.isMuted ? 'MUTEADO' : voiceSession.isSpeaking ? 'HABLANDO' : 'EN ESPERA'}
            </span>
          </div>

          <div className="h-9 w-full bg-[#111214]/80 rounded-lg p-1 border border-white/5 overflow-hidden">
            <AudioSpectrumCanvas
              height={28}
              barCount={24}
              isMuted={voiceSession.isMuted}
              isSpeaking={voiceSession.isSpeaking}
              interactive={true}
            />
          </div>
        </div>

        {/* Selector Rápido de Calidad Opus */}
        <div className="hidden md:flex items-center bg-[#111214] p-1 rounded-xl border border-white/5">
          {qualityOptions.map((opt) => {
            const isSelected = audioQuality === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => setAudioQuality(opt.mode)}
                title={opt.desc}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-discord-blurple text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-[#80848e]'}`}>
                  {opt.bitrate}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sección Derecha: Accesos Directos de Voz y Soundboard */}
        <div className="flex items-center gap-1.5">
          {/* Soundboard */}
          <button
            onClick={toggleSoundboard}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2b2d31] hover:bg-[#35373c] text-discord-text-normal hover:text-white rounded-xl border border-white/5 transition font-semibold text-xs shadow"
            title="Abrir Soundboard Pro"
          >
            <Sparkles className="w-4 h-4 text-discord-blurple" />
            <span className="hidden sm:inline">Soundboard</span>
          </button>

          {/* Toggle Mute */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl transition border border-white/5 ${
              voiceSession.isMuted
                ? 'bg-discord-red text-white shadow-[0_0_12px_rgba(242,63,67,0.4)]'
                : 'bg-[#2b2d31] hover:bg-[#35373c] text-[#dbdee1]'
            }`}
            title={voiceSession.isMuted ? 'Desmutear micrófono' : 'Mutear micrófono'}
          >
            {voiceSession.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Toggle Deafen */}
          <button
            onClick={toggleDeafen}
            className={`p-2 rounded-xl transition border border-white/5 ${
              voiceSession.isDeafened
                ? 'bg-discord-red text-white shadow-[0_0_12px_rgba(242,63,67,0.4)]'
                : 'bg-[#2b2d31] hover:bg-[#35373c] text-[#dbdee1]'
            }`}
            title={voiceSession.isDeafened ? 'Desensordecer' : 'Ensordecer'}
          >
            <Headphones className="w-4 h-4" />
          </button>

          {/* Desconectar */}
          <button
            onClick={leaveVoiceChannel}
            className="p-2 rounded-xl bg-discord-red/90 hover:bg-discord-red text-white transition shadow border border-white/5"
            title="Desconectar de la llamada"
          >
            <PhoneOff className="w-4 h-4" />
          </button>

          {/* Expandir / Colapsar Panel de Telemetría */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-[#949ba4] hover:text-white hover:bg-white/5 transition ml-0.5"
            title={isExpanded ? 'Ocultar telemetría extendida' : 'Mostrar telemetría extendida'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Panel Desplegable de Telemetría Detallada y Cifrado */}
      {isExpanded && (
        <div className="px-4 py-3 bg-[#18191c]/90 border-t border-[#2b2d31] rounded-b-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn">
          {/* Telemetría 1: Cifrado E2EE MLS */}
          <div className="flex items-center gap-2.5 p-2 bg-[#1e1f22] rounded-xl border border-white/5">
            <div className="p-1.5 rounded-lg bg-discord-green/20 text-discord-green">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#949ba4] font-semibold uppercase">Cifrado E2EE</span>
              <span className="font-bold text-white text-[11px]">MLS DAVE Activo</span>
            </div>
          </div>

          {/* Telemetría 2: Jitter de Red */}
          <div className="flex items-center gap-2.5 p-2 bg-[#1e1f22] rounded-xl border border-white/5">
            <div className="p-1.5 rounded-lg bg-discord-blurple/20 text-discord-blurple">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#949ba4] font-semibold uppercase">Jitter de Red</span>
              <span className="font-bold text-white font-mono text-[11px]">{telemetry.jitterMs} ms</span>
            </div>
          </div>

          {/* Telemetría 3: Pérdida de paquetes */}
          <div className="flex items-center gap-2.5 p-2 bg-[#1e1f22] rounded-xl border border-white/5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#949ba4] font-semibold uppercase">Packet Loss</span>
              <span className="font-bold text-white font-mono text-[11px]">{telemetry.packetLoss.toFixed(1)}%</span>
            </div>
          </div>

          {/* Telemetría 4: Códec y Bitrate Opus */}
          <div className="flex items-center gap-2.5 p-2 bg-[#1e1f22] rounded-xl border border-white/5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Radio className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#949ba4] font-semibold uppercase">Códec RTC</span>
              <span className="font-bold text-white font-mono text-[11px]">Opus {telemetry.bitrateActual} kbps</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
