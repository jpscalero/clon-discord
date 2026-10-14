import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { DiscordMarkdown } from '../../utils/markdownParser';
import {
  Sparkles,
  X,
  FileText,
  ListTodo,
  Megaphone,
  Copy,
  Check,
  Send,
  Bot,
  RefreshCw,
  Share2,
  Cpu,
  CornerDownLeft,
} from 'lucide-react';

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAIAssistantOpen,
    toggleAIAssistant,
    activeChannelId,
    activeGuildId,
    guilds,
    messages,
    users,
    currentUser,
    sendMessage,
  } = useChatStore();

  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [activeActionTitle, setActiveActionTitle] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  if (!isAIAssistantOpen) {
    return null;
  }

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === activeChannelId);
  const channelMessages = messages[activeChannelId] || [];

  // Función para simular respuesta inteligente basada en mensajes reales
  const generateAnalysis = (type: 'summary' | 'tasks' | 'announcement' | 'custom', customQuery?: string) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setIsCopied(false);
    setIsPublished(false);

    const messageCount = channelMessages.length;
    const authors = Array.from(
      new Set(channelMessages.map((m) => users[m.authorId]?.displayName || m.authorId))
    );
    const messagesExcerpt = channelMessages
      .map((m) => `• ${users[m.authorId]?.displayName || 'Usuario'}: "${m.content.slice(0, 100)}"`)
      .join('\n');

    setTimeout(() => {
      let result = '';

      if (type === 'summary') {
        setActiveActionTitle('Resumen Ejecutivo del Canal');
        result = `### 📋 Resumen Ejecutivo de #${currentChannel?.name || 'canal'}

**Participantes activos:** ${authors.length > 0 ? authors.join(', ') : 'Ninguno registrado aún'}
**Total de mensajes analizados:** ${messageCount} mensajes recientes

#### 💡 Puntos Clave y Decisiones:
1. **Lanzamiento y Arquitectura:** La comunidad celebra el despliegue del nuevo cliente *Discord Clone Pro*, destacando la arquitectura de latencia ultra-baja y la ausencia de telemetría y límites artificiales.
2. **Capacidades Técnicas:** Se verificó el funcionamiento del generador de identificadores Snowflake de 64 bits y el parseo nativo de Markdown con bloques de código y spoilers interactivos.
3. **Calidad de Voz y Audio:** Se validó el procesamiento de audio con detección de actividad de voz (VAD) por histéresis y rampas suaves para evitar chasquidos en llamadas RTC.

> *Conclusión:* El canal mantiene una dinámica técnica de alto rendimiento enfocada en optimización y arquitectura frontend moderna.`;
      } else if (type === 'tasks') {
        setActiveActionTitle('Compromisos y Tareas Detectadas');
        result = `### ✅ Compromisos y Tareas Identificadas en #${currentChannel?.name || 'canal'}

Analizando los acuerdos conversacionales del equipo:

* [ ] **[Alta Prioridad]** Verificar rendimiento del generador Snowflake en picos de 4096 IDs/ms. — *Responsable sugerido: Sarah Connor*
* [ ] **[Media Prioridad]** Evaluar códec Opus a 384kbps Hi-Fi para canales musicales. — *Responsable sugerido: Lucas Beat*
* [ ] **[Seguridad]** Mantener pruebas del ratcheting MLS DAVE en WebRTC para asegurar E2EE. — *Responsable sugerido: JP (Lead Dev)*
* [ ] **[UI/UX]** Confirmar accesibilidad de contraste en temas Midnight y Dark. — *Responsable sugerido: Elena UI/UX*

💡 *Consejo:* Puedes trasladar estas tarjetas directamente al Tablero Kanban del canal con un solo clic.`;
      } else if (type === 'announcement') {
        setActiveActionTitle('Comunicado Formal para la Comunidad');
        result = `### 📢 Comunicado Oficial: Avances del Servidor

**Estimada comunidad de ${currentGuild?.name || 'nuestro servidor'}:**

Nos entusiasma compartir los hitos logrados en nuestras sesiones recientes de trabajo en el canal **#${currentChannel?.name || 'general'}**:

✨ **Novedades Destacadas:**
• Hemos desplegado mejoras críticas de rendimiento en tiempo real y compatibilidad con React 19.
• Las salas de voz cuentan ahora con cancelación adaptativa y control de ganancia de grado profesional.
• Todas las funciones avanzadas están abiertas sin suscripciones de pago.

Agradecemos profundamente el compromiso y retroalimentación de nuestros miembros: **${authors.slice(0, 3).join(', ')}** y equipo general.

¡Sigamos construyendo juntos el mejor espacio de comunicación! 🚀`;
      } else {
        setActiveActionTitle(`Consulta: "${customQuery}"`);
        result = `### 🤖 Respuesta del Copiloto IA

Analizando la consulta: *"${customQuery}"* en el contexto de **#${currentChannel?.name || 'canal'}**:

Basado en los **${messageCount} mensajes** del canal:
• La conversación trata primordialmente sobre el desarrollo del sistema, protocolos de audio en tiempo real y componentes de interfaz.
• **Participantes relevantes:** ${authors.join(', ')}.
• **Fragmentos coincidentes en la conversación:**
${messagesExcerpt || 'No hay mensajes previos en este canal.'}

¿Deseas que profundice en algún punto o prepare un informe para el equipo?`;
      }

      setGeneratedContent(result);
      setIsGenerating(false);
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    const query = promptInput.trim();
    setPromptInput('');
    generateAnalysis('custom', query);
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const publishToChannel = () => {
    if (!generatedContent) return;
    sendMessage(activeChannelId, generatedContent);
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 2500);
  };

  return (
    <aside
      aria-label="Copiloto de Inteligencia Artificial"
      className="w-96 lg:w-[440px] flex-shrink-0 h-full bg-[#232428]/95 backdrop-blur-xl border-l border-[#35373c] flex flex-col z-30 shadow-2xl select-text animate-in slide-in-from-right duration-200"
    >
      {/* 1. Cabecera del Copiloto */}
      <header className="h-12 px-4 border-b border-[#35373c] bg-[#1e1f22] flex items-center justify-between select-none flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-discord-blurple to-indigo-400 text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-discord-text-header">Copiloto IA Discord Pro</h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-discord-blurple/20 text-discord-blurple font-semibold uppercase tracking-wider border border-discord-blurple/30">
                GPT-4o Context
              </span>
            </div>
            <span className="text-[10px] text-discord-text-muted truncate">
              Analizando #{currentChannel?.name || 'canal activo'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleAIAssistant}
          className="p-1.5 text-discord-text-muted hover:text-white hover:bg-discord-hover rounded transition-colors"
          title="Cerrar Copiloto"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* 2. Cuerpo del Copiloto */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Banner de Bienvenida y Estado */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#1e1f22] to-[#2b2d31] border border-[#35373c] shadow-sm select-none">
          <div className="flex items-center gap-2 text-xs font-semibold text-discord-text-header mb-1">
            <Cpu className="w-4 h-4 text-discord-blurple" />
            <span>Asistente Contextual en Tiempo Real</span>
          </div>
          <p className="text-[11px] text-discord-text-muted leading-relaxed">
            Este copiloto analiza automáticamente los mensajes compartidos en el canal para extraer
            conclusiones, minutas ejecutivas y detectar compromisos de trabajo al instante.
          </p>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="space-y-2 select-none">
          <span className="text-[10px] font-bold text-discord-text-muted uppercase tracking-wider block">
            Acciones Rápidas del Canal
          </span>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => generateAnalysis('summary')}
              disabled={isGenerating}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#2b2d31] hover:bg-[#313338] border border-[#35373c]/70 hover:border-discord-blurple transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-semibold text-discord-text-header group-hover:text-white">
                  Resumir conversación del canal
                </span>
                <span className="block text-[10px] text-discord-text-muted">
                  Sintetiza acuerdos y temas clave de la charla
                </span>
              </div>
            </button>

            <button
              onClick={() => generateAnalysis('tasks')}
              disabled={isGenerating}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#2b2d31] hover:bg-[#313338] border border-[#35373c]/70 hover:border-discord-blurple transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <ListTodo className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-semibold text-discord-text-header group-hover:text-white">
                  Detectar compromisos y tareas
                </span>
                <span className="block text-[10px] text-discord-text-muted">
                  Extrae pendientes y responsables sugeridos
                </span>
              </div>
            </button>

            <button
              onClick={() => generateAnalysis('announcement')}
              disabled={isGenerating}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#2b2d31] hover:bg-[#313338] border border-[#35373c]/70 hover:border-discord-blurple transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-semibold text-discord-text-header group-hover:text-white">
                  Redactar comunicado formal
                </span>
                <span className="block text-[10px] text-discord-text-muted">
                  Genera un anuncio listo para la comunidad
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Estado de Generación */}
        {isGenerating && (
          <div className="p-6 rounded-xl bg-[#1e1f22] border border-[#35373c] text-center select-none animate-pulse">
            <Bot className="w-8 h-8 text-discord-blurple mx-auto mb-2 animate-bounce" />
            <h4 className="text-xs font-bold text-discord-text-header">
              Analizando mensajes del canal...
            </h4>
            <p className="text-[10px] text-discord-text-muted mt-1">
              Sintetizando contexto y generando respuesta inteligente
            </p>
          </div>
        )}

        {/* Resultado Generado */}
        {generatedContent && !isGenerating && (
          <div className="rounded-xl bg-[#1e1f22] border border-[#35373c] overflow-hidden shadow-lg animate-in fade-in duration-200">
            {/* Cabecera del Resultado */}
            <div className="px-3.5 py-2.5 bg-[#2b2d31] border-b border-[#35373c] flex items-center justify-between select-none">
              <span className="text-[11px] font-bold text-discord-text-header truncate">
                {activeActionTitle || 'Resultado'}
              </span>

              <div className="flex items-center gap-1.5">
                {/* Botón Copiar */}
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-[#1e1f22] hover:bg-discord-hover text-discord-text-normal hover:text-white transition-colors"
                  title="Copiar al portapapeles"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-discord-green" />
                      <span className="text-discord-green">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                {/* Botón Publicar en el Canal */}
                <button
                  onClick={publishToChannel}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-discord-blurple hover:bg-discord-blurple-hover text-white transition-colors"
                  title="Enviar este resumen como mensaje al canal"
                >
                  {isPublished ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Enviado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Enviar al chat</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Contenido en Markdown */}
            <div className="p-4 text-xs text-discord-text-normal leading-relaxed overflow-x-auto">
              <DiscordMarkdown
                content={generatedContent}
                getUserName={(id) => users[id]?.displayName || id}
                getChannelName={(id) =>
                  currentGuild?.channels.find((c) => c.id === id)?.name || id
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Input de Consulta Personalizada al Copiloto */}
      <footer className="p-3 bg-[#1e1f22] border-t border-[#35373c] flex-shrink-0 select-none">
        <form onSubmit={handleCustomSubmit} className="relative flex items-center">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Pregunta algo sobre este canal..."
            disabled={isGenerating}
            className="w-full bg-[#2b2d31] text-xs text-discord-text-header placeholder-discord-text-muted pl-3 pr-9 py-2.5 rounded-lg border border-[#35373c] focus:outline-none focus:border-discord-blurple disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!promptInput.trim() || isGenerating}
            className="absolute right-2 p-1 text-discord-text-muted hover:text-discord-blurple disabled:opacity-40 transition-colors"
            title="Enviar consulta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </aside>
  );
};
