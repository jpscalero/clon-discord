import React, { useState, useMemo } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Attachment } from '../../types';
import {
  FolderArchive,
  Search,
  Filter,
  Image as ImageIcon,
  FileText,
  FileCode,
  Download,
  ExternalLink,
  Copy,
  Check,
  Upload,
  MessageSquare,
  Kanban,
  Sparkles,
  Hash,
  X,
  File,
  Eye,
  Calendar,
  User as UserIcon,
} from 'lucide-react';

interface VaultItem extends Attachment {
  messageId: string;
  authorId: string;
  timestamp: string;
}

type MediaFilterCategory = 'all' | 'images' | 'docs' | 'code';

export const MediaVaultView: React.FC = () => {
  const {
    activeChannelId,
    activeGuildId,
    guilds,
    messages,
    sendMessage,
    users,
    currentUser,
    setViewMode,
    currentViewMode,
    toggleAIAssistant,
    isAIAssistantOpen,
  } = useChatStore();

  const [filterCategory, setFilterCategory] = useState<MediaFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<VaultItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === activeChannelId);

  // Extraer todos los adjuntos de los mensajes del canal activo
  const channelMessages = messages[activeChannelId] || [];

  // Recopilar items de la bóveda
  const vaultItems = useMemo<VaultItem[]>(() => {
    const extracted: VaultItem[] = [];

    channelMessages.forEach((msg) => {
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach((att) => {
          extracted.push({
            ...att,
            messageId: msg.id,
            authorId: msg.authorId,
            timestamp: msg.timestamp,
          });
        });
      }
    });

    // Si el canal no tiene adjuntos todavía, proveer algunos ítems iniciales profesionales
    if (extracted.length === 0) {
      return [
        {
          id: 'vault-demo-1',
          filename: 'diagrama_arquitectura_mls.png',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
          size: 2450000,
          contentType: 'image/png',
          messageId: 'demo-msg-1',
          authorId: currentUser.id,
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          width: 1200,
          height: 800,
        },
        {
          id: 'vault-demo-2',
          filename: 'especificacion_audio_webrtc_dave.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: 1420000,
          contentType: 'application/pdf',
          messageId: 'demo-msg-2',
          authorId: '100000000000000002',
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'vault-demo-3',
          filename: 'snowflake_generator.ts',
          url: 'https://raw.githubusercontent.com/',
          size: 18400,
          contentType: 'application/typescript',
          messageId: 'demo-msg-3',
          authorId: '100000000000000003',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'vault-demo-4',
          filename: 'ui_preview_dark_mode.jpg',
          url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
          size: 3200000,
          contentType: 'image/jpeg',
          messageId: 'demo-msg-4',
          authorId: '100000000000000005',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          width: 1200,
          height: 800,
        },
        {
          id: 'vault-demo-5',
          filename: 'benchmark_opus_vs_aac.json',
          url: 'https://raw.githubusercontent.com/',
          size: 52000,
          contentType: 'application/json',
          messageId: 'demo-msg-5',
          authorId: '100000000000000004',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
      ];
    }

    return extracted;
  }, [channelMessages, currentUser.id]);

  // Clasificador de categoría
  const getItemCategory = (item: VaultItem): MediaFilterCategory => {
    const ct = item.contentType.toLowerCase();
    const fn = item.filename.toLowerCase();

    if (
      ct.startsWith('image/') ||
      fn.endsWith('.png') ||
      fn.endsWith('.jpg') ||
      fn.endsWith('.jpeg') ||
      fn.endsWith('.gif') ||
      fn.endsWith('.webp') ||
      fn.endsWith('.svg')
    ) {
      return 'images';
    }

    if (
      ct.includes('pdf') ||
      ct.includes('document') ||
      ct.includes('word') ||
      fn.endsWith('.pdf') ||
      fn.endsWith('.docx') ||
      fn.endsWith('.txt') ||
      fn.endsWith('.md')
    ) {
      return 'docs';
    }

    if (
      ct.includes('javascript') ||
      ct.includes('typescript') ||
      ct.includes('json') ||
      ct.includes('xml') ||
      ct.includes('code') ||
      fn.endsWith('.ts') ||
      fn.endsWith('.tsx') ||
      fn.endsWith('.js') ||
      fn.endsWith('.jsx') ||
      fn.endsWith('.py') ||
      fn.endsWith('.rs') ||
      fn.endsWith('.json') ||
      fn.endsWith('.css') ||
      fn.endsWith('.html')
    ) {
      return 'code';
    }

    return 'docs';
  };

  // Filtrar según categoría y búsqueda
  const filteredItems = useMemo(() => {
    return vaultItems.filter((item) => {
      const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
      const itemCat = getItemCategory(item);
      const matchesCategory = filterCategory === 'all' || itemCat === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [vaultItems, searchQuery, filterCategory]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const copyFileLink = (item: VaultItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const newAttachment: Attachment = {
      id: `vault-upload-${Date.now()}`,
      filename: file.name,
      url: isImage
        ? URL.createObjectURL(file)
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      size: file.size,
      contentType: file.type || 'application/octet-stream',
    };

    sendMessage(
      activeChannelId,
      `📁 *Nuevo archivo subido a la Bóveda:* **${file.name}** (${formatFileSize(file.size)})`,
      [newAttachment]
    );
  };

  return (
    <div className="flex-1 bg-discord-chat flex flex-col h-full overflow-hidden select-text relative">
      {/* 1. Cabecera Unificada con Switcher de Vistas */}
      <header className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between bg-discord-chat z-10 select-none shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden mr-4">
          <Hash className="w-5 h-5 text-discord-text-muted flex-shrink-0" />
          <span className="font-bold text-discord-text-header truncate">
            {currentChannel?.name || 'canal'}
          </span>
          <span className="text-xs text-discord-text-muted font-normal hidden sm:inline">
            · Bóveda Multimedia y Archivos
          </span>
        </div>

        {/* Switcher de Vistas */}
        <div className="flex items-center bg-[#1e1f22] p-0.5 rounded-lg border border-[#35373c]/60">
          <button
            onClick={() => setViewMode('chat')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              currentViewMode === 'chat'
                ? 'bg-[#35373c] text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              currentViewMode === 'kanban'
                ? 'bg-[#35373c] text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('vault')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              currentViewMode === 'vault'
                ? 'bg-discord-blurple text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bóveda</span>
          </button>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAIAssistant}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
              isAIAssistantOpen
                ? 'bg-discord-blurple text-white border-discord-blurple shadow-md'
                : 'bg-[#2b2d31] text-discord-text-normal border-[#35373c] hover:bg-discord-hover hover:text-white'
            }`}
            title="Abrir Copiloto IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden md:inline">Copiloto IA</span>
          </button>

          <label className="cursor-pointer flex items-center gap-1.5 bg-discord-blurple hover:bg-discord-blurple-hover text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Archivo</span>
            <input type="file" className="hidden" onChange={handleUploadFile} />
          </label>
        </div>
      </header>

      {/* 2. Barra de Filtros y Buscador */}
      <div className="h-12 px-4 border-b border-[#232428] bg-[#2b2d31]/40 flex items-center justify-between gap-3 flex-shrink-0 select-none">
        {/* Pestañas de Filtrado */}
        <div className="flex items-center gap-1 bg-[#1e1f22] p-1 rounded-lg border border-[#35373c]/50">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-discord-blurple text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setFilterCategory('images')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterCategory === 'images'
                ? 'bg-discord-blurple text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Imágenes</span>
          </button>
          <button
            onClick={() => setFilterCategory('docs')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterCategory === 'docs'
                ? 'bg-discord-blurple text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documentos</span>
          </button>
          <button
            onClick={() => setFilterCategory('code')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterCategory === 'code'
                ? 'bg-discord-blurple text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Código</span>
          </button>
        </div>

        {/* Buscador de archivos */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 text-discord-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1f22] text-xs text-discord-text-header placeholder-discord-text-muted pl-8 pr-3 py-1.5 rounded-md border border-[#35373c] focus:outline-none focus:border-discord-blurple"
          />
        </div>
      </div>

      {/* 3. Cuadrícula de Archivos y Galería */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center select-none">
            <div className="w-16 h-16 rounded-full bg-[#232428] flex items-center justify-center text-discord-text-muted mb-3">
              <FolderArchive className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-discord-text-header">
              No se encontraron archivos
            </h3>
            <p className="text-xs text-discord-text-muted mt-1 max-w-sm">
              No hay archivos que coincidan con los filtros seleccionados o aún no se han compartido
              adjuntos en este canal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const category = getItemCategory(item);
              const author = users[item.authorId] || currentUser;

              return (
                <div
                  key={item.id}
                  className="group bg-[#2b2d31] hover:bg-[#313338] border border-[#35373c]/70 hover:border-discord-blurple/50 rounded-xl overflow-hidden shadow-md transition-all duration-200 flex flex-col"
                >
                  {/* Vista Previa Multimedia */}
                  {category === 'images' ? (
                    <div
                      onClick={() => setSelectedPreviewItem(item)}
                      className="relative h-40 bg-[#1e1f22] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="p-2 bg-black/60 rounded-full text-white hover:bg-discord-blurple transition-colors">
                          <Eye className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setSelectedPreviewItem(item)}
                      className="h-40 bg-[#1e1f22]/70 flex flex-col items-center justify-center p-4 cursor-pointer relative overflow-hidden group-hover:bg-[#1e1f22] transition-colors"
                    >
                      {category === 'code' ? (
                        <FileCode className="w-12 h-12 text-discord-blurple mb-2" />
                      ) : (
                        <FileText className="w-12 h-12 text-emerald-400 mb-2" />
                      )}
                      <span className="text-[10px] font-mono text-discord-text-muted uppercase tracking-wider px-2 py-0.5 rounded bg-[#2b2d31] border border-[#35373c]">
                        {item.filename.split('.').pop() || 'file'}
                      </span>
                    </div>
                  )}

                  {/* Metadatos y Detalles */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <h4
                        className="text-xs font-semibold text-discord-text-header truncate"
                        title={item.filename}
                      >
                        {item.filename}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-discord-text-muted mt-1">
                        <span>{formatFileSize(item.size)}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Autor del archivo */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#35373c]/50">
                      <img
                        src={author.avatar}
                        alt={author.displayName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-discord-text-normal truncate flex-1">
                        {author.displayName}
                      </span>

                      {/* Botones de Acción */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyFileLink(item)}
                          className="p-1 rounded text-discord-text-muted hover:text-white hover:bg-[#1e1f22] transition-colors"
                          title="Copiar enlace"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-discord-green" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={item.filename}
                          className="p-1 rounded text-discord-text-muted hover:text-white hover:bg-[#1e1f22] transition-colors"
                          title="Abrir o descargar archivo"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Modal / Lightbox de Previsualización */}
      {selectedPreviewItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-4xl w-full bg-[#2b2d31] rounded-2xl border border-[#35373c] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Cabecera del visor */}
            <div className="px-5 py-3.5 border-b border-[#1f2023] flex items-center justify-between bg-[#232428]">
              <div className="flex items-center gap-2 overflow-hidden mr-4">
                <FolderArchive className="w-4 h-4 text-discord-blurple flex-shrink-0" />
                <span className="font-bold text-xs text-discord-text-header truncate">
                  {selectedPreviewItem.filename}
                </span>
                <span className="text-[10px] text-discord-text-muted">
                  ({formatFileSize(selectedPreviewItem.size)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedPreviewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={selectedPreviewItem.filename}
                  className="flex items-center gap-1.5 px-3 py-1 bg-discord-blurple hover:bg-discord-blurple-hover text-white rounded text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
                <button
                  onClick={() => setSelectedPreviewItem(null)}
                  className="p-1 text-discord-text-muted hover:text-white rounded hover:bg-discord-hover transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido del visor */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#111214]">
              {getItemCategory(selectedPreviewItem) === 'images' ? (
                <img
                  src={selectedPreviewItem.url}
                  alt={selectedPreviewItem.filename}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="text-center p-8 max-w-md">
                  <FileText className="w-16 h-16 text-discord-blurple mx-auto mb-4" />
                  <h3 className="text-base font-bold text-discord-text-header">
                    {selectedPreviewItem.filename}
                  </h3>
                  <p className="text-xs text-discord-text-muted mt-2">
                    Tipo de archivo: {selectedPreviewItem.contentType} · Tamaño:{' '}
                    {formatFileSize(selectedPreviewItem.size)}
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <a
                      href={selectedPreviewItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-discord-blurple hover:bg-discord-blurple-hover text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir archivo en nueva pestaña</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
