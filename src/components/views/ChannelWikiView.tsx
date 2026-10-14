import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BookOpen,
  Plus,
  CheckSquare,
  AlertCircle,
  FileText,
  Trash2,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  Square,
  Search,
  Trophy,
  Swords,
  Shield,
  Crosshair,
  TrendingUp,
  Clock,
  DollarSign,
  Copy,
  Check,
  ChevronRight,
  BarChart3,
  Flame,
  Zap,
  Bookmark,
  Layers,
  Activity,
  Target,
  Play,
  RotateCcw,
  Sliders,
  Volume2,
  Cpu,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { WikiDocument, WikiSection } from '../../types';

export const ChannelWikiView: React.FC = () => {
  const { activeChannelId, wikiDocuments, updateWikiDocument } = useChatStore();

  const doc: WikiDocument = wikiDocuments[activeChannelId] || {
    id: `wiki-${Date.now()}`,
    channelId: activeChannelId,
    title: '🏆 Playbook Táctico VCT 2026: Sentinels Protocol',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 's-1',
        title: '1. Filosofía del IGL & Control de Economía',
        content:
          'El IGL Boaster dicta las llamadas a 1:15 del temporizador. Si el balance del equipo es inferior a $3,900 créditos tras perder la ronda, se juega save completo con Sheriff para garantizar compra plena de rifles Vandal + Armadura Pesada en la siguiente.',
        type: 'text',
      },
      {
        id: 's-2',
        title: '⚡ Setups de Humos y Flashes en Ascent A Site',
        content:
          'Humo A Heaven a los 0:12 de ronda. Humo A Door sincronizado con flashbang de Breach desde A Lobby para denegar retake y cerrar puerta con switch inmediatamente.',
        type: 'callout',
      },
      {
        id: 's-3',
        title: '📌 Protocolo de Tactical Timeout (60 Segundos)',
        content:
          'Al activar el Tactical Timeout en el Discord Overlay:\n[x] Mute automático de jugadores para escuchar únicamente a Coach Potter y al IGL.\n[x] Repaso rápido del antistrat del rival.\n[ ] Identificar patrón de rondas eco del rival.\n[ ] Reset mental y planteamiento de las próximas 3 rondas.',
        type: 'todo',
      },
    ],
  };

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [titleText, setTitleText] = useState<string>(doc.title);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChapter, setActiveChapter] = useState<string>('all');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // 1. Interactive Economy Calculator State
  const [calcCurrentMoney, setCalcCurrentMoney] = useState<number>(2400);
  const [calcRoundResult, setCalcRoundResult] = useState<'loss1' | 'loss2' | 'loss3' | 'loss4' | 'win' | 'winDefuse'>('loss2');

  // 2. Interactive Crosshair Generator State
  const [crosshairColor, setCrosshairColor] = useState<string>('#00f0ff');
  const [crosshairThickness, setCrosshairThickness] = useState<number>(1);
  const [crosshairLength, setCrosshairLength] = useState<number>(4);
  const [crosshairGap, setCrosshairGap] = useState<number>(2);
  const [crosshairCenterDot, setCrosshairCenterDot] = useState<boolean>(false);

  // 3. Interactive Tactical Timeout Timer State
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Interactive Radar Player Selection
  const [selectedPlayerRadar, setSelectedPlayerRadar] = useState<'tenz' | 'boaster' | 's1mple' | 'faker'>('tenz');

  const playerRadarStats = {
    tenz: { name: 'SEN TenZ', role: 'Duelist', aim: 98, gameSense: 88, utility: 82, trades: 92, clutch: 95 },
    boaster: { name: 'FNC Boaster', role: 'IGL / Support', aim: 82, gameSense: 99, utility: 96, trades: 89, clutch: 88 },
    s1mple: { name: 's1mple', role: 'Sniper / Entry', aim: 99, gameSense: 94, utility: 80, trades: 95, clutch: 97 },
    faker: { name: 'Faker', role: 'Anchor / Mid', aim: 90, gameSense: 98, utility: 94, trades: 96, clutch: 99 },
  };

  // Economy calculation logic
  const economyResult = useMemo(() => {
    let reward = 1900;
    if (calcRoundResult === 'loss1') reward = 1900;
    if (calcRoundResult === 'loss2') reward = 2400;
    if (calcRoundResult === 'loss3') reward = 2900;
    if (calcRoundResult === 'loss4') reward = 3400;
    if (calcRoundResult === 'win') reward = 3000;
    if (calcRoundResult === 'winDefuse') reward = 3300;

    const nextMoney = calcCurrentMoney + reward;
    let recommendation = 'Compra Completa (Full Buy)';
    let badgeColor = 'bg-[#22c55e] text-black';
    let suggestedGear = 'Vandal / Phantom + Armadura Pesada ($1,000) + Habilidades Plenas';

    if (nextMoney < 2900) {
      recommendation = 'Hard Eco (Save Completo)';
      badgeColor = 'bg-[#ff4655] text-white';
      suggestedGear = 'Classic (Gratis) o 1 Sheriff compartido. Guardar todo el saldo para la siguiente.';
    } else if (nextMoney < 3900) {
      recommendation = 'Semi-Eco Táctico';
      badgeColor = 'bg-[#f97316] text-white';
      suggestedGear = 'Ghost + Escudo Ligero ($400). Dejar mínimo $2,000 de reserva para garantizar $3,900 en la siguiente.';
    } else if (nextMoney < 4500) {
      recommendation = 'Force Buy / Compra Media';
      badgeColor = 'bg-[#facc15] text-black';
      suggestedGear = 'Bulldog / Guardian + Escudo Ligero + Utilidad clave para site.';
    }

    return {
      reward,
      nextMoney,
      recommendation,
      badgeColor,
      suggestedGear,
    };
  }, [calcCurrentMoney, calcRoundResult]);

  // Generated Crosshair Code
  const generatedCrosshairCode = useMemo(() => {
    const dotParam = crosshairCenterDot ? ';d;1;0b;0' : ';d;0';
    return `0;s;1;P;c;5;h;0${dotParam};0t;${crosshairThickness};0l;${crosshairLength};0v;${crosshairLength};0o;${crosshairGap};0a;1;0f;0;1b;0`;
  }, [crosshairColor, crosshairThickness, crosshairLength, crosshairGap, crosshairCenterDot]);

  // Timeout timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            playBuzzerSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const playBuzzerSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio fallback
    }
  };

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleUpdateSectionContent = (sectionId: string, newContent: string) => {
    const updatedSections = doc.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, content: newContent } : sec
    );
    updateWikiDocument(activeChannelId, { sections: updatedSections });
  };

  const handleAddSection = (type: WikiSection['type']) => {
    const newSection: WikiSection = {
      id: `sec-${Date.now()}`,
      title:
        type === 'callout'
          ? 'Nota Importante del Coach'
          : type === 'todo'
          ? 'Checklist de Objetivos de Ronda'
          : 'Nueva Estrategia',
      content:
        type === 'todo'
          ? '[ ] Definir timing de entrada\n[x] Asignar anclas defensivos'
          : 'Describe los pasos tácticos en detalle...',
      type,
    };
    updateWikiDocument(activeChannelId, {
      sections: [...doc.sections, newSection],
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    const updated = doc.sections.filter((s) => s.id !== sectionId);
    updateWikiDocument(activeChannelId, { sections: updated });
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    updateWikiDocument(activeChannelId, { title: titleText });
  };

  const chapters = [
    { id: 'all', label: 'Todos los Capítulos', icon: BookOpen },
    { id: 'comms', label: '1. Filosofía & Comms', icon: Shield },
    { id: 'calculator', label: '2. Calculadora Económica', icon: DollarSign },
    { id: 'economy', label: '3. Tablas de Compra VCT', icon: TrendingUp },
    { id: 'antistrat', label: '4. Antistrats de Rivales', icon: Swords },
    { id: 'maps', label: '5. Lineups por Mapa', icon: Target },
    { id: 'weapons', label: '6. Balística & TTK', icon: Crosshair },
    { id: 'radar', label: '7. Radar de Escuadra', icon: Cpu },
    { id: 'crosshair', label: '8. Generador de Miras', icon: Crosshair },
    { id: 'timeout', label: '9. Simulador Timeout 60s', icon: Clock },
    { id: 'notes', label: '10. Notas & Checklists', icon: FileText },
  ];

  return (
    <div className="flex-1 h-full bg-[#0b0e14] flex flex-col overflow-y-auto select-none text-[#e2e8f0]">
      {/* 1. Header & Hero Cover Banner */}
      <div className="bg-gradient-to-r from-[#181d27] via-[#1a2333] to-[#181d27] border-b border-[#2b3547] p-6 lg:p-8 relative overflow-hidden shadow-2xl flex-shrink-0">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#ff4655]/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <Trophy className="w-96 h-96 text-[#ff4655]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#ff4655]/15 border border-[#ff4655]/40 flex items-center justify-center text-3xl shadow-xl shadow-[#ff4655]/20 flex-shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ff4655] text-white">
                  VCT TIER 1 CIRCUIT 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFICADO POR COACHING
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    autoFocus
                    className="text-2xl font-black text-white bg-[#0f1422] px-3 py-1 rounded-xl border border-[#ff4655] focus:outline-none"
                  />
                ) : (
                  <h1
                    onClick={() => setIsEditingTitle(true)}
                    className="text-2xl md:text-3xl font-black text-white hover:text-[#ff4655] cursor-pointer transition tracking-tight"
                    title="Haz clic para editar título"
                  >
                    {doc.title}
                  </h1>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#94a3b8] mt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#ff4655]" />
                  Temporada VCT 2026 Masters & Champions
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                  10 Módulos • 26 Tablas & Herramientas Interactivas
                </span>
                <span>•</span>
                <span className="text-[#22c55e] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Sincronización en vivo 0ms
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search in Playbook */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar tácticas, mapas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#111620] border border-[#2b3547] rounded-xl text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#ff4655] transition w-56 md:w-64"
              />
            </div>
          </div>
        </div>

        {/* 2. Interactive Navigation Tabs (Table of Contents) */}
        <div className="max-w-6xl mx-auto mt-6 pt-5 border-t border-[#2b3547]/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {chapters.map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(ch.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/25'
                    : 'bg-[#111620] text-[#94a3b8] hover:text-white hover:bg-[#182133] border border-[#2b3547]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Content Body */}
      <div className="max-w-6xl w-full mx-auto p-6 lg:p-8 space-y-12">
        {/* CAPÍTULO 1: Filosofía & Comms Hierarchy */}
        {(activeChapter === 'all' || activeChapter === 'comms') && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2b3547]">
              <span className="w-8 h-8 rounded-xl bg-[#ff4655]/20 text-[#ff4655] flex items-center justify-center font-black text-sm">
                01
              </span>
              <div>
                <h2 className="text-xl font-black text-white">
                  Filosofía del IGL, Jerarquía de Comms & Regla de Clutch
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Estructura de voz de alta precisión para cero saturación acústica en momentos críticos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#111620] border border-[#2b3547] space-y-2">
                <div className="flex items-center gap-2 text-[#ff4655] font-black text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>1. Regla de Oro en Clutch</span>
                </div>
                <h3 className="text-sm font-bold text-white">Silencio Sepulcral Absoluto</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Cuando queda 1 jugador vivo, todos los eliminados permanecen en silencio. Prohibido sugerir jugadas o narrar audio. Únicamente el IGL puede aportar info si faltan menos de 7s de defuse.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111620] border border-[#2b3547] space-y-2">
                <div className="flex items-center gap-2 text-[#38bdf8] font-black text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>2. Protocolo de 3 Palabras</span>
                </div>
                <h3 className="text-sm font-bold text-white">Comms Concisas & Rápidas</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Toda llamada de contacto debe seguir el formato estandarizado: <strong>[Agente] + [Ubicación] + [Daño infligido]</strong> (Ej: <em>"Jett en Heaven, 120"</em> o <em>"Sova en Tree, tocado"</em>).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111620] border border-[#2b3547] space-y-2">
                <div className="flex items-center gap-2 text-[#facc15] font-black text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  <span>3. Reset Psicológico</span>
                </div>
                <h3 className="text-sm font-bold text-white">Respiración Post-Round</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Tras perder 2 rondas consecutivas, los primeros 5 segundos de la fase de compra son de silencio para inhalación y reseteo de ritmo cardíaco. El IGL da la llamada de compra al 1:15.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CAPÍTULO 2: Calculadora Económica Interactiva */}
        {(activeChapter === 'all' || activeChapter === 'calculator') && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2b3547]">
              <span className="w-8 h-8 rounded-xl bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center font-black text-sm">
                02
              </span>
              <div>
                <h2 className="text-xl font-black text-white">
                  Calculadora Interactiva de Economía VCT (Simulador en Vivo)
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Ingresa los créditos de tu escuadra y simula el resultado de la ronda para obtener la recomendación matemática del IGL.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#111620] via-[#141b27] to-[#111620] border border-[#2b3547] shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Controles de Entrada */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#94a3b8] flex items-center justify-between mb-2">
                      <span>Saldo Promedio Actual de la Escuadra</span>
                      <span className="text-base font-black text-[#22c55e] font-mono">${calcCurrentMoney}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={9000}
                      step={100}
                      value={calcCurrentMoney}
                      onChange={(e) => setCalcCurrentMoney(Number(e.target.value))}
                      className="w-full accent-[#ff4655] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-1">
                      <span>$0 (Bancarrota)</span>
                      <span>$3,900 (Umbral Rifle)</span>
                      <span>$9,000 (Tope Max)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#94a3b8] block mb-2">
                      Resultado de la Ronda Actual
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'loss1', label: 'Derrota 1 (+$1,900)' },
                        { id: 'loss2', label: 'Derrota 2 (+$2,400)' },
                        { id: 'loss3', label: 'Derrota 3 (+$2,900)' },
                        { id: 'loss4', label: 'Derrota 4+ (+$3,400)' },
                        { id: 'win', label: 'Victoria (+$3,000)' },
                        { id: 'winDefuse', label: 'Defuse (+$3,300)' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCalcRoundResult(item.id as typeof calcRoundResult)}
                          className={`px-2.5 py-2 rounded-xl text-xs font-bold transition border ${
                            calcRoundResult === item.id
                              ? 'bg-[#ff4655] text-white border-[#ff4655] shadow-lg shadow-[#ff4655]/20'
                              : 'bg-[#181d27] text-[#94a3b8] border-[#2b3547] hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resultado Algorítmico */}
                <div className="p-5 rounded-2xl bg-[#0b0e14] border border-[#2b3547] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
                      <span>Saldo Calculado Próxima Ronda:</span>
                      <span className="text-xl font-black text-white font-mono">
                        ${economyResult.nextMoney}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${economyResult.badgeColor}`}>
                        {economyResult.recommendation}
                      </span>
                    </div>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      <strong>Directiva del IGL:</strong> {economyResult.suggestedGear}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181d27] border border-[#2b3547] text-[11px] text-[#94a3b8] font-mono flex items-center justify-between">
                    <span>Loss Bonus acumulado: <strong>+${economyResult.reward}</strong></span>
                    <span>Meta de supervivencia: <strong>3 armas vivas</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CAPÍTULO 3: Antistrats de Rivales Tier 1 */}
        {(activeChapter === 'all' || activeChapter === 'antistrat') && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2b3547]">
              <span className="w-8 h-8 rounded-xl bg-[#facc15]/20 text-[#facc15] flex items-center justify-center font-black text-sm">
                04
              </span>
              <div>
                <h2 className="text-xl font-black text-white">
                  Matriz de Antistrats de Rivales Tier 1 (VCT Champions)
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Tendencias detectadas por Coaching Staff para anular los puntos fuertes de los contrincantes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rival 1: Fnatic */}
              <div className="p-5 rounded-2xl bg-[#111620] border border-[#2b3547] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧡</span>
                    <div>
                      <h3 className="text-sm font-black text-white">Fnatic (FNC)</h3>
                      <span className="text-[10px] font-mono text-[#f97316]">EMEA Tier 1</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f97316]/20 text-[#f97316]">
                    Metódico / Default
                  </span>
                </div>
                <div className="text-xs text-[#94a3b8] space-y-1.5 leading-relaxed">
                  <p>• <strong>Tendencia:</strong> 82% de ejecuciones sobre A Site con doble iniciador (Fade + Breach).</p>
                  <p>• <strong>Punto débil:</strong> Anclas pasivos en B site; vulnerables a fast-rush con flashes ciegos.</p>
                  <p>• <strong>Trigger de Timeout:</strong> Si Derke logra 2 rondas con Operator en Mid.</p>
                </div>
              </div>

              {/* Rival 2: Paper Rex */}
              <div className="p-5 rounded-2xl bg-[#111620] border border-[#2b3547] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦖</span>
                    <div>
                      <h3 className="text-sm font-black text-white">Paper Rex (PRX)</h3>
                      <span className="text-[10px] font-mono text-[#a855f7]">Pacific Tier 1</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#a855f7]/20 text-[#a855f7]">
                    W-Gaming / Caos
                  </span>
                </div>
                <div className="text-xs text-[#94a3b8] space-y-1.5 leading-relaxed">
                  <p>• <strong>Tendencia:</strong> Push constante a través de humos en los primeros 12 segundos (something / f0rsakeN).</p>
                  <p>• <strong>Punto débil:</strong> Agotan utilidades rápido; ceden espacio en post-plant fácilmente.</p>
                  <p>• <strong>Contramedida:</strong> Molotovs tempranos de contención en entradas y esperar sin asomarse.</p>
                </div>
              </div>

              {/* Rival 3: LOUD */}
              <div className="p-5 rounded-2xl bg-[#111620] border border-[#2b3547] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💚</span>
                    <div>
                      <h3 className="text-sm font-black text-white">LOUD</h3>
                      <span className="text-[10px] font-mono text-[#22c55e]">Americas Tier 1</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/20 text-[#22c55e]">
                    Control de Viper
                  </span>
                </div>
                <div className="text-xs text-[#94a3b8] space-y-1.5 leading-relaxed">
                  <p>• <strong>Tendencia:</strong> Muro de Viper para cortar mapa y lurkeo persistente en flanco.</p>
                  <p>• <strong>Punto débil:</strong> Rotaciones lentas (más de 18 segundos de A a B por spawn).</p>
                  <p>• <strong>Contramedida:</strong> Fakes rápidos con ruidos de pasos para forzar bajada de combustible de Viper.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CAPÍTULO 4: Lineups de Habilidades por Mapa */}
        {(activeChapter === 'all' || activeChapter === 'maps') && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2b3547]">
              <span className="w-8 h-8 rounded-xl bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center font-black text-sm">
                05
              </span>
              <div>
                <h2 className="text-xl font-black text-white">
                  Lineups & Setups Tácticos de Alta Precisión por Mapa
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Coordenadas milimétricas para flechas de Sova, humos de Omen y nanoplazas de Killjoy.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#2b3547] bg-[#111620] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181d27] text-[#94a3b8] font-bold uppercase tracking-wider border-b border-[#2b3547]">
                  <tr>
                    <th className="p-3.5">Mapa</th>
                    <th className="p-3.5">Agente</th>
                    <th className="p-3.5">Habilidad</th>
                    <th className="p-3.5">Punto de Lanzamiento</th>
                    <th className="p-3.5">Objetivo Revelado / Bloqueado</th>
                    <th className="p-3.5">Carga & Rebote</th>
                    <th className="p-3.5">Efectividad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b3547] text-[#cbd5e1] font-mono">
                  <tr className="hover:bg-[#182133] transition">
                    <td className="p-3.5 font-bold text-white font-sans">Ascent</td>
                    <td className="p-3.5 text-[#38bdf8]">Sova</td>
                    <td className="p-3.5 font-sans">Recon Bolt</td>
                    <td className="p-3.5 font-sans">A Lobby (Esquina de ladrillos)</td>
                    <td className="p-3.5 font-sans">A Heaven & Generator</td>
                    <td className="p-3.5 text-[#facc15]">2 Barras / 1 Rebote</td>
                    <td className="p-3.5 text-[#22c55e] font-black">98% Escaneo</td>
                  </tr>
                  <tr className="hover:bg-[#182133] transition">
                    <td className="p-3.5 font-bold text-white font-sans">Ascent</td>
                    <td className="p-3.5 text-[#a855f7]">Omen</td>
                    <td className="p-3.5 font-sans">Dark Cover</td>
                    <td className="p-3.5 font-sans">B Main entrance</td>
                    <td className="p-3.5 font-sans">Market Door & CT Spawn</td>
                    <td className="p-3.5 text-[#facc15]">Instantáneo (0:08)</td>
                    <td className="p-3.5 text-[#22c55e] font-black">100% Cierre</td>
                  </tr>
                  <tr className="hover:bg-[#182133] transition">
                    <td className="p-3.5 font-bold text-white font-sans">Haven</td>
                    <td className="p-3.5 text-[#facc15]">Killjoy</td>
                    <td className="p-3.5 font-sans">Lockdown Ultimate</td>
                    <td className="p-3.5 font-sans">B Site Link / Bajo ventana</td>
                    <td className="p-3.5 font-sans">Cubre 100% de A Site & A Short</td>
                    <td className="p-3.5 text-[#facc15]">Ult (8 Puntos)</td>
                    <td className="p-3.5 text-[#22c55e] font-black">Retake Garantizado</td>
                  </tr>
                  <tr className="hover:bg-[#182133] transition">
                    <td className="p-3.5 font-bold text-white font-sans">Lotus</td>
                    <td className="p-3.5 text-[#ff4655]">Fade</td>
                    <td className="p-3.5 font-sans">Haunt (Ojo)</td>
                    <td className="p-3.5 font-sans">C Lobby sobre tejado</td>
                    <td className="p-3.5 font-sans">C Site completo & C Mound</td>
                    <td className="p-3.5 text-[#facc15]">Caída en vértice</td>
                    <td className="p-3.5 text-[#22c55e] font-black">94% Detección</td>
                  </tr>
                  <tr className="hover:bg-[#182133] transition">
                    <td className="p-3.5 font-bold text-white font-sans">Mirage (CS2)</td>
                    <td className="p-3.5 text-[#eab308]">Todos</td>
                    <td className="p-3.5 font-sans">Smoke Granada</td>
                    <td className="p-3.5 font-sans">T Roof / Basura Spawn</td>
                    <td className="p-3.5 font-sans">Mirage Window (Ventana Mid)</td>
                    <td className="p-3.5 text-[#facc15]">Jumpthrow (Tecla V)</td>
                    <td className="p-3.5 text-[#22c55e] font-black">Humo Perfecto 0 Gap</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CAPÍTULO 5: Radar de Habilidades del Roster */}
        {(activeChapter === 'all' || activeChapter === 'radar') && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2b3547]">
              <span className="w-8 h-8 rounded-xl bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center font-black text-sm">
                07
              </span>
              <div>
                <h2 className="text-xl font-black text-white">
                  Radar Táctico de Habilidades del Roster Oficial
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Desglose de métricas avanzadas (Aim, Game Sense, Utilidad, Trades y Clutch) por jugador.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111620] border border-[#2b3547] shadow-xl space-y-6">
              {/* Selector de Jugador */}
              <div className="flex flex-wrap items-center gap-2">
                {(['tenz', 'boaster', 's1mple', 'faker'] as const).map((key) => {
                  const p = playerRadarStats[key];
                  const isSel = selectedPlayerRadar === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPlayerRadar(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                        isSel
                          ? 'bg-[#ff4655] text-white border-[#ff4655] shadow-lg shadow-[#ff4655]/25'
                          : 'bg-[#181d27] text-[#94a3b8] border-[#2b3547] hover:text-white'
                      }`}
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] font-mono opacity-80">({p.role})</span>
                    </button>
                  );
                })}
              </div>

              {/* Estadísticas en Barras / Radar */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { label: 'Aim / One-Tap', value: playerRadarStats[selectedPlayerRadar].aim, color: 'from-[#ff4655] to-[#f43f5e]' },
                  { label: 'Game Sense (Macro)', value: playerRadarStats[selectedPlayerRadar].gameSense, color: 'from-[#38bdf8] to-[#0ea5e9]' },
                  { label: 'Eficiencia Utilidad', value: playerRadarStats[selectedPlayerRadar].utility, color: 'from-[#22c55e] to-[#16a34a]' },
                  { label: 'Trade Fragging', value: playerRadarStats[selectedPlayerRadar].trades, color: 'from-[#facc15] to-[#eab308]' },
                  { label: 'Clutch Factor (1vX)', value: playerRadarStats[selectedPlayerRadar].clutch, color: 'from-[#a855f7] to-[#9333ea]' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0b0e14] border border-[#2b3547] space-y-2">
                    <span className="text-xs font-bold text-[#94a3b8]">{stat.label}</span>
                    <div className="text-2xl font-black text-white font-mono">{stat.value}%</div>
                    <div className="w-full h-2 bg-[#181d27] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-700`}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CAPÍTULO 6: Generador Interactivo de Miras en Vivo */}
        {(activeChapter === 'all' || activeChapter === 'crosshair') && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2b3547]">
              <span className="w-8 h-8 rounded-xl bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center font-black text-sm">
                08
              </span>
              <div>
                <h2 className="text-xl font-black text-white">
                  Generador & Validador de Miras VCT en Vivo
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Personaliza visualmente tu retícula con preview a escala real y exporta el código oficial para Valorant.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111620] border border-[#2b3547] shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controles de Mira */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#94a3b8] block mb-2">Color de Mira</label>
                  <div className="flex items-center gap-2">
                    {['#00f0ff', '#22c55e', '#ffffff', '#ff4655', '#facc15'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCrosshairColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          crosshairColor === c ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#94a3b8] mb-1">
                    <span>Grosor de Línea</span>
                    <span className="font-mono text-white">{crosshairThickness} px</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={crosshairThickness}
                    onChange={(e) => setCrosshairThickness(Number(e.target.value))}
                    className="w-full accent-[#ff4655]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#94a3b8] mb-1">
                    <span>Longitud de Línea</span>
                    <span className="font-mono text-white">{crosshairLength} px</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    value={crosshairLength}
                    onChange={(e) => setCrosshairLength(Number(e.target.value))}
                    className="w-full accent-[#ff4655]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#94a3b8] mb-1">
                    <span>Espaciado Central (Gap)</span>
                    <span className="font-mono text-white">{crosshairGap} px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={6}
                    value={crosshairGap}
                    onChange={(e) => setCrosshairGap(Number(e.target.value))}
                    className="w-full accent-[#ff4655]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="centerDot"
                    checked={crosshairCenterDot}
                    onChange={(e) => setCrosshairCenterDot(e.target.checked)}
                    className="rounded border-[#2b3547] text-[#ff4655] accent-[#ff4655]"
                  />
                  <label htmlFor="centerDot" className="text-xs font-bold text-white cursor-pointer">
                    Activar Punto Central (Center Dot)
                  </label>
                </div>
              </div>

              {/* Previsualización en Vivo & Código */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-[#07090e] border border-[#2b3547] space-y-4">
                {/* Canvas Box */}
                <div className="h-44 w-full bg-[#181d27] rounded-xl flex items-center justify-center relative border border-[#2b3547] overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-transparent to-black/60 pointer-events-none" />
                  {/* Subtle target circle */}
                  <div className="w-16 h-16 rounded-full border border-[#ff4655]/30 flex items-center justify-center pointer-events-none" />

                  {/* Dynamic Crosshair Render */}
                  <div className="relative flex items-center justify-center pointer-events-none">
                    {crosshairCenterDot && (
                      <div
                        className="rounded-full absolute"
                        style={{
                          width: `${crosshairThickness + 1}px`,
                          height: `${crosshairThickness + 1}px`,
                          backgroundColor: crosshairColor,
                        }}
                      />
                    )}
                    {/* Top */}
                    <div
                      className="absolute"
                      style={{
                        width: `${crosshairThickness}px`,
                        height: `${crosshairLength * 2}px`,
                        bottom: `${crosshairGap + 2}px`,
                        backgroundColor: crosshairColor,
                      }}
                    />
                    {/* Bottom */}
                    <div
                      className="absolute"
                      style={{
                        width: `${crosshairThickness}px`,
                        height: `${crosshairLength * 2}px`,
                        top: `${crosshairGap + 2}px`,
                        backgroundColor: crosshairColor,
                      }}
                    />
                    {/* Left */}
                    <div
                      className="absolute"
                      style={{
                        height: `${crosshairThickness}px`,
                        width: `${crosshairLength * 2}px`,
                        right: `${crosshairGap + 2}px`,
                        backgroundColor: crosshairColor,
                      }}
                    />
                    {/* Right */}
                    <div
                      className="absolute"
                      style={{
                        height: `${crosshairThickness}px`,
                        width: `${crosshairLength * 2}px`,
                        left: `${crosshairGap + 2}px`,
                        backgroundColor: crosshairColor,
                      }}
                    />
                  </div>
                </div>

                {/* Código Generado y Botón de Copiar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-[#94a3b8]">Código Generado de Valorant:</span>
                    <button
                      onClick={() => handleCopySnippet(generatedCrosshairCode, 'gen-crosshair')}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#ff4655] hover:bg-[#e03b49] text-white rounded-lg text-xs font-bold transition shadow-md shadow-[#ff4655]/20"
                    >
                      {copiedSnippet === 'gen-crosshair' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-2.5 bg-[#0b0e14] rounded-lg text-xs font-mono text-[#38bdf8] overflow-x-auto border border-[#1b2234]">
                    {generatedCrosshairCode}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CAPÍTULO 7: Simulador de Tactical Timeout 60s en Vivo */}
        {(activeChapter === 'all' || activeChapter === 'timeout') && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2b3547]">
              <span className="w-8 h-8 rounded-xl bg-[#ff4655]/20 text-[#ff4655] flex items-center justify-center font-black text-sm">
                09
              </span>
              <div>
                <h2 className="text-xl font-black text-white">
                  Simulador de Tactical Timeout (60 Segundos en Vivo)
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Herramienta interactiva para ensayar las 4 fases obligatorias de la pausa reglamentaria.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111620] border border-[#2b3547] shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black font-mono text-white tracking-widest">
                    00:{timeoutSeconds < 10 ? `0${timeoutSeconds}` : timeoutSeconds}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#ff4655] uppercase tracking-wider block">
                      {timeoutSeconds > 45
                        ? 'Fase 1: Silencio & Hidratación'
                        : timeoutSeconds > 25
                        ? 'Fase 2: Análisis Antistrat Coach Potter'
                        : timeoutSeconds > 10
                        ? 'Fase 3: Llamada de Jugada IGL Boaster'
                        : 'Fase 4: Ready Check & Retorno al Servidor'}
                    </span>
                    <span className="text-[11px] text-[#94a3b8]">
                      Canal de voz enmudecido para escuchar exclusivamente al cuerpo técnico.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                      isTimerRunning
                        ? 'bg-[#ef4444] text-white'
                        : 'bg-[#22c55e] text-black shadow-[#22c55e]/25'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isTimerRunning ? 'Pausar' : 'Iniciar Timeout'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimeoutSeconds(60);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#181d27] hover:bg-[#222a38] text-white rounded-xl text-xs font-bold transition border border-[#2b3547]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar 60s</span>
                  </button>
                </div>
              </div>

              {/* Barra de Progreso del Timeout */}
              <div className="w-full h-3 bg-[#0b0e14] rounded-full overflow-hidden border border-[#2b3547]">
                <div
                  className="h-full bg-gradient-to-r from-[#22c55e] via-[#facc15] to-[#ff4655] rounded-full transition-all duration-1000"
                  style={{ width: `${(timeoutSeconds / 60) * 100}%` }}
                />
              </div>
            </div>
          </section>
        )}

        {/* CAPÍTULO 8: Notas de Campo & Checklists Personalizables */}
        {(activeChapter === 'all' || activeChapter === 'notes') && (
          <section className="space-y-4 pt-4 border-t border-[#2b3547]">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center font-black text-sm">
                  10
                </span>
                <div>
                  <h2 className="text-xl font-black text-white">
                    Notas de Campo y Checklists de la Escuadra
                  </h2>
                  <p className="text-xs text-[#94a3b8]">
                    Bloques editables en vivo por los miembros autorizados del equipo.
                  </p>
                </div>
              </div>

              {/* Add block buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddSection('text')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#181d27] hover:bg-[#222a38] text-white rounded-xl text-xs font-bold transition border border-[#2b3547]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ff4655]" />
                  <span>Texto</span>
                </button>
                <button
                  onClick={() => handleAddSection('callout')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#181d27] hover:bg-[#222a38] text-white rounded-xl text-xs font-bold transition border border-[#2b3547]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Callout</span>
                </button>
                <button
                  onClick={() => handleAddSection('todo')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#181d27] hover:bg-[#222a38] text-white rounded-xl text-xs font-bold transition border border-[#2b3547]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>Checklist</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {doc.sections.map((section) => (
                <div
                  key={section.id}
                  className="group relative bg-[#111620] hover:bg-[#141b27] border border-[#2b3547] rounded-2xl p-5 transition shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {section.type === 'callout' && <Info className="w-4 h-4 text-[#38bdf8]" />}
                      {section.type === 'todo' && <CheckSquare className="w-4 h-4 text-[#22c55e]" />}
                      {section.type === 'text' && <FileText className="w-4 h-4 text-[#94a3b8]" />}
                      <h3 className="text-sm font-bold text-white">{section.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      title="Eliminar bloque"
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#94a3b8] hover:text-[#ff4655] hover:bg-[#ff4655]/10 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {section.type === 'callout' ? (
                    <div className="bg-[#38bdf8]/10 border-l-4 border-[#38bdf8] rounded-r-xl p-3">
                      <textarea
                        value={section.content}
                        onChange={(e) => handleUpdateSectionContent(section.id, e.target.value)}
                        rows={2}
                        className="w-full bg-transparent text-xs text-[#cbd5e1] resize-none focus:outline-none"
                      />
                    </div>
                  ) : section.type === 'todo' ? (
                    <div className="space-y-1.5 bg-[#0b0e14] rounded-xl p-3 border border-[#1b2234]">
                      {section.content.split('\n').map((line, idx) => {
                        const isChecked = line.trim().startsWith('[x]') || line.trim().startsWith('[X]');
                        const text = line.replace(/^\[[ xX]\]\s*/, '');
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              const lines = section.content.split('\n');
                              lines[idx] = isChecked ? `[ ] ${text}` : `[x] ${text}`;
                              handleUpdateSectionContent(section.id, lines.join('\n'));
                            }}
                            className="flex items-center gap-2.5 text-xs text-[#cbd5e1] cursor-pointer hover:bg-[#111620] p-1.5 rounded-lg transition"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#22c55e] shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-[#64748b] shrink-0" />
                            )}
                            <span className={isChecked ? 'line-through text-[#64748b]' : ''}>
                              {text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <textarea
                      value={section.content}
                      onChange={(e) => handleUpdateSectionContent(section.id, e.target.value)}
                      rows={3}
                      className="w-full bg-transparent text-xs text-[#cbd5e1] leading-relaxed resize-none focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
