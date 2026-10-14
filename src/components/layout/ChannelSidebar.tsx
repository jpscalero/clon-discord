import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import {
  Hash,
  Volume2,
  Megaphone,
  Lock,
  ChevronDown,
  Plus,
  Mic,
  MicOff,
  Headphones,
  Settings,
  PhoneOff,
  Monitor,
  Camera,
  Signal,
  ShieldCheck,
  UserPlus,
  PenTool,
  Trophy,
  Swords,
  Kanban,
  Radio,
  Sparkles,
} from 'lucide-react';

export const ChannelSidebar: React.FC = () => {
  const {
    guilds,
    activeGuildId,
    activeChannelId,
    setActiveChannel,
    currentViewMode,
    setViewMode,
    currentUser,
    voiceSession,
    leaveVoiceChannel,
    toggleMute,
    toggleDeafen,
    openModal,
    joinVoiceChannel,
    users,
  } = useChatStore();

  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsServerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeGuild = guilds.find((g) => g.id === activeGuildId);

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (!activeGuild) {
    return (
      <div className="w-64 bg-[#090d16] flex flex-col items-center justify-center text-[#64748b] text-xs select-none">
        Selecciona un servidor
      </div>
    );
  }

  return (
    <nav
      aria-label="Canales y Operaciones de Escuadra"
      className="w-64 bg-[#090d16] flex flex-col h-full select-none flex-shrink-0 border-r border-[#151c2a]"
    >
      {/* 1. Header del Equipo / Servidor */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
          className="w-full h-14 px-3 flex items-center justify-between text-white border-b border-[#151c2a] hover:bg-[#0f1422] transition-colors shadow-sm group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#ff4655]/15 border border-[#ff4655]/30 flex items-center justify-center text-xs flex-shrink-0">
              ⚡
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-black tracking-wide text-white truncate leading-tight">
                {activeGuild.name.replace(/^⚡\s*/, '')}
              </span>
              <span className="text-[9px] font-mono font-bold text-[#ff4655] tracking-wider uppercase leading-tight">
                VCT TIER 1 SQUAD
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#64748b] group-hover:text-white transition-transform duration-200 flex-shrink-0 ${
              isServerDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Ajustes del Servidor */}
        {isServerDropdownOpen && (
          <div className="absolute top-16 left-3 right-3 bg-[#0d111a] border border-[#2b3547] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-tooltip">
            <button
              onClick={() => {
                setIsServerDropdownOpen(false);
                openModal('serverSettings');
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#cbd5e1] hover:bg-[#ff4655] hover:text-white rounded-xl transition-colors"
            >
              <span>Ajustes de Organización</span>
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsServerDropdownOpen(false);
                openModal('createChannel');
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#cbd5e1] hover:bg-[#ff4655] hover:text-white rounded-xl transition-colors"
            >
              <span>Crear Canal Táctico</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Tactical Quick Deck (Pinned Esports Tools) */}
      <div className="p-3 pb-2 border-b border-[#151c2a] space-y-1">
        <div className="text-[10px] font-black uppercase tracking-wider text-[#64748b] px-2 mb-1.5">
          Operaciones de Partida
        </div>

        <button
          onClick={() => setViewMode('whiteboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
            currentViewMode === 'whiteboard'
              ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#0f1422]'
          }`}
        >
          <PenTool className="w-4 h-4 text-[#ff4655]" />
          <span>Strat Board (Ascent/Mirage)</span>
        </button>

        <button
          onClick={() => setViewMode('veto')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
            currentViewMode === 'veto'
              ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#0f1422]'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#facc15]" />
          <span>Map Veto (Pick & Ban)</span>
        </button>

        <button
          onClick={() => setViewMode('scrims')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
            currentViewMode === 'scrims'
              ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#0f1422]'
          }`}
        >
          <Swords className="w-4 h-4 text-[#38bdf8]" />
          <span>Match Center (Scrims Tier 1)</span>
        </button>
      </div>

      {/* 3. Canales del Servidor (Texto & Voz) */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
        {activeGuild.categories.map((category) => {
          const categoryChannels = activeGuild.channels.filter((c) => c.categoryId === category.id);
          const isCollapsed = collapsedCategories[category.id];

          return (
            <div key={category.id} className="space-y-0.5">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between px-2 py-1 text-[11px] font-black uppercase tracking-wider text-[#64748b] hover:text-white cursor-pointer transition"
              >
                <div className="flex items-center gap-1">
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                  <span>{category.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('createChannel');
                  }}
                  className="p-0.5 hover:text-white text-[#64748b]"
                  title="Crear Canal"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Channels List */}
              {!isCollapsed &&
                categoryChannels.map((channel) => {
                  const isActive = activeChannelId === channel.id;
                  const isVoice = channel.type === 'voice';

                  return (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setActiveChannel(channel.id);
                        if (isVoice) {
                          joinVoiceChannel(activeGuild.id, channel.id);
                        } else {
                          setViewMode('chat');
                        }
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition group text-left ${
                        isActive
                          ? 'bg-[#151c2a] text-white border border-[#2b3547]'
                          : 'text-[#94a3b8] hover:text-white hover:bg-[#0f1422]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isVoice ? (
                          <Volume2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                        ) : (
                          <Hash className="w-4 h-4 text-[#64748b] group-hover:text-[#ff4655] flex-shrink-0" />
                        )}
                        <span className="truncate">{channel.name}</span>
                      </div>

                      {isVoice && (
                        <span className="text-[10px] font-mono font-bold text-[#22c55e] px-1.5 py-0.2 bg-[#22c55e]/15 rounded">
                          8ms
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* 4. Active Voice Call HUD (si está conectado) */}
      {voiceSession && (
        <div className="p-3 bg-[#0d111a] border-t border-[#151c2a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
            <div>
              <div className="text-xs font-black text-[#22c55e]">VOZ CONECTADA</div>
              <div className="text-[10px] font-mono text-[#64748b]">Frankfurt (7ms) • DAVE E2EE</div>
            </div>
          </div>
          <button
            onClick={leaveVoiceChannel}
            className="p-1.5 bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-white rounded-xl transition"
            title="Desconectar de voz"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Bottom User Deck */}
      <div className="p-2.5 bg-[#07090e] border-t border-[#151c2a] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#ff4655]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-[#07090e]" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white truncate">
              {currentUser.displayName}
            </span>
            <span className="text-[10px] text-[#ff4655] font-mono truncate font-bold">
              {currentUser.gamingProfile?.roleTitle || 'Duelist'}
            </span>
          </div>
        </div>

        {/* Audio Mute & Deafen Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-xl transition ${
              voiceSession?.isMuted
                ? 'bg-[#ef4444] text-white'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#131824]'
            }`}
            title="Silenciar Micrófono"
          >
            {voiceSession?.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleDeafen}
            className={`p-1.5 rounded-xl transition ${
              voiceSession?.isDeafened
                ? 'bg-[#ef4444] text-white'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#131824]'
            }`}
            title="Ensordecer"
          >
            <Headphones className="w-4 h-4" />
          </button>
          <button
            onClick={() => openModal('userSettings')}
            className="p-1.5 rounded-xl text-[#94a3b8] hover:text-white hover:bg-[#131824] transition"
            title="Ajustes de Usuario"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
