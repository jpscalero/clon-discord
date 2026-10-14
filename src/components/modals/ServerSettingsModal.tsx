import React, { useState } from 'react';
import {
  X,
  Shield,
  Hash,
  Users,
  Plus,
  Trash2,
  Check,
  Server,
  Settings,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { Permissions, roleHasPermission } from '../../utils/permissions';
import { Role } from '../../types';

type ServerTab = 'overview' | 'roles' | 'channels';

export const ServerSettingsModal: React.FC = () => {
  const {
    isServerSettingsOpen,
    closeModals,
    guilds,
    activeGuildId,
    updateRole,
    createRole,
    deleteRole,
  } = useChatStore();

  const [activeTab, setActiveTab] = useState<ServerTab>('overview');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const currentGuild = guilds.find((g) => g.id === activeGuildId);

  if (!isServerSettingsOpen || !currentGuild) return null;

  const currentRole =
    currentGuild.roles.find((r) => r.id === selectedRoleId) || currentGuild.roles[0];

  const handleTogglePermission = (permBit: bigint) => {
    if (!currentRole) return;
    const currentPerms = currentRole.permissions;
    const has = (currentPerms & permBit) === permBit;

    const newPerms = has ? currentPerms & ~permBit : currentPerms | permBit;

    updateRole(currentGuild.id, {
      ...currentRole,
      permissions: newPerms,
    });
  };

  const handleCreateNewRole = () => {
    const roleColors = ['#e91e63', '#9c27b0', '#3f51b5', '#00bcd4', '#4caf50', '#ff9800'];
    const randomColor = roleColors[Math.floor(Math.random() * roleColors.length)];
    createRole(currentGuild.id, 'Nuevo Rol', randomColor);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#313338] animate-fade-in text-[#dbdee1]">
      {/* Sidebar Izquierda */}
      <div className="w-60 bg-[#2b2d31] flex flex-col items-end py-14 pr-6 pl-8 flex-shrink-0 select-none border-r border-[#202225]/40">
        <div className="w-48 space-y-6">
          <div>
            <h4 className="text-[11px] font-bold text-[#949ba4] uppercase tracking-wider mb-2 px-2">
              {currentGuild.name}
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition ${
                  activeTab === 'overview'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                }`}
              >
                <Server className="w-4 h-4" />
                Vista General
              </button>

              <button
                onClick={() => {
                  setActiveTab('roles');
                  if (!selectedRoleId && currentGuild.roles.length > 0) {
                    setSelectedRoleId(currentGuild.roles[0].id);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition ${
                  activeTab === 'roles'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                }`}
              >
                <Shield className="w-4 h-4 text-discord-blurple" />
                Roles
              </button>

              <button
                onClick={() => setActiveTab('channels')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition ${
                  activeTab === 'channels'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                }`}
              >
                <Hash className="w-4 h-4" />
                Canales ({currentGuild.channels.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Central */}
      <div className="flex-1 py-14 px-10 overflow-y-auto custom-scrollbar max-w-4xl">
        {/* Vista General */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">Ajustes del Servidor</h2>

            <div className="flex items-center gap-6">
              <img
                src={currentGuild.icon}
                alt={currentGuild.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#2b2d31] shadow-lg"
              />
              <div className="space-y-2">
                <h3 className="text-white font-bold text-lg">{currentGuild.name}</h3>
                <p className="text-xs text-[#949ba4] font-mono">ID: {currentGuild.id}</p>
                <span className="inline-block text-xs bg-[#23a55a]/20 text-[#23a55a] font-semibold px-2 py-0.5 rounded">
                  Servidor Verificado Activo
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Nombre del Servidor
                </label>
                <input
                  type="text"
                  defaultValue={currentGuild.name}
                  className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Región de Voz del Servidor (RTC SFU)
                </label>
                <select className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple">
                  <option>Europa (Madrid / Frankfurt) • LiveKit SFU</option>
                  <option>Norteamérica Este (US-East) • LiveKit SFU</option>
                  <option>Brasil (São Paulo) • LiveKit SFU</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Roles y Permisos Bitwise */}
        {activeTab === 'roles' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Administrador de Roles</h2>
                <p className="text-xs text-[#949ba4]">
                  Usa roles para asignar permisos y agrupar a los miembros en la lista.
                </p>
              </div>

              <button
                onClick={handleCreateNewRole}
                className="bg-discord-blurple hover:bg-[#4752c4] text-white px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Crear Rol
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Columna de Lista de Roles */}
              <div className="bg-[#2b2d31] rounded-xl p-3 border border-[#35373c] space-y-1 h-[480px] overflow-y-auto custom-scrollbar">
                {currentGuild.roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm font-semibold transition ${
                      currentRole?.id === role.id
                        ? 'bg-[#35373c] text-white'
                        : 'text-[#dbdee1] hover:bg-[#35373c]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="truncate">{role.name}</span>
                    </div>

                    {role.name !== '@everyone' && (
                      <Trash2
                        className="w-3.5 h-3.5 text-[#949ba4] hover:text-discord-red ml-1 opacity-0 hover:opacity-100 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRole(currentGuild.id, role.id);
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Columna de Edición del Rol Seleccionado */}
              {currentRole && (
                <div className="col-span-2 bg-[#2b2d31] rounded-xl p-5 border border-[#35373c] space-y-5 h-[480px] overflow-y-auto custom-scrollbar">
                  {/* Nombre y Color */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
                        Nombre del Rol
                      </label>
                      <input
                        type="text"
                        value={currentRole.name}
                        disabled={currentRole.name === '@everyone'}
                        onChange={(e) =>
                          updateRole(currentGuild.id, { ...currentRole, name: e.target.value })
                        }
                        className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
                        Color del Rol
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={currentRole.color}
                          disabled={currentRole.name === '@everyone'}
                          onChange={(e) =>
                            updateRole(currentGuild.id, { ...currentRole, color: e.target.value })
                          }
                          className="w-9 h-9 rounded cursor-pointer border border-[#35373c] bg-transparent"
                        />
                        <span className="text-xs font-mono text-[#dbdee1]">{currentRole.color}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interruptores de Permisos 64-bit Bitwise */}
                  <div className="space-y-3 pt-3 border-t border-[#35373c]">
                    <h4 className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider">
                      Matriz de Permisos (Bitwise Flags)
                    </h4>

                    {[
                      { bit: Permissions.ADMINISTRATOR, name: 'Administrador', desc: 'Concede todos los permisos y anula cualquier restricción de canal.' },
                      { bit: Permissions.MANAGE_CHANNELS, name: 'Gestionar Canales', desc: 'Permite crear, editar o eliminar canales de texto y voz.' },
                      { bit: Permissions.KICK_MEMBERS, name: 'Expulsar Miembros', desc: 'Permite expulsar miembros del servidor.' },
                      { bit: Permissions.BAN_MEMBERS, name: 'Banear Miembros', desc: 'Permite expulsar y prohibir permanentemente el acceso.' },
                      { bit: Permissions.SEND_MESSAGES, name: 'Enviar Mensajes', desc: 'Permite publicar mensajes en canales de texto.' },
                      { bit: Permissions.MANAGE_MESSAGES, name: 'Gestionar Mensajes', desc: 'Permite eliminar y fijar mensajes de otros miembros.' },
                      { bit: Permissions.CONNECT, name: 'Conectar a Voz', desc: 'Permite unirse a canales de audio y conferencias.' },
                      { bit: Permissions.SPEAK, name: 'Hablar en Voz', desc: 'Permite transmitir audio desde el micrófono.' },
                      { bit: Permissions.STREAM, name: 'Transmitir Pantalla / Vídeo', desc: 'Permite compartir pantalla o activar cámara web.' },
                    ].map(({ bit, name, desc }) => {
                      const isEnabled = roleHasPermission(currentRole.permissions, bit);
                      return (
                        <div
                          key={name}
                          className="flex items-center justify-between p-3 bg-[#1e1f22] rounded-lg border border-[#35373c]/50"
                        >
                          <div className="pr-4">
                            <p className="text-sm font-semibold text-white">{name}</p>
                            <p className="text-xs text-[#949ba4]">{desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleTogglePermission(bit)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer flex-shrink-0 ${
                              isEnabled ? 'bg-discord-green justify-end' : 'bg-[#4e5058] justify-start'
                            }`}
                          >
                            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canales */}
        {activeTab === 'channels' && (
          <div className="space-y-4 animate-fade-in max-w-xl">
            <h2 className="text-xl font-bold text-white mb-4">Canales del Servidor</h2>

            <div className="bg-[#2b2d31] rounded-xl p-4 border border-[#35373c] space-y-2">
              {currentGuild.channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-2.5 bg-[#1e1f22] rounded-lg border border-[#35373c]/60"
                >
                  <div className="flex items-center gap-2">
                    {channel.type === 'voice' ? (
                      <span className="text-[#949ba4]">🔊</span>
                    ) : (
                      <span className="text-[#949ba4]">#</span>
                    )}
                    <span className="text-white text-sm font-semibold">{channel.name}</span>
                    <span className="text-[10px] bg-[#2b2d31] text-[#949ba4] px-1.5 py-0.5 rounded uppercase">
                      {channel.type}
                    </span>
                  </div>

                  <span className="text-xs text-[#949ba4] font-mono">{channel.id.slice(-6)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botón Salir / ESC */}
      <div className="pt-14 pr-12 flex-shrink-0">
        <button
          onClick={closeModals}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full border-2 border-[#b5bac1] flex items-center justify-center text-[#b5bac1] group-hover:border-white group-hover:text-white transition">
            <X className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#b5bac1] group-hover:text-white uppercase mt-1">
            ESC
          </span>
        </button>
      </div>
    </div>
  );
};
