import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Copy,
  Check,
  Flame,
  Swords,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

const MAP_IMAGES: Record<string, string> = {
  Ascent: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  Haven: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
  Bind: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  Lotus: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
  Sunset: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  Abyss: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
  Split: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
  Mirage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  Inferno: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  Nuke: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
  Ancient: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
};

export const MapVetoView: React.FC = () => {
  const { mapVetoSession, executeMapVetoBan, executeMapVetoPick, resetMapVeto } = useChatStore();
  const [copied, setCopied] = useState(false);

  const activeTeamName =
    mapVetoSession.currentTurn === 'teamA'
      ? mapVetoSession.teamA.name
      : mapVetoSession.teamB.name;

  const activeTeamTag =
    mapVetoSession.currentTurn === 'teamA'
      ? mapVetoSession.teamA.tag
      : mapVetoSession.teamB.tag;

  const isCompleted = mapVetoSession.status === 'completed' || mapVetoSession.availableMaps.length <= 1;

  const handleCopyVetoSummary = () => {
    const summary = `🏆 VETO DE MAPAS [${mapVetoSession.format}] - ${mapVetoSession.teamA.name} vs ${mapVetoSession.teamB.name}\n` +
      `Banes: ${mapVetoSession.bannedMaps.map((b) => `${b.map} (${b.by})`).join(', ')}\n` +
      `Picks: ${mapVetoSession.pickedMaps.map((p) => `${p.map} (${p.by})`).join(', ')}\n` +
      `Decider: ${mapVetoSession.deciderMap || 'Por definir'}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 h-full bg-[#0b0e14] overflow-y-auto p-6 flex flex-col text-[#e2e8f0]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#181d27] via-[#1e293b] to-[#181d27] rounded-3xl p-6 border border-[#2b3547] shadow-2xl mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Trophy className="w-80 h-80 text-[#ff4655]" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ff4655]/15 border border-[#ff4655]/40 flex items-center justify-center text-3xl shadow-lg shadow-[#ff4655]/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ff4655] text-white">
                  {mapVetoSession.game} VCT TOURNAMENT
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                  FORMATO: {mapVetoSession.format}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                Pick & Ban Map Veto System
              </h1>
              <p className="text-sm text-[#94a3b8]">
                Herramienta oficial de descarte y selección de mapas con sincronización en tiempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyVetoSummary}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white rounded-xl text-xs font-bold transition border border-[#334155]"
            >
              {copied ? <Check className="w-4 h-4 text-[#22c55e]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Resumen'}</span>
            </button>
            <button
              onClick={resetMapVeto}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff4655]/15 hover:bg-[#ff4655]/25 text-[#ff4655] border border-[#ff4655]/40 rounded-xl text-xs font-bold transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Veto</span>
            </button>
          </div>
        </div>

        {/* Turn Tracker Matchup Bar */}
        <div className="mt-6 pt-5 border-t border-[#2b3547] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Team A */}
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition ${
                mapVetoSession.currentTurn === 'teamA' && !isCompleted
                  ? 'bg-[#ff4655]/20 border-[#ff4655] shadow-lg shadow-[#ff4655]/20'
                  : 'bg-[#111620] border-[#2b3547] opacity-80'
              }`}
            >
              <span className="text-2xl">{mapVetoSession.teamA.logo}</span>
              <div>
                <div className="text-sm font-black text-white">{mapVetoSession.teamA.name}</div>
                <div className="text-[10px] font-bold text-[#ff4655]">
                  {mapVetoSession.currentTurn === 'teamA' && !isCompleted ? '👉 TURNO ACTIVO' : 'LISTO'}
                </div>
              </div>
            </div>

            <span className="text-sm font-black text-[#64748b]">VS</span>

            {/* Team B */}
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition ${
                mapVetoSession.currentTurn === 'teamB' && !isCompleted
                  ? 'bg-[#f97316]/20 border-[#f97316] shadow-lg shadow-[#f97316]/20'
                  : 'bg-[#111620] border-[#2b3547] opacity-80'
              }`}
            >
              <span className="text-2xl">{mapVetoSession.teamB.logo}</span>
              <div>
                <div className="text-sm font-black text-white">{mapVetoSession.teamB.name}</div>
                <div className="text-[10px] font-bold text-[#f97316]">
                  {mapVetoSession.currentTurn === 'teamB' && !isCompleted ? '👉 TURNO ACTIVO' : 'LISTO'}
                </div>
              </div>
            </div>
          </div>

          {/* Phase Banner */}
          <div>
            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#22c55e]/20 border border-[#22c55e] text-[#22c55e] rounded-2xl font-bold text-sm shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span>¡VETO COMPLETADO! MAPAS LISTOS</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] rounded-2xl font-bold text-sm">
                <Swords className="w-4 h-4 animate-pulse" />
                <span>Turno de: {activeTeamName} ({activeTeamTag})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Available Maps to Ban/Pick */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ff4655]" />
            <span>Map Pool Activo ({mapVetoSession.availableMaps.length} disponibles)</span>
          </h2>
          <span className="text-xs text-[#94a3b8]">
            Selecciona <strong className="text-[#ef4444]">BAN</strong> para descartar o <strong className="text-[#22c55e]">PICK</strong> para jugar
          </span>
        </div>

        {mapVetoSession.availableMaps.length === 0 ? (
          <div className="p-8 text-center bg-[#111620] rounded-3xl border border-[#2b3547]">
            <p className="text-[#94a3b8]">Todos los mapas han sido procesados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mapVetoSession.availableMaps.map((map) => {
              const bgImg = MAP_IMAGES[map] || MAP_IMAGES['Ascent'];
              return (
                <div
                  key={map}
                  className="group relative bg-[#181d27] rounded-3xl border border-[#2b3547] overflow-hidden shadow-xl hover:border-[#3b82f6] transition-all flex flex-col"
                >
                  {/* Map Thumbnail */}
                  <div className="h-36 relative overflow-hidden">
                    <img
                      src={bgImg}
                      alt={map}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181d27] via-transparent to-black/40" />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-black text-white border border-white/20">
                      {map}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                    <div className="text-xs text-[#94a3b8] flex items-center justify-between">
                      <span>Estado: En Pool</span>
                      <span className="text-[#38bdf8] font-bold">Disponible</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => executeMapVetoBan(map)}
                        disabled={isCompleted}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#ef4444]/15 hover:bg-[#ef4444] text-[#ef4444] hover:text-white rounded-xl text-xs font-black transition border border-[#ef4444]/30 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>BAN</span>
                      </button>
                      <button
                        onClick={() => executeMapVetoPick(map)}
                        disabled={isCompleted}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#22c55e]/15 hover:bg-[#22c55e] text-[#22c55e] hover:text-white rounded-xl text-xs font-black transition border border-[#22c55e]/30 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PICK</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Veto History & Results: Picks, Bans & Decider */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Picks Box */}
        <div className="bg-[#181d27] rounded-3xl p-5 border border-[#2b3547] shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2b3547]">
            <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
            <h3 className="font-bold text-white text-sm">Mapas Seleccionados (Picks)</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#22c55e] font-bold">
              {mapVetoSession.pickedMaps.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {mapVetoSession.pickedMaps.length === 0 ? (
              <div className="text-xs text-[#64748b] text-center py-6">Ningún mapa pickeado aún.</div>
            ) : (
              mapVetoSession.pickedMaps.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#111620] rounded-2xl border border-[#22c55e]/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#22c55e]/20 text-[#22c55e] font-bold text-xs flex items-center justify-center">
                      M{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{p.map}</div>
                      <div className="text-[11px] text-[#94a3b8]">Elegido por: <strong className="text-white">{p.by}</strong></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#22c55e]">JUGABLE</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bans Box */}
        <div className="bg-[#181d27] rounded-3xl p-5 border border-[#2b3547] shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2b3547]">
            <XCircle className="w-5 h-5 text-[#ef4444]" />
            <h3 className="font-bold text-white text-sm">Mapas Bloqueados (Bans)</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-bold">
              {mapVetoSession.bannedMaps.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {mapVetoSession.bannedMaps.length === 0 ? (
              <div className="text-xs text-[#64748b] text-center py-6">Ningún mapa baneado aún.</div>
            ) : (
              mapVetoSession.bannedMaps.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#111620] rounded-2xl border border-[#ef4444]/30 flex items-center justify-between opacity-80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#ef4444]/20 text-[#ef4444] font-bold text-xs flex items-center justify-center">
                      🚫
                    </span>
                    <div>
                      <div className="text-sm font-bold line-through text-[#94a3b8]">{b.map}</div>
                      <div className="text-[11px] text-[#64748b]">Baneado por: <strong className="text-[#94a3b8]">{b.by}</strong></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#ef4444]">DESCARTADO</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Decider Map Box */}
        <div className="bg-[#181d27] rounded-3xl p-5 border border-[#2b3547] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2b3547]">
              <Sparkles className="w-5 h-5 text-[#facc15]" />
              <h3 className="font-bold text-white text-sm">Mapa Decisivo (Decider)</h3>
            </div>

            {mapVetoSession.deciderMap ? (
              <div className="p-4 bg-gradient-to-br from-[#1e293b] to-[#111620] rounded-2xl border border-[#facc15]/50 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#facc15]/20 text-[#facc15] flex items-center justify-center text-2xl mb-2">
                  🏆
                </div>
                <div className="text-xl font-black text-white">{mapVetoSession.deciderMap}</div>
                <div className="text-xs text-[#facc15] font-bold mt-1">Mapa 3 / Decider Match</div>
                <p className="text-[11px] text-[#94a3b8] mt-2">
                  Si la serie empata 1-1, el mapa final será {mapVetoSession.deciderMap}.
                </p>
              </div>
            ) : (
              <div className="p-6 bg-[#111620] rounded-2xl border border-dashed border-[#2b3547] text-center">
                <div className="text-xs text-[#64748b]">
                  El mapa decisivo se revelará automáticamente cuando reste 1 mapa en el pool.
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#2b3547] text-center">
            <span className="text-[11px] text-[#64748b]">
              Reglamento VCT Tier 1 • Servidores 128 Tickrate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
