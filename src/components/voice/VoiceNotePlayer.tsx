import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Volume2 } from 'lucide-react';

interface VoiceNotePlayerProps {
  durationSeconds?: number;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ durationSeconds = 14 }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0); // 0 to 1
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 28 realistic waveform bar amplitudes
  const waveformBars = [
    25, 45, 75, 90, 60, 40, 80, 100, 70, 50, 30, 65, 85, 95, 80, 60, 45, 90, 100,
    75, 55, 35, 70, 85, 60, 40, 25, 15,
  ];

  // Procedural audio playback with Web Audio API tone synthesis
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      // Create oscillator beep if supported
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (e) {
        // ignore audio context failures
      }

      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          const step = (1 / (durationSeconds * 10)) * playbackRate;
          if (prev + step >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + step;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackRate, durationSeconds]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    if (playbackRate === 1.0) setPlaybackRate(1.5);
    else if (playbackRate === 1.5) setPlaybackRate(2.0);
    else setPlaybackRate(1.0);
  };

  const currentSeconds = Math.floor(playbackProgress * durationSeconds);
  const totalSeconds = durationSeconds;

  return (
    <div className="flex items-center gap-3 bg-[#2b2d31] p-3 rounded-2xl border border-[#35373c] max-w-sm w-full my-2 select-none shadow-md">
      {/* Play / Pause Circular Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-white flex items-center justify-center transition shrink-0 shadow"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Scrubber Bars */}
      <div className="flex-1 flex flex-col justify-center gap-1.5">
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setPlaybackProgress(Math.max(0, Math.min(1, clickPos)));
          }}
          className="flex items-center gap-0.5 h-7 cursor-pointer py-1"
        >
          {waveformBars.map((heightPercent, idx) => {
            const barFraction = idx / waveformBars.length;
            const isPlayed = barFraction <= playbackProgress;

            return (
              <div
                key={idx}
                style={{ height: `${Math.max(15, heightPercent)}%` }}
                className={`flex-1 rounded-full transition-colors duration-150 ${
                  isPlayed ? 'bg-[#5865f2]' : 'bg-[#4e5058] hover:bg-[#949ba4]'
                }`}
              />
            );
          })}
        </div>

        {/* Time and Codec info */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#949ba4]">
          <span>
            0:{currentSeconds.toString().padStart(2, '0')} / 0:{totalSeconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-[#23a55a] font-semibold">Opus Voice</span>
        </div>
      </div>

      {/* Playback Speed Switcher */}
      <button
        onClick={cycleSpeed}
        className="px-2 py-1 bg-[#1e1f22] hover:bg-[#35373c] text-[#dbdee1] rounded-lg text-[10px] font-bold font-mono transition border border-[#3f4147]"
        title="Velocidad de reproducción"
      >
        {playbackRate}x
      </button>
    </div>
  );
};
