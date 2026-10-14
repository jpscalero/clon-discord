import React from 'react';
import { useChatStore } from './store/useChatStore';
import { GlobalTopNav } from './components/layout/GlobalTopNav';
import { ServerSidebar } from './components/layout/ServerSidebar';
import { ChannelSidebar } from './components/layout/ChannelSidebar';
import { ChatArea } from './components/chat/ChatArea';
import { VoiceRoomGrid } from './components/voice/VoiceRoomGrid';
import { MemberList } from './components/members/MemberList';
import { KanbanBoardView } from './components/views/KanbanBoardView';
import { MediaVaultView } from './components/views/MediaVaultView';
import { WhiteboardView } from './components/views/WhiteboardView';
import { CodeStudioView } from './components/views/CodeStudioView';
import { ChannelWikiView } from './components/views/ChannelWikiView';
import { StageChannelView } from './components/views/StageChannelView';
import { EventsCalendarView } from './components/views/EventsCalendarView';
import { MapVetoView } from './components/views/MapVetoView';
import { ScrimsMatchView } from './components/views/ScrimsMatchView';
import { ThreadDrawer } from './components/views/ThreadDrawer';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { VoiceStudioHUD } from './components/voice/VoiceStudioHUD';
import { SoundboardModal } from './components/voice/SoundboardModal';
import { GamingOverlayHUD } from './components/voice/GamingOverlayHUD';
import { UserProfilePopover } from './components/popovers/UserProfilePopover';
import { CommandPalette } from './components/modals/CommandPalette';
import { UserSettingsModal } from './components/modals/UserSettingsModal';
import { ServerSettingsModal } from './components/modals/ServerSettingsModal';
import { CreateChannelModal } from './components/modals/CreateChannelModal';
import { CreateServerModal } from './components/modals/CreateServerModal';
import { CreatePollModal } from './components/modals/CreatePollModal';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { WorkflowBuilderModal } from './components/modals/WorkflowBuilderModal';
import { E2EESafetyModal } from './components/modals/E2EESafetyModal';
import { Eye } from 'lucide-react';

export const App: React.FC = () => {
  const {
    guilds,
    activeGuildId,
    activeChannelId,
    currentViewMode,
    activeThreadMessageId,
    isAIAssistantOpen,
    settings,
    zenMode,
    toggleZenMode,
  } = useChatStore();

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === activeChannelId);

  const isVoiceView = currentChannel?.type === 'voice';

  // Dynamic Theme Styling
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'midnight':
        return 'bg-[#000000] text-[#dbdee1]';
      case 'light':
        return 'bg-[#ffffff] text-[#313338]';
      case 'cyberpunk':
        return 'bg-[#0d0f18] text-[#00f0ff]';
      case 'nord':
        return 'bg-[#242933] text-[#eceff4]';
      case 'dracula':
        return 'bg-[#1e1f29] text-[#f8f8f2]';
      case 'dark':
      default:
        return 'bg-[#1e1f22] text-[#dbdee1]';
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden select-none font-sans ${getThemeClasses()}`}
    >
      {/* 1. Barra de Navegación Omnibox Global Superior */}
      <GlobalTopNav />

      {/* Floating Zen Mode Exit Pill when Zen Mode is Active */}
      {zenMode && (
        <div className="absolute top-14 right-6 z-40">
          <button
            onClick={toggleZenMode}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#fee75c] text-black font-bold text-xs rounded-full shadow-2xl hover:bg-[#edd44c] transition animate-bounce"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Salir del Modo Zen</span>
          </button>
        </div>
      )}

      {/* 2. Cuerpo Principal de la Aplicación */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Barra de Servidores (Oculta en Modo Zen) */}
        {!zenMode && <ServerSidebar />}

        {/* Barra de Canales y Perfil Inferior (Oculta en Modo Zen) */}
        {!zenMode && <ChannelSidebar />}

        {/* Área Central Multipantalla y Multivista */}
        <main className="flex-1 flex min-w-0 overflow-hidden relative bg-[#0b0e14]">
          {isVoiceView ? (
            <VoiceRoomGrid />
          ) : (
            <div className="flex-1 flex min-w-0 overflow-hidden">
              {/* Vistas Pro del Canal Activo */}
              {currentViewMode === 'chat' && <ChatArea />}
              {currentViewMode === 'kanban' && <KanbanBoardView />}
              {currentViewMode === 'vault' && <MediaVaultView />}
              {currentViewMode === 'whiteboard' && <WhiteboardView />}
              {currentViewMode === 'code' && <CodeStudioView />}
              {currentViewMode === 'wiki' && <ChannelWikiView />}
              {currentViewMode === 'stage' && <StageChannelView />}
              {currentViewMode === 'calendar' && <EventsCalendarView />}
              {currentViewMode === 'veto' && <MapVetoView />}
              {currentViewMode === 'scrims' && <ScrimsMatchView />}

              {/* Panel Lateral Dividido de Hilo (Split-View Thread) */}
              {activeThreadMessageId && <ThreadDrawer />}

              {/* Copiloto de Inteligencia Artificial */}
              {isAIAssistantOpen && <AIAssistantDrawer />}

              {/* Lista de Miembros del Servidor (sólo en modo Chat normal) */}
              {!zenMode &&
                !activeThreadMessageId &&
                !isAIAssistantOpen &&
                currentViewMode === 'chat' && <MemberList />}
            </div>
          )}
        </main>
      </div>

      {/* 3. Voice Studio HUD Flotante (Espectrograma en vivo, Bitrate selector y métricas) */}
      <VoiceStudioHUD />

      {/* 4. In-Game Esports Overlay HUD */}
      <GamingOverlayHUD />

      {/* 5. Modales y Popovers Globales */}
      <SoundboardModal />
      <UserProfilePopover />
      <CommandPalette />
      <UserSettingsModal />
      <ServerSettingsModal />
      <CreateChannelModal />
      <CreateServerModal />
      <CreatePollModal />
      <CreateEventModal />
      <WorkflowBuilderModal />
      <E2EESafetyModal />
    </div>
  );
};

export default App;
