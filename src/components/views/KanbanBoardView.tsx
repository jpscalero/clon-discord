import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { KanbanTask } from '../../types';
import {
  Kanban,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Tag,
  User as UserIcon,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  X,
  MessageSquare,
  Sparkles,
  FolderArchive,
  Hash,
} from 'lucide-react';

interface ColumnConfig {
  id: KanbanTask['status'];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'backlog',
    label: 'Backlog',
    icon: Circle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
  },
  {
    id: 'todo',
    label: 'Por Hacer',
    icon: Clock,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
  },
  {
    id: 'in_progress',
    label: 'En Progreso',
    icon: AlertCircle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    id: 'done',
    label: 'Terminado',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
];

export const KanbanBoardView: React.FC = () => {
  const {
    activeChannelId,
    activeGuildId,
    guilds,
    kanbanTasks,
    addKanbanTask,
    updateKanbanTaskStatus,
    deleteKanbanTask,
    users,
    currentUser,
    setViewMode,
    currentViewMode,
    toggleAIAssistant,
    isAIAssistantOpen,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<KanbanTask['status']>('todo');
  const [newPriority, setNewPriority] = useState<KanbanTask['priority']>('medium');
  const [newAssigneeId, setNewAssigneeId] = useState<string>(currentUser.id);
  const [newTagsInput, setNewTagsInput] = useState('');

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === activeChannelId);
  const tasks = kanbanTasks[activeChannelId] || [];

  // Filtrado de tareas
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority =
      selectedPriorityFilter === 'all' || task.priority === selectedPriorityFilter;

    return matchesSearch && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tags = newTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addKanbanTask(activeChannelId, {
      channelId: activeChannelId,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      status: newStatus,
      priority: newPriority,
      assigneeId: newAssigneeId || undefined,
      tags,
    });

    // Resetear formulario
    setNewTitle('');
    setNewDescription('');
    setNewStatus('todo');
    setNewPriority('medium');
    setNewTagsInput('');
    setIsNewTaskModalOpen(false);
  };

  const getPriorityBadge = (priority: KanbanTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Urgente
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Alta
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            Media
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Baja
          </span>
        );
    }
  };

  const STATUS_ORDER: KanbanTask['status'][] = ['backlog', 'todo', 'in_progress', 'done'];

  const moveTask = (taskId: string, current: KanbanTask['status'], direction: 'next' | 'prev') => {
    const currentIndex = STATUS_ORDER.indexOf(current);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < STATUS_ORDER.length) {
      updateKanbanTaskStatus(activeChannelId, taskId, STATUS_ORDER[targetIndex]);
    }
  };

  return (
    <div className="flex-1 bg-discord-chat flex flex-col h-full overflow-hidden select-text relative">
      {/* 1. Cabecera Unificada del Canal con Switcher de Vistas */}
      <header className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between bg-discord-chat z-10 select-none shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden mr-4">
          <Hash className="w-5 h-5 text-discord-text-muted flex-shrink-0" />
          <span className="font-bold text-discord-text-header truncate">
            {currentChannel?.name || 'canal'}
          </span>
          <span className="text-xs text-discord-text-muted font-normal hidden sm:inline">
            · Tablero Kanban Linear
          </span>
        </div>

        {/* Switcher de Vistas estilo pestaña */}
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
                ? 'bg-discord-blurple text-white shadow-sm'
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
                ? 'bg-[#35373c] text-white shadow-sm'
                : 'text-discord-text-muted hover:text-white'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bóveda</span>
          </button>
        </div>

        {/* Acciones de la cabecera */}
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

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-1.5 bg-discord-blurple hover:bg-discord-blurple-hover text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </header>

      {/* 2. Barra de Herramientas y Filtros del Kanban */}
      <div className="h-11 px-4 border-b border-[#232428] bg-[#2b2d31]/40 flex items-center justify-between gap-3 flex-shrink-0 select-none">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-discord-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tareas por título, etiqueta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1f22] text-xs text-discord-text-header placeholder-discord-text-muted pl-8 pr-3 py-1.5 rounded border border-[#35373c] focus:outline-none focus:border-discord-blurple"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-discord-text-muted">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prioridad:</span>
          </div>
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-[#1e1f22] text-xs text-discord-text-normal border border-[#35373c] rounded px-2 py-1 focus:outline-none focus:border-discord-blurple cursor-pointer"
          >
            <option value="all">Todas</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>

          <span className="text-xs text-discord-text-muted ml-2">
            Total: <strong className="text-white">{filteredTasks.length}</strong>
          </span>
        </div>
      </div>

      {/* 3. Columnas del Tablero Kanban */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <div className="flex gap-4 h-full min-w-max pb-2">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const Icon = col.icon;

            return (
              <div
                key={col.id}
                className="w-80 flex flex-col h-full bg-[#232428]/80 rounded-xl border border-[#35373c]/70 shadow-lg overflow-hidden"
              >
                {/* Cabecera de Columna */}
                <div
                  className={`p-3 border-b border-[#35373c]/50 flex items-center justify-between ${col.bgColor} select-none`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${col.color}`} />
                    <h3 className="font-bold text-xs text-discord-text-header tracking-wide">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1e1f22] text-discord-text-normal border border-[#35373c]">
                    {colTasks.length}
                  </span>
                </div>

                {/* Lista de Tarjetas */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-[#35373c]/40 rounded-lg text-discord-text-muted text-xs select-none">
                      <span>No hay tareas</span>
                      <button
                        onClick={() => {
                          setNewStatus(col.id);
                          setIsNewTaskModalOpen(true);
                        }}
                        className="mt-1 text-[11px] text-discord-blurple hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Agregar tarea
                      </button>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const assignee = task.assigneeId
                        ? users[task.assigneeId] || currentUser
                        : null;

                      return (
                        <div
                          key={task.id}
                          className="group bg-[#2b2d31] hover:bg-[#313338] border border-[#35373c]/60 hover:border-discord-blurple/50 rounded-lg p-3 shadow transition-all duration-150 flex flex-col gap-2.5"
                        >
                          {/* Fila Superior: Prioridad y Acciones */}
                          <div className="flex items-center justify-between">
                            {getPriorityBadge(task.priority)}

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Mover hacia la izquierda */}
                              {col.id !== 'backlog' && (
                                <button
                                  onClick={() => moveTask(task.id, task.status, 'prev')}
                                  title="Mover a columna anterior"
                                  className="p-1 rounded bg-[#1e1f22] text-discord-text-muted hover:text-white hover:bg-discord-hover transition-colors"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Mover hacia la derecha */}
                              {col.id !== 'done' && (
                                <button
                                  onClick={() => moveTask(task.id, task.status, 'next')}
                                  title="Mover a columna siguiente"
                                  className="p-1 rounded bg-[#1e1f22] text-discord-text-muted hover:text-white hover:bg-discord-hover transition-colors"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Eliminar tarea */}
                              <button
                                onClick={() => deleteKanbanTask(activeChannelId, task.id)}
                                title="Eliminar tarea"
                                className="p-1 rounded bg-[#1e1f22] text-discord-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Título de la tarea */}
                          <h4 className="text-xs font-semibold text-discord-text-header leading-snug">
                            {task.title}
                          </h4>

                          {/* Descripción */}
                          {task.description && (
                            <p className="text-[11px] text-discord-text-muted line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Tags / Etiquetas */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1f22] text-discord-text-muted border border-[#35373c] flex items-center gap-0.5"
                                >
                                  <Tag className="w-2.5 h-2.5 text-discord-blurple" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Pie de la tarjeta: Asignado y Fecha */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#35373c]/40 text-[10px] text-discord-text-muted">
                            <div className="flex items-center gap-1.5">
                              {assignee ? (
                                <div
                                  className="flex items-center gap-1.5"
                                  title={`Asignado a: ${assignee.displayName}`}
                                >
                                  <img
                                    src={assignee.avatar}
                                    alt={assignee.displayName}
                                    className="w-4 h-4 rounded-full object-cover"
                                  />
                                  <span className="truncate max-w-[100px] text-discord-text-normal">
                                    {assignee.displayName}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <UserIcon className="w-3 h-3" />
                                  <span>Sin asignar</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-discord-text-muted" />
                              <span>
                                {new Date(task.createdAt).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Modal para Crear Nueva Tarea */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#2b2d31] rounded-2xl border border-[#35373c] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Cabecera del Modal */}
            <div className="px-5 py-4 border-b border-[#1f2023] flex items-center justify-between bg-[#232428]">
              <div className="flex items-center gap-2">
                <Kanban className="w-5 h-5 text-discord-blurple" />
                <h3 className="font-bold text-sm text-discord-text-header">Nueva Tarea Kanban</h3>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-discord-text-muted hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-[11px] font-bold text-discord-text-muted uppercase tracking-wider mb-1.5">
                  Título de la tarea <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Optimizar compresión de audio Opus"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1e1f22] text-xs text-discord-text-header p-2.5 rounded-lg border border-[#35373c] focus:outline-none focus:border-discord-blurple"
                  autoFocus
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-[11px] font-bold text-discord-text-muted uppercase tracking-wider mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre lo que se debe hacer..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#1e1f22] text-xs text-discord-text-header p-2.5 rounded-lg border border-[#35373c] focus:outline-none focus:border-discord-blurple resize-none"
                />
              </div>

              {/* Columna / Estado y Prioridad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-discord-text-muted uppercase tracking-wider mb-1.5">
                    Columna inicial
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as KanbanTask['status'])}
                    className="w-full bg-[#1e1f22] text-xs text-discord-text-header p-2 rounded-lg border border-[#35373c] focus:outline-none focus:border-discord-blurple cursor-pointer"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">Por Hacer</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="done">Terminado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-discord-text-muted uppercase tracking-wider mb-1.5">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as KanbanTask['priority'])}
                    className="w-full bg-[#1e1f22] text-xs text-discord-text-header p-2 rounded-lg border border-[#35373c] focus:outline-none focus:border-discord-blurple cursor-pointer"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Asignado */}
              <div>
                <label className="block text-[11px] font-bold text-discord-text-muted uppercase tracking-wider mb-1.5">
                  Asignar a
                </label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full bg-[#1e1f22] text-xs text-discord-text-header p-2 rounded-lg border border-[#35373c] focus:outline-none focus:border-discord-blurple cursor-pointer"
                >
                  {Object.values(users).map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.displayName} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Etiquetas */}
              <div>
                <label className="block text-[11px] font-bold text-discord-text-muted uppercase tracking-wider mb-1.5">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  placeholder="ej. Frontend, Bug, Audio, WebRTC"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  className="w-full bg-[#1e1f22] text-xs text-discord-text-header p-2.5 rounded-lg border border-[#35373c] focus:outline-none focus:border-discord-blurple"
                />
              </div>

              {/* Botones */}
              <div className="pt-3 flex justify-end gap-2 border-t border-[#1f2023]">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-discord-text-normal hover:bg-[#35373c] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-discord-blurple hover:bg-discord-blurple-hover text-white transition-colors shadow-md"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
