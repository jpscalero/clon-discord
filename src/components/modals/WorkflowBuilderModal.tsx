import React, { useState } from 'react';
import {
  X,
  Workflow,
  Zap,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Bot,
  Webhook,
  Sparkles,
  GitPullRequest,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { WorkflowRule } from '../../types';

export const WorkflowBuilderModal: React.FC = () => {
  const {
    isWorkflowBuilderOpen,
    setModalPro,
    workflows,
    addWorkflow,
    toggleWorkflow,
    deleteWorkflow,
    activeGuildId,
    guilds,
  } = useChatStore();

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const channels = currentGuild?.channels || [];

  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<WorkflowRule['trigger']>('member_join');
  const [action, setAction] = useState<WorkflowRule['action']>('send_welcome');
  const [targetChannelId, setTargetChannelId] = useState(channels[0]?.id || '');

  if (!isWorkflowBuilderOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addWorkflow({
      guildId: activeGuildId,
      name: name.trim(),
      trigger,
      action,
      targetChannelId: targetChannelId || undefined,
      isEnabled: true,
    });

    setName('');
  };

  const getTriggerLabel = (trig: WorkflowRule['trigger']) => {
    switch (trig) {
      case 'member_join':
        return { label: 'Nuevo Miembro Entra al Servidor', icon: UserPlus, color: 'text-[#23a55a]' };
      case 'message_contains':
        return { label: 'Mensaje Contiene Palabra Clave', icon: Bot, color: 'text-[#fee75c]' };
      case 'github_webhook':
        return { label: 'GitHub Webhook (Push / PR)', icon: GitPullRequest, color: 'text-[#5865f2]' };
      case 'role_assigned':
        return { label: 'Rol Asignado a Usuario', icon: Sparkles, color: 'text-[#eb459e]' };
    }
  };

  const getActionLabel = (act: WorkflowRule['action']) => {
    switch (act) {
      case 'send_welcome':
        return 'Enviar Mensaje de Bienvenida Automatizado';
      case 'assign_role':
        return 'Auto-Asignar Rol Inicial (@Comunidad)';
      case 'post_embed':
        return 'Publicar Notificación Embed Enriquecida';
      case 'notify_mods':
        return 'Alertar a Moderadores por Actividad';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#313338] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#3f4147] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-[#2b2d31] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Estudio de Automatizaciones y Webhooks</h2>
              <p className="text-xs text-[#949ba4]">Construye reglas reactivas y bots sin programar</p>
            </div>
          </div>
          <button
            onClick={() => setModalPro('workflow', false)}
            className="p-1.5 text-[#949ba4] hover:text-white rounded-lg hover:bg-[#35373c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Workflows List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-3">
              REGLAS ACTIVAS ({workflows.length})
            </h3>

            <div className="space-y-3">
              {workflows.map((wf) => {
                const triggerInfo = getTriggerLabel(wf.trigger);
                const TriggerIcon = triggerInfo.icon;

                return (
                  <div
                    key={wf.id}
                    className={`bg-[#2b2d31] rounded-2xl p-4 border transition flex items-center justify-between shadow ${
                      wf.isEnabled ? 'border-[#35373c]' : 'border-[#35373c]/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Trigger Pill */}
                      <div className="flex items-center gap-2 bg-[#1e1f22] px-3 py-2 rounded-xl border border-[#3f4147]">
                        <TriggerIcon className={`w-4 h-4 ${triggerInfo.color}`} />
                        <span className="text-xs font-semibold text-white">{wf.name}</span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#5865f2] shrink-0" />

                      {/* Action Pill */}
                      <div className="text-xs text-[#dbdee1] font-medium bg-[#1e1f22]/70 px-3 py-2 rounded-xl border border-[#3f4147]/60">
                        {getActionLabel(wf.action)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => toggleWorkflow(wf.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          wf.isEnabled
                            ? 'bg-[#23a55a]/20 text-[#23a55a] hover:bg-[#23a55a]/30'
                            : 'bg-[#35373c] text-[#80848e] hover:text-white'
                        }`}
                      >
                        {wf.isEnabled ? 'Activo' : 'Pausado'}
                      </button>

                      <button
                        onClick={() => deleteWorkflow(wf.id)}
                        className="p-1.5 text-[#949ba4] hover:text-[#da373c] rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create New Workflow Builder */}
          <div className="pt-4 border-t border-[#35373c]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#5865f2]" />
              CREAR NUEVO WORKFLOW
            </h3>

            <form onSubmit={handleAdd} className="space-y-4 bg-[#2b2d31]/50 p-5 rounded-2xl border border-[#35373c]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-1.5">
                  Nombre de la Automatización
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Auto-bienvenida a Nuevos Usuarios"
                  required
                  className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-1.5">
                    1. Cuando Sucede (Disparador)
                  </label>
                  <select
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value as any)}
                    className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
                  >
                    <option value="member_join">Nuevo Miembro Entra</option>
                    <option value="github_webhook">Webhook de GitHub (Push / PR)</option>
                    <option value="message_contains">Mensaje con Palabra Clave</option>
                    <option value="role_assigned">Rol Asignado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-1.5">
                    2. Ejecutar Acción
                  </label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value as any)}
                    className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
                  >
                    <option value="send_welcome">Enviar Mensaje de Bienvenida</option>
                    <option value="assign_role">Auto-Asignar Rol</option>
                    <option value="post_embed">Publicar Embed Informativo</option>
                    <option value="notify_mods">Alertar a Moderadores</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-1.5">
                  Canal de Destino
                </label>
                <select
                  value={targetChannelId}
                  onChange={(e) => setTargetChannelId(e.target.value)}
                  className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  Guardar Automatización
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
