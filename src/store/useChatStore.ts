import { create } from 'zustand';
import {
  User,
  Guild,
  Message,
  ActiveVoiceSession,
  UserSettings,
  UserStatus,
  ChannelType,
  Permissions,
  ChannelViewMode,
  KanbanTask,
  AudioQualityMode,
  Poll,
  CommunityEvent,
  WorkflowRule,
  WhiteboardElement,
  CodeStudioFile,
  WikiDocument,
  StageSession,
  MapVetoSession,
  ScrimMatch,
} from '../types';
import { defaultSnowflake } from '../utils/snowflake';

const CURRENT_USER: User = {
  id: '100000000000000001',
  username: 'tenz_aim',
  displayName: 'SEN TenZ',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  status: 'online',
  customStatus: 'Scrimming vs Fnatic 🔥 (Ascent)',
  bannerColor: '#ff4655',
  bio: 'Pro Duelist para Sentinels. VCT Masters Winner. 800 DPI, 0.28 in-game sens, 360Hz.',
  badges: ['🏆 VCT Champion', '👑 Sentinels VIP', '⚡ Radiant #12', '🎯 Duelist'],
  gamingProfile: {
    teamTag: 'SEN',
    roleTitle: 'Duelist / Entry',
    rankTier: 'Radiant #12',
    mainGame: 'VALORANT',
    kda: '1.62',
    headshotPct: '41.8%',
    winRate: '76.4%',
    riotId: 'SEN TenZ#NA1',
  },
  activity: {
    type: 'playing',
    name: 'VALORANT - VCT Masters',
    details: 'En partida competitiva (Ascent 11 - 9) - KDA: 24/11/6',
  },
};

const MOCK_USERS: Record<string, User> = {
  '100000000000000001': CURRENT_USER,
  '100000000000000002': {
    id: '100000000000000002',
    username: 'boaster_igl',
    displayName: 'FNC Boaster (IGL)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    bannerColor: '#f7931a',
    bio: 'Capitán e IGL de Fnatic. Diseñando los mejores sets de utilidades para VCT EMEA.',
    badges: ['👑 IGL', '🏆 VCT Champion', '🧠 Strat Master'],
    gamingProfile: {
      teamTag: 'FNC',
      roleTitle: 'IGL',
      rankTier: 'Radiant #45',
      mainGame: 'VALORANT',
      kda: '1.24',
      headshotPct: '32.1%',
      winRate: '71.2%',
      riotId: 'FNC Boaster#EUW',
    },
    activity: { type: 'playing', name: 'VALORANT - Custom Scrim' },
  },
  '100000000000000003': {
    id: '100000000000000003',
    username: 'potter_coach',
    displayName: 'EG Potter (Head Coach)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'dnd',
    customStatus: 'Revisando VODs & Antistrats 📊',
    bannerColor: '#00f0ff',
    bio: 'Esports Head Coach of the Year. Campeona del Mundo. Analítica de rondas y economía.',
    badges: ['🎯 Head Coach', '📊 VOD Architect', '🏆 World Champion'],
    gamingProfile: {
      teamTag: 'EG',
      roleTitle: 'Head Coach',
      rankTier: 'Radiant',
      mainGame: 'VALORANT',
      winRate: '69.0%',
    },
  },
  '100000000000000004': {
    id: '100000000000000004',
    username: 's1mple_cs',
    displayName: 's1mple (AWP God)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    status: 'idle',
    bannerColor: '#fff000',
    bio: 'Counter-Strike Legend. Major MVP. 400 DPI, Raw Input, 4:3 Stretched.',
    badges: ['👑 CS Major MVP', '🎯 AWP God', '⭐ Faceit 10'],
    gamingProfile: {
      teamTag: 'NAVI',
      roleTitle: 'Sniper / AWP',
      rankTier: 'Global Elite / Faceit 3800 ELO',
      mainGame: 'Counter-Strike 2',
      kda: '1.74',
      headshotPct: '44.0%',
      winRate: '74.2%',
      steamId: 'STEAM_0:1:23910293',
    },
    activity: { type: 'playing', name: 'Counter-Strike 2 - Faceit Pro League' },
  },
  '100000000000000005': {
    id: '100000000000000005',
    username: 'faker_demon',
    displayName: 'T1 Faker (Demon King)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    bannerColor: '#e50914',
    bio: 'Unkillable Demon King. 5x Worlds Champion. Siempre buscando la jugada perfecta.',
    badges: ['🏆 5x Worlds Champ', '👑 Hall of Fame', '⭐ Challenger'],
    gamingProfile: {
      teamTag: 'T1',
      roleTitle: 'IGL',
      rankTier: 'Challenger 1150LP',
      mainGame: 'League of Legends',
      kda: '1.45',
      winRate: '68.9%',
      riotId: 'Hide on bush#KR1',
    },
    activity: { type: 'playing', name: 'League of Legends (Ranked Challenger)' },
  },
};

const INITIAL_GUILDS: Guild[] = [
  {
    id: '200000000000000001',
    name: '⚡ SENTINELS ESPORTS HQ (Tier 1)',
    icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
    ownerId: '100000000000000001',
    roles: [
      {
        id: '200000000000000001',
        name: '@everyone',
        color: '#99aab5',
        hoist: false,
        position: 0,
        permissions: Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES | Permissions.CONNECT | Permissions.SPEAK,
      },
      {
        id: '300000000000000001',
        name: '👑 IGL / Capitán',
        color: '#ff4655',
        hoist: true,
        position: 10,
        permissions: Permissions.ADMINISTRATOR,
      },
      {
        id: '300000000000000002',
        name: '🎯 Head Coach',
        color: '#00f0ff',
        hoist: true,
        position: 8,
        permissions: Permissions.PRIORITY_SPEAKER | Permissions.MUTE_MEMBERS | Permissions.MANAGE_CHANNELS,
      },
      {
        id: '300000000000000003',
        name: '⚡ Tier 1 Pro Starter',
        color: '#23a55a',
        hoist: true,
        position: 5,
        permissions: Permissions.STREAM | Permissions.CONNECT | Permissions.SPEAK,
      },
      {
        id: '300000000000000004',
        name: '📊 Esports Analyst',
        color: '#fee75c',
        hoist: true,
        position: 3,
        permissions: Permissions.SEND_MESSAGES | Permissions.ATTACH_FILES,
      },
    ],
    categories: [
      { id: '400000000000000001', guildId: '200000000000000001', name: '🏆 TORNEOS & MATCHMAKING', position: 0 },
      { id: '400000000000000002', guildId: '200000000000000001', name: '🎯 ESTRATEGIAS & LINEUPS', position: 1 },
      { id: '400000000000000003', guildId: '200000000000000001', name: '🔊 CABINAS DE VOZ & COACHING', position: 2 },
    ],
    channels: [
      {
        id: '500000000000000001',
        guildId: '200000000000000001',
        name: '📢-anuncios-vct',
        type: 'announcement',
        topic: 'Horarios oficiales de partidos, brackets y comunicados de la organización.',
        categoryId: '400000000000000001',
        position: 0,
      },
      {
        id: '500000000000000002',
        guildId: '200000000000000001',
        name: '⚔️-scrims-matchmaking',
        type: 'text',
        topic: 'Canal de coordinación de Scrims Tier 1 contra Fnatic, C9, LOUD y NAVI.',
        categoryId: '400000000000000001',
        position: 1,
      },
      {
        id: '500000000000000003',
        guildId: '200000000000000001',
        name: '🎯-playbook-y-lineups',
        type: 'text',
        topic: 'Mapas tácticos, setups de humos, flashes y anti-eco strats.',
        categoryId: '400000000000000002',
        position: 2,
      },
      {
        id: '500000000000000004',
        guildId: '200000000000000001',
        name: '🔒-coach-private-briefing',
        type: 'text',
        topic: 'Debriefing confidencial entre Head Coach, IGL y analistas.',
        categoryId: '400000000000000002',
        position: 3,
        isPrivate: true,
      },
      {
        id: '500000000000000005',
        guildId: '200000000000000001',
        name: '🔊 Cabina Principal VCT (144k)',
        type: 'voice',
        categoryId: '400000000000000003',
        position: 4,
      },
      {
        id: '500000000000000006',
        guildId: '200000000000000001',
        name: '🔊 Coach & IGL Whisper Line',
        type: 'voice',
        categoryId: '400000000000000003',
        position: 5,
      },
      {
        id: '500000000000000007',
        guildId: '200000000000000001',
        name: '🔊 Scrim Room Alfa',
        type: 'voice',
        categoryId: '400000000000000003',
        position: 6,
      },
      {
        id: '500000000000000008',
        guildId: '200000000000000001',
        name: '🎤 Escenario VCT Grand Finals',
        type: 'stage',
        categoryId: '400000000000000001',
        position: 7,
      },
    ],
    members: [
      { userId: '100000000000000001', guildId: '200000000000000001', roleIds: ['300000000000000001', '300000000000000003'], joinedAt: '2026-01-01' },
      { userId: '100000000000000002', guildId: '200000000000000001', roleIds: ['300000000000000001'], joinedAt: '2026-01-02' },
      { userId: '100000000000000003', guildId: '200000000000000001', roleIds: ['300000000000000002'], joinedAt: '2026-01-03' },
      { userId: '100000000000000004', guildId: '200000000000000001', roleIds: ['300000000000000003'], joinedAt: '2026-01-04' },
      { userId: '100000000000000005', guildId: '200000000000000001', roleIds: ['300000000000000003'], joinedAt: '2026-01-05' },
    ],
  },
  {
    id: '200000000000000002',
    name: '🏆 VCT & CS2 TOURNAMENT CIRCUIT',
    icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80',
    ownerId: '100000000000000001',
    roles: [
      {
        id: '200000000000000002',
        name: '@everyone',
        color: '#99aab5',
        hoist: false,
        position: 0,
        permissions: Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES | Permissions.CONNECT | Permissions.SPEAK,
      },
    ],
    categories: [
      { id: '400000000000000010', guildId: '200000000000000002', name: 'COMPETICIÓN EN VIVO', position: 0 },
    ],
    channels: [
      {
        id: '500000000000000011',
        guildId: '200000000000000002',
        name: '🏆-bracket-en-vivo',
        type: 'text',
        topic: 'Cuadro de enfrentamientos eliminatorios y resultados en directo.',
        categoryId: '400000000000000010',
        position: 0,
      },
      {
        id: '500000000000000012',
        guildId: '200000000000000002',
        name: '⚔️-map-veto-pick-ban',
        type: 'text',
        topic: 'Fase de vetos y elecciones de mapas oficiales.',
        categoryId: '400000000000000010',
        position: 1,
      },
      {
        id: '500000000000000013',
        guildId: '200000000000000002',
        name: '🔊 Caster & Observer Booth',
        type: 'voice',
        categoryId: '400000000000000010',
        position: 2,
      },
    ],
    members: [
      { userId: '100000000000000001', guildId: '200000000000000002', roleIds: [], joinedAt: '2026-01-01' },
      { userId: '100000000000000002', guildId: '200000000000000002', roleIds: [], joinedAt: '2026-01-02' },
    ],
  },
  {
    id: '200000000000000003',
    name: '🔥 RADIANT & FACEIT 10 LFT',
    icon: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
    ownerId: '100000000000000004',
    roles: [],
    categories: [],
    channels: [],
    members: [],
  },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '500000000000000002': [
    {
      id: '600000000000000001',
      channelId: '500000000000000002',
      authorId: '100000000000000001',
      content: '¡GGs equipo! Acabamos de terminar la sesión de VOD review contra Fnatic. Hemos identificado los timings de rotación en **Ascent A Main** y **B Site**. Aquí está el clip del clutch 1v3 con Omen en la ronda 22: ¡9ms de latencia constante y 360 FPS!',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      reactions: [{ emoji: '🔥', count: 4, users: ['100000000000000002', '100000000000000003', '100000000000000004', '100000000000000005'] }, { emoji: '👑', count: 3, users: ['100000000000000001', '100000000000000002', '100000000000000003'] }],
      attachments: [
        {
          id: 'att-1',
          filename: 'tenz_clutch_ascent_a.png',
          url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
          size: 2450000,
          contentType: 'image/png',
          width: 1200,
          height: 800,
        },
      ],
    },
    {
      id: '600000000000000002',
      channelId: '500000000000000002',
      authorId: '100000000000000002',
      content: 'Exacto TenZ. Si ejecutamos el doble flash en A short cuando tiren el molly de Killjoy, ganamos el site el 85% de las rondas.\nPor cierto, tu nuevo código de mira competitivo está impecable:\n`0;s;1;P;c;5;h;0;m;1;0t;1;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0`\n\nSpoiler antistrat: ||Fnatic fuerza buy en la ronda 3 si pierden la eco previa|| 🎯',
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      reactions: [{ emoji: '👀', count: 2, users: ['100000000000000001', '100000000000000004'] }],
    },
    {
      id: '600000000000000003',
      channelId: '500000000000000002',
      authorId: '100000000000000003',
      content: '```cfg\\n// SENTINELS TenZ VCT 2026 Competitive Config\\nsensitivity 0.35 // 800 DPI (eDPI 280)\\ncl_crosshairstyle 4\\ncl_crosshairsize 2\\ncl_crosshairgap -1\\nfps_max 400\\n```\\nRecordad que mañana a las 18:00 CET tenemos scrim Bo3 contra Cloud9 en Frankfurt 1. Todo el mundo 15 minutos antes en el canal de voz táctico. El sistema de Map Veto ya está abierto.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      reactions: [{ emoji: '⚡', count: 4, users: ['100000000000000001', '100000000000000002', '100000000000000004', '100000000000000005'] }],
      attachments: [
        {
          id: 'att-2',
          filename: 'tenz_vct_crosshair.cfg',
          url: 'https://raw.githubusercontent.com/',
          size: 14500,
          contentType: 'text/plain',
        },
      ],
    },
    {
      id: '600000000000000004',
      channelId: '500000000000000002',
      authorId: '100000000000000004',
      content: 'En CS2 Mirage también tenemos el execute A listo: humo en CT, Escalera y Conector con 8ms de ping y 128 Tickrate. Y el botón de **Tactical Timeout** en el Discord Overlay silencia a todos para el coach automáticamente. ¡Ready! 🏆',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      reactions: [{ emoji: '🎉', count: 3, users: ['100000000000000001', '100000000000000002', '100000000000000003'] }],
      attachments: [
        {
          id: 'att-3',
          filename: 'mirage_strat_playbook.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: 1240000,
          contentType: 'application/pdf',
        },
      ],
    },
  ],
};

const INITIAL_KANBAN_TASKS: Record<string, KanbanTask[]> = {
  '500000000000000002': [
    {
      id: 'k-1',
      channelId: '500000000000000002',
      title: '🎯 Antistrat Fnatic: Lineups de Sova en Haven',
      description: 'Recon dardo para B site y shock darts para spike plant default.',
      status: 'done',
      priority: 'urgent',
      assigneeId: '100000000000000002',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ['VCT', 'Antistrat'],
    },
    {
      id: 'k-2',
      channelId: '500000000000000002',
      title: '⚡ Scrim Bo3 vs Cloud9 - Servidor Frankfurt',
      description: 'Partida de preparación VCT Masters. Bloquear 3 mapas en el Veto.',
      status: 'in_progress',
      priority: 'high',
      assigneeId: '100000000000000003',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      tags: ['Tier 1 Scrim', 'Frankfurt'],
    },
    {
      id: 'k-3',
      channelId: '500000000000000002',
      title: '🔥 Sincronizar Crosshairs y Autoexecs (360Hz)',
      description: 'Actualizar archivos en Code Studio con configs de TenZ y s1mple.',
      status: 'todo',
      priority: 'medium',
      assigneeId: '100000000000000001',
      createdAt: new Date(Date.now() - 21600000).toISOString(),
      tags: ['Config', 'Pro Gear'],
    },
    {
      id: 'k-4',
      channelId: '500000000000000002',
      title: '📊 Análisis de Economía Anti-Eco & Bonus Round',
      description: 'Repasar rondas 2 y 3 para evitar pérdidas de armas costosas.',
      status: 'backlog',
      priority: 'low',
      assigneeId: '100000000000000004',
      createdAt: new Date().toISOString(),
      tags: ['Economía', 'Coaching'],
    },
  ],
};

const INITIAL_THREAD_MESSAGES: Record<string, Message[]> = {
  '600000000000000003': [
    {
      id: '700000000000000001',
      channelId: '500000000000000002',
      authorId: '100000000000000001',
      content: 'El código de mira funciona genial a 1440p 360Hz. La apertura de 1 píxel permite alinear cabezas en A Heaven a la perfección sin tapar el modelo.',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      reactions: [{ emoji: '🔥', count: 3, users: ['100000000000000003', '100000000000000001', '100000000000000002'] }],
    },
    {
      id: '700000000000000002',
      channelId: '500000000000000002',
      authorId: '100000000000000004',
      content: 'Probado en deathmatch. El recoil reset con el autoexec de CS2 se siente instantáneo.',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      reactions: [{ emoji: '🎯', count: 2, users: ['100000000000000001', '100000000000000003'] }],
    },
  ],
};

const INITIAL_POLLS: Record<string, Poll[]> = {
  '500000000000000002': [
    {
      id: 'poll-1',
      channelId: '500000000000000002',
      authorId: '100000000000000003',
      question: '¿Qué mapa priorizamos banear en el Bo3 contra Fnatic en el Veto?',
      options: [
        { id: 'opt-1', text: 'Sunset (Tienen 92% winrate con Cypher)', votes: 9, voters: ['100000000000000001', '100000000000000003', '100000000000000004'] },
        { id: 'opt-2', text: 'Lotus (Tienen executes agresivos en A)', votes: 4, voters: ['100000000000000002'] },
        { id: 'opt-3', text: 'Abyss (Prefieren dejarlo pasar)', votes: 2, voters: ['100000000000000005'] },
      ],
      isAnonymous: false,
      weightedByRole: true,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
};

const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'event-1',
    guildId: '200000000000000001',
    title: '🏆 Gran Final VCT Masters: Sentinels vs Fnatic',
    description: 'Bo5 por el campeonato mundial. Transmisión táctica con audio de coach en vivo.',
    location: '🔊 Stage Táctico VCT',
    startDate: new Date(Date.now() + 7200000).toISOString(),
    attendees: ['100000000000000001', '100000000000000002', '100000000000000003', '100000000000000004'],
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'event-2',
    guildId: '200000000000000001',
    title: '⚡ Scrim Bo3 Oficial vs Cloud9 (Servidor Frankfurt)',
    description: 'Partidas de entrenamiento Tier 1. Ping garantizado sub-10ms con Voice Studio HUD.',
    location: '🔊 Scrims Room 1 (Baja Latencia)',
    startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    attendees: ['100000000000000001', '100000000000000003'],
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
  },
];

const INITIAL_WORKFLOWS: WorkflowRule[] = [
  {
    id: 'wf-1',
    guildId: '200000000000000001',
    name: 'Notificar 10m antes de Scrim al IGL y Coach',
    trigger: 'member_join',
    action: 'assign_role',
    isEnabled: true,
  },
  {
    id: 'wf-2',
    guildId: '200000000000000001',
    name: 'Publicar resultados de Scrims en #scrim-results',
    trigger: 'github_webhook',
    action: 'post_embed',
    targetChannelId: '500000000000000001',
    isEnabled: true,
  },
];

const INITIAL_CODE_FILES: Record<string, CodeStudioFile[]> = {
  '500000000000000002': [
    {
      id: 'file-1',
      name: 'tenz_vct_crosshair.cfg',
      language: 'text',
      content: `// ==========================================
// SENTINELS TenZ VCT 2026 Competitive Config
// Valorant Crosshair Code: 0;s;1;P;c;5;h;0;m;1;0t;1;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0
// ==========================================
cl_crosshairstyle 4
cl_crosshairsize 2
cl_crosshairgap -1
cl_crosshairdot 0
cl_crosshair_drawoutline 1
sensitivity 0.35 // 800 DPI (eDPI: 280)
zoom_sensitivity_ratio 1.0
raw_input 1
fps_max 400
echo "TenZ Pro Crosshair & Sensitivity Applied"`,
    },
    {
      id: 'file-2',
      name: 'cs2_pro_autoexec.cfg',
      language: 'text',
      content: `// ==========================================
// Tier 1 CS2 Pro Autoexec - Low Latency & High Tickrate
// ==========================================
rate "786432"
cl_updaterate "128"
cl_cmdrate "128"
cl_interp "0.015625"
cl_interp_ratio "1"
fps_max "400"

// Jumpthrow Bind
alias "+jumpthrow" "+jump; -attack; -attack2"
alias "-jumpthrow" "-jump"
bind "v" "+jumpthrow"

// Clear decals and quick switch
bind "q" "lastinv"
bind "mouse_wheel_down" "+jump"
echo "SENTINELS Autoexec Loaded - 144+ FPS Locked"`,
    },
  ],
};

const INITIAL_WIKI_DOCS: Record<string, WikiDocument> = {
  '500000000000000002': {
    id: 'wiki-1',
    channelId: '500000000000000002',
    title: '🏆 Playbook Táctico VCT 2026: Sentinels Protocol',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 's-1',
        title: '1. Filosofía del IGL & Control de Economía',
        content: 'El IGL Boaster dicta las llamadas a 1:15 del temporizador. Si el balance del equipo es inferior a $3,900 créditos tras perder la ronda, se juega save completo con Sheriff.',
        type: 'text',
      },
      {
        id: 's-2',
        title: '⚡ Setups de Humos y Flashes en Ascent A Site',
        content: 'Humo A Heaven a los 0:12 de ronda. Humo A Door sincronizado con flashbang de Breach desde A Lobby para denegar retake.',
        type: 'callout',
      },
      {
        id: 's-3',
        title: '📌 Protocolo de Tactical Timeout (60 Segundos)',
        content: 'Al activar el Tactical Timeout en el Discord Overlay:\n- Mute automático de jugadores para escuchar únicamente a Coach Potter y al IGL.\n- Repaso rápido del antistrat del rival.\n- Reset mental y planteamiento de las próximas 3 rondas.',
        type: 'todo',
      },
    ],
  },
};

const INITIAL_STAGE: StageSession = {
  channelId: '500000000000000003',
  guildId: '200000000000000001',
  topic: '🎤 Análisis Táctico Post-Match: Sentinels Coaching Staff',
  speakers: [
    { userId: '100000000000000003', role: 'host', isSpeaking: true, isMuted: false }, // Potter
    { userId: '100000000000000001', role: 'speaker', isSpeaking: false, isMuted: false }, // TenZ
    { userId: '100000000000000002', role: 'speaker', isSpeaking: false, isMuted: false }, // Boaster
    { userId: '100000000000000004', role: 'audience', isSpeaking: false, isMuted: true }, // s1mple
  ],
};

const INITIAL_WHITEBOARD: Record<string, WhiteboardElement[]> = {
  '500000000000000002': [
    { id: 'el-1', type: 'rectangle', x: 80, y: 80, width: 340, height: 230, color: '#334155', fillColor: 'rgba(30, 41, 59, 0.7)', text: 'Ascent Site A (Main & Heaven)' },
    { id: 'el-2', type: 'smoke', x: 270, y: 120, width: 60, height: 60, color: '#38bdf8', fillColor: 'rgba(56, 189, 248, 0.45)', text: 'Humo Heaven', icon: '💨' },
    { id: 'el-3', type: 'smoke', x: 340, y: 180, width: 60, height: 60, color: '#38bdf8', fillColor: 'rgba(56, 189, 248, 0.45)', text: 'Humo Puerta', icon: '💨' },
    { id: 'el-4', type: 'flash', x: 160, y: 200, width: 45, height: 45, color: '#facc15', text: 'Flash A Main', icon: '⚡' },
    { id: 'el-5', type: 'attacker', x: 110, y: 240, width: 40, height: 40, color: '#ef4444', text: 'TenZ (Jett)', icon: '⚔️' },
    { id: 'el-6', type: 'attacker', x: 90, y: 170, width: 40, height: 40, color: '#ef4444', text: 'Boaster (Omen)', icon: '⚔️' },
    { id: 'el-7', type: 'defender', x: 350, y: 110, width: 40, height: 40, color: '#3b82f6', text: 'Derke (AWP)', icon: '🛡️' },
    { id: 'el-8', type: 'spike', x: 240, y: 210, width: 45, height: 45, color: '#22c55e', text: 'Plante Default', icon: '💣' },
  ],
};

const INITIAL_MAP_VETO: MapVetoSession = {
  id: 'veto-vct-01',
  game: 'VALORANT',
  teamA: { name: 'Sentinels', tag: 'SEN', logo: '⚡' },
  teamB: { name: 'Fnatic', tag: 'FNC', logo: '🧡' },
  format: 'BO3',
  currentTurn: 'teamA',
  availableMaps: ['Ascent', 'Haven', 'Bind', 'Lotus', 'Sunset', 'Abyss', 'Split'],
  bannedMaps: [
    { map: 'Sunset', by: 'Sentinels' },
    { map: 'Abyss', by: 'Fnatic' },
  ],
  pickedMaps: [
    { map: 'Ascent', by: 'Sentinels' },
    { map: 'Haven', by: 'Fnatic' },
  ],
  deciderMap: 'Lotus',
  status: 'in_progress',
};

const INITIAL_SCRIMS: ScrimMatch[] = [
  {
    id: 'scrim-01',
    teamA: { name: 'Sentinels', tag: 'SEN', logo: '⚡', score: 11 },
    teamB: { name: 'Fnatic', tag: 'FNC', logo: '🧡', score: 9 },
    game: 'VALORANT',
    tier: 'Tier 1 Pro',
    scheduledTime: 'En directo (Ronda 21)',
    serverLocation: 'Frankfurt (8ms ping)',
    status: 'live',
    mapsResult: [
      { map: 'Ascent', scoreA: 13, scoreB: 8 },
      { map: 'Haven', scoreA: 11, scoreB: 9 },
    ],
  },
  {
    id: 'scrim-02',
    teamA: { name: 'Sentinels', tag: 'SEN', logo: '⚡', score: 0 },
    teamB: { name: 'Cloud9', tag: 'C9', logo: '☁️', score: 0 },
    game: 'VALORANT',
    tier: 'Tier 1 Pro',
    scheduledTime: 'Hoy 21:00 CET',
    serverLocation: 'Virginia AWS (18ms ping)',
    status: 'upcoming',
  },
  {
    id: 'scrim-03',
    teamA: { name: 'SEN Academy', tag: 'SENA', logo: '⚡', score: 2 },
    teamB: { name: 'NAVI Junior', tag: 'NAVI.J', logo: '💛', score: 1 },
    game: 'Counter-Strike 2',
    tier: 'Tier 2 Academy',
    scheduledTime: 'Ayer 19:30 CET',
    serverLocation: 'Stockholm (128 Tick, 12ms ping)',
    status: 'finished',
    mapsResult: [
      { map: 'Mirage', scoreA: 13, scoreB: 10 },
      { map: 'Inferno', scoreA: 9, scoreB: 13 },
      { map: 'Ancient', scoreA: 13, scoreB: 7 },
    ],
  },
];

const INITIAL_USER_REPUTATION: Record<string, number> = {
  '100000000000000001': 342,
  '100000000000000002': 589,
  '100000000000000003': 1240,
  '100000000000000004': 210,
  '100000000000000005': 175,
};

interface ChatStore {
  currentUser: User;
  users: Record<string, User>;
  guilds: Guild[];
  activeGuildId: string;
  activeChannelId: string;
  messages: Record<string, Message[]>; // channelId -> Message[]
  voiceSession: ActiveVoiceSession | null;
  settings: UserSettings;

  // Estados de interfaz y modales
  currentViewMode: ChannelViewMode;
  activeThreadMessageId: string | null;
  isAIAssistantOpen: boolean;
  isSoundboardOpen: boolean;
  audioQuality: AudioQualityMode;
  kanbanTasks: Record<string, KanbanTask[]>;
  threadMessages: Record<string, Message[]>;

  // Funcionalidades Pro y Gobernanza
  polls: Record<string, Poll[]>;
  events: CommunityEvent[];
  workflows: WorkflowRule[];
  whiteboardElements: Record<string, WhiteboardElement[]>;
  codeStudioFiles: Record<string, CodeStudioFile[]>;
  wikiDocuments: Record<string, WikiDocument>;
  stageSession: StageSession | null;
  userReputation: Record<string, number>;
  zenMode: boolean;

  isUserSettingsOpen: boolean;
  isServerSettingsOpen: boolean;
  isCreateChannelOpen: boolean;
  isCreateServerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isCreatePollOpen: boolean;
  isCreateEventOpen: boolean;
  isWorkflowBuilderOpen: boolean;
  isE2EESafetyOpen: boolean;
  selectedUserIdPopover: string | null;
  memberListVisible: boolean;

  // Acciones Pro
  setViewMode: (mode: ChannelViewMode) => void;
  openThread: (messageId: string) => void;
  closeThread: () => void;
  toggleAIAssistant: () => void;
  toggleSoundboard: () => void;
  setAudioQuality: (quality: AudioQualityMode) => void;
  addKanbanTask: (channelId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => void;
  updateKanbanTaskStatus: (channelId: string, taskId: string, status: KanbanTask['status']) => void;
  deleteKanbanTask: (channelId: string, taskId: string) => void;
  sendThreadMessage: (parentMessageId: string, content: string) => void;

  // Acciones Pro Avanzadas
  createPoll: (channelId: string, question: string, options: string[], isAnonymous?: boolean, weightedByRole?: boolean) => void;
  votePoll: (channelId: string, pollId: string, optionId: string) => void;
  createEvent: (event: Omit<CommunityEvent, 'id' | 'attendees'>) => void;
  toggleEventRSVP: (eventId: string) => void;
  addWorkflow: (workflow: Omit<WorkflowRule, 'id'>) => void;
  toggleWorkflow: (workflowId: string) => void;
  deleteWorkflow: (workflowId: string) => void;
  updateWhiteboardElements: (channelId: string, elements: WhiteboardElement[]) => void;
  updateCodeFile: (channelId: string, fileId: string, content: string) => void;
  createCodeFile: (channelId: string, name: string, language: string, content: string) => void;
  updateWikiDocument: (channelId: string, doc: Partial<WikiDocument>) => void;
  toggleZenMode: () => void;
  giveKarma: (userId: string) => void;
  requestToSpeakStage: () => void;
  moderateStageSpeaker: (userId: string, action: 'promote' | 'mute' | 'demote') => void;
  setModalPro: (modal: 'poll' | 'event' | 'workflow' | 'e2ee', open: boolean) => void;

  // Acciones Base
  setActiveGuild: (guildId: string) => void;
  setActiveChannel: (channelId: string) => void;
  sendMessage: (channelId: string, content: string, attachments?: any[]) => void;
  editMessage: (channelId: string, messageId: string, newContent: string) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  addReaction: (channelId: string, messageId: string, emoji: string) => void;

  // Voz
  joinVoiceChannel: (guildId: string, channelId: string) => void;
  leaveVoiceChannel: () => void;
  toggleMute: () => void;
  toggleDeafen: () => void;
  toggleScreenShare: () => void;
  toggleCamera: () => void;
  setLocalSpeaking: (speaking: boolean) => void;

  // Servidor y Canales
  createChannel: (guildId: string, name: string, type: ChannelType, categoryId?: string) => void;
  createGuild: (name: string, icon?: string) => void;
  updateRole: (guildId: string, role: any) => void;
  createRole: (guildId: string, name: string, color: string) => void;
  deleteRole: (guildId: string, roleId: string) => void;

  // Usuario y UI
  setUserStatus: (status: UserStatus) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  openModal: (modal: 'userSettings' | 'serverSettings' | 'createChannel' | 'createServer' | 'commandPalette') => void;
  closeModals: () => void;
  setUserProfilePopover: (userId: string | null) => void;
  toggleMemberList: () => void;

  // Esports & Gaming Pro
  mapVetoSession: MapVetoSession;
  scrimMatches: ScrimMatch[];
  isGamingOverlayOpen: boolean;
  isMapVetoOpen: boolean;
  isTacticalTimeoutActive: boolean;
  tacticalTimeoutSecondsLeft: number;

  toggleGamingOverlay: () => void;
  toggleMapVetoModal: () => void;
  triggerTacticalTimeout: () => void;
  executeMapVetoBan: (map: string) => void;
  executeMapVetoPick: (map: string) => void;
  resetMapVeto: () => void;
  bookScrimMatch: (scrim: Omit<ScrimMatch, 'id'>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentUser: CURRENT_USER,
  users: MOCK_USERS,
  guilds: INITIAL_GUILDS,
  activeGuildId: INITIAL_GUILDS[0].id,
  activeChannelId: INITIAL_GUILDS[0].channels[1].id, // #general
  messages: INITIAL_MESSAGES,
  voiceSession: null,
  currentViewMode: 'chat',
  activeThreadMessageId: null,
  isAIAssistantOpen: false,
  isSoundboardOpen: false,
  audioQuality: 'hifi',
  kanbanTasks: INITIAL_KANBAN_TASKS,
  threadMessages: INITIAL_THREAD_MESSAGES,

  polls: INITIAL_POLLS,
  events: INITIAL_EVENTS,
  workflows: INITIAL_WORKFLOWS,
  whiteboardElements: INITIAL_WHITEBOARD,
  codeStudioFiles: INITIAL_CODE_FILES,
  wikiDocuments: INITIAL_WIKI_DOCS,
  stageSession: INITIAL_STAGE,
  userReputation: INITIAL_USER_REPUTATION,
  zenMode: false,

  settings: {
    theme: 'dark',
    inputVolume: 85,
    outputVolume: 100,
    vadSensitivity: -40,
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    hardwareAcceleration: true,
    compactMode: false,
    zenMode: false,
    voiceModulation: 'normal',
  },

  isUserSettingsOpen: false,
  isServerSettingsOpen: false,
  isCreateChannelOpen: false,
  isCreateServerOpen: false,
  isCommandPaletteOpen: false,
  isCreatePollOpen: false,
  isCreateEventOpen: false,
  isWorkflowBuilderOpen: false,
  isE2EESafetyOpen: false,
  selectedUserIdPopover: null,
  memberListVisible: true,

  // Esports & Gaming Pro
  mapVetoSession: INITIAL_MAP_VETO,
  scrimMatches: INITIAL_SCRIMS,
  isGamingOverlayOpen: false,
  isMapVetoOpen: false,
  isTacticalTimeoutActive: false,
  tacticalTimeoutSecondsLeft: 60,

  setViewMode: (mode) => set({ currentViewMode: mode }),
  openThread: (messageId) => set({ activeThreadMessageId: messageId }),
  closeThread: () => set({ activeThreadMessageId: null }),
  toggleAIAssistant: () => set((state) => ({ isAIAssistantOpen: !state.isAIAssistantOpen })),
  toggleSoundboard: () => set((state) => ({ isSoundboardOpen: !state.isSoundboardOpen })),
  setAudioQuality: (quality) => set({ audioQuality: quality }),

  createPoll: (channelId, question, options, isAnonymous = false, weightedByRole = false) => {
    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      channelId,
      authorId: get().currentUser.id,
      question,
      options: options.map((opt, idx) => ({
        id: `opt-${idx + 1}`,
        text: opt,
        votes: 0,
        voters: [],
      })),
      isAnonymous,
      weightedByRole,
      expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date().toISOString(),
      hasVoted: false,
    };
    set((state) => {
      const channelPolls = state.polls[channelId] || [];
      return {
        polls: {
          ...state.polls,
          [channelId]: [...channelPolls, newPoll],
        },
        isCreatePollOpen: false,
      };
    });
  },

  votePoll: (channelId, pollId, optionId) => {
    const currentUserId = get().currentUser.id;
    set((state) => {
      const channelPolls = state.polls[channelId] || [];
      const updatedPolls = channelPolls.map((poll) => {
        if (poll.id !== pollId) return poll;
        const updatedOptions = poll.options.map((opt) => {
          const alreadyVoted = opt.voters.includes(currentUserId);
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: alreadyVoted ? opt.votes : opt.votes + 1,
              voters: alreadyVoted ? opt.voters : [...opt.voters, currentUserId],
            };
          } else {
            return {
              ...opt,
              votes: opt.voters.includes(currentUserId) ? Math.max(0, opt.votes - 1) : opt.votes,
              voters: opt.voters.filter((id) => id !== currentUserId),
            };
          }
        });
        return {
          ...poll,
          options: updatedOptions,
          hasVoted: true,
        };
      });
      return {
        polls: {
          ...state.polls,
          [channelId]: updatedPolls,
        },
      };
    });
  },

  createEvent: (event) => {
    const newEvent: CommunityEvent = {
      ...event,
      id: `event-${Date.now()}`,
      attendees: [get().currentUser.id],
    };
    set((state) => ({
      events: [...state.events, newEvent],
      isCreateEventOpen: false,
    }));
  },

  toggleEventRSVP: (eventId) => {
    const currentUserId = get().currentUser.id;
    set((state) => ({
      events: state.events.map((ev) => {
        if (ev.id !== eventId) return ev;
        const isAttending = ev.attendees.includes(currentUserId);
        return {
          ...ev,
          attendees: isAttending
            ? ev.attendees.filter((id) => id !== currentUserId)
            : [...ev.attendees, currentUserId],
        };
      }),
    }));
  },

  addWorkflow: (workflow) => {
    const newWorkflow: WorkflowRule = {
      ...workflow,
      id: `wf-${Date.now()}`,
    };
    set((state) => ({
      workflows: [...state.workflows, newWorkflow],
      isWorkflowBuilderOpen: false,
    }));
  },

  toggleWorkflow: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.map((wf) =>
        wf.id === workflowId ? { ...wf, isEnabled: !wf.isEnabled } : wf
      ),
    }));
  },

  deleteWorkflow: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.filter((wf) => wf.id !== workflowId),
    }));
  },

  updateWhiteboardElements: (channelId, elements) => {
    set((state) => ({
      whiteboardElements: {
        ...state.whiteboardElements,
        [channelId]: elements,
      },
    }));
  },

  updateCodeFile: (channelId, fileId, content) => {
    set((state) => {
      const files = state.codeStudioFiles[channelId] || [];
      return {
        codeStudioFiles: {
          ...state.codeStudioFiles,
          [channelId]: files.map((f) => (f.id === fileId ? { ...f, content } : f)),
        },
      };
    });
  },

  createCodeFile: (channelId, name, language, content) => {
    const newFile: CodeStudioFile = {
      id: `file-${Date.now()}`,
      name,
      language,
      content,
    };
    set((state) => {
      const files = state.codeStudioFiles[channelId] || [];
      return {
        codeStudioFiles: {
          ...state.codeStudioFiles,
          [channelId]: [...files, newFile],
        },
      };
    });
  },

  updateWikiDocument: (channelId, doc) => {
    set((state) => {
      const existing = state.wikiDocuments[channelId] || {
        id: `wiki-${Date.now()}`,
        channelId,
        title: 'Documento de Canal',
        updatedAt: new Date().toISOString(),
        sections: [],
      };
      return {
        wikiDocuments: {
          ...state.wikiDocuments,
          [channelId]: {
            ...existing,
            ...doc,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  },

  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),

  giveKarma: (userId) => {
    set((state) => ({
      userReputation: {
        ...state.userReputation,
        [userId]: (state.userReputation[userId] || 0) + 1,
      },
    }));
  },

  requestToSpeakStage: () => {
    const currentUserId = get().currentUser.id;
    set((state) => {
      if (!state.stageSession) return state;
      const speakerIdx = state.stageSession.speakers.findIndex((s) => s.userId === currentUserId);
      let updatedSpeakers = [...state.stageSession.speakers];
      if (speakerIdx >= 0) {
        updatedSpeakers[speakerIdx] = {
          ...updatedSpeakers[speakerIdx],
          raisedHandTime: updatedSpeakers[speakerIdx].raisedHandTime ? undefined : new Date().toISOString(),
        };
      } else {
        updatedSpeakers.push({
          userId: currentUserId,
          role: 'audience',
          isSpeaking: false,
          isMuted: true,
          raisedHandTime: new Date().toISOString(),
        });
      }
      return {
        stageSession: {
          ...state.stageSession,
          speakers: updatedSpeakers,
        },
      };
    });
  },

  moderateStageSpeaker: (userId, action) => {
    set((state) => {
      if (!state.stageSession) return state;
      const updatedSpeakers = state.stageSession.speakers.map((s) => {
        if (s.userId !== userId) return s;
        if (action === 'promote') {
          return { ...s, role: 'speaker' as const, isMuted: false, raisedHandTime: undefined };
        }
        if (action === 'mute') {
          return { ...s, isMuted: !s.isMuted };
        }
        if (action === 'demote') {
          return { ...s, role: 'audience' as const, isMuted: true, raisedHandTime: undefined };
        }
        return s;
      });
      return {
        stageSession: {
          ...state.stageSession,
          speakers: updatedSpeakers,
        },
      };
    });
  },

  setModalPro: (modal, open) => {
    set({
      isCreatePollOpen: modal === 'poll' ? open : false,
      isCreateEventOpen: modal === 'event' ? open : false,
      isWorkflowBuilderOpen: modal === 'workflow' ? open : false,
      isE2EESafetyOpen: modal === 'e2ee' ? open : false,
    });
  },

  addKanbanTask: (channelId, task) => {
    const newTask: KanbanTask = {
      ...task,
      id: `task-${Date.now()}`,
      channelId,
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const channelTasks = state.kanbanTasks[channelId] || [];
      return {
        kanbanTasks: {
          ...state.kanbanTasks,
          [channelId]: [...channelTasks, newTask],
        },
      };
    });
  },

  updateKanbanTaskStatus: (channelId, taskId, status) => {
    set((state) => {
      const channelTasks = state.kanbanTasks[channelId] || [];
      return {
        kanbanTasks: {
          ...state.kanbanTasks,
          [channelId]: channelTasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        },
      };
    });
  },

  deleteKanbanTask: (channelId, taskId) => {
    set((state) => {
      const channelTasks = state.kanbanTasks[channelId] || [];
      return {
        kanbanTasks: {
          ...state.kanbanTasks,
          [channelId]: channelTasks.filter((t) => t.id !== taskId),
        },
      };
    });
  },

  sendThreadMessage: (parentMessageId, content) => {
    if (!content.trim()) return;
    const newMessage: Message = {
      id: defaultSnowflake.nextId(),
      channelId: get().activeChannelId,
      authorId: get().currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      reactions: [],
      replyToId: parentMessageId,
    };
    set((state) => {
      const list = state.threadMessages[parentMessageId] || [];
      return {
        threadMessages: {
          ...state.threadMessages,
          [parentMessageId]: [...list, newMessage],
        },
      };
    });
  },

  setActiveGuild: (guildId) => {
    const guild = get().guilds.find((g) => g.id === guildId);
    if (guild && guild.channels.length > 0) {
      set({
        activeGuildId: guildId,
        activeChannelId: guild.channels[0].id,
        selectedUserIdPopover: null,
      });
    } else {
      set({ activeGuildId: guildId, selectedUserIdPopover: null });
    }
  },

  setActiveChannel: (channelId) => set({ activeChannelId: channelId, selectedUserIdPopover: null }),

  sendMessage: (channelId, content, attachments) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    const newMessage: Message = {
      id: defaultSnowflake.nextId(),
      channelId,
      authorId: get().currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      reactions: [],
      attachments: attachments || [],
    };

    set((state) => {
      const currentList = state.messages[channelId] || [];
      return {
        messages: {
          ...state.messages,
          [channelId]: [...currentList, newMessage],
        },
      };
    });
  },

  editMessage: (channelId, messageId, newContent) => {
    set((state) => {
      const channelMsgs = state.messages[channelId] || [];
      return {
        messages: {
          ...state.messages,
          [channelId]: channelMsgs.map((m) =>
            m.id === messageId ? { ...m, content: newContent, editedAt: new Date().toISOString() } : m
          ),
        },
      };
    });
  },

  deleteMessage: (channelId, messageId) => {
    set((state) => {
      const channelMsgs = state.messages[channelId] || [];
      return {
        messages: {
          ...state.messages,
          [channelId]: channelMsgs.filter((m) => m.id !== messageId),
        },
      };
    });
  },

  addReaction: (channelId, messageId, emoji) => {
    const userId = get().currentUser.id;
    set((state) => {
      const channelMsgs = state.messages[channelId] || [];
      return {
        messages: {
          ...state.messages,
          [channelId]: channelMsgs.map((m) => {
            if (m.id !== messageId) return m;

            const existingReaction = m.reactions.find((r) => r.emoji === emoji);
            let updatedReactions = [...m.reactions];

            if (existingReaction) {
              if (existingReaction.users.includes(userId)) {
                // Quitar reacción
                updatedReactions = updatedReactions
                  .map((r) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count - 1, users: r.users.filter((id) => id !== userId) }
                      : r
                  )
                  .filter((r) => r.count > 0);
              } else {
                // Añadir a reacción existente
                updatedReactions = updatedReactions.map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, userId] } : r
                );
              }
            } else {
              // Nueva reacción
              updatedReactions.push({ emoji, count: 1, users: [userId] });
            }

            return { ...m, reactions: updatedReactions };
          }),
        },
      };
    });
  },

  joinVoiceChannel: (guildId, channelId) => {
    set({
      voiceSession: {
        channelId,
        guildId,
        isMuted: false,
        isDeafened: false,
        isScreenSharing: false,
        isCameraOn: false,
        isSpeaking: false,
        latencyMs: 14,
        activeParticipants: [
          { userId: get().currentUser.id, isSpeaking: false, isMuted: false, volume: 100 },
          { userId: '100000000000000002', isSpeaking: false, isMuted: false, volume: 100 },
          { userId: '100000000000000004', isSpeaking: true, isMuted: false, volume: 90 },
        ],
      },
    });
  },

  leaveVoiceChannel: () => set({ voiceSession: null }),

  toggleMute: () => {
    const session = get().voiceSession;
    if (session) {
      set({
        voiceSession: {
          ...session,
          isMuted: !session.isMuted,
          isSpeaking: false,
        },
      });
    }
  },

  toggleDeafen: () => {
    const session = get().voiceSession;
    if (session) {
      const willDeafen = !session.isDeafened;
      set({
        voiceSession: {
          ...session,
          isDeafened: willDeafen,
          isMuted: willDeafen ? true : session.isMuted,
          isSpeaking: false,
        },
      });
    }
  },

  toggleScreenShare: () => {
    const session = get().voiceSession;
    if (session) {
      set({
        voiceSession: {
          ...session,
          isScreenSharing: !session.isScreenSharing,
        },
      });
    }
  },

  toggleCamera: () => {
    const session = get().voiceSession;
    if (session) {
      set({
        voiceSession: {
          ...session,
          isCameraOn: !session.isCameraOn,
        },
      });
    }
  },

  setLocalSpeaking: (speaking) => {
    const session = get().voiceSession;
    if (session && !session.isMuted) {
      set({
        voiceSession: {
          ...session,
          isSpeaking: speaking,
        },
      });
    }
  },

  createChannel: (guildId, name, type, categoryId) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '-');
    const newChannel = {
      id: defaultSnowflake.nextId(),
      guildId,
      name: cleanName,
      type,
      categoryId,
      position: 99,
    };

    set((state) => ({
      guilds: state.guilds.map((g) =>
        g.id === guildId ? { ...g, channels: [...g.channels, newChannel] } : g
      ),
      activeChannelId: newChannel.id,
      isCreateChannelOpen: false,
    }));
  },

  createGuild: (name, icon) => {
    const newGuildId = defaultSnowflake.nextId();
    const generalChannelId = defaultSnowflake.nextId();
    const generalVoiceId = defaultSnowflake.nextId();

    const newGuild: Guild = {
      id: newGuildId,
      name,
      icon: icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5865f2&color=fff`,
      ownerId: get().currentUser.id,
      roles: [
        {
          id: newGuildId,
          name: '@everyone',
          color: '#99aab5',
          hoist: false,
          position: 0,
          permissions: Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES | Permissions.CONNECT | Permissions.SPEAK,
        },
      ],
      categories: [
        { id: defaultSnowflake.nextId(), guildId: newGuildId, name: 'CANALES DE TEXTO', position: 0 },
        { id: defaultSnowflake.nextId(), guildId: newGuildId, name: 'CANALES DE VOZ', position: 1 },
      ],
      channels: [
        {
          id: generalChannelId,
          guildId: newGuildId,
          name: 'general',
          type: 'text',
          position: 0,
        },
        {
          id: generalVoiceId,
          guildId: newGuildId,
          name: 'General',
          type: 'voice',
          position: 1,
        },
      ],
      members: [
        { userId: get().currentUser.id, guildId: newGuildId, roleIds: [], joinedAt: new Date().toISOString() },
      ],
    };

    set((state) => ({
      guilds: [...state.guilds, newGuild],
      activeGuildId: newGuild.id,
      activeChannelId: generalChannelId,
      isCreateServerOpen: false,
    }));
  },

  updateRole: (guildId, updatedRole) => {
    set((state) => ({
      guilds: state.guilds.map((g) =>
        g.id === guildId
          ? {
              ...g,
              roles: g.roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)),
            }
          : g
      ),
    }));
  },

  createRole: (guildId, name, color) => {
    const newRole = {
      id: defaultSnowflake.nextId(),
      name,
      color,
      hoist: true,
      position: 1,
      permissions: Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES,
    };

    set((state) => ({
      guilds: state.guilds.map((g) =>
        g.id === guildId ? { ...g, roles: [...g.roles, newRole] } : g
      ),
    }));
  },

  deleteRole: (guildId, roleId) => {
    set((state) => ({
      guilds: state.guilds.map((g) =>
        g.id === guildId
          ? { ...g, roles: g.roles.filter((r) => r.id !== roleId) }
          : g
      ),
    }));
  },

  setUserStatus: (status) => {
    set((state) => ({
      currentUser: { ...state.currentUser, status },
    }));
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  openModal: (modal) => {
    set({
      isUserSettingsOpen: modal === 'userSettings',
      isServerSettingsOpen: modal === 'serverSettings',
      isCreateChannelOpen: modal === 'createChannel',
      isCreateServerOpen: modal === 'createServer',
      isCommandPaletteOpen: modal === 'commandPalette',
    });
  },

  closeModals: () => {
    set({
      isUserSettingsOpen: false,
      isServerSettingsOpen: false,
      isCreateChannelOpen: false,
      isCreateServerOpen: false,
      isCommandPaletteOpen: false,
      selectedUserIdPopover: null,
    });
  },

  setUserProfilePopover: (userId) => set({ selectedUserIdPopover: userId }),

  toggleMemberList: () => set((state) => ({ memberListVisible: !state.memberListVisible })),

  // Esports & Gaming Pro Actions
  toggleGamingOverlay: () => set((state) => ({ isGamingOverlayOpen: !state.isGamingOverlayOpen })),

  toggleMapVetoModal: () => set((state) => ({ isMapVetoOpen: !state.isMapVetoOpen })),

  triggerTacticalTimeout: () => {
    set({ isTacticalTimeoutActive: true, tacticalTimeoutSecondsLeft: 60 });
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, audioCtx.currentTime);
        osc.frequency.setValueAtTime(220, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.9);
      }
    } catch {}

    const interval = setInterval(() => {
      const current = get().tacticalTimeoutSecondsLeft;
      if (current <= 1) {
        clearInterval(interval);
        set({ isTacticalTimeoutActive: false, tacticalTimeoutSecondsLeft: 60 });
      } else {
        set({ tacticalTimeoutSecondsLeft: current - 1 });
      }
    }, 1000);
  },

  executeMapVetoBan: (mapName) => {
    set((state) => {
      const session = state.mapVetoSession;
      if (!session.availableMaps.includes(mapName)) return state;
      const actingTeam = session.currentTurn === 'teamA' ? session.teamA.name : session.teamB.name;
      const nextTurn = session.currentTurn === 'teamA' ? 'teamB' : 'teamA';
      const remainingMaps = session.availableMaps.filter((m) => m !== mapName);
      const newBans = [...session.bannedMaps, { map: mapName, by: actingTeam }];

      let decider = session.deciderMap;
      let status = session.status;
      if (remainingMaps.length === 1 && !decider) {
        decider = remainingMaps[0];
        status = 'completed';
      }

      return {
        mapVetoSession: {
          ...session,
          availableMaps: remainingMaps,
          bannedMaps: newBans,
          currentTurn: nextTurn,
          deciderMap: decider,
          status,
        },
      };
    });
  },

  executeMapVetoPick: (mapName) => {
    set((state) => {
      const session = state.mapVetoSession;
      if (!session.availableMaps.includes(mapName)) return state;
      const actingTeam = session.currentTurn === 'teamA' ? session.teamA.name : session.teamB.name;
      const nextTurn = session.currentTurn === 'teamA' ? 'teamB' : 'teamA';
      const remainingMaps = session.availableMaps.filter((m) => m !== mapName);
      const newPicks = [...session.pickedMaps, { map: mapName, by: actingTeam }];

      let decider = session.deciderMap;
      let status = session.status;
      if (remainingMaps.length === 1 && !decider) {
        decider = remainingMaps[0];
        status = 'completed';
      }

      return {
        mapVetoSession: {
          ...session,
          availableMaps: remainingMaps,
          pickedMaps: newPicks,
          currentTurn: nextTurn,
          deciderMap: decider,
          status,
        },
      };
    });
  },

  resetMapVeto: () => {
    set({
      mapVetoSession: {
        id: `veto-${Date.now()}`,
        game: 'VALORANT',
        teamA: { name: 'Sentinels', tag: 'SEN', logo: '⚡' },
        teamB: { name: 'Fnatic', tag: 'FNC', logo: '🧡' },
        format: 'BO3',
        currentTurn: 'teamA',
        availableMaps: ['Ascent', 'Haven', 'Bind', 'Lotus', 'Sunset', 'Abyss', 'Split'],
        bannedMaps: [],
        pickedMaps: [],
        status: 'in_progress',
      },
    });
  },

  bookScrimMatch: (scrimData) => {
    const newScrim: ScrimMatch = {
      id: `scrim-${Date.now()}`,
      ...scrimData,
    };
    set((state) => ({
      scrimMatches: [newScrim, ...state.scrimMatches],
    }));
  },
}));
