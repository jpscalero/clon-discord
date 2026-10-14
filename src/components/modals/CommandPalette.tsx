import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Hash, Volume2, Shield, Settings, Server, Plus, User as UserIcon } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    closeModals,
    guilds,
    users,
    setActiveGuild,
    setActiveChannel,
    openModal,
  } = useChatStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Manejar atajo global Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) {
          closeModals();
        } else {
          openModal('commandPalette');
        }
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        closeModals();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeModals, openModal]);

  interface CommandItem {
    id: string;
    type: 'channel' | 'guild' | 'user' | 'action';
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    action: () => void;
  }

  const items = useMemo(() => {
    const result: CommandItem[] = [];

    // Canales de todos los servidores
    guilds.forEach((guild) => {
      guild.channels.forEach((channel) => {
        result.push({
          id: `channel-${channel.id}`,
          type: 'channel',
          title: `#${channel.name}`,
          subtitle: `En ${guild.name}`,
          icon: channel.type === 'voice' ? <Volume2 className="w-4 h-4 text-[#949ba4]" /> : <Hash className="w-4 h-4 text-[#949ba4]" />,
          action: () => {
            setActiveGuild(guild.id);
            setActiveChannel(channel.id);
            closeModals();
          },
        });
      });
    });

    // Servidores
    guilds.forEach((guild) => {
      result.push({
        id: `guild-${guild.id}`,
        type: 'guild',
        title: guild.name,
        subtitle: 'Cambiar de servidor',
        icon: <Server className="w-4 h-4 text-discord-blurple" />,
        action: () => {
          setActiveGuild(guild.id);
          closeModals();
        },
      });
    });

    // Usuarios
    Object.values(users).forEach((user) => {
      result.push({
        id: `user-${user.id}`,
        type: 'user',
        title: `@${user.displayName}`,
        subtitle: `@${user.username}`,
        icon: <UserIcon className="w-4 h-4 text-discord-green" />,
        action: () => {
          useChatStore.getState().setUserProfilePopover(user.id);
          closeModals();
        },
      });
    });

    // Acciones del sistema
    result.push({
      id: 'action-user-settings',
      type: 'action',
      title: 'Ajustes de Usuario',
      subtitle: 'Voz, vídeo, perfil y tema',
      icon: <Settings className="w-4 h-4 text-[#dbdee1]" />,
      action: () => {
        openModal('userSettings');
      },
    });

    result.push({
      id: 'action-server-settings',
      type: 'action',
      title: 'Ajustes del Servidor',
      subtitle: 'Roles, permisos y configuración',
      icon: <Shield className="w-4 h-4 text-discord-red" />,
      action: () => {
        openModal('serverSettings');
      },
    });

    result.push({
      id: 'action-create-channel',
      type: 'action',
      title: 'Crear Nuevo Canal',
      subtitle: 'Canal de texto o voz',
      icon: <Plus className="w-4 h-4 text-[#23a55a]" />,
      action: () => {
        openModal('createChannel');
      },
    });

    result.push({
      id: 'action-create-server',
      type: 'action',
      title: 'Crear Servidor',
      subtitle: 'Crea tu propia comunidad',
      icon: <Server className="w-4 h-4 text-[#23a55a]" />,
      action: () => {
        openModal('createServer');
      },
    });

    return result;
  }, [guilds, users, setActiveGuild, setActiveChannel, closeModals, openModal]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [items, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredItems[selectedIndex]?.action();
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closeModals}
    >
      <div
        className="w-[560px] max-w-[90vw] bg-[#2b2d31] rounded-xl shadow-2xl border border-[#35373c] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de búsqueda */}
        <div className="flex items-center px-4 py-3 border-b border-[#202225] bg-[#1e1f22]">
          <Search className="w-5 h-5 text-[#949ba4] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="¿A dónde te gustaría ir? Escribe un canal, servidor o acción..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#80848e]"
          />
          <span className="text-[10px] font-bold text-[#80848e] bg-[#2b2d31] px-1.5 py-0.5 rounded border border-[#35373c]">
            ESC
          </span>
        </div>

        {/* Lista de resultados */}
        <div className="max-h-[360px] overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-[#949ba4] text-xs">
              No se encontraron resultados para &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition ${
                  index === selectedIndex
                    ? 'bg-discord-blurple text-white'
                    : 'text-[#dbdee1] hover:bg-[#35373c]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-md ${
                      index === selectedIndex ? 'bg-white/20 text-white' : 'bg-[#1e1f22]'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate leading-none mb-1">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p
                        className={`text-xs truncate ${
                          index === selectedIndex ? 'text-white/80' : 'text-[#949ba4]'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    index === selectedIndex
                      ? 'bg-black/20 text-white'
                      : 'bg-[#1e1f22] text-[#80848e]'
                  }`}
                >
                  {item.type.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#1e1f22] border-t border-[#202225] flex items-center justify-between text-[11px] text-[#949ba4]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="bg-[#2b2d31] px-1 rounded text-white font-mono">↑</kbd>{' '}
              <kbd className="bg-[#2b2d31] px-1 rounded text-white font-mono">↓</kbd> Navegar
            </span>
            <span>
              <kbd className="bg-[#2b2d31] px-1.5 rounded text-white font-mono">↵</kbd> Seleccionar
            </span>
          </div>
          <span>Búsqueda Rápida (Quick Switcher)</span>
        </div>
      </div>
    </div>
  );
};
