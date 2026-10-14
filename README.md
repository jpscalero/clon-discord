# Discord Pro Clone 🚀

Un clon de Discord de alto rendimiento, privado y de código abierto desarrollado con **React 19**, **TypeScript**, **Tailwind CSS**, **Zustand** y gestionado con **pnpm**.

---

## 🚀 Inicio Rápido con `pnpm`

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo en caliente
pnpm dev

# 3. Compilación para producción (TypeScript + Vite)
pnpm build
```

---

## 🛠️ Características Principales Implementadas

1. **Gestor de Paquetes Exclusivo**:
   - `pnpm` (versión 11.21.0) con enlace estricto de dependencias y aislamiento de binarios.

2. **Arquitectura de Audio y Voz WebRTC**:
   - [audioEngine.ts](src/services/audioEngine.ts): Detector VAD con histéresis Schmitt Trigger (-40 dBFS activación / -52 dBFS corte con 350 ms de sostenido) y rampas suaves de ganancia de 20 ms para suprimir chasquidos y pops al mutear.
   - [VoiceRoomGrid.tsx](src/components/voice/VoiceRoomGrid.tsx): Sala de voz interactiva con tarjetas de participantes, anillo verde luminoso de voz activa, alternancia de cámara, compartir pantalla y dock de llamadas.

3. **Renderizado de Chat & Markdown Enriquecido**:
   - [markdownParser.tsx](src/utils/markdownParser.tsx): Lexer AST para negritas, cursivas, citas, bloques de código, menciones dinámicas y spoilers blur interactivos (`||texto oculto||`).
   - [ChatArea.tsx](src/components/chat/ChatArea.tsx): Anclaje de scroll en prepending de mensajes vía `useLayoutEffect`, edición y eliminación de mensajes, y sistema de reacciones con emojis.

4. **Matriz de Permisos Bitwise de 64 bits**:
   - [permissions.ts](src/utils/permissions.ts): Algoritmo de resolución exacta de permisos jerárquicos de Discord con soporte para `BigInt`.

5. **Navegación Rápida & Modales Profesionales**:
   - [CommandPalette.tsx](src/components/modals/CommandPalette.tsx): Quick Switcher activable con `Ctrl + K` / `Cmd + K`.
   - [UserSettingsModal.tsx](src/components/modals/UserSettingsModal.tsx): Panel de configuración con prueba de micrófono en vivo (medidor VU), selector de temas (Oscuro, Medianoche OLED, Claro) y configuraciones de privacidad (Camo Proxy, WebRTC IP Shield).
   - [ServerSettingsModal.tsx](src/components/modals/ServerSettingsModal.tsx): Administrador de roles con selector de color hex y switches de permisos bitwise.
