import React, { useState } from 'react';
import { X, Upload, Server, Sparkles } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const CreateServerModal: React.FC = () => {
  const {
    isCreateServerOpen,
    closeModals,
    currentUser,
    createGuild,
  } = useChatStore();

  const [serverName, setServerName] = useState(`${currentUser.displayName}'s Server`);
  const [iconUrl, setIconUrl] = useState('');

  if (!isCreateServerOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;

    createGuild(serverName.trim(), iconUrl.trim() || undefined);
    setServerName('');
    setIconUrl('');
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
        <div className="p-6 text-center border-b border-[#202225]/40 relative">
          <button
            onClick={closeModals}
            className="absolute top-4 right-4 text-[#949ba4] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-white mb-1">Crea tu servidor</h3>
          <p className="text-xs text-[#949ba4]">
            Tu servidor es donde tú y tus amigos pasáis el tiempo. Crea el tuyo y empieza a hablar.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subir Icono Simulador */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#80848e] hover:border-discord-blurple flex flex-col items-center justify-center cursor-pointer transition relative group bg-[#2b2d31]">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt="Icon Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#949ba4] group-hover:text-white mb-1" />
                  <span className="text-[10px] font-bold uppercase text-[#949ba4] group-hover:text-white">
                    Subir
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] text-[#949ba4] mt-2">
              (O pega una URL de imagen abajo)
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
              URL del Icono (Opcional)
            </label>
            <input
              type="url"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
              Nombre del Servidor
            </label>
            <input
              type="text"
              required
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="El servidor de..."
              className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
            />
            <p className="text-[10px] text-[#949ba4] mt-1.5">
              Al crear un servidor, aceptas las Directivas de la comunidad.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center pt-4 border-t border-[#202225]/40">
            <button
              type="button"
              onClick={closeModals}
              className="text-sm font-medium text-white hover:underline transition"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={!serverName.trim()}
              className="px-6 py-2.5 bg-discord-blurple hover:bg-[#4752c4] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition shadow"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
