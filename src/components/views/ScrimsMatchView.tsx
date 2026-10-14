import React, { useState } from 'react';
import {
  Swords,
  Radio,
  Clock,
  MapPin,
  Plus,
  Play,
  ExternalLink,
  Volume2,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { ScrimMatch } from '../../types';

export const ScrimsMatchView: React.FC = () => {
  const { scrimMatches, bookScrimMatch, joinVoiceChannel, guilds, activeGuildId } = useChatStore();
  const [filterTier, setFilterTier] = useState<string>('all');
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);

  // Form state for booking scrim
  const [opponentName, setOpponentName] = useState('');
  const [opponentTag, setOpponentTag] = useState('');
  const [game, setGame] = useState('VALORANT');
  const [tier, setTier] = useState<ScrimMatch['tier']>('Tier 1 Pro');
  const [serverLocation, setServerLocation] = useState('Frankfurt AWS (8ms ping)');
  const [scheduledTime, setScheduledTime] = useState('Hoy 20:00 CET');

  const filteredScrims = scrimMatches.filter((s) => {
    if (filterTier === 'all') return true;
    if (filterTier === 'live') return s.status === 'live';
    return s.tier === filterTier;
  });

  const handleCreateScrim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName.trim()) return;

    bookScrimMatch({
      teamA: { name: 'Sentinels', tag: 'SEN', logo: '⚡', score: 0 },
      teamB: {
        name: opponentName.trim(),
        tag: opponentTag.trim() || opponentName.substring(0, 3).toUpperCase(),
        logo: '🎯',
        score: 0,
      },
      game,
      tier,
      scheduledTime,
      serverLocation,
      status: 'upcoming',
    });

    setIsBookModalOpen(false);
    setOpponentName('');
    setOpponentTag('');
  };

  const handleJoinVoiceScrim = () => {
    // Find voice channel in active guild
    const guild = guilds.find((g) => g.id === activeGuildId);
    const voiceChannel = guild?.channels.find((c) => c.type === 'voice');
    if (voiceChannel && guild) {
      joinVoiceChannel(guild.id, voiceChannel.id);
    }
  };

  return (
    <div className="flex-1 h-full bg-[#0b0e14] overflow-y-auto p-6 flex flex-col text-[#e2e8f0]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#181d27] via-[#1a2233] to-[#181d27] rounded-3xl p-6 border border-[#2b3547] shadow-2xl mb-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ff4655]/15 border border-[#ff4655]/40 flex items-center justify-center text-3xl shadow-lg shadow-[#ff4655]/20">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ff4655] text-white">
                  TIER 1 SCRIMS HUB
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  RED SUB-10MS ACTIVA
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                Match Center & Scrims Competitivos
              </h1>
              <p className="text-sm text-[#94a3b8]">
                Entrenamiento oficial entre organizaciones de Tier 1 (Sentinels, Fnatic, Cloud9, NAVI).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleJoinVoiceScrim}
              className="flex items-center gap-2 px-4 py-2 bg-[#22c55e]/15 hover:bg-[#22c55e]/25 text-[#22c55e] border border-[#22c55e]/40 rounded-xl text-xs font-bold transition shadow-lg"
            >
              <Volume2 className="w-4 h-4" />
              <span>Conectar Voz de Partida</span>
            </button>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff4655] hover:bg-[#e03b49] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#ff4655]/25"
            >
              <Plus className="w-4 h-4" />
              <span>Reservar Scrim</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-5 border-t border-[#2b3547] flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterTier('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterTier === 'all'
                ? 'bg-[#ff4655] text-white'
                : 'bg-[#111620] text-[#94a3b8] hover:text-white border border-[#2b3547]'
            }`}
          >
            Todos ({scrimMatches.length})
          </button>
          <button
            onClick={() => setFilterTier('live')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              filterTier === 'live'
                ? 'bg-[#22c55e] text-black'
                : 'bg-[#111620] text-[#22c55e] hover:text-white border border-[#22c55e]/30'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>En Directo</span>
          </button>
          <button
            onClick={() => setFilterTier('Tier 1 Pro')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterTier === 'Tier 1 Pro'
                ? 'bg-[#3b82f6] text-white'
                : 'bg-[#111620] text-[#94a3b8] hover:text-white border border-[#2b3547]'
            }`}
          >
            Tier 1 Pro
          </button>
          <button
            onClick={() => setFilterTier('Tier 2 Academy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterTier === 'Tier 2 Academy'
                ? 'bg-[#a855f7] text-white'
                : 'bg-[#111620] text-[#94a3b8] hover:text-white border border-[#2b3547]'
            }`}
          >
            Tier 2 Academy
          </button>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredScrims.map((match) => (
          <div
            key={match.id}
            className={`p-6 rounded-3xl border transition-all ${
              match.status === 'live'
                ? 'bg-gradient-to-r from-[#181d27] via-[#1a2333] to-[#181d27] border-[#22c55e]/50 shadow-xl shadow-[#22c55e]/10'
                : 'bg-[#181d27] border-[#2b3547] hover:border-[#3b82f6]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                {match.status === 'live' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#22c55e] text-black flex items-center gap-1 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                    LIVE MATCH
                  </span>
                ) : match.status === 'upcoming' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/30 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    PROGRAMADO
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#64748b]/20 text-[#94a3b8] border border-[#64748b]/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    FINALIZADO
                  </span>
                )}

                <span className="text-xs font-bold text-[#94a3b8] px-2.5 py-0.5 bg-[#111620] rounded-full border border-[#2b3547]">
                  {match.game}
                </span>

                <span className="text-xs font-bold text-[#38bdf8] px-2.5 py-0.5 bg-[#38bdf8]/10 rounded-full border border-[#38bdf8]/30">
                  {match.tier}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff4655]" />
                  <span>{match.serverLocation}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>{match.scheduledTime}</span>
                </div>
              </div>
            </div>

            {/* Scoreboard Face-off */}
            <div className="bg-[#111620] rounded-2xl p-5 border border-[#2b3547] flex flex-wrap items-center justify-between gap-6">
              {/* Team A */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <span className="text-3xl">{match.teamA.logo}</span>
                <div>
                  <div className="text-lg font-black text-white">{match.teamA.name}</div>
                  <div className="text-xs font-bold text-[#ff4655]">Tag: {match.teamA.tag}</div>
                </div>
              </div>

              {/* Score Display */}
              <div className="flex flex-col items-center px-6 py-2 bg-[#181d27] rounded-2xl border border-[#2b3547]">
                <div className="flex items-center gap-4 text-3xl font-black text-white">
                  <span className={match.teamA.score > match.teamB.score ? 'text-[#22c55e]' : ''}>
                    {match.teamA.score}
                  </span>
                  <span className="text-[#64748b] text-xl">-</span>
                  <span className={match.teamB.score > match.teamA.score ? 'text-[#22c55e]' : ''}>
                    {match.teamB.score}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-[#94a3b8] tracking-wider uppercase mt-1">
                  {match.status === 'live' ? 'Ronda 21 • Cambio de Lado' : 'Resultado'}
                </div>
              </div>

              {/* Team B */}
              <div className="flex items-center gap-4 min-w-[200px] justify-end text-right">
                <div>
                  <div className="text-lg font-black text-white">{match.teamB.name}</div>
                  <div className="text-xs font-bold text-[#f97316]">Tag: {match.teamB.tag}</div>
                </div>
                <span className="text-3xl">{match.teamB.logo}</span>
              </div>
            </div>

            {/* Maps breakdown if available */}
            {match.mapsResult && match.mapsResult.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#2b3547] flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-[#94a3b8]">Mapas jugados:</span>
                {match.mapsResult.map((m, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1 bg-[#111620] rounded-xl border border-[#2b3547] text-xs font-mono text-[#cbd5e1] flex items-center gap-2"
                  >
                    <span className="font-bold text-white">{m.map}</span>
                    <span className="text-[#22c55e] font-bold">
                      {m.scoreA} - {m.scoreB}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Book Scrim Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#181d27] border border-[#2b3547] rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[#94a3b8] hover:text-white rounded-xl hover:bg-[#252f40] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#ff4655]/20 text-[#ff4655] flex items-center justify-center text-xl">
                ⚔️
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Reservar Scrim Oficial</h3>
                <p className="text-xs text-[#94a3b8]">Programa un enfrentamiento 5v5 con una escuadra rival</p>
              </div>
            </div>

            <form onSubmit={handleCreateScrim} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#cbd5e1] block mb-1">Nombre del Equipo Rival</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Cloud9, KRÜ Esports, NAVI..."
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111620] rounded-xl border border-[#2b3547] text-white text-sm outline-none focus:border-[#ff4655]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#cbd5e1] block mb-1">Tag del Rival</label>
                  <input
                    type="text"
                    placeholder="ej. C9, KRU, NAVI"
                    value={opponentTag}
                    onChange={(e) => setOpponentTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#111620] rounded-xl border border-[#2b3547] text-white text-sm outline-none focus:border-[#ff4655]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#cbd5e1] block mb-1">Videojuego</label>
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#111620] rounded-xl border border-[#2b3547] text-white text-sm outline-none focus:border-[#ff4655]"
                  >
                    <option value="VALORANT">VALORANT</option>
                    <option value="Counter-Strike 2">Counter-Strike 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#cbd5e1] block mb-1">Nivel / Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#111620] rounded-xl border border-[#2b3547] text-white text-sm outline-none focus:border-[#ff4655]"
                  >
                    <option value="Tier 1 Pro">Tier 1 Pro</option>
                    <option value="Tier 2 Academy">Tier 2 Academy</option>
                    <option value="Radiant / Faceit 10">Radiant / Faceit 10</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#cbd5e1] block mb-1">Horario</label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="ej. Hoy 21:00 CET"
                    className="w-full px-3.5 py-2.5 bg-[#111620] rounded-xl border border-[#2b3547] text-white text-sm outline-none focus:border-[#ff4655]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#cbd5e1] block mb-1">Ubicación del Servidor</label>
                <input
                  type="text"
                  value={serverLocation}
                  onChange={(e) => setServerLocation(e.target.value)}
                  placeholder="ej. Frankfurt AWS (8ms ping)"
                  className="w-full px-3.5 py-2.5 bg-[#111620] rounded-xl border border-[#2b3547] text-white text-sm outline-none focus:border-[#ff4655]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#94a3b8] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ff4655] hover:bg-[#e03b49] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#ff4655]/25 transition"
                >
                  Confirmar Scrim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
