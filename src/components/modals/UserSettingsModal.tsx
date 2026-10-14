import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Sliders,
  Volume2,
  Shield,
  Palette,
  Mic,
  Monitor,
  Check,
  Sparkles,
  Lock,
  Radio,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { audioEngine } from '../../services/audioEngine';

type Tab = 'profile' | 'voice' | 'appearance' | 'security';

export const UserSettingsModal: React.FC = () => {
  const {
    isUserSettingsOpen,
    closeModals,
    currentUser,
    settings,
    updateSettings,
    setUserStatus,
  } = useChatStore();

  const [activeTab, setActiveTab] = useState<Tab>('voice');
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  // Form states para perfil
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [bannerColor, setBannerColor] = useState(currentUser.bannerColor || '#5865f2');
  const [customStatus, setCustomStatus] = useState(currentUser.customStatus || '');

  useEffect(() => {
    if (isUserSettingsOpen) {
      setDisplayName(currentUser.displayName);
      setBio(currentUser.bio || '');
      setBannerColor(currentUser.bannerColor || '#5865f2');
      setCustomStatus(currentUser.customStatus || '');
    } else {
      if (isMicTesting) {
        audioEngine.stop();
        setIsMicTesting(false);
      }
    }
  }, [isUserSettingsOpen, currentUser]);

  const toggleMicTest = async () => {
    if (isMicTesting) {
      audioEngine.stop();
      setIsMicTesting(false);
      setMicLevel(0);
    } else {
      const started = await audioEngine.start((energy: number, _isSpeaking: boolean) => {
        // Normalizar energía para el VU meter (0 a 100%)
        const pct = Math.min(100, Math.max(0, (energy + 80) * 1.5));
        setMicLevel(pct);
      });
      if (started) {
        setIsMicTesting(true);
      }
    }
  };

  const handleSaveProfile = () => {
    useChatStore.setState((state) => ({
      currentUser: {
        ...state.currentUser,
        displayName,
        bio,
        bannerColor,
        customStatus,
      },
      users: {
        ...state.users,
        [currentUser.id]: {
          ...state.users[currentUser.id],
          displayName,
          bio,
          bannerColor,
          customStatus,
        },
      },
    }));
  };

  if (!isUserSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-[#313338] animate-fade-in text-[#dbdee1]">
      {/* Barra lateral de navegación izquierda */}
      <div className="w-60 bg-[#2b2d31] flex flex-col items-end py-14 pr-6 pl-8 flex-shrink-0 select-none border-r border-[#202225]/40">
        <div className="w-48 space-y-6">
          <div>
            <h4 className="text-[11px] font-bold text-[#949ba4] uppercase tracking-wider mb-2 px-2">
              Ajustes de Usuario
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition ${
                  activeTab === 'profile'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                }`}
              >
                <User className="w-4 h-4" />
                Perfil de Usuario
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#949ba4] uppercase tracking-wider mb-2 px-2">
              Ajustes de la App
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('voice')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition ${
                  activeTab === 'voice'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Voz y Vídeo
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition ${
                  activeTab === 'appearance'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                }`}
              >
                <Palette className="w-4 h-4" />
                Apariencia
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition ${
                  activeTab === 'security'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                }`}
              >
                <Shield className="w-4 h-4 text-discord-green" />
                Seguridad y Privacidad
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#35373c]">
            <span className="text-[11px] text-[#949ba4] block px-2">
              Discord Pro Clone v1.0.0
            </span>
            <span className="text-[10px] text-[#23a55a] font-mono block px-2">
              WebAudio Schmitt VAD OK
            </span>
          </div>
        </div>
      </div>

      {/* Contenido principal central */}
      <div className="flex-1 py-14 px-10 overflow-y-auto custom-scrollbar max-w-3xl">
        {/* Pestaña: Perfil de Usuario */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Perfil de Usuario</h2>

            {/* Vista previa de tarjeta */}
            <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#35373c]/60 max-w-sm mb-6">
              <div
                className="h-20 rounded-lg relative mb-8"
                style={{ backgroundColor: bannerColor }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-16 h-16 rounded-full border-4 border-[#1e1f22] absolute -bottom-8 left-4 object-cover"
                />
              </div>
              <h3 className="text-white font-bold text-base">{displayName}</h3>
              <p className="text-xs text-[#949ba4]">@{currentUser.username}</p>
              {customStatus && (
                <p className="text-xs text-[#dbdee1] mt-2 italic bg-[#2b2d31] p-1.5 rounded">
                  {customStatus}
                </p>
              )}
            </div>

            {/* Campos de edición */}
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Nombre para mostrar
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Estado Personalizado
                </label>
                <input
                  type="text"
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  placeholder="¿Qué estás tramando?"
                  className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Color del Banner (Hexadecimal)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={bannerColor}
                    onChange={(e) => setBannerColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-[#35373c] bg-transparent"
                  />
                  <input
                    type="text"
                    value={bannerColor}
                    onChange={(e) => setBannerColor(e.target.value)}
                    className="w-32 bg-[#1e1f22] text-sm text-white px-3 py-2 rounded-lg outline-none border border-[#35373c] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Sobre Mí
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntale un poco de ti a la comunidad..."
                  className="w-full bg-[#1e1f22] text-sm text-white p-3 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple resize-none"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="bg-discord-blurple hover:bg-[#4752c4] text-white px-5 py-2 rounded-lg font-semibold text-sm transition shadow"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

        {/* Pestaña: Voz y Vídeo */}
        {activeTab === 'voice' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Ajustes de Voz y Vídeo</h2>

            {/* Entrada y Salida */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Dispositivo de Entrada
                </label>
                <select className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple cursor-pointer">
                  <option>Micrófono Predeterminado del Sistema</option>
                  <option>Micrófono USB Profesional (Condensador)</option>
                  <option>Entrada de línea auxiliar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Dispositivo de Salida
                </label>
                <select className="w-full bg-[#1e1f22] text-sm text-white px-3 py-2.5 rounded-lg outline-none border border-[#35373c] focus:border-discord-blurple cursor-pointer">
                  <option>Altavoces / Auriculares Predeterminados</option>
                  <option>Salida digital (S/PDIF)</option>
                </select>
              </div>
            </div>

            {/* Sliders de Volumen */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#b5bac1] uppercase mb-1">
                  <span>Volumen de entrada</span>
                  <span>{settings.inputVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.inputVolume}
                  onChange={(e) => updateSettings({ inputVolume: Number(e.target.value) })}
                  className="w-full accent-discord-blurple"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#b5bac1] uppercase mb-1">
                  <span>Volumen de salida</span>
                  <span>{settings.outputVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.outputVolume}
                  onChange={(e) => updateSettings({ outputVolume: Number(e.target.value) })}
                  className="w-full accent-discord-blurple"
                />
              </div>
            </div>

            {/* Test de Micrófono Interactivo con VU Meter */}
            <div className="bg-[#2b2d31] p-5 rounded-xl border border-[#35373c] space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Prueba de Micrófono</h4>
                <p className="text-xs text-[#949ba4]">
                  Comprueba si tu micrófono capta tu voz y verifica el detector VAD sin chasquidos.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMicTest}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isMicTesting
                      ? 'bg-discord-red hover:bg-[#a1282c] text-white shadow'
                      : 'bg-discord-blurple hover:bg-[#4752c4] text-white shadow'
                  }`}
                >
                  {isMicTesting ? 'Detener Prueba' : 'Comprobemos'}
                </button>

                {/* Barra de nivel VU */}
                <div className="flex-1 bg-[#1e1f22] h-4 rounded-full overflow-hidden p-0.5 border border-[#35373c] relative">
                  <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                      width: `${micLevel}%`,
                      backgroundColor:
                        micLevel > 80
                          ? '#da373c'
                          : micLevel > 40
                          ? '#23a55a'
                          : '#5865f2',
                    }}
                  />
                  {/* Línea de umbral VAD (-40dB) */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
                    style={{ left: '45%' }}
                    title="Umbral de activación vocal (Schmitt Trigger)"
                  />
                </div>
              </div>
            </div>

            {/* Procesamiento Avanzado de Audio */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider">
                Avanzado (Web Audio & DSP)
              </h4>

              <div className="flex items-center justify-between p-3 bg-[#1e1f22] rounded-lg border border-[#35373c]">
                <div>
                  <h5 className="text-sm font-semibold text-white">Supresión de Ruido (Krisp / RNNoise)</h5>
                  <p className="text-xs text-[#949ba4]">Filtra el ruido de fondo mediante redes neuronales en WASM.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.noiseSuppression}
                  onChange={(e) => updateSettings({ noiseSuppression: e.target.checked })}
                  className="w-5 h-5 accent-discord-blurple cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1e1f22] rounded-lg border border-[#35373c]">
                <div>
                  <h5 className="text-sm font-semibold text-white">Cancelación de Eco Acústico (AEC)</h5>
                  <p className="text-xs text-[#949ba4]">Evita que los demás escuchen el audio que sale de tus altavoces.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.echoCancellation}
                  onChange={(e) => updateSettings({ echoCancellation: e.target.checked })}
                  className="w-5 h-5 accent-discord-blurple cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1e1f22] rounded-lg border border-[#35373c]">
                <div>
                  <h5 className="text-sm font-semibold text-white">Control Automático de Ganancia (AGC)</h5>
                  <p className="text-xs text-[#949ba4]">Nivela automáticamente susurros o gritos para mantener volumen constante.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoGainControl}
                  onChange={(e) => updateSettings({ autoGainControl: e.target.checked })}
                  className="w-5 h-5 accent-discord-blurple cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Apariencia */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Apariencia</h2>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
                Tema de Interfaz
              </label>

              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`p-4 rounded-xl border text-left transition ${
                    settings.theme === 'dark'
                      ? 'border-discord-blurple bg-[#2b2d31] shadow-lg ring-2 ring-discord-blurple/40'
                      : 'border-[#35373c] bg-[#1e1f22] hover:bg-[#2b2d31]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#313338] border border-[#404249] mb-3 flex items-center justify-center">
                    🌙
                  </div>
                  <h4 className="text-sm font-bold text-white">Oscuro</h4>
                  <p className="text-xs text-[#949ba4]">El clásico tema de Discord.</p>
                </button>

                <button
                  onClick={() => updateSettings({ theme: 'midnight' })}
                  className={`p-4 rounded-xl border text-left transition ${
                    settings.theme === 'midnight'
                      ? 'border-discord-blurple bg-[#111214] shadow-lg ring-2 ring-discord-blurple/40'
                      : 'border-[#35373c] bg-[#0c0d0e] hover:bg-[#111214]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-black border border-[#2b2d31] mb-3 flex items-center justify-center">
                    🌌
                  </div>
                  <h4 className="text-sm font-bold text-white">Medianoche (OLED)</h4>
                  <p className="text-xs text-[#949ba4]">Negro puro para OLED.</p>
                </button>

                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`p-4 rounded-xl border text-left transition ${
                    settings.theme === 'light'
                      ? 'border-discord-blurple bg-[#ffffff] text-black shadow-lg ring-2 ring-discord-blurple/40'
                      : 'border-[#35373c] bg-[#f2f3f5] text-black/80 hover:bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-400 mb-3 flex items-center justify-center">
                    ☀️
                  </div>
                  <h4 className="text-sm font-bold text-black">Claro</h4>
                  <p className="text-xs text-black/60">Contraste diurno.</p>
                </button>

                <button
                  onClick={() => updateSettings({ theme: 'cyberpunk' })}
                  className={`p-4 rounded-xl border text-left transition ${
                    settings.theme === 'cyberpunk'
                      ? 'border-[#00f0ff] bg-[#0d0f18] shadow-lg ring-2 ring-[#00f0ff]/40'
                      : 'border-[#35373c] bg-[#12131f] hover:bg-[#181928]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#ff0055] mb-3 flex items-center justify-center text-white">
                    ⚡
                  </div>
                  <h4 className="text-sm font-bold text-[#00f0ff]">Cyberpunk 2077</h4>
                  <p className="text-xs text-[#ff0055]">Neón cian y acentos vibrantes.</p>
                </button>

                <button
                  onClick={() => updateSettings({ theme: 'nord' })}
                  className={`p-4 rounded-xl border text-left transition ${
                    settings.theme === 'nord'
                      ? 'border-[#88c0d0] bg-[#2e3440] shadow-lg ring-2 ring-[#88c0d0]/40'
                      : 'border-[#35373c] bg-[#242933] hover:bg-[#2e3440]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#88c0d0] mb-3 flex items-center justify-center text-slate-900">
                    ❄️
                  </div>
                  <h4 className="text-sm font-bold text-[#eceff4]">Nordic Frost</h4>
                  <p className="text-xs text-[#81a1c1]">Paleta ártica relajante.</p>
                </button>

                <button
                  onClick={() => updateSettings({ theme: 'dracula' })}
                  className={`p-4 rounded-xl border text-left transition ${
                    settings.theme === 'dracula'
                      ? 'border-[#bd93f9] bg-[#282a36] shadow-lg ring-2 ring-[#bd93f9]/40'
                      : 'border-[#35373c] bg-[#1e1f29] hover:bg-[#282a36]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#bd93f9] mb-3 flex items-center justify-center text-slate-900">
                    🧛
                  </div>
                  <h4 className="text-sm font-bold text-[#ff79c6]">Dracula Pro</h4>
                  <p className="text-xs text-[#bd93f9]">Elegancia gótica para devs.</p>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#35373c] space-y-4">
              <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
                Visualización de Mensajes
              </label>

              <div className="flex gap-4">
                <button
                  onClick={() => updateSettings({ compactMode: false })}
                  className={`flex-1 p-3 rounded-lg border text-left transition ${
                    !settings.compactMode
                      ? 'border-discord-blurple bg-[#2b2d31]'
                      : 'border-[#35373c] bg-[#1e1f22]'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white">Cómodo</h4>
                  <p className="text-xs text-[#949ba4]">Muestra avatares grandes y espaciado acogedor.</p>
                </button>

                <button
                  onClick={() => updateSettings({ compactMode: true })}
                  className={`flex-1 p-3 rounded-lg border text-left transition ${
                    settings.compactMode
                      ? 'border-discord-blurple bg-[#2b2d31]'
                      : 'border-[#35373c] bg-[#1e1f22]'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white">Compacto</h4>
                  <p className="text-xs text-[#949ba4]">Ajusta más texto en pantalla tipo IRC.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Seguridad y Privacidad */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Seguridad y Privacidad</h2>

            <div className="bg-[#23a55a]/10 border border-[#23a55a]/30 p-4 rounded-xl flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#23a55a] flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#23a55a]">Protección de Grado Militar Activa</h4>
                <p className="text-xs text-[#dbdee1]">
                  Tu conexión está blindada contra fugas de IP en WebRTC, Canary Tokens y ataques XSS.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1e1f22] rounded-xl border border-[#35373c]">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-white">Blindaje WebRTC IP Leak (SFU Relay)</h5>
                    <span className="text-[10px] bg-discord-blurple/30 text-discord-blurple font-bold px-1.5 py-0.5 rounded">
                      RECOMENDADO
                    </span>
                  </div>
                  <p className="text-xs text-[#949ba4] mt-1">
                    Fuerza a que todo el tráfico de voz y vídeo pase a través del servidor SFU y desactiva candidatos mDNS/host locales, impidiendo que nadie descubra tu IP real.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="w-5 h-5 accent-discord-green cursor-default"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#1e1f22] rounded-xl border border-[#35373c]">
                <div className="pr-4">
                  <h5 className="text-sm font-bold text-white">Proxy Seguro de Imágenes (Camo Proxy)</h5>
                  <p className="text-xs text-[#949ba4] mt-1">
                    Todas las imágenes externas son descargadas a través de nuestro proxy servidor con Content-Security-Policy estricta, bloqueando balizas de rastreo y grabadores de IP.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="w-5 h-5 accent-discord-green cursor-default"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#1e1f22] rounded-xl border border-[#35373c]">
                <div className="pr-4">
                  <h5 className="text-sm font-bold text-white">Cifrado de Extremo a Extremo DAVE (MLS)</h5>
                  <p className="text-xs text-[#949ba4] mt-1">
                    Cifra los flujos de audio y vídeo mediante Messaging Layer Security (MLS) y Encoded Transforms. Ni siquiera el servidor de retransmisión puede escuchar tus llamadas.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="w-5 h-5 accent-discord-green cursor-default"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botón Salir / Escape */}
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
