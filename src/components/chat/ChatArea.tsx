import React, { useState, useRef, useLayoutEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { DiscordMarkdown } from '../../utils/markdownParser';
import {
  Hash,
  Volume2,
  Users,
  Smile,
  Send,
  MoreVertical,
  Trash2,
  Edit2,
  Reply,
  Check,
  X,
  FileText,
  MessageSquare,
  Sparkles,
  BarChart2,
  PenTool,
  Copy,
  Trophy,
  Swords,
  Radio,
  Paperclip,
  Mic,
} from 'lucide-react';
import { PollCard } from './PollCard';
import { VoiceNotePlayer } from '../voice/VoiceNotePlayer';
import { VoiceNoteRecorder } from '../voice/VoiceNoteRecorder';

export const ChatArea: React.FC = () => {
  const {
    guilds,
    activeGuildId,
    activeChannelId,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    currentUser,
    users,
    setUserProfilePopover,
    toggleMemberList,
    openThread,
    threadMessages,
    setViewMode,
    toggleAIAssistant,
    polls,
    setModalPro,
  } = useChatStore();

  const [inputText, setInputText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isRecordingVoiceNote, setIsRecordingVoiceNote] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef<boolean>(true);
  const previousScrollHeightRef = useRef<number>(0);

  const activeGuild = guilds.find((g) => g.id === activeGuildId);
  const activeChannel = activeGuild?.channels.find((c) => c.id === activeChannelId);
  const channelMessages = messages[activeChannelId] || [];

  // Scroll Anchoring
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    } else {
      const delta = el.scrollHeight - previousScrollHeightRef.current;
      if (delta > 0) {
        el.scrollTop += delta;
      }
    }
  }, [channelMessages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    isAtBottomRef.current = distanceToBottom < 80;
    previousScrollHeightRef.current = target.scrollHeight;
  };

  const handleSend = () => {
    if (!inputText.trim() && !selectedFile) return;

    let attachments = undefined;
    if (selectedFile) {
      attachments = [
        {
          id: String(Date.now()),
          filename: selectedFile.name,
          url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
          size: selectedFile.size,
          contentType: 'image/png',
        },
      ];
    }

    sendMessage(activeChannelId, inputText, attachments);
    setInputText('');
    setSelectedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyCrosshair = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const quickReactions = ['🔥', '👑', '🎯', '⚡', '👀', '❤️'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0e14] min-w-0 select-text overflow-hidden relative">
      {/* 1. Header Táctico del Canal */}
      <div className="h-14 px-4 bg-[#090d16]/90 backdrop-blur-xl border-b border-[#151c2a] flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#ff4655]/15 border border-[#ff4655]/30 flex items-center justify-center text-[#ff4655] font-black text-xs">
              #
            </span>
            <h2 className="text-sm font-black text-white tracking-wide truncate">
              {activeChannel?.name || 'general'}
            </h2>
          </div>

          <div className="h-4 w-px bg-[#151c2a] mx-1 hidden sm:block" />

          <p className="text-xs text-[#94a3b8] truncate hidden sm:block max-w-md font-sans">
            {activeChannel?.topic || 'War Room táctico oficial de Sentinels • VOD review & Strat prep'}
          </p>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setModalPro('poll', true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0f1422] hover:bg-[#182133] border border-[#1e2638] text-xs font-bold text-[#facc15] transition shadow-sm"
            title="Crear Encuesta Táctica"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Encuesta</span>
          </button>

          <button
            onClick={() => setViewMode('whiteboard')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0f1422] hover:bg-[#182133] border border-[#1e2638] text-xs font-bold text-[#ff4655] transition shadow-sm"
            title="Abrir Strat Board"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Strat Board</span>
          </button>

          <button
            onClick={toggleMemberList}
            className="p-2 text-[#94a3b8] hover:text-white rounded-xl bg-[#0f1422] hover:bg-[#182133] border border-[#1e2638] transition"
            title="Mostrar Roster del Equipo"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Lista de Mensajes con Scroll Anchoring */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {/* Welcome Banner */}
        <div className="my-6 p-6 rounded-3xl bg-gradient-to-r from-[#0d111a] via-[#131a29] to-[#0d111a] border border-[#1e2638] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#ff4655]/20 border border-[#ff4655]/40 flex items-center justify-center text-2xl mb-3 shadow-lg shadow-[#ff4655]/20">
            ⚡
          </div>
          <h1 className="text-xl font-black text-white">
            ¡Bienvenido a #{activeChannel?.name || 'general'}!
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-xl leading-relaxed">
            Canal de comunicación oficial de la plantilla VCT de Sentinels. Comparte clips, códigos de miras competitivos, antistrats y notas de voz sincronizadas.
          </p>
        </div>

        {/* Encuestas activas del canal */}
        {polls[activeChannelId] &&
          polls[activeChannelId].map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}

        {/* Mensajes */}
        {channelMessages.map((message) => {
          const author = users[message.authorId] || currentUser;
          const isMe = author.id === currentUser.id;
          const isEditing = editingMessageId === message.id;
          const replyCount = threadMessages[message.id]?.length || 0;
          const gp = author.gamingProfile;

          // Detect crosshair code in message (Valorant standard regex pattern)
          const crosshairMatch = message.content.match(/0;s;1;P;[a-zA-Z0-9;]+/);

          return (
            <div
              key={message.id}
              className="group relative flex gap-3.5 p-3 rounded-2xl hover:bg-[#0f1422]/80 transition-all border border-transparent hover:border-[#1e2638]/70"
            >
              {/* Floating Action Bar */}
              <div className="absolute right-4 -top-3 hidden group-hover:flex items-center gap-1 bg-[#0d111a] border border-[#2b3547] rounded-xl px-1.5 py-1 shadow-2xl z-20">
                {quickReactions.slice(0, 3).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(activeChannelId, message.id, emoji)}
                    className="p-1 hover:bg-[#182133] rounded-lg text-xs transition"
                  >
                    {emoji}
                  </button>
                ))}
                <div className="w-[1px] h-3.5 bg-[#2b3547] mx-0.5" />
                <button
                  onClick={() => openThread(message.id)}
                  className="p-1 text-[#94a3b8] hover:text-white hover:bg-[#182133] rounded-lg transition"
                  title="Abrir Hilo Táctico"
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
                {isMe && (
                  <>
                    <button
                      onClick={() => {
                        setEditingMessageId(message.id);
                        setEditContent(message.content);
                      }}
                      className="p-1 text-[#94a3b8] hover:text-white hover:bg-[#182133] rounded-lg transition"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMessage(activeChannelId, message.id)}
                      className="p-1 text-[#ef4444] hover:bg-[#ef4444]/20 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Player Avatar */}
              <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setUserProfilePopover(author.id)}>
                <img
                  src={author.avatar}
                  alt={author.displayName}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#1e2638] group-hover:ring-[#ff4655] transition"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#0b0e14]" />
              </div>

              {/* Content Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    onClick={() => setUserProfilePopover(author.id)}
                    className="font-black text-sm text-white hover:underline cursor-pointer"
                  >
                    {author.displayName}
                  </span>

                  {gp?.teamTag && (
                    <span className="px-1.5 py-0.2 rounded bg-[#ff4655] text-white text-[9px] font-black uppercase font-mono">
                      {gp.teamTag}
                    </span>
                  )}

                  {gp?.roleTitle && (
                    <span className="text-[10px] text-[#38bdf8] font-bold font-mono px-1.5 py-0.2 bg-[#38bdf8]/10 rounded border border-[#38bdf8]/30">
                      {gp.roleTitle}
                    </span>
                  )}

                  {gp?.rankTier && (
                    <span className="text-[10px] text-[#facc15] font-bold font-mono">
                      • {gp.rankTier}
                    </span>
                  )}

                  <span className="text-[10px] text-[#64748b] font-mono ml-auto">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Edit input or Message Markdown */}
                {isEditing ? (
                  <div className="mt-1 space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-[#111620] text-sm text-white p-3 rounded-xl border border-[#ff4655] outline-none"
                      rows={3}
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => {
                          editMessage(activeChannelId, message.id, editContent);
                          setEditingMessageId(null);
                        }}
                        className="px-3 py-1 bg-[#ff4655] text-white rounded-lg font-bold"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="px-3 py-1 bg-[#1e2638] text-[#cbd5e1] rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#cbd5e1] leading-relaxed">
                    <DiscordMarkdown content={message.content} />
                  </div>
                )}

                {/* Crosshair Card Widget (if code detected) */}
                {crosshairMatch && (
                  <div className="mt-3 p-3 bg-[#111620] rounded-2xl border border-[#22c55e]/40 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center text-sm font-black">
                        🎯
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Código de Mira Competitivo (VCT)</div>
                        <div className="text-[11px] font-mono text-[#22c55e] truncate max-w-xs sm:max-w-md">
                          {crosshairMatch[0]}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCrosshair(crosshairMatch[0], message.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs rounded-xl transition shadow-md flex-shrink-0"
                    >
                      {copiedCodeId === message.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCodeId === message.id ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}

                {/* Voice Note Player (if audio message) */}
                {message.attachments?.some((a) => a.contentType.includes('audio')) && (
                  <div className="mt-3">
                    <VoiceNotePlayer durationSeconds={7} />
                  </div>
                )}

                {/* Attachments / Images */}
                {message.attachments &&
                  message.attachments
                    .filter((a) => !a.contentType.includes('audio'))
                    .map((att) => (
                      <div key={att.id} className="mt-3">
                        {att.contentType.startsWith('image/') ? (
                          <div className="rounded-2xl overflow-hidden border border-[#1e2638] max-w-md shadow-xl group/img relative">
                            <img src={att.url} alt={att.filename} className="w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-[#111620] rounded-xl border border-[#1e2638] max-w-md">
                            <FileText className="w-5 h-5 text-[#ff4655]" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-white truncate">{att.filename}</div>
                              <div className="text-[10px] text-[#64748b]">{(att.size / 1024).toFixed(1)} KB</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {message.reactions.map((r, idx) => (
                      <button
                        key={idx}
                        onClick={() => addReaction(activeChannelId, message.id, r.emoji)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#111620] hover:bg-[#182133] border border-[#1e2638] rounded-xl text-xs font-bold text-white transition"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] font-mono text-[#94a3b8]">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Reply / Thread indicator */}
                {replyCount > 0 && (
                  <button
                    onClick={() => openThread(message.id)}
                    className="mt-2 text-xs font-bold text-[#ff4655] hover:underline flex items-center gap-1"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{replyCount} respuestas en el hilo táctico</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Voice Note Recorder Tray (si está grabando) */}
      {isRecordingVoiceNote && (
        <div className="px-4 py-2 bg-[#090d16] border-t border-[#151c2a]">
          <VoiceNoteRecorder onRecorded={() => setIsRecordingVoiceNote(false)} />
        </div>
      )}

      {/* 4. Bottom Tactical Input Box */}
      <div className="p-4 bg-[#07090e]/95 backdrop-blur-xl border-t border-[#151c2a] flex-shrink-0">
        {selectedFile && (
          <div className="mb-2 px-3 py-1.5 bg-[#111620] rounded-xl border border-[#2b3547] flex items-center justify-between text-xs text-white max-w-sm">
            <span className="truncate">📎 {selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="text-[#ef4444]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="relative bg-[#0d111a] rounded-2xl border border-[#1e2638] focus-within:border-[#ff4655] transition shadow-xl p-2 flex items-center gap-2">
          {/* File Attach */}
          <button
            onClick={() => setSelectedFile({ name: 'clutch_ascent_a.png', size: 1850000 })}
            className="p-2 text-[#94a3b8] hover:text-white rounded-xl hover:bg-[#182133] transition"
            title="Adjuntar Clip / Screenshot"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice note recorder toggle */}
          <button
            onClick={() => setIsRecordingVoiceNote(true)}
            className="p-2 text-[#94a3b8] hover:text-[#ff4655] rounded-xl hover:bg-[#182133] transition"
            title="Grabar Nota de Voz Táctica"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Tactical Poll launcher */}
          <button
            onClick={() => setModalPro('poll', true)}
            className="p-2 text-[#94a3b8] hover:text-[#facc15] rounded-xl hover:bg-[#182133] transition"
            title="Crear Encuesta"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Main Textarea */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enviar llamada a #${activeChannel?.name || 'general'} (Markdown, spoilers ||antistrat||, miras)...`}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#64748b] outline-none resize-none py-1.5 font-sans"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() && !selectedFile}
            className="p-2.5 bg-[#ff4655] hover:bg-[#e03b49] disabled:opacity-40 text-white rounded-xl transition shadow-lg shadow-[#ff4655]/25"
            title="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
