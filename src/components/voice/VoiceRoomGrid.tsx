import React from 'react';
import {
  Mic,
  MicOff,
  Headphones,
  Monitor,
  Video,
  VideoOff,
  PhoneOff,
  Settings,
  Sparkles,
  Signal,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { AudioSpectrumCanvas } from './AudioSpectrumCanvas';

export const VoiceRoomGrid: React.FC = () => {
  const {
    voiceSession,
    users,
    guilds,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
    toggleCamera,
    leaveVoiceChannel,
    openModal,
    toggleSoundboard,
  } = useChatStore();

  if (!voiceSession) return null;

  const currentGuild = guilds.find((g) => g.id === voiceSession.guildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === voiceSession.channelId);

  const participants = voiceSession.activeParticipants.map((p) => ({
    ...p,
    user: users[p.userId],
  })).filter((p) => !!p.user);

  return (
    <div className="flex-1 bg-[#1e1f22] flex flex-col h-full overflow-hidden relative">
      {/* Cabecera del canal de voz */}
      <div className="h-12 border-b border-[#202225] flex items-center justify-between px-4 bg-[#2b2d31]/80 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <span className="text-[#80848e] text-lg font-bold">🔊</span>
          <h2 className="text-white font-bold text-sm tracking-wide">
            {currentChannel?.name || 'Canal de Voz'}
          </h2>
          <span className="text-xs bg-[#23a55a]/20 text-[#23a55a] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Signal className="w-3 h-3 animate-pulse" />
            RTC Conectado • {voiceSession.latencyMs}ms
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#949ba4]">
          <span className="bg-[#111214] px-2 py-1 rounded text-white/80 font-mono">
            MLS DAVE E2EE Activo
          </span>
        </div>
      </div>

      {/* Grid de participantes */}
      <div className="flex-1 p-4 grid gap-4 overflow-y-auto custom-scrollbar auto-rows-fr place-content-center"
        style={{
          gridTemplateColumns:
            participants.length === 1
              ? '1fr'
              : participants.length === 2
              ? 'repeat(2, 1fr)'
              : participants.length <= 4
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fit, minmax(280px, 1fr))',
          maxHeight: 'calc(100vh - 120px)',
        }}
      >
        {participants.map(({ user, isSpeaking, isMuted, userId }) => {
          const isCurrentUser = userId === useChatStore.getState().currentUser.id;
          const isCurrentSpeaking = isCurrentUser ? voiceSession.isSpeaking : isSpeaking;
          const isCurrentMuted = isCurrentUser ? voiceSession.isMuted : isMuted;

          return (
            <div
              key={user.id}
              className={`relative bg-[#2b2d31] rounded-lg overflow-hidden flex flex-col items-center justify-center min-h-[220px] max-h-[480px] w-full transition-all duration-150 ${
                isCurrentSpeaking
                  ? 'ring-2 ring-discord-green shadow-[0_0_20px_rgba(35,165,90,0.4)]'
                  : 'hover:bg-[#313338]'
              }`}
            >
              {/* Vista si tiene cámara encendida / o avatar */}
              {isCurrentUser && voiceSession.isCameraOn ? (
                <div className="w-full h-full bg-[#111214] flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <Video className="w-12 h-12 text-discord-blurple mx-auto mb-2 animate-bounce" />
                    <p className="text-white text-sm font-semibold">Cámara Web Activa</p>
                    <p className="text-xs text-[#949ba4]">Transmisión simulada a 1080p 60fps</p>
                  </div>
                </div>
              ) : isCurrentUser && voiceSession.isScreenSharing ? (
                <div className="w-full h-full bg-[#0d0e11] flex items-center justify-center relative overflow-hidden border border-discord-blurple/30">
                  <div className="text-center">
                    <Monitor className="w-12 h-12 text-[#23a55a] mx-auto mb-2 animate-pulse" />
                    <p className="text-white text-sm font-semibold">Compartiendo Pantalla</p>
                    <p className="text-xs text-[#949ba4]">Pantalla Completa 1 • 60 FPS</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className={`w-24 h-24 rounded-full object-cover transition duration-150 ${
                        isCurrentSpeaking
                          ? 'ring-4 ring-discord-green ring-offset-4 ring-offset-[#2b2d31]'
                          : ''
                      }`}
                    />
                    {isCurrentSpeaking && (
                      <span className="absolute -bottom-1 -right-1 bg-discord-green text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-full shadow">
                        HABLANDO
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-base">{user.displayName}</h3>
                  {isCurrentSpeaking && !isCurrentMuted && (
                    <div className="w-28 h-5 mt-0.5 opacity-90">
                      <AudioSpectrumCanvas
                        height={20}
                        barCount={16}
                        isMuted={false}
                        isSpeaking={true}
                        interactive={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Barra inferior de la tarjeta del participante */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <span className="bg-[#111214]/80 backdrop-blur text-white text-xs px-2 py-1 rounded font-semibold truncate max-w-[150px]">
                  {user.displayName}
                </span>

                <div className="flex items-center gap-1">
                  {isCurrentMuted && (
                    <span className="bg-[#da373c] text-white p-1 rounded-full shadow">
                      <MicOff className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {isCurrentUser && voiceSession.isDeafened && (
                    <span className="bg-[#da373c] text-white p-1 rounded-full shadow">
                      <Headphones className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dock de Control de Voz Inferior */}
      <div className="h-20 bg-[#111214] border-t border-[#202225] flex items-center justify-center px-6 gap-3 z-10">
        {/* Toggle Cámara */}
        <button
          onClick={toggleCamera}
          className={`p-3 rounded-full transition flex items-center justify-center ${
            voiceSession.isCameraOn
              ? 'bg-discord-blurple text-white shadow-lg'
              : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c] hover:text-white'
          }`}
          title={voiceSession.isCameraOn ? 'Apagar cámara' : 'Encender cámara'}
        >
          {voiceSession.isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Toggle Pantalla */}
        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-full transition flex items-center justify-center ${
            voiceSession.isScreenSharing
              ? 'bg-discord-green text-white shadow-lg'
              : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c] hover:text-white'
          }`}
          title={voiceSession.isScreenSharing ? 'Dejar de compartir pantalla' : 'Compartir pantalla'}
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Separador */}
        <div className="h-6 w-px bg-[#35373c] mx-1" />

        {/* Toggle Micrófono */}
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition flex items-center justify-center ${
            voiceSession.isMuted
              ? 'bg-[#da373c] text-white shadow-lg'
              : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c] hover:text-white'
          }`}
          title={voiceSession.isMuted ? 'Desmutear' : 'Mutear'}
        >
          {voiceSession.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Toggle Ensombrecer / Ensordecer */}
        <button
          onClick={toggleDeafen}
          className={`p-3 rounded-full transition flex items-center justify-center ${
            voiceSession.isDeafened
              ? 'bg-[#da373c] text-white shadow-lg'
              : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c] hover:text-white'
          }`}
          title={voiceSession.isDeafened ? 'Desensordecer' : 'Ensordecer'}
        >
          <Headphones className="w-5 h-5" />
        </button>

        {/* Soundboard */}
        <button
          onClick={toggleSoundboard}
          className="p-3 rounded-full bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c] hover:text-white transition"
          title="Abrir Soundboard Pro"
        >
          <Sparkles className="w-5 h-5 text-discord-blurple" />
        </button>

        {/* Ajustes de Voz */}
        <button
          onClick={() => openModal('userSettings')}
          className="p-3 rounded-full bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c] hover:text-white transition"
          title="Ajustes de Voz y Vídeo"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Desconectar */}
        <button
          onClick={leaveVoiceChannel}
          className="p-3 rounded-full bg-[#da373c] hover:bg-[#a1282c] text-white transition shadow-lg flex items-center justify-center ml-2"
          title="Desconectar"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
