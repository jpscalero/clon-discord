import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Plus, Trophy, Flame, Zap, Shield, Sparkles } from 'lucide-react';

export const ServerSidebar: React.FC = () => {
  const { guilds, activeGuildId, setActiveGuild, openModal } = useChatStore();
  const [hoveredGuildId, setHoveredGuildId] = useState<string | null>(null);

  return (
    <aside className="w-[74px] bg-[#07090e] flex flex-col items-center py-3 gap-2.5 select-none z-20 flex-shrink-0 border-r border-[#151c2a]">
      {/* 1. Global Home / HQ Command */}
      <div className="relative group flex items-center justify-center w-full">
        <div
          className={`absolute left-0 w-1 bg-[#ff4655] rounded-r-full transition-all duration-300 ${
            activeGuildId === 'home'
              ? 'h-10'
              : hoveredGuildId === 'home'
              ? 'h-5'
              : 'h-0'
          }`}
        />
        <button
          onClick={() => setActiveGuild('home')}
          onMouseEnter={() => setHoveredGuildId('home')}
          onMouseLeave={() => setHoveredGuildId(null)}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-300 relative group ${
            activeGuildId === 'home'
              ? 'bg-[#ff4655] rounded-2xl text-white shadow-lg shadow-[#ff4655]/40 scale-105'
              : 'bg-[#0f1422] hover:bg-[#ff4655] rounded-3xl hover:rounded-2xl text-[#94a3b8] hover:text-white border border-[#1e2638] hover:border-[#ff4655]'
          }`}
        >
          <Zap className="w-6 h-6 fill-current" />
        </button>

        {hoveredGuildId === 'home' && (
          <div className="absolute left-[84px] bg-[#0d111a] text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-2xl border border-[#2b3547] z-50 whitespace-nowrap animate-tooltip pointer-events-none">
            War Room & DMs
          </div>
        )}
      </div>

      {/* Cyber Divider */}
      <div className="w-8 h-[2px] bg-[#1a2333] rounded my-0.5" />

      {/* 2. Esports Organizations & Tournaments List */}
      <div className="flex-1 w-full flex flex-col items-center gap-2.5 overflow-y-auto overflow-x-hidden no-scrollbar">
        {guilds.map((guild) => {
          const isActive = activeGuildId === guild.id;
          const isHovered = hoveredGuildId === guild.id;

          return (
            <div key={guild.id} className="relative group flex items-center justify-center w-full">
              {/* Active Indicator Bar */}
              <div
                className={`absolute left-0 w-1.5 bg-[#ff4655] rounded-r-full transition-all duration-300 ${
                  isActive ? 'h-10 shadow-lg shadow-[#ff4655]' : isHovered ? 'h-5' : 'h-0'
                }`}
              />

              <button
                onClick={() => setActiveGuild(guild.id)}
                onMouseEnter={() => setHoveredGuildId(guild.id)}
                onMouseLeave={() => setHoveredGuildId(null)}
                className={`w-12 h-12 flex items-center justify-center font-black text-xs overflow-hidden transition-all duration-300 relative ${
                  isActive
                    ? 'rounded-2xl shadow-xl ring-2 ring-[#ff4655] ring-offset-2 ring-offset-[#07090e] scale-105'
                    : 'rounded-3xl hover:rounded-2xl bg-[#0f1422] hover:bg-[#182133] text-[#cbd5e1] hover:text-white border border-[#1e2638]'
                }`}
              >
                {guild.icon ? (
                  <img src={guild.icon} alt={guild.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono">{guild.name.slice(0, 3).toUpperCase()}</span>
                )}
              </button>

              {/* Tooltip with Tier info */}
              {isHovered && (
                <div className="absolute left-[84px] bg-[#0d111a] text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-2xl border border-[#2b3547] z-50 whitespace-nowrap animate-tooltip pointer-events-none flex flex-col gap-0.5">
                  <div className="text-white flex items-center gap-1.5">
                    <span>{guild.name}</span>
                  </div>
                  <span className="text-[10px] text-[#ff4655] font-mono">
                    ORGANIZACIÓN TIER 1 ACTIVA
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* 3. Add Organization Button */}
        <div className="relative group flex items-center justify-center w-full mt-1">
          <button
            onClick={() => openModal('createServer')}
            onMouseEnter={() => setHoveredGuildId('add')}
            onMouseLeave={() => setHoveredGuildId(null)}
            className="w-12 h-12 flex items-center justify-center bg-[#0f1422] hover:bg-[#22c55e] text-[#22c55e] hover:text-black rounded-3xl hover:rounded-2xl border border-[#1e2638] hover:border-[#22c55e] transition-all duration-300 shadow-sm"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
          {hoveredGuildId === 'add' && (
            <div className="absolute left-[84px] bg-[#0d111a] text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-2xl border border-[#2b3547] z-50 whitespace-nowrap animate-tooltip pointer-events-none">
              Crear Organización / Equipo
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Hardware & Anti-Cheat Badge */}
      <div className="pt-2 flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-xl bg-[#0f1422] border border-[#1e2638] flex items-center justify-center text-[11px] font-mono font-bold text-[#22c55e] cursor-default"
          title="Vanguard & Low-Latency Engine Activo"
        >
          🛡️
        </div>
      </div>
    </aside>
  );
};
