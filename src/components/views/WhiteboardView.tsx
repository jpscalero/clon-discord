import React, { useRef, useState, useEffect } from 'react';
import {
  Square,
  Circle,
  MoveRight,
  Type,
  StickyNote,
  Eraser,
  RotateCcw,
  Download,
  Trash2,
  PenTool,
  MousePointer,
  ZoomIn,
  ZoomOut,
  MapPin,
  Shield,
  Swords,
  Bomb,
  CloudFog,
  Zap,
  Flame,
  Layers,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { WhiteboardElement } from '../../types';

type Tool =
  | 'select'
  | 'pencil'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'text'
  | 'sticky'
  | 'eraser'
  | 'smoke'
  | 'flash'
  | 'molly'
  | 'attacker'
  | 'defender'
  | 'spike';

type MapPreset = 'ascent' | 'mirage' | 'grid';

const COLOR_PALETTE = [
  '#ff4655', // Valorant Red
  '#38bdf8', // Tactical Sky / Smoke
  '#facc15', // Flash Gold
  '#22c55e', // Spike Green
  '#5865f2', // Discord Blurple
  '#a855f7', // Omen Purple
  '#f97316', // Molly Orange
  '#f2f3f5', // White / Neutral
];

export const WhiteboardView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { activeChannelId, whiteboardElements, updateWhiteboardElements, guilds, activeGuildId } =
    useChatStore();

  const currentGuild = guilds.find((g) => g.id === activeGuildId);
  const currentChannel = currentGuild?.channels.find((c) => c.id === activeChannelId);

  const elements = whiteboardElements[activeChannelId] || [];

  const [activeTool, setActiveTool] = useState<Tool>('pencil');
  const [selectedColor, setSelectedColor] = useState<string>('#ff4655');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [selectedMap, setSelectedMap] = useState<MapPreset>('ascent');

  // Render tactical map layout and all elements onto the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply Zoom scale
    const scale = zoom / 100;
    ctx.scale(scale, scale);

    // Background Tactical Canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width / scale; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height / scale);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height / scale; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width / scale, y);
      ctx.stroke();
    }

    // Render Tactical Map Outline
    if (selectedMap === 'ascent') {
      // Valorant Ascent Architectural Layout
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';

      // A Site
      ctx.strokeRect(100, 100, 320, 220);
      ctx.fillRect(100, 100, 320, 220);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px Whitney, sans-serif';
      ctx.fillText('SITE A (Heaven & Generator)', 115, 125);

      // Mid Courtyard
      ctx.strokeRect(460, 140, 220, 280);
      ctx.fillRect(460, 140, 220, 280);
      ctx.fillText('MID COURTYARD & MARKET', 475, 165);

      // B Site
      ctx.strokeRect(720, 100, 320, 220);
      ctx.fillRect(720, 100, 320, 220);
      ctx.fillText('SITE B (Boathouse & Lane)', 735, 125);

      // Attackers Spawn corridor
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.strokeRect(200, 480, 740, 90);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(200, 480, 740, 90);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px Whitney, sans-serif';
      ctx.fillText('⚔️ ATTACKER SPAWN (LOBBY)', 490, 530);
    } else if (selectedMap === 'mirage') {
      // CS2 Mirage Architectural Layout
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';

      // A Site CS2
      ctx.strokeRect(120, 100, 300, 240);
      ctx.fillRect(120, 100, 300, 240);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px Whitney, sans-serif';
      ctx.fillText('BOMBSITE A (Palace / CT / Ramp)', 135, 125);

      // Mid
      ctx.strokeRect(460, 120, 200, 300);
      ctx.fillRect(460, 120, 200, 300);
      ctx.fillText('MIDDLE & CONNECTOR', 475, 145);

      // B Site CS2
      ctx.strokeRect(700, 100, 300, 240);
      ctx.fillRect(700, 100, 300, 240);
      ctx.fillText('BOMBSITE B (Apartments / Market)', 715, 125);

      // T Spawn
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.strokeRect(220, 480, 700, 90);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(220, 480, 700, 90);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px Whitney, sans-serif';
      ctx.fillText('⚔️ TERRORIST SPAWN', 490, 530);
    }

    // Draw all stored tactical elements
    elements.forEach((el) => {
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (el.type === 'pencil' && el.points && el.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      } else if (el.type === 'rectangle' && el.width && el.height) {
        ctx.fillStyle = `${el.color}22`;
        ctx.fillRect(el.x, el.y, el.width, el.height);
        ctx.strokeRect(el.x, el.y, el.width, el.height);

        if (el.text) {
          ctx.fillStyle = '#f2f3f5';
          ctx.font = '13px Whitney, sans-serif';
          ctx.fillText(el.text, el.x + 12, el.y + 24);
        }
      } else if (el.type === 'circle' && el.width) {
        ctx.fillStyle = `${el.color}22`;
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (el.type === 'arrow' && el.width) {
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x + el.width, el.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(el.x + el.width, el.y);
        ctx.lineTo(el.x + el.width - 12, el.y - 6);
        ctx.lineTo(el.x + el.width - 12, el.y + 6);
        ctx.fill();

        if (el.text) {
          ctx.fillStyle = '#b5bac1';
          ctx.font = '11px Whitney, sans-serif';
          ctx.fillText(el.text, el.x + 20, el.y - 8);
        }
      } else if (el.type === 'smoke') {
        // Esports Smoke Sphere
        const radius = (el.width || 60) / 2;
        const grad = ctx.createRadialGradient(el.x, el.y, radius * 0.2, el.x, el.y, radius);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Whitney, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(el.text || 'Humo', el.x, el.y + 4);
        ctx.textAlign = 'left';
      } else if (el.type === 'flash') {
        // Flashbang Icon
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(el.x, el.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px Whitney, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡', el.x, el.y + 5);
        if (el.text) {
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 11px Whitney, sans-serif';
          ctx.fillText(el.text, el.x, el.y + 24);
        }
        ctx.textAlign = 'left';
      } else if (el.type === 'molly') {
        // Incendiary Area
        const radius = (el.width || 50) / 2;
        const grad = ctx.createRadialGradient(el.x, el.y, radius * 0.1, el.x, el.y, radius);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        grad.addColorStop(1, 'rgba(249, 115, 22, 0.2)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f97316';
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Whitney, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔥 ' + (el.text || 'Molly'), el.x, el.y + 4);
        ctx.textAlign = 'left';
      } else if (el.type === 'attacker') {
        // Duelist / Entry Player Token
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(el.x, el.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Whitney, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️', el.x, el.y + 5);

        // Player Name Tag
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 11px Whitney, sans-serif';
        ctx.fillText(el.text || 'Entry', el.x, el.y + 26);
        ctx.textAlign = 'left';
      } else if (el.type === 'defender') {
        // Anchor / Defender Token
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(el.x, el.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Whitney, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛡️', el.x, el.y + 5);

        // Player Name Tag
        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 11px Whitney, sans-serif';
        ctx.fillText(el.text || 'Anchor', el.x, el.y + 26);
        ctx.textAlign = 'left';
      } else if (el.type === 'spike') {
        // Spike Plant Token with diffuse zone
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(el.x, el.y, 35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(el.x, el.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px Whitney, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💣', el.x, el.y + 5);
        ctx.fillStyle = '#86efac';
        ctx.font = 'bold 11px Whitney, sans-serif';
        ctx.fillText(el.text || 'Spike Plant', el.x, el.y + 25);
        ctx.textAlign = 'left';
      } else if (el.type === 'sticky') {
        ctx.fillStyle = el.color;
        const w = el.width || 220;
        const h = el.height || 140;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 12;
        ctx.fillRect(el.x, el.y, w, h);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px Whitney, sans-serif';
        if (el.text) {
          const lines = el.text.split('\n');
          lines.forEach((line, idx) => {
            ctx.fillText(line, el.x + 12, el.y + 22 + idx * 18);
          });
        }
      } else if (el.type === 'text' && el.text) {
        ctx.fillStyle = el.color;
        ctx.font = 'bold 16px Whitney, sans-serif';
        ctx.fillText(el.text, el.x, el.y);
      }
    });

    // Draw active live path if pencil
    if (isDrawing && activeTool === 'pencil' && currentPath.length > 1) {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  }, [elements, isDrawing, currentPath, activeTool, selectedColor, strokeWidth, zoom, selectedMap]);

  // Adjust canvas size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);

    if (activeTool === 'pencil') {
      setCurrentPath([coords]);
    } else if (activeTool === 'eraser') {
      const filtered = elements.filter((el) => {
        const dist = Math.hypot(el.x - coords.x, el.y - coords.y);
        return dist > 40;
      });
      updateWhiteboardElements(activeChannelId, filtered);
    } else if (activeTool === 'smoke') {
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'smoke',
        x: coords.x,
        y: coords.y,
        width: 60,
        height: 60,
        color: '#38bdf8',
        text: 'Humo',
        icon: '💨',
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
    } else if (activeTool === 'flash') {
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'flash',
        x: coords.x,
        y: coords.y,
        width: 40,
        height: 40,
        color: '#facc15',
        text: 'Flash',
        icon: '⚡',
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
    } else if (activeTool === 'molly') {
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'molly',
        x: coords.x,
        y: coords.y,
        width: 55,
        height: 55,
        color: '#f97316',
        text: 'Molly',
        icon: '🔥',
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
    } else if (activeTool === 'attacker') {
      const name = prompt('Nombre del jugador atacante / agente:', 'TenZ (Jett)') || 'Atacante';
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'attacker',
        x: coords.x,
        y: coords.y,
        width: 40,
        height: 40,
        color: '#ef4444',
        text: name,
        icon: '⚔️',
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
    } else if (activeTool === 'defender') {
      const name = prompt('Nombre del jugador defensor / rol:', 'Derke (AWP)') || 'Defensor';
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'defender',
        x: coords.x,
        y: coords.y,
        width: 40,
        height: 40,
        color: '#3b82f6',
        text: name,
        icon: '🛡️',
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
    } else if (activeTool === 'spike') {
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'spike',
        x: coords.x,
        y: coords.y,
        width: 45,
        height: 45,
        color: '#22c55e',
        text: 'Plante Default',
        icon: '💣',
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);

    if (activeTool === 'pencil') {
      setCurrentPath((prev) => [...prev, coords]);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const endCoords = getCanvasCoords(e);

    if (activeTool === 'pencil' && currentPath.length > 1) {
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'pencil',
        x: currentPath[0].x,
        y: currentPath[0].y,
        points: currentPath,
        color: selectedColor,
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
      setCurrentPath([]);
    } else if (activeTool === 'rectangle' && startPos) {
      const w = endCoords.x - startPos.x;
      const h = endCoords.y - startPos.y;
      if (Math.abs(w) > 5 && Math.abs(h) > 5) {
        const newEl: WhiteboardElement = {
          id: `wb-${Date.now()}`,
          type: 'rectangle',
          x: Math.min(startPos.x, endCoords.x),
          y: Math.min(startPos.y, endCoords.y),
          width: Math.abs(w),
          height: Math.abs(h),
          color: selectedColor,
          text: 'Zona Táctica',
        };
        updateWhiteboardElements(activeChannelId, [...elements, newEl]);
      }
    } else if (activeTool === 'circle' && startPos) {
      const radius = Math.hypot(endCoords.x - startPos.x, endCoords.y - startPos.y);
      if (radius > 10) {
        const newEl: WhiteboardElement = {
          id: `wb-${Date.now()}`,
          type: 'circle',
          x: startPos.x,
          y: startPos.y,
          width: radius * 2,
          height: radius * 2,
          color: selectedColor,
        };
        updateWhiteboardElements(activeChannelId, [...elements, newEl]);
      }
    } else if (activeTool === 'arrow' && startPos) {
      const len = endCoords.x - startPos.x;
      if (Math.abs(len) > 20) {
        const newEl: WhiteboardElement = {
          id: `wb-${Date.now()}`,
          type: 'arrow',
          x: startPos.x,
          y: startPos.y,
          width: len,
          color: selectedColor,
          text: 'Rotación',
        };
        updateWhiteboardElements(activeChannelId, [...elements, newEl]);
      }
    } else if (activeTool === 'sticky' && startPos) {
      const newEl: WhiteboardElement = {
        id: `wb-${Date.now()}`,
        type: 'sticky',
        x: startPos.x,
        y: startPos.y,
        width: 220,
        height: 140,
        color: selectedColor === '#2b2d31' ? '#fee75c' : selectedColor,
        text: 'Nota Estratégica:\n- Sincronizar humos a los 0:15\n- Flash A Short\n- Post-plant en Main',
      };
      updateWhiteboardElements(activeChannelId, [...elements, newEl]);
    } else if (activeTool === 'text' && startPos) {
      const input = prompt('Escribe el texto a insertar en la táctica:');
      if (input && input.trim()) {
        const newEl: WhiteboardElement = {
          id: `wb-${Date.now()}`,
          type: 'text',
          x: startPos.x,
          y: startPos.y,
          color: selectedColor,
          text: input.trim(),
        };
        updateWhiteboardElements(activeChannelId, [...elements, newEl]);
      }
    }
    setStartPos(null);
  };

  const handleLoadAscentExecute = () => {
    setSelectedMap('ascent');
    const stratElements: WhiteboardElement[] = [
      { id: 'strat-1', type: 'rectangle', x: 100, y: 100, width: 340, height: 230, color: '#334155', fillColor: 'rgba(30, 41, 59, 0.7)', text: 'Ascent Site A (Main & Heaven)' },
      { id: 'strat-2', type: 'smoke', x: 290, y: 130, width: 65, height: 65, color: '#38bdf8', text: 'Humo Heaven', icon: '💨' },
      { id: 'strat-3', type: 'smoke', x: 360, y: 190, width: 65, height: 65, color: '#38bdf8', text: 'Humo Puerta', icon: '💨' },
      { id: 'strat-4', type: 'flash', x: 170, y: 210, width: 45, height: 45, color: '#facc15', text: 'Flash A Main', icon: '⚡' },
      { id: 'strat-5', type: 'attacker', x: 120, y: 250, width: 40, height: 40, color: '#ef4444', text: 'TenZ (Jett Entry)', icon: '⚔️' },
      { id: 'strat-6', type: 'attacker', x: 90, y: 190, width: 40, height: 40, color: '#ef4444', text: 'Boaster (Omen IGL)', icon: '⚔️' },
      { id: 'strat-7', type: 'defender', x: 360, y: 120, width: 40, height: 40, color: '#3b82f6', text: 'Derke (AWP)', icon: '🛡️' },
      { id: 'strat-8', type: 'spike', x: 250, y: 220, width: 45, height: 45, color: '#22c55e', text: 'Plante Default Safe', icon: '💣' },
      { id: 'strat-9', type: 'sticky', x: 480, y: 120, width: 230, height: 130, color: '#ff4655', text: '🎯 Execute A VCT Strat:\n- Smoke Heaven a los 0:12\n- Double flash A Short\n- Plantar y replegar a Main' },
    ];
    updateWhiteboardElements(activeChannelId, stratElements);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `stratboard-${selectedMap}-${currentChannel?.name || 'tactics'}.png`;
    a.click();
  };

  const handleClear = () => {
    if (confirm('¿Deseas vaciar la pizarra táctica de este canal?')) {
      updateWhiteboardElements(activeChannelId, []);
    }
  };

  const handleUndo = () => {
    if (elements.length === 0) return;
    updateWhiteboardElements(activeChannelId, elements.slice(0, -1));
  };

  return (
    <div className="relative flex-1 h-full bg-[#0b0e14] flex flex-col overflow-hidden select-none">
      {/* Top Floating Esports Strat Toolbar */}
      <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-none gap-3">
        {/* Left: Map preset and Drawing Tools */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#181d27]/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xl border border-[#2b3547]">
          {/* Map Preset selector */}
          <div className="flex items-center gap-1 pr-2 border-r border-[#2b3547]">
            <MapPin className="w-3.5 h-3.5 text-[#ff4655]" />
            <select
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value as MapPreset)}
              className="bg-[#111620] text-white text-xs font-semibold px-2 py-1 rounded-lg border border-[#2b3547] outline-none cursor-pointer"
            >
              <option value="ascent">Valorant: Ascent</option>
              <option value="mirage">CS2: Mirage</option>
              <option value="grid">Grid Táctico Libre</option>
            </select>
          </div>

          {/* Standard Tools */}
          <button
            onClick={() => setActiveTool('select')}
            title="Seleccionar (V)"
            className={`p-2 rounded-xl transition ${
              activeTool === 'select' ? 'bg-[#ff4655] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#252f40]'
            }`}
          >
            <MousePointer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('pencil')}
            title="Lápiz Táctico (P)"
            className={`p-2 rounded-xl transition ${
              activeTool === 'pencil' ? 'bg-[#ff4655] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#252f40]'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('arrow')}
            title="Flecha de Rotación (A)"
            className={`p-2 rounded-xl transition ${
              activeTool === 'arrow' ? 'bg-[#ff4655] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#252f40]'
            }`}
          >
            <MoveRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('rectangle')}
            title="Zona Táctica (R)"
            className={`p-2 rounded-xl transition ${
              activeTool === 'rectangle' ? 'bg-[#ff4655] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#252f40]'
            }`}
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('circle')}
            title="Radio / Área (C)"
            className={`p-2 rounded-xl transition ${
              activeTool === 'circle' ? 'bg-[#ff4655] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#252f40]'
            }`}
          >
            <Circle className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-[#2b3547] mx-1" />

          {/* Tactical Tokens Section */}
          <div className="flex items-center gap-1 bg-[#111620] p-1 rounded-xl border border-[#2b3547]">
            <button
              onClick={() => setActiveTool('smoke')}
              title="Colocar Humo (💨)"
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                activeTool === 'smoke' ? 'bg-[#38bdf8] text-black shadow-md' : 'text-[#38bdf8] hover:bg-[#38bdf8]/15'
              }`}
            >
              <CloudFog className="w-3.5 h-3.5" />
              <span>Humo</span>
            </button>
            <button
              onClick={() => setActiveTool('flash')}
              title="Colocar Flashbang (⚡)"
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                activeTool === 'flash' ? 'bg-[#facc15] text-black shadow-md' : 'text-[#facc15] hover:bg-[#facc15]/15'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Flash</span>
            </button>
            <button
              onClick={() => setActiveTool('molly')}
              title="Colocar Molly / Incendiario (🔥)"
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                activeTool === 'molly' ? 'bg-[#f97316] text-white shadow-md' : 'text-[#f97316] hover:bg-[#f97316]/15'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Molly</span>
            </button>
            <button
              onClick={() => setActiveTool('attacker')}
              title="Colocar Atacante / Entry (⚔️)"
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                activeTool === 'attacker' ? 'bg-[#ef4444] text-white shadow-md' : 'text-[#ef4444] hover:bg-[#ef4444]/15'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Atacante</span>
            </button>
            <button
              onClick={() => setActiveTool('defender')}
              title="Colocar Defensor / Anchor (🛡️)"
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                activeTool === 'defender' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#3b82f6] hover:bg-[#3b82f6]/15'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Defensor</span>
            </button>
            <button
              onClick={() => setActiveTool('spike')}
              title="Colocar Spike / Plante (💣)"
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                activeTool === 'spike' ? 'bg-[#22c55e] text-black shadow-md' : 'text-[#22c55e] hover:bg-[#22c55e]/15'
              }`}
            >
              <Bomb className="w-3.5 h-3.5" />
              <span>Spike</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTool('sticky')}
            title="Nota Táctica"
            className={`p-2 rounded-xl transition ${
              activeTool === 'sticky' ? 'bg-[#ff4655] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#252f40]'
            }`}
          >
            <StickyNote className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('eraser')}
            title="Borrador"
            className={`p-2 rounded-xl transition ${
              activeTool === 'eraser' ? 'bg-[#da373c] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#252f40]'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-[#2b3547] mx-1" />

          {/* Color palette */}
          <div className="flex items-center gap-1 px-1">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                style={{ backgroundColor: c }}
                className={`w-4 h-4 rounded-full transition-transform ${
                  selectedColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#181d27]' : 'hover:scale-110 opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Actions (Strat presets, Undo, Clear, Export, Zoom) */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#181d27]/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xl border border-[#2b3547]">
          <button
            onClick={handleLoadAscentExecute}
            title="Cargar Táctica Prefabricada Ascent Site A"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#ff4655]/15 hover:bg-[#ff4655]/25 border border-[#ff4655]/40 text-[#ff4655] rounded-xl text-xs font-semibold transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cargar Execute A</span>
          </button>

          <button
            onClick={handleUndo}
            title="Deshacer trazo"
            className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#252f40] rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            title="Limpiar pizarra táctica"
            className="p-2 text-[#ef4444] hover:bg-[#ef4444]/15 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-[#2b3547] mx-1" />

          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            title="Alejar"
            className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#252f40] rounded-xl transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold text-[#f1f5f9] min-w-[36px] text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            title="Acercar"
            className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#252f40] rounded-xl transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-6 bg-[#2b3547] mx-1" />

          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4655] hover:bg-[#e03b49] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#ff4655]/25"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Strat</span>
          </button>
        </div>
      </div>

      {/* Interactive HTML5 Canvas */}
      <div className="flex-1 w-full h-full relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="absolute inset-0 w-full h-full block"
        />
      </div>

      {/* Bottom Tactical Bar */}
      <div className="absolute bottom-3 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto text-[11px] text-[#94a3b8] bg-[#181d27]/90 backdrop-blur px-3 py-1.5 rounded-full border border-[#2b3547] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span>Strat Board VCT 2026: Haz clic con los tokens tácticos (Humo, Flash, Molly, Atacante, Defensor, Spike) para fijar posiciones de ronda.</span>
        </div>
        <div className="pointer-events-auto text-[11px] font-mono text-[#cbd5e1] bg-[#181d27]/90 backdrop-blur px-3 py-1 rounded-full border border-[#2b3547]">
          {elements.length} Entidades Tácticas Activas
        </div>
      </div>
    </div>
  );
};
