import React, { useState } from 'react';
import { X, Hash, Volume2, Megaphone } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { ChannelType } from '../../types';

export const CreateChannelModal: React.FC = () => {
  const {
    isCreateChannelOpen,
    closeModals,
    activeGuildId,
    guilds,
    createChannel,
  } = useChatStore();

  const [channelType, setChannelType] = useState<ChannelType>('text');
  const [channelName, setChannelName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const currentGuild = guilds.find((g) => g.id === activeGuildId);

  if (!isCreateChannelOpen || !currentGuild) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    createChannel(
      currentGuild.id,
      channelName.trim(),
      channelType,
      selectedCategoryId || undefined
    );
    setChannelName('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closeModals}
    >
      <div
        className="w-[440px] bg-[#313338] rounded-xl shadow-2xl overflow-hidden border border-[#35373c]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-[#202225]/40">
          <div>
            <h3 className="text-base font-bold text-white">Crear Canal</h3>
            <p className="text-xs text-[#949ba4]">en {currentGuild.name}</p>
          </div>
          <button
            onClick={closeModals}
            className="text-[#949ba4] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Selector de Tipo de Canal */}
          <div>
            <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
              Tipo de Canal
            </label>

            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                  channelType === 'text'
                    ? 'border-discord-blurple bg-[#2b2d31]'
                    : 'border-[#35373c] bg-[#1e1f22] hover:bg-[#2b2d31]'
                }`}
              >
                <input
                  type="radio"
                  name="channelType"
                  checked={channelType === 'text'}
                  onChange={() => setChannelType('text')}
                  className="hidden"
                />
                <Hash className="w-6 h-6 text-[#949ba4]" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Texto</div>
                  <div className="text-xs text-[#949ba4]">
                    Envía mensajes, imágenes, memes, opiniones y bromas
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                  channelType === 'voice'
                    ? 'border-discord-blurple bg-[#2b2d31]'
                    : 'border-[#35373c] bg-[#1e1f22] hover:bg-[#2b2d31]'
                }`}
              >
                <input
                  type="radio"
                  name="channelType"
                  checked={channelType === 'voice'}
                  onChange={() => setChannelType('voice')}
                  className="hidden"
                />
                <Volume2 className="w-6 h-6 text-[#949ba4]" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Voz</div>
                  <div className="text-xs text-[#949ba4]">
                    Juntos por voz, vídeo y pantalla compartida
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                  channelType === 'announcement'
                    ? 'border-discord-blurple bg-[#2b2d31]'
                    : 'border-[#35373c] bg-[#1e1f22] hover:bg-[#2b2d31]'
                }`}
              >
                <input
                  type="radio"
                  name="channelType"
                  checked={channelType === 'announcement'}
                  onChange={() => setChannelType('announcement')}
                  className="hidden"
                />
                <Megaphone className="w-6 h-6 text-[#949ba4]" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Anuncios</div>
                  <div className="text-xs text-[#949ba4]">
                    Publicaciones importantes con suscripción a otros servidores
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Nombre del Canal */}
          <div>
            <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
              Nombre del Canal
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm text-[#949ba4]">
                {channelType === 'voice' ? '🔊' : '#'}
              </span>
              <input
                type="text"
                required
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="nuevo-canal"
                className="w-full bg-[#1e1f22] text-sm text-white pl-8 pr-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
              />
            </div>
          </div>

          {/* Categoría Opcional */}
          {currentGuild.categories.length > 0 && (
            <div>
              <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
                Categoría
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
              >
                <option value="">(Sin Categoría)</option>
                {currentGuild.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#202225]/40">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2 text-sm font-medium text-white hover:underline transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!channelName.trim()}
              className="px-5 py-2 bg-discord-blurple hover:bg-[#4752c4] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition shadow"
            >
              Crear Canal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
