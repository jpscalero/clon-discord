// 64-bit Bitwise Permissions Flags (BigInt)
export const Permissions = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
} as const;

export const ALL_PERMISSIONS = 0xFFFFFFFFFFFFFFFFn;

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface UserGamingProfile {
  teamTag?: string; // ej. 'SEN', 'FNC', 'KRÜ', 'G2'
  roleTitle?: 'IGL' | 'Head Coach' | 'Duelist / Entry' | 'Sniper / AWP' | 'Anchor / Support' | 'Analyst';
  rankTier?: string; // ej. 'Radiant #28', 'Global Elite', 'Challenger 920LP', 'Predator #09'
  mainGame?: 'VALORANT' | 'Counter-Strike 2' | 'League of Legends' | 'Apex Legends';
  kda?: string; // ej. '1.54'
  headshotPct?: string; // ej. '38.4%'
  winRate?: string; // ej. '72.1%'
  steamId?: string;
  riotId?: string;
}

export interface User {
  id: string; // Snowflake ID
  username: string;
  discriminator?: string;
  displayName: string;
  avatar: string;
  bannerColor?: string;
  status: UserStatus;
  customStatus?: string;
  activity?: {
    type: 'playing' | 'listening' | 'streaming';
    name: string;
    details?: string;
  };
  bio?: string;
  badges: string[];
  gamingProfile?: UserGamingProfile;
}

export interface Role {
  id: string;
  name: string;
  color: string; // Hex code ej. #e91e63
  hoist: boolean; // Mostrar por separado en la lista de miembros
  position: number;
  permissions: bigint;
}

export type ChannelType = 'text' | 'voice' | 'announcement' | 'stage';

export interface ChannelOverwrite {
  id: string; // Role ID o User ID
  type: 'role' | 'member';
  allow: bigint;
  deny: bigint;
}

export interface Channel {
  id: string;
  guildId: string;
  name: string;
  type: ChannelType;
  topic?: string;
  categoryId?: string;
  position: number;
  isPrivate?: boolean;
  overwrites?: ChannelOverwrite[];
}

export interface Category {
  id: string;
  guildId: string;
  name: string;
  position: number;
}

export interface GuildMember {
  userId: string;
  guildId: string;
  nickname?: string;
  roleIds: string[];
  joinedAt: string;
}

export interface Guild {
  id: string;
  name: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  roles: Role[];
  categories: Category[];
  channels: Channel[];
  members: GuildMember[];
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs que han reaccionado
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
  width?: number;
  height?: number;
}

export interface Embed {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  author?: {
    name: string;
    iconUrl?: string;
  };
  footer?: {
    text: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  imageUrl?: string;
}

export interface Message {
  id: string; // Snowflake ID
  channelId: string;
  guildId?: string;
  authorId: string;
  content: string;
  timestamp: string; // ISO String
  editedAt?: string;
  attachments?: Attachment[];
  embeds?: Embed[];
  reactions: Reaction[];
  isPinned?: boolean;
  replyToId?: string;
  isOptimistic?: boolean; // Para reconciliación en UI
}

export interface ActiveVoiceSession {
  channelId: string;
  guildId: string;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenSharing: boolean;
  isCameraOn: boolean;
  isSpeaking: boolean;
  latencyMs: number;
  activeParticipants: {
    userId: string;
    isSpeaking: boolean;
    isMuted: boolean;
    volume: number; // 0 a 100
  }[];
}

export type ThemeMode = 'dark' | 'midnight' | 'light' | 'cyberpunk' | 'nord' | 'dracula';

export type ChannelViewMode =
  | 'chat'
  | 'kanban'
  | 'vault'
  | 'whiteboard'
  | 'code'
  | 'wiki'
  | 'stage'
  | 'calendar'
  | 'veto'
  | 'scrims';

export type AudioQualityMode = 'standard' | 'broadcast' | 'hifi'; // 64kbps, 128kbps, 384kbps

export interface MapVetoSession {
  id: string;
  game: 'VALORANT' | 'Counter-Strike 2';
  teamA: { name: string; tag: string; logo: string };
  teamB: { name: string; tag: string; logo: string };
  format: 'BO1' | 'BO3' | 'BO5';
  currentTurn: 'teamA' | 'teamB';
  availableMaps: string[];
  bannedMaps: { map: string; by: string }[];
  pickedMaps: { map: string; by: string }[];
  deciderMap?: string;
  status: 'in_progress' | 'completed';
}

export interface ScrimMatch {
  id: string;
  teamA: { name: string; tag: string; logo: string; score: number };
  teamB: { name: string; tag: string; logo: string; score: number };
  game: string;
  tier: 'Tier 1 Pro' | 'Tier 2 Academy' | 'Radiant / Faceit 10';
  scheduledTime: string;
  serverLocation: string;
  status: 'upcoming' | 'live' | 'finished';
  mapsResult?: { map: string; scoreA: number; scoreB: number }[];
  vodUrl?: string;
}

export interface KanbanTask {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  createdAt: string;
  tags: string[];
}

export interface Thread {
  parentMessageId: string;
  channelId: string;
  name: string;
  messageCount: number;
  lastReplyAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface Poll {
  id: string;
  channelId: string;
  authorId: string;
  question: string;
  options: PollOption[];
  isAnonymous: boolean;
  weightedByRole: boolean;
  expiresAt: string;
  createdAt: string;
  hasVoted?: boolean;
}

export interface CommunityEvent {
  id: string;
  guildId: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  attendees: string[];
  bannerUrl?: string;
}

export interface WorkflowRule {
  id: string;
  guildId: string;
  name: string;
  trigger: 'member_join' | 'message_contains' | 'github_webhook' | 'role_assigned';
  triggerValue?: string;
  action: 'send_welcome' | 'assign_role' | 'post_embed' | 'notify_mods';
  targetChannelId?: string;
  isEnabled: boolean;
}

export interface WhiteboardElement {
  id: string;
  type:
    | 'pencil'
    | 'rectangle'
    | 'circle'
    | 'arrow'
    | 'text'
    | 'sticky'
    | 'smoke'
    | 'flash'
    | 'molly'
    | 'attacker'
    | 'defender'
    | 'spike';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
  color: string;
  fillColor?: string;
  text?: string;
  icon?: string;
}

export interface CodeStudioFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface WikiSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'callout' | 'todo' | 'table';
}

export interface WikiDocument {
  id: string;
  channelId: string;
  title: string;
  updatedAt: string;
  sections: WikiSection[];
}

export interface StageSession {
  channelId: string;
  guildId: string;
  topic: string;
  speakers: {
    userId: string;
    role: 'host' | 'speaker' | 'audience';
    isSpeaking: boolean;
    isMuted: boolean;
    raisedHandTime?: string;
  }[];
}

export interface UserSettings {
  theme: ThemeMode;
  inputVolume: number; // 0 - 100
  outputVolume: number;
  vadSensitivity: number; // -60 a -20 dB
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
  hardwareAcceleration: boolean;
  compactMode: boolean;
  zenMode: boolean;
  voiceModulation: 'normal' | 'robot' | 'deep' | 'radio' | 'helium';
}


