import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Trophy, Swords, Shield, Crosshair, Sparkles, Volume2 } from 'lucide-react';
import { UserStatus } from '../../types';

export const MemberList: React.FC = () => {
  const {
    guilds,
    activeGuildId,
    users,
    memberListVisible,
    setUserProfilePopover,
  } = useChatStore();

  if (!memberListVisible) return null;

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  if (!currentGuild) return null;

  const members = currentGuild.members
    .map((m) => ({
      ...m,
      user: users[m.userId],
    }))
    .filter((m) => !!m.user);

  // Group by Esports hierarchy
  const coachingStaff = members.filter(
    (m) =>
      m.user.gamingProfile?.roleTitle === 'Head Coach' ||
      m.user.gamingProfile?.roleTitle === 'IGL'
  );

  const startingFive = members.filter(
    (m) =>
      m.user.gamingProfile?.roleTitle === 'Duelist / Entry' ||
      m.user.gamingProfile?.roleTitle === 'Sniper / AWP' ||
      m.user.gamingProfile?.roleTitle === 'Anchor / Support'
  );

  const otherPros = members.filter(
    (m) => !coachingStaff.includes(m) && !startingFive.includes(m)
  );

  const renderStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'online':
        return <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-[#090d16]" />;
      case 'idle':
        return <div className="w-2.5 h-2.5 rounded-full bg-[#facc15] border-2 border-[#090d16]" />;
      case 'dnd':
        return <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border-2 border-[#090d16]" />;
      case 'offline':
      default:
        return <div className="w-2.5 h-2.5 rounded-full bg-[#64748b] border-2 border-[#090d16]" />;
    }
  };

  const renderPlayerCard = (user: (typeof members)[0]['user']) => {
    const gp = user.gamingProfile;
    return (
      <button
        key={user.id}
        onClick={() => setUserProfilePopover(user.id)}
        className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-[#131824] transition group text-left border border-transparent hover:border-[#1e2638]"
      >
        {/* Avatar with VAD Glow */}
        <div className="relative flex-shrink-0">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#1e2638] group-hover:ring-[#ff4655] transition"
          />
          <div className="absolute -bottom-0.5 -right-0.5">
            {renderStatusBadge(user.status)}
          </div>
        </div>

        {/* Player Names & Role Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-black text-white truncate group-hover:text-[#ff4655] transition">
              {user.displayName}
            </span>
            {gp?.teamTag && (
              <span className="text-[9px] px-1 py-0.2 bg-[#ff4655] text-white font-black rounded uppercase flex-shrink-0 font-mono">
                {gp.teamTag}
              </span>
            )}
          </div>

          {gp?.roleTitle ? (
            <div className="text-[10px] text-[#38bdf8] truncate font-mono font-bold flex items-center justify-between">
              <span>{gp.roleTitle}</span>
              <span className="text-[#facc15] text-[9px]">{gp.rankTier}</span>
            </div>
          ) : user.customStatus ? (
            <div className="text-[10px] text-[#64748b] truncate">
              {user.customStatus}
            </div>
          ) : null}

          {/* Mini KDA & HS stats preview */}
          {gp && (
            <div className="flex items-center gap-2 text-[9px] font-mono text-[#64748b] pt-0.5">
              <span>KDA: <strong className="text-[#22c55e]">{gp.kda}</strong></span>
              <span>HS: <strong className="text-white">{gp.headshotPct}</strong></span>
              <span>WR: <strong className="text-[#facc15]">{gp.winRate}</strong></span>
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-[#090d16] flex flex-col flex-shrink-0 select-none overflow-y-auto custom-scrollbar border-l border-[#151c2a] p-3 space-y-4">
      {/* Roster Header */}
      <div className="pb-2 border-b border-[#151c2a] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-[#ff4655]" />
          <span>ROSTER OFICIAL VCT</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#22c55e] px-1.5 py-0.5 bg-[#22c55e]/15 rounded-full">
          {members.length} PROS
        </span>
      </div>

      {/* 1. Coaching Staff & IGL */}
      {coachingStaff.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#64748b] px-1 flex items-center justify-between">
            <span>COACHING & IGL</span>
            <span>{coachingStaff.length}</span>
          </div>
          {coachingStaff.map((m) => renderPlayerCard(m.user))}
        </div>
      )}

      {/* 2. Starting Lineup */}
      {startingFive.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#64748b] px-1 flex items-center justify-between">
            <span>STARTING LINEUP (DUELISTS)</span>
            <span>{startingFive.length}</span>
          </div>
          {startingFive.map((m) => renderPlayerCard(m.user))}
        </div>
      )}

      {/* 3. Other Team Members / Franchise Legends */}
      {otherPros.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#64748b] px-1 flex items-center justify-between">
            <span>LEYENDAS & SUPLENTES</span>
            <span>{otherPros.length}</span>
          </div>
          {otherPros.map((m) => renderPlayerCard(m.user))}
        </div>
      )}

      {/* Quick Specs Legend Footer */}
      <div className="p-3 bg-[#0d111a] rounded-2xl border border-[#1b2234] text-[10px] font-mono text-[#64748b] space-y-1 mt-auto">
        <div className="text-white font-bold text-[11px] mb-1">GEAR & SPECS:</div>
        <div>• 360Hz Fast-IPS Monitors</div>
        <div>• 800 DPI (eDPI 280) Raw Input</div>
        <div>• 0.0% Latency Jitter Protocol</div>
      </div>
    </aside>
  );
};
