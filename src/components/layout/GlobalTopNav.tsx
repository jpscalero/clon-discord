import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Music,
  Users,
  MessageSquare,
  Kanban,
  FolderArchive,
  PenTool,
  Code2,
  BookOpen,
  Radio,
  Calendar,
  EyeOff,
  Eye,
  Trophy,
  Swords,
  Crosshair,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { ChannelViewMode, UserStatus } from '../../types';

export const GlobalTopNav: React.FC = () => {
  const {
    guilds,
    activeGuildId,
    activeChannelId,
    currentViewMode,
    setViewMode,
    currentUser,
    setUserStatus,
    openModal,
    toggleAIAssistant,
    toggleSoundboard,
    toggleMemberList,
    memberListVisible,
    isAIAssistantOpen,
    zenMode,
    toggleZenMode,
    toggleGamingOverlay,
    isGamingOverlayOpen,
    scrimMatches,
  } = useChatStore();

  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);

  const statusMenuRef = useRef<HTMLDivElement>(null);
  const moreToolsRef = useRef<HTMLDivElement>(null);

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const liveMatch = scrimMatches.find((s) => s.status === 'live') || scrimMatches[0];

  const statuses: { label: string; value: UserStatus; color: string }[] = [
    { label: 'En línea (Ready)', value: 'online', color: 'bg-[#22c55e]' },
    { label: 'En Partida / Scrim', value: 'idle', color: 'bg-[#facc15]' },
    { label: 'No molestar (Focus)', value: 'dnd', color: 'bg-[#ff4655]' },
    { label: 'Desconectado', value: 'offline', color: 'bg-[#64748b]' },
  ];

  const secondaryViewLabels: Record<string, string> = {
    kanban: 'Coaching',
    code: 'Configs',
    wiki: 'Playbook',
    stage: 'Stage',
    vault: 'Bóveda',
    calendar: 'Calendario',
  };

  const isSecondaryViewActive = Boolean(secondaryViewLabels[currentViewMode]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setIsStatusMenuOpen(false);
      }
      if (moreToolsRef.current && !moreToolsRef.current.contains(e.target as Node)) {
        setIsMoreToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-[#07090e]/95 backdrop-blur-xl border-b border-[#1b2234] flex items-center justify-between px-4 flex-shrink-0 select-none z-30 shadow-2xl relative">
      {/* 1. Left: Org Crest & Live Match Telemetry Ticker */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Navigation arrows */}
        <div className="hidden sm:flex items-center gap-0.5 text-[#64748b] flex-shrink-0">
          <button
            className="p-1.5 rounded-lg hover:bg-[#131824] hover:text-white transition disabled:opacity-30"
            title="Atrás"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-[#131824] hover:text-white transition disabled:opacity-30"
            title="Adelante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:block h-5 w-px bg-[#1b2234] flex-shrink-0" />

        {/* Organization Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#ff4655]/15 border border-[#ff4655]/40 flex items-center justify-center text-sm shadow-md shadow-[#ff4655]/20 flex-shrink-0">
            ⚡
          </div>
          <div className="flex flex-col flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white tracking-wide whitespace-nowrap">
                {currentGuild?.name.replace(/^⚡\s*/, '').replace(/\s*HQ\s*$/i, '') || 'SENTINELS'}
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 bg-[#ff4655]/20 text-[#ff4655] rounded border border-[#ff4655]/30">
                VCT
              </span>
            </div>
            <span className="text-[10px] text-[#64748b] font-bold tracking-wider uppercase font-mono">
              TIER 1 CIRCUIT
            </span>
          </div>
        </div>

        {/* Live Match Marquee (Fixed size & single line) */}
        {liveMatch && (
          <button
            onClick={() => setViewMode('scrims')}
            className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#131824] to-[#182133] border border-[#ff4655]/30 hover:border-[#ff4655] transition text-xs shadow-md flex-shrink-0 whitespace-nowrap flex items-center gap-2 group"
            title="Ver Match Center de Scrim en Directo"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
            </span>
            <span className="font-black text-[#ff4655] tracking-wider text-[10px] uppercase">LIVE:</span>
            <span className="font-mono font-bold text-white text-xs">
              {liveMatch.teamA.tag} {liveMatch.teamA.score} - {liveMatch.teamB.score} {liveMatch.teamB.tag}
            </span>
            <span className="text-[10px] text-[#64748b] border-l border-[#2b3547] pl-2 font-mono hidden xl:inline">
              7ms • 360 FPS
            </span>
          </button>
        )}
      </div>

      {/* 2. Center: Tactical Viewports Dock (Compact 4 Core + Dropdown) */}
      <div className="flex items-center gap-1 bg-[#0d111a] p-1 rounded-2xl border border-[#1b2234] shadow-inner flex-shrink-0 mx-2">
        <button
          onClick={() => setViewMode('chat')}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap ${
            currentViewMode === 'chat'
              ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/25'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#131824]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">War Room</span>
        </button>

        <button
          onClick={() => setViewMode('whiteboard')}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap ${
            currentViewMode === 'whiteboard'
              ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/25'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#131824]'
          }`}
          title="Strat Board Táctico (Ascent & Mirage)"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Strat Board</span>
        </button>

        <button
          onClick={() => setViewMode('veto')}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap ${
            currentViewMode === 'veto'
              ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/25'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#131824]'
          }`}
          title="Pick & Ban Map Veto (Bo1/Bo3)"
        >
          <Trophy className="w-3.5 h-3.5 text-[#facc15]" />
          <span className="hidden md:inline">Map Veto</span>
        </button>

        <button
          onClick={() => setViewMode('scrims')}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap ${
            currentViewMode === 'scrims'
              ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/25'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#131824]'
          }`}
          title="Match Center de Scrims Tier 1"
        >
          <Swords className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="hidden md:inline">Scrims Hub</span>
        </button>

        {/* Dropdown Más Herramientas Tácticas */}
        <div className="relative" ref={moreToolsRef}>
          <button
            onClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)}
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap ${
              isSecondaryViewActive
                ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/25'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#131824]'
            }`}
            title="Herramientas adicionales de equipo"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">
              {isSecondaryViewActive ? secondaryViewLabels[currentViewMode] : 'Más'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isMoreToolsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMoreToolsOpen && (
            <div className="absolute top-10 left-0 w-52 bg-[#0d111a] border border-[#1b2234] rounded-2xl shadow-2xl p-1.5 z-50 animate-tooltip">
              <button
                onClick={() => {
                  setViewMode('kanban');
                  setIsMoreToolsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  currentViewMode === 'kanban' ? 'bg-[#ff4655] text-white' : 'text-[#cbd5e1] hover:bg-[#182133]'
                }`}
              >
                <Kanban className="w-3.5 h-3.5 text-[#facc15]" />
                <span>Coaching (Kanban)</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('code');
                  setIsMoreToolsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  currentViewMode === 'code' ? 'bg-[#ff4655] text-white' : 'text-[#cbd5e1] hover:bg-[#182133]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Configs & Autoexec</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('wiki');
                  setIsMoreToolsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  currentViewMode === 'wiki' ? 'bg-[#ff4655] text-white' : 'text-[#cbd5e1] hover:bg-[#182133]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Playbook & Wiki</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('stage');
                  setIsMoreToolsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  currentViewMode === 'stage' ? 'bg-[#ff4655] text-white' : 'text-[#cbd5e1] hover:bg-[#182133]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>Stage & Debrief</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('vault');
                  setIsMoreToolsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  currentViewMode === 'vault' ? 'bg-[#ff4655] text-white' : 'text-[#cbd5e1] hover:bg-[#182133]'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Bóveda Multimedia</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('calendar');
                  setIsMoreToolsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  currentViewMode === 'calendar' ? 'bg-[#ff4655] text-white' : 'text-[#cbd5e1] hover:bg-[#182133]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#eab308]" />
                <span>Calendario VCT</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right: Command Launcher, Telemetry & Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Command Palette Button */}
        <button
          onClick={() => openModal('commandPalette')}
          className="hidden md:flex items-center gap-2 h-8 px-2.5 rounded-xl bg-[#0d111a] hover:bg-[#131824] border border-[#1b2234] text-xs text-[#94a3b8] hover:text-white transition shadow-sm flex-shrink-0 whitespace-nowrap"
          title="Abrir Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#ff4655]" />
          <span className="hidden lg:inline">Buscar...</span>
          <span className="text-[10px] font-mono bg-[#182133] px-1.5 py-0.5 rounded border border-[#2b3547]">
            ⌘K
          </span>
        </button>

        {/* In-Game Overlay HUD Button */}
        <button
          onClick={toggleGamingOverlay}
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-black transition border shadow-md flex-shrink-0 whitespace-nowrap ${
            isGamingOverlayOpen
              ? 'bg-[#ff4655] text-white border-[#ff4655] shadow-[#ff4655]/30'
              : 'bg-[#0d111a] text-[#94a3b8] hover:text-white border-[#1b2234] hover:border-[#ff4655]'
          }`}
          title="In-Game Esports Discord Overlay (360 FPS & Timeout)"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isGamingOverlayOpen ? 'text-white' : 'text-[#ff4655]'}`} />
          <span className="hidden xl:inline">Overlay</span>
        </button>

        {/* AI Copilot */}
        <button
          onClick={toggleAIAssistant}
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-bold transition border flex-shrink-0 whitespace-nowrap ${
            isAIAssistantOpen
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md'
              : 'bg-[#0d111a] text-[#dbdee1] border-[#1b2234] hover:bg-[#131824]'
          }`}
          title="Copiloto Táctico de IA"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
          <span className="hidden xl:inline">AI Coach</span>
        </button>

        {/* Soundboard de Torneo */}
        <button
          onClick={toggleSoundboard}
          className="h-8 w-8 flex items-center justify-center rounded-xl text-[#94a3b8] hover:text-white bg-[#0d111a] hover:bg-[#131824] border border-[#1b2234] transition flex-shrink-0"
          title="Soundboard Táctico (Headshot, Spike, ACE)"
        >
          <Music className="w-4 h-4 text-[#38bdf8]" />
        </button>

        {/* Modo Zen */}
        <button
          onClick={toggleZenMode}
          className={`h-8 w-8 flex items-center justify-center rounded-xl text-xs font-semibold transition border flex-shrink-0 ${
            zenMode
              ? 'bg-[#facc15] text-black border-[#facc15]'
              : 'text-[#94a3b8] hover:text-white bg-[#0d111a] hover:bg-[#131824] border-[#1b2234]'
          }`}
          title={zenMode ? 'Desactivar Modo Zen' : 'Modo Zen Competitivo (Sin Distracciones)'}
        >
          {zenMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Roster Toggle */}
        <button
          onClick={toggleMemberList}
          className={`h-8 w-8 flex items-center justify-center rounded-xl transition border flex-shrink-0 ${
            memberListVisible
              ? 'text-white bg-[#ff4655]/15 border-[#ff4655]/40 text-[#ff4655]'
              : 'text-[#94a3b8] hover:text-white bg-[#0d111a] hover:bg-[#131824] border-[#1b2234]'
          }`}
          title="Mostrar/Ocultar Escuadra"
        >
          <Users className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-[#1b2234] flex-shrink-0" />

        {/* Player Status Avatar Card */}
        <div className="relative flex-shrink-0" ref={statusMenuRef}>
          <button
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            className="flex items-center gap-2 h-8 p-1 pl-1.5 rounded-2xl bg-[#0d111a] hover:bg-[#131824] border border-[#1b2234] transition flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-[#ff4655]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#07090e] bg-[#22c55e]" />
            </div>
            <div className="hidden sm:flex flex-col text-left pr-1 min-w-0">
              <span className="text-[11px] font-black text-white leading-tight truncate max-w-[80px]">
                {currentUser.displayName}
              </span>
              <span className="text-[8px] font-mono font-bold text-[#ff4655] leading-none">
                {currentUser.gamingProfile?.teamTag || 'SEN'} • Radiant
              </span>
            </div>
          </button>

          {/* Status Dropdown */}
          {isStatusMenuOpen && (
            <div className="absolute right-0 top-10 w-48 bg-[#0d111a] border border-[#1b2234] rounded-2xl shadow-2xl p-1.5 z-50 animate-tooltip">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setUserStatus(s.value);
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#cbd5e1] hover:bg-[#182133] hover:text-white transition"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
