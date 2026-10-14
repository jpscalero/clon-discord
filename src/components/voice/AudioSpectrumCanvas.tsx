import React, { useEffect, useRef, useState, useCallback } from 'react';
import { audioEngine } from '../../services/audioEngine';

export interface AudioSpectrumCanvasProps {
  analyser?: AnalyserNode | null;
  isMuted?: boolean;
  isSpeaking?: boolean;
  mode?: 'bars' | 'wave';
  barCount?: number;
  height?: number;
  width?: number | string;
  className?: string;
  interactive?: boolean;
  onModeChange?: (mode: 'bars' | 'wave') => void;
}

/**
 * AudioSpectrumCanvas
 * Renderizador Canvas HTML5 a 60 FPS optimizado para Web Audio API:
 * - Espectrograma de frecuencias FFT en barras con degradado Discord Green -> Blurple.
 * - Modo osciloscopio de onda continua (Time Domain).
 * - Animación simulada de armónicos cuando no hay flujo de entrada o el micro está inactivo.
 * - Cero fugas de memoria con cancelación determinista de rAF y buffers estables.
 */
export const AudioSpectrumCanvas: React.FC<AudioSpectrumCanvasProps> = ({
  analyser: propAnalyser,
  isMuted = false,
  isSpeaking = false,
  mode: propMode,
  barCount = 32,
  height = 54,
  className = '',
  interactive = true,
  onModeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const [currentMode, setCurrentMode] = useState<'bars' | 'wave'>(propMode || 'bars');

  // Mantener sincronizado si cambia desde props
  useEffect(() => {
    if (propMode && propMode !== currentMode) {
      setCurrentMode(propMode);
    }
  }, [propMode]);

  const toggleMode = useCallback(() => {
    if (!interactive) return;
    const next = currentMode === 'bars' ? 'wave' : 'bars';
    setCurrentMode(next);
    if (onModeChange) onModeChange(next);
  }, [interactive, currentMode, onModeChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isDestroyed = false;

    // Buffer FFT reutilizable (evita recolección de basura a 60 FPS)
    const fftBufferSize = 128;
    const freqData = new Uint8Array(fftBufferSize);
    const timeData = new Uint8Array(fftBufferSize);

    // Amortiguamiento para caída suave de barras (lerp)
    const barValues = new Float32Array(barCount);
    const peakCaps = new Float32Array(barCount);

    let animationTick = 0;

    const render = () => {
      if (isDestroyed) return;

      animationTick++;
      const width = canvas.width;
      const height = canvas.height;

      // Limpieza de fotograma
      ctx.clearRect(0, 0, width, height);

      const activeAnalyser = propAnalyser || audioEngine.getAnalyser();
      const hasRealAudio = !!activeAnalyser && !isMuted;

      if (hasRealAudio && activeAnalyser) {
        if (currentMode === 'bars') {
          activeAnalyser.getByteFrequencyData(freqData);
        } else {
          activeAnalyser.getByteTimeDomainData(timeData);
        }
      }

      // ==========================================
      // MODO 1: BARRAS DE FRECUENCIA FFT
      // ==========================================
      if (currentMode === 'bars') {
        const gap = 2;
        const totalGap = gap * (barCount - 1);
        const barWidth = Math.max(2, (width - totalGap) / barCount);

        // Degradado vertical: Verde Discord (#23a55a) a Blurple (#5865f2)
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#23a55a');
        gradient.addColorStop(0.55, '#5865f2');
        gradient.addColorStop(1, '#818cf8');

        for (let i = 0; i < barCount; i++) {
          let targetHeight = 0;

          if (hasRealAudio) {
            // Muestreo logarítmico/uniforme de bins de voz
            const binIndex = Math.min(
              freqData.length - 1,
              Math.floor((i / barCount) * (freqData.length * 0.75))
            );
            const rawVal = freqData[binIndex] || 0;
            targetHeight = (rawVal / 255) * (height - 4);
          } else {
            // Modo interactivo simulado si no hay señal real o está muteado
            if (isMuted) {
              // Pulso sutil casi inactivo
              targetHeight = Math.sin(animationTick * 0.05 + i * 0.4) * 1.5 + 2;
            } else if (isSpeaking) {
              // Voz sintetizada viva
              const wave1 = Math.sin(animationTick * 0.12 + i * 0.5) * 0.45;
              const wave2 = Math.cos(animationTick * 0.08 + i * 0.8) * 0.35;
              const wave3 = Math.sin(animationTick * 0.03 + i * 0.2) * 0.2;
              const factor = Math.max(0.08, wave1 + wave2 + wave3 + 0.4);
              targetHeight = factor * (height - 4);
            } else {
              // Respiración de fondo relajada
              const idleWave = Math.sin(animationTick * 0.04 + i * 0.3) * 0.2 + 0.22;
              targetHeight = idleWave * (height * 0.35);
            }
          }

          // Lerp suave para caída orgánica de las barras (anti-jitter)
          barValues[i] += (targetHeight - barValues[i]) * 0.28;
          const currentH = Math.max(2, barValues[i]);

          // Actualizar picos que caen con gravedad
          if (currentH > peakCaps[i]) {
            peakCaps[i] = currentH;
          } else {
            peakCaps[i] = Math.max(0, peakCaps[i] - 0.5);
          }

          const x = i * (barWidth + gap);
          const y = height - currentH;

          // Dibujar barra con esquinas superiores redondeadas
          ctx.fillStyle = gradient;
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, currentH, [2, 2, 0, 0]);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth, currentH);
          }

          // Dibujar cápsula de pico (peak cap)
          if (peakCaps[i] > 3) {
            const capY = Math.max(0, height - peakCaps[i] - 1.5);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, capY, barWidth, 1.5);
          }
        }
      }

      // ==========================================
      // MODO 2: OSCILOSCOPIO (TIME DOMAIN WAVE)
      // ==========================================
      else {
        const centerY = height / 2;

        ctx.beginPath();
        ctx.lineWidth = 2;

        const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
        waveGrad.addColorStop(0, '#23a55a');
        waveGrad.addColorStop(0.5, '#5865f2');
        waveGrad.addColorStop(1, '#818cf8');
        ctx.strokeStyle = waveGrad;

        // Efecto de resplandor para osciloscopio de alta fidelidad
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#5865f2';

        const sliceWidth = width / (barCount * 2);
        let x = 0;

        for (let i = 0; i <= barCount * 2; i++) {
          let y = centerY;

          if (hasRealAudio) {
            const sampleIdx = Math.floor((i / (barCount * 2)) * timeData.length);
            const v = (timeData[sampleIdx] || 128) / 128.0; // Normalizado ~0.0 a 2.0
            y = (v * height) / 2;
          } else {
            if (isMuted) {
              y = centerY + Math.sin(x * 0.06 + animationTick * 0.05) * 1.5;
            } else if (isSpeaking) {
              const harmonics =
                Math.sin(x * 0.05 + animationTick * 0.15) * 0.6 +
                Math.sin(x * 0.12 - animationTick * 0.1) * 0.3 +
                Math.cos(x * 0.02 + animationTick * 0.08) * 0.2;
              y = centerY + harmonics * (height * 0.38);
            } else {
              y = centerY + Math.sin(x * 0.04 + animationTick * 0.03) * (height * 0.12);
            }
          }

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.stroke();

        // Relleno translúcido debajo de la onda
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
        fillGrad.addColorStop(0, 'rgba(88, 101, 242, 0.15)');
        fillGrad.addColorStop(1, 'rgba(35, 165, 90, 0.0)');
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Restaurar sombras
        ctx.shadowBlur = 0;
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    // Ajustar DPI y tamaño físico real del Canvas
    const updateCanvasDimensions = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const targetWidth = Math.max(60, Math.floor(rect.width));
      const targetHeight = Math.max(20, Math.floor(rect.height || height));

      if (canvas.width !== targetWidth * dpr || canvas.height !== targetHeight * dpr) {
        canvas.width = targetWidth * dpr;
        canvas.height = targetHeight * dpr;
        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Iniciar ciclo a 60 FPS
    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      isDestroyed = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [propAnalyser, isMuted, isSpeaking, currentMode, barCount, height]);

  return (
    <div
      ref={containerRef}
      onClick={toggleMode}
      title={interactive ? `Modo actual: ${currentMode === 'bars' ? 'Espectro FFT' : 'Osciloscopio'}. Clic para cambiar.` : undefined}
      className={`relative w-full overflow-hidden select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {interactive && (
        <span className="absolute top-1 right-1.5 text-[9px] font-mono uppercase tracking-widest text-[#949ba4] opacity-40 hover:opacity-100 transition-opacity pointer-events-none">
          {currentMode}
        </span>
      )}
    </div>
  );
};
