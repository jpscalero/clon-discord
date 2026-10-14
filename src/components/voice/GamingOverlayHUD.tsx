import React, { useState } from 'react';
import {
  Activity,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  ShieldAlert,
  Flame,
  Gauge,
  Crosshair,
  Maximize2,
  Minimize2,
  Move,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const GamingOverlayHUD: React.FC = () => {
  const {
    isGamingOverlayOpen,
    toggleGamingOverlay,
    isTacticalTimeoutActive,
    tacticalTimeoutSecondsLeft,
    triggerTacticalTimeout,
    currentUser,
    users,
    voiceSession,
    toggleMute,
    toggleDeafen,
  } = useChatStore();

  const [position, setPosition] = useState<'top-left' | 'top-right'>('top-left');
  const [isCrosshairGuideActive, setIsCrosshairGuideActive] = useState<boolean>(false);

  if (!isGamingOverlayOpen) return null;

  // Active teammates in voice or squad
  const squadMembers = [
    currentUser,
    users['100000000000000002'], // Boaster
    users['100000000000000003'], // Potter
    users['100000000000000004'], // s1mple
    users['100000000000000005'], // Faker
  ].filter(Boolean);

  return (
    <>
      {/* Optional In-Game Crosshair Overlay Simulation */}
      {isCrosshairGuideActive && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full shadow-[0_0_8px_#22c55e]" />
            <div className="absolute w-3 h-0.5 bg-[#22c55e] -left-2" />
            <div className="absolute w-3 h-0.5 bg-[#22c55e] -right-2" />
            <div className="absolute w-0.5 h-3 bg-[#22c55e] -top-2" />
            <div className="absolute w-0.5 h-3 bg-[#22c55e] -bottom-2" />
          </div>
        </div>
      )}

      {/* Floating Esports In-Game Discord HUD */}
      <div
        className={`fixed z-50 ${
          position === 'top-left' ? 'top-6 left-6' : 'top-6 right-6'
        } w-84 bg-[#0b0e14]/90 backdrop-blur-xl border border-[#2b3547] rounded-3xl shadow-2xl p-4 text-[#e2e8f0] select-none transition-all duration-300 animate-in fade-in zoom-in-95`}
      >
        {/* Top Bar: Title & Telemetry */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2b3547]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
            <span className="text-xs font-black tracking-wider uppercase text-white">
              DISCORD PRO OVERLAY
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#ff4655] text-white font-bold rounded">
              144+ FPS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPosition((p) => (p === 'top-left' ? 'top-right' : 'top-left'))}
              title="Mover esquina"
              className="p-1 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1e293b] transition"
            >
              <Move className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleGamingOverlay}
              title="Cerrar overlay"
              className="p-1 text-[#94a3b8] hover:text-[#ef4444] rounded-lg hover:bg-[#1e293b] transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Hardware & Network Telemetry */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center">
          <div className="bg-[#111620] p-1.5 rounded-xl border border-[#2b3547]">
            <div className="text-[10px] text-[#94a3b8]">FPS</div>
            <div className="text-xs font-black text-[#22c55e]">358</div>
          </div>
          <div className="bg-[#111620] p-1.5 rounded-xl border border-[#2b3547]">
            <div className="text-[10px] text-[#94a3b8]">LATENCIA</div>
            <div className="text-xs font-black text-[#38bdf8]">7ms</div>
          </div>
          <div className="bg-[#111620] p-1.5 rounded-xl border border-[#2b3547]">
            <div className="text-[10px] text-[#94a3b8]">PÉRDIDA</div>
            <div className="text-xs font-black text-white">0.0%</div>
          </div>
          <div className="bg-[#111620] p-1.5 rounded-xl border border-[#2b3547]">
            <div className="text-[10px] text-[#94a3b8]">TICK</div>
            <div className="text-xs font-black text-[#facc15]">128</div>
          </div>
        </div>

        {/* Tactical Timeout Banner / Button */}
        {isTacticalTimeoutActive ? (
          <div className="my-3 p-3 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-2xl text-white shadow-lg animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <div>
                <div className="text-xs font-black">TIMEOUT TÁCTICO ACTIVO</div>
                <div className="text-[10px] opacity-90">Canal exclusivo Coach Potter & IGL</div>
              </div>
            </div>
            <div className="text-xl font-black font-mono bg-black/30 px-2.5 py-1 rounded-xl">
              {tacticalTimeoutSecondsLeft}s
            </div>
          </div>
        ) : (
          <button
            onClick={triggerTacticalTimeout}
            className="w-full my-3 py-2 px-3 bg-gradient-to-r from-[#ff4655]/20 to-[#f97316]/20 hover:from-[#ff4655] hover:to-[#f97316] text-[#ff4655] hover:text-white border border-[#ff4655]/40 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition shadow-md group"
          >
            <ShieldAlert className="w-4 h-4 text-[#ff4655] group-hover:text-white" />
            <span>SOLICITAR TACTICAL TIMEOUT (60s)</span>
          </button>
        )}

        {/* Active Squad Voice Roster */}
        <div className="space-y-2 mt-2">
          <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider px-1">
            Escuadra en Voz (VCT Team SEN)
          </div>
          {squadMembers.map((member, idx) => {
            const isSpeaking = idx === 0 || idx === 1; // simulation
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#111620] border border-[#2b3547]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.displayName}
                      className={`w-7 h-7 rounded-full object-cover ${
                        isSpeaking
                          ? 'ring-2 ring-[#22c55e] ring-offset-1 ring-offset-[#111620]'
                          : ''
                      }`}
                    />
                    {isSpeaking && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#22c55e]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{member.displayName}</span>
                      {member.gamingProfile?.roleTitle && (
                        <span className="text-[9px] px-1 bg-[#1e293b] text-[#38bdf8] rounded font-mono">
                          {member.gamingProfile.roleTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#94a3b8]">
                  {isSpeaking ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#22c55e] animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 opacity-40" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Quick Controls */}
        <div className="mt-3 pt-3 border-t border-[#2b3547] flex items-center justify-between">
          <button
            onClick={() => setIsCrosshairGuideActive((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
              isCrosshairGuideActive
                ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                : 'text-[#94a3b8] hover:text-white bg-[#111620]'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Mira Overlay</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-xl transition ${
                voiceSession?.isMuted
                  ? 'bg-[#ef4444] text-white'
                  : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
              }`}
            >
              {voiceSession?.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={toggleDeafen}
              className={`p-1.5 rounded-xl transition ${
                voiceSession?.isDeafened
                  ? 'bg-[#ef4444] text-white'
                  : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
              }`}
            >
              {voiceSession?.isDeafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
