import React, { useState, useRef, useLayoutEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { DiscordMarkdown } from '../../utils/markdownParser';
import {
  X,
  Send,
  Smile,
  MessageSquare,
  Hash,
  FileText,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';

export const ThreadDrawer: React.FC = () => {
  const {
    activeThreadMessageId,
    closeThread,
    threadMessages,
    sendThreadMessage,
    messages,
    activeChannelId,
    guilds,
    activeGuildId,
    users,
    currentUser,
    setUserProfilePopover,
  } = useChatStore();

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const repliesContainerRef = useRef<HTMLDivElement>(null);

  // Obtener canal y servidor actual
  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === activeChannelId);

  // Buscar el mensaje principal de origen
  const allChannelMessages = Object.values(messages).flat();
  const parentMessage =
    messages[activeChannelId]?.find((m) => m.id === activeThreadMessageId) ||
    allChannelMessages.find((m) => m.id === activeThreadMessageId);

  const parentAuthor = parentMessage ? users[parentMessage.authorId] || currentUser : null;
  const replies = activeThreadMessageId ? threadMessages[activeThreadMessageId] || [] : [];

  // Scroll automático hacia abajo al agregar o cargar respuestas
  useLayoutEffect(() => {
    if (repliesContainerRef.current) {
      repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
    }
  }, [replies.length, activeThreadMessageId]);

  if (!activeThreadMessageId) {
    return null;
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendThreadMessage(activeThreadMessageId, inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const QUICK_EMOJIS = ['👍', '❤️', '🔥', '🚀', '🎉', '💯'];

  return (
    <aside
      aria-label="Panel lateral de hilo"
      className="w-96 lg:w-[420px] flex-shrink-0 h-full bg-[#2b2d31] border-l border-[#1f2023] flex flex-col z-20 shadow-2xl select-text animate-in slide-in-from-right duration-200"
    >
      {/* 1. Cabecera del Hilo */}
      <header className="h-12 px-4 border-b border-[#1f2023] bg-[#2b2d31] flex items-center justify-between select-none flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <div className="p-1 rounded bg-[#35373c] text-discord-text-header">
            <MessageSquare className="w-4 h-4 text-discord-blurple" />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <h3 className="text-xs font-bold text-discord-text-header truncate">
              Hilo de conversación
            </h3>
            <span className="text-[10px] text-discord-text-muted truncate flex items-center gap-1">
              <Hash className="w-2.5 h-2.5 inline" />
              {currentChannel?.name || 'canal'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={closeThread}
            className="p-1.5 text-discord-text-muted hover:text-white hover:bg-discord-hover rounded transition-colors"
            title="Cerrar hilo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Cuerpo del Hilo (Mensaje Origen + Respuestas) */}
      <div
        ref={repliesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
      >
        {/* Mensaje Principal de Origen */}
        {parentMessage && parentAuthor ? (
          <div className="bg-[#1e1f22]/70 rounded-xl p-3 border border-[#35373c]/50 relative group">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-discord-blurple flex items-center gap-1 mb-2">
              <CornerDownRight className="w-3 h-3" />
              <span>Mensaje Principal</span>
            </div>

            <div className="flex items-start gap-3">
              <button
                onClick={() => setUserProfilePopover(parentAuthor.id)}
                className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 hover:opacity-90 focus:ring-2 focus:ring-discord-blurple"
              >
                <img
                  src={parentAuthor.avatar}
                  alt={parentAuthor.displayName}
                  className="w-full h-full object-cover"
                />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <button
                    onClick={() => setUserProfilePopover(parentAuthor.id)}
                    className="font-bold text-xs text-discord-text-header hover:underline truncate"
                  >
                    {parentAuthor.displayName}
                  </button>
                  <span className="text-[10px] text-discord-text-muted">
                    {new Date(parentMessage.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    {new Date(parentMessage.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="text-xs text-discord-text-normal mt-1 break-words">
                  <DiscordMarkdown
                    content={parentMessage.content}
                    getUserName={(id) => users[id]?.displayName || id}
                    getChannelName={(id) =>
                      currentGuild?.channels.find((c) => c.id === id)?.name || id
                    }
                  />
                </div>

                {/* Adjuntos del mensaje origen */}
                {parentMessage.attachments && parentMessage.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {parentMessage.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="rounded border border-discord-divider bg-[#111214] overflow-hidden"
                      >
                        {att.contentType.startsWith('image/') ? (
                          <img
                            src={att.url}
                            alt={att.filename}
                            className="max-h-48 w-full object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <div className="p-2 flex items-center gap-2 text-xs">
                            <FileText className="w-4 h-4 text-discord-blurple flex-shrink-0" />
                            <span className="truncate">{att.filename}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-discord-text-muted italic p-2 bg-[#1e1f22]/40 rounded">
            Mensaje original de origen cargando...
          </div>
        )}

        {/* Separador de respuestas */}
        <div className="flex items-center gap-2 select-none">
          <div className="h-[1px] flex-1 bg-[#35373c]" />
          <span className="text-[10px] font-semibold text-discord-text-muted uppercase tracking-wider">
            {replies.length} {replies.length === 1 ? 'Respuesta' : 'Respuestas'}
          </span>
          <div className="h-[1px] flex-1 bg-[#35373c]" />
        </div>

        {/* Lista de Respuestas */}
        {replies.length === 0 ? (
          <div className="py-8 text-center select-none">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1e1f22] flex items-center justify-center text-discord-text-muted mb-2">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-xs text-discord-text-header font-medium">Aún no hay respuestas</p>
            <p className="text-[11px] text-discord-text-muted mt-1 max-w-xs mx-auto">
              Inicia la conversación en este hilo respondiendo en el formulario inferior.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {replies.map((reply) => {
              const replyAuthor = users[reply.authorId] || currentUser;
              return (
                <div
                  key={reply.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#313338]/60 transition-colors"
                >
                  <button
                    onClick={() => setUserProfilePopover(replyAuthor.id)}
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-0.5 hover:opacity-90"
                  >
                    <img
                      src={replyAuthor.avatar}
                      alt={replyAuthor.displayName}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <button
                        onClick={() => setUserProfilePopover(replyAuthor.id)}
                        className="font-semibold text-xs text-discord-text-header hover:underline truncate"
                      >
                        {replyAuthor.displayName}
                      </button>
                      <span className="text-[10px] text-discord-text-muted">
                        {new Date(reply.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-discord-text-normal mt-0.5 break-words">
                      <DiscordMarkdown
                        content={reply.content}
                        getUserName={(id) => users[id]?.displayName || id}
                        getChannelName={(id) =>
                          currentGuild?.channels.find((c) => c.id === id)?.name || id
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Selector rápido de emojis si está abierto */}
      {showEmojiPicker && (
        <div className="px-3 py-1.5 bg-[#1e1f22] border-t border-[#35373c] flex items-center gap-2">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + ' ' + emoji);
                setShowEmojiPicker(false);
              }}
              className="text-base hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* 4. Input inferior de respuestas */}
      <footer className="p-3 bg-[#2b2d31] border-t border-[#1f2023] flex-shrink-0 select-none">
        <div className="bg-[#383a40] rounded-lg px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-discord-text-muted hover:text-white transition-colors"
            title="Añadir emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Responder en el hilo..."
            className="flex-1 bg-transparent text-xs text-discord-text-header placeholder-discord-text-muted focus:outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="text-discord-text-muted hover:text-discord-blurple disabled:opacity-40 transition-colors"
            title="Enviar respuesta"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </aside>
  );
};
