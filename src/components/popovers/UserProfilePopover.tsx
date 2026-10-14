import React from 'react';
import { X, MessageSquare, Shield, Sparkles, Send, Trophy, Swords, Crosshair, Award } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const UserProfilePopover: React.FC = () => {
  const {
    selectedUserIdPopover,
    setUserProfilePopover,
    users,
    guilds,
    activeGuildId,
  } = useChatStore();

  if (!selectedUserIdPopover) return null;

  const user = users[selectedUserIdPopover];
  if (!user) return null;

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const member = currentGuild?.members.find((m) => m.userId === user.id);
  const userRoles = currentGuild?.roles.filter((r) => member?.roleIds.includes(r.id)) || [];
  const gp = user.gamingProfile;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setUserProfilePopover(null)}
    >
      <div
        className="w-[380px] bg-[#111620] rounded-3xl overflow-hidden shadow-2xl border border-[#2b3547] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div
          className="h-28 w-full relative"
          style={{ backgroundColor: user.bannerColor || '#ff4655' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#111620] via-transparent to-black/30" />
          <button
            onClick={() => setUserProfilePopover(null)}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar y Badges */}
        <div className="px-5 pb-5 relative">
          <div className="flex justify-between items-end -mt-12 mb-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-22 h-22 rounded-2xl border-4 border-[#111620] object-cover bg-[#0b0e14] shadow-xl"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-[#111620] ${
                  user.status === 'online'
                    ? 'bg-[#22c55e]'
                    : user.status === 'idle'
                    ? 'bg-[#facc15]'
                    : user.status === 'dnd'
                    ? 'bg-[#ef4444]'
                    : 'bg-[#64748b]'
                }`}
              />
            </div>

            {/* Insignias / Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="flex flex-wrap gap-1 bg-[#181d27] px-2.5 py-1.5 rounded-xl border border-[#2b3547] text-xs">
                {user.badges.map((badge, idx) => (
                  <span key={idx} className="cursor-default font-bold" title={badge}>
                    {badge.split(' ')[0]}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="bg-[#181d27] rounded-2xl p-4 border border-[#2b3547] space-y-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-black text-lg leading-tight">
                  {user.displayName}
                </h2>
                {gp?.teamTag && (
                  <span className="px-1.5 py-0.5 rounded bg-[#ff4655] text-white text-[10px] font-black uppercase">
                    {gp.teamTag}
                  </span>
                )}
              </div>
              <p className="text-[#94a3b8] text-xs font-mono">@{user.username}</p>
            </div>

            {user.customStatus && (
              <div className="text-xs text-[#cbd5e1] bg-[#111620] px-3 py-1.5 rounded-xl border border-[#2b3547]">
                {user.customStatus}
              </div>
            )}

            {/* Esports Pro Gaming Stats Box */}
            {gp && (
              <div className="bg-[#111620] rounded-xl p-3 border border-[#2b3547] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-black tracking-wider uppercase text-[#ff4655] flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>PERFIL COMPETITIVO TIER 1</span>
                  </span>
                  <span className="font-bold text-white text-[11px] px-2 py-0.5 bg-[#ff4655]/15 border border-[#ff4655]/40 rounded-full">
                    {gp.rankTier || 'Radiant'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-[#181d27] p-2 rounded-lg border border-[#2b3547]">
                    <div className="text-[9px] text-[#94a3b8] font-bold">KDA</div>
                    <div className="text-xs font-black text-[#22c55e]">{gp.kda || '1.45'}</div>
                  </div>
                  <div className="bg-[#181d27] p-2 rounded-lg border border-[#2b3547]">
                    <div className="text-[9px] text-[#94a3b8] font-bold">HEADSHOT</div>
                    <div className="text-xs font-black text-[#38bdf8]">{gp.headshotPct || '34.2%'}</div>
                  </div>
                  <div className="bg-[#181d27] p-2 rounded-lg border border-[#2b3547]">
                    <div className="text-[9px] text-[#94a3b8] font-bold">WINRATE</div>
                    <div className="text-xs font-black text-[#facc15]">{gp.winRate || '68.5%'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-[#94a3b8]">
                  <span>Rol: <strong className="text-white">{gp.roleTitle}</strong></span>
                  <span>Juego: <strong className="text-[#38bdf8]">{gp.mainGame}</strong></span>
                </div>

                {(gp.riotId || gp.steamId) && (
                  <div className="pt-1.5 border-t border-[#2b3547] text-[10px] font-mono text-[#64748b] flex justify-between">
                    {gp.riotId && <span>Riot: <span className="text-[#94a3b8]">{gp.riotId}</span></span>}
                    {gp.steamId && <span>Steam: <span className="text-[#94a3b8]">{gp.steamId}</span></span>}
                  </div>
                )}
              </div>
            )}

            {/* Sobre mí */}
            {user.bio && (
              <div>
                <span className="text-[10px] font-black uppercase text-[#94a3b8] tracking-wider block mb-1">
                  Setup & Biografía
                </span>
                <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">{user.bio}</p>
              </div>
            )}

            {/* Roles en este servidor */}
            {userRoles.length > 0 && (
              <div>
                <span className="text-[10px] font-black uppercase text-[#94a3b8] tracking-wider block mb-1">
                  Roles del Equipo ({userRoles.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {userRoles.map((role) => (
                    <span
                      key={role.id}
                      className="text-[11px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1.5 bg-[#111620] border border-[#2b3547]"
                      style={{ color: role.color }}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block shadow-sm"
                        style={{ backgroundColor: role.color }}
                      />
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Enviar mensaje rápido */}
            <div className="pt-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enviar whisper a @${user.username}...`}
                  className="w-full bg-[#111620] text-xs text-white px-3.5 py-2.5 pr-8 rounded-xl outline-none placeholder-[#64748b] border border-[#2b3547] focus:border-[#ff4655]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setUserProfilePopover(null);
                    }
                  }}
                />
                <Send className="w-3.5 h-3.5 text-[#94a3b8] absolute right-3 top-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
