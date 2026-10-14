import React from 'react';
import {
  Mic,
  MicOff,
  Hand,
  Radio,
  Users,
  Crown,
  Volume2,
  PhoneOff,
  Shield,
  MoreVertical,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const StageChannelView: React.FC = () => {
  const {
    stageSession,
    users,
    currentUser,
    requestToSpeakStage,
    moderateStageSpeaker,
    setViewMode,
  } = useChatStore();

  if (!stageSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1f22] text-[#949ba4]">
        <Radio className="w-12 h-12 mb-3 text-[#5865f2] opacity-50" />
        <h3 className="text-lg font-bold text-white">No hay ningún Escenario en vivo activo</h3>
        <button
          onClick={() => setViewMode('chat')}
          className="mt-4 px-4 py-2 bg-[#5865f2] text-white rounded-xl text-sm font-semibold"
        >
          Volver al Chat
        </button>
      </div>
    );
  }

  const speakers = stageSession.speakers.filter(
    (s) => s.role === 'host' || s.role === 'speaker'
  );
  const audience = stageSession.speakers.filter((s) => s.role === 'audience');

  const me = stageSession.speakers.find((s) => s.userId === currentUser.id);
  const hasRaisedHand = !!me?.raisedHandTime;
  const isHost = me?.role === 'host';

  return (
    <div className="flex-1 h-full bg-[#1e1f22] flex flex-col overflow-hidden select-none">
      {/* Stage Header */}
      <div className="h-16 px-6 bg-[#2b2d31]/80 backdrop-blur-md border-b border-[#1f2023] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#da373c] text-white rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>EN VIVO</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              {stageSession.topic}
            </h2>
            <p className="text-xs text-[#949ba4]">
              {speakers.length} ponentes en el escenario • {audience.length} en la audiencia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-[#949ba4]">
          <span className="flex items-center gap-1 bg-[#1e1f22] px-3 py-1 rounded-full border border-[#35373c]">
            <Users className="w-3.5 h-3.5 text-[#5865f2]" />
            <span>{stageSession.speakers.length} Conectados</span>
          </span>
        </div>
      </div>

      {/* Main Auditorium */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Section 1: Speakers Podium */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fee75c]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#949ba4]">
                EN EL ESCENARIO ({speakers.length})
              </h3>
            </div>
            {isHost && (
              <span className="text-[11px] text-[#23a55a] font-medium">
                👑 Eres el Anfitrión del Escenario
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {speakers.map((speaker) => {
              const u = users[speaker.userId] || {
                username: 'Usuario',
                displayName: 'Usuario',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              };
              return (
                <div
                  key={speaker.userId}
                  className={`relative bg-[#2b2d31] rounded-2xl p-4 flex flex-col items-center text-center border transition shadow-lg ${
                    speaker.isSpeaking
                      ? 'border-[#23a55a] ring-2 ring-[#23a55a]/40 bg-[#2b2d31]/90'
                      : 'border-[#35373c]'
                  }`}
                >
                  {/* Avatar with speaking glow */}
                  <div className="relative mb-3">
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className={`w-20 h-20 rounded-full object-cover transition-transform ${
                        speaker.isSpeaking ? 'scale-105 ring-4 ring-[#23a55a]' : ''
                      }`}
                    />
                    {speaker.role === 'host' && (
                      <div className="absolute -top-1.5 -right-1.5 bg-[#fee75c] p-1 rounded-full text-black shadow">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 p-1 rounded-full border-2 border-[#2b2d31] ${
                        speaker.isMuted ? 'bg-[#da373c] text-white' : 'bg-[#23a55a] text-white'
                      }`}
                    >
                      {speaker.isMuted ? (
                        <MicOff className="w-3 h-3" />
                      ) : (
                        <Mic className="w-3 h-3" />
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate max-w-full">
                    {u.displayName || u.username}
                  </h4>
                  <span className="text-[11px] text-[#949ba4] font-medium capitalize mt-0.5">
                    {speaker.role === 'host' ? 'Anfitrión' : 'Ponente'}
                  </span>

                  {/* Moderator Actions */}
                  {isHost && speaker.userId !== currentUser.id && (
                    <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-[#35373c] w-full justify-center">
                      <button
                        onClick={() => moderateStageSpeaker(speaker.userId, 'mute')}
                        className="p-1 hover:bg-[#35373c] text-[#949ba4] hover:text-white rounded"
                        title={speaker.isMuted ? 'Desmutear' : 'Mutear'}
                      >
                        <MicOff className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moderateStageSpeaker(speaker.userId, 'demote')}
                        className="px-2 py-0.5 bg-[#35373c] hover:bg-[#da373c]/20 hover:text-[#da373c] text-[#949ba4] text-[10px] rounded transition font-semibold"
                      >
                        Bajar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Audience */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#949ba4]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#949ba4]">
                AUDIENCIA ({audience.length})
              </h3>
            </div>
            {audience.some((a) => a.raisedHandTime) && (
              <span className="text-xs text-[#fee75c] font-semibold flex items-center gap-1 animate-bounce">
                ✋ {audience.filter((a) => a.raisedHandTime).length} personas solicitan hablar
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {audience.map((member) => {
              const u = users[member.userId] || {
                username: 'Usuario',
                displayName: 'Usuario',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              };
              return (
                <div
                  key={member.userId}
                  className={`bg-[#2b2d31]/60 hover:bg-[#2b2d31] p-3 rounded-2xl flex flex-col items-center text-center border transition relative group ${
                    member.raisedHandTime ? 'border-[#fee75c] bg-[#fee75c]/5' : 'border-[#35373c]/40'
                  }`}
                >
                  <div className="relative mb-2">
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {member.raisedHandTime && (
                      <div className="absolute -top-1 -right-1 bg-[#fee75c] p-1 rounded-full text-black shadow animate-pulse">
                        <Hand className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#dbdee1] truncate max-w-full">
                    {u.displayName || u.username}
                  </span>

                  {/* Host Promote Button */}
                  {isHost && (
                    <button
                      onClick={() => moderateStageSpeaker(member.userId, 'promote')}
                      className="mt-1 opacity-0 group-hover:opacity-100 px-2 py-0.5 bg-[#23a55a] text-white text-[10px] rounded-lg font-bold transition shadow"
                    >
                      Invitar a Hablar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="h-20 bg-[#2b2d31]/95 backdrop-blur-md border-t border-[#1f2023] px-8 flex items-center justify-between">
        {/* Left Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1e1f22] flex items-center justify-center text-[#5865f2]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Escenario en vivo</div>
            <div className="text-[11px] text-[#949ba4]">Cifrado WebRTC Opus HD</div>
          </div>
        </div>

        {/* Center Actions */}
        <div className="flex items-center gap-3">
          {/* Raise Hand Button */}
          <button
            onClick={requestToSpeakStage}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-lg ${
              hasRaisedHand
                ? 'bg-[#fee75c] text-black hover:bg-[#edd44c]'
                : 'bg-[#35373c] text-white hover:bg-[#3f4147]'
            }`}
          >
            <Hand className={`w-4 h-4 ${hasRaisedHand ? 'fill-current' : ''}`} />
            <span>{hasRaisedHand ? 'Mano Levantada' : 'Levantar la Mano'}</span>
          </button>

          {/* Mute button if speaker */}
          {me && (me.role === 'host' || me.role === 'speaker') && (
            <button
              onClick={() => moderateStageSpeaker(currentUser.id, 'mute')}
              className={`p-3 rounded-2xl transition ${
                me.isMuted
                  ? 'bg-[#da373c] text-white'
                  : 'bg-[#35373c] hover:bg-[#3f4147] text-white'
              }`}
            >
              {me.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {/* Leave Stage */}
          <button
            onClick={() => setViewMode('chat')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#da373c]/20 hover:bg-[#da373c] text-[#da373c] hover:text-white rounded-2xl text-xs font-bold transition"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Abandonar</span>
          </button>
        </div>

        {/* Right Info */}
        <div className="text-xs text-[#80848e]">
          Auditorio con moderación pro
        </div>
      </div>
    </div>
  );
};
