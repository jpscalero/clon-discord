import React, { useState, useEffect } from 'react';
import { Mic, Trash2, Send, Radio } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

interface VoiceNoteRecorderProps {
  onRecorded?: () => void;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ onRecorded }) => {
  const { activeChannelId, sendMessage } = useChatStore();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      setRecordSeconds(0);
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const handleStart = () => {
    setIsRecording(true);
  };

  const handleCancel = () => {
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const handleSend = () => {
    const formatted = `0:${recordSeconds.toString().padStart(2, '0')}`;
    sendMessage(
      activeChannelId,
      `🎤 Nota de Voz (${formatted})`,
      [
        {
          id: `vn-${Date.now()}`,
          filename: `voice_note_${Date.now()}.ogg`,
          size: 1024 * (recordSeconds + 1) * 8,
          url: 'mock://voice_note.ogg',
          contentType: 'audio/ogg',
        },
      ]
    );
    setIsRecording(false);
    setRecordSeconds(0);
    if (onRecorded) onRecorded();
  };

  if (!isRecording) {
    return (
      <button
        type="button"
        onClick={handleStart}
        title="Grabar nota de voz"
        className="p-2 text-[#b5bac1] hover:text-[#5865f2] hover:bg-[#35373c] rounded-xl transition"
      >
        <Mic className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#da373c]/15 border border-[#da373c]/40 px-3 py-1.5 rounded-2xl animate-in fade-in duration-200">
      {/* Blinking recording dot & timer */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#da373c] animate-ping" />
        <span className="text-xs font-mono font-bold text-white">
          0:{recordSeconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Simulated Live Audio Bars */}
      <div className="flex items-center gap-1 h-4 px-2">
        {[40, 80, 50, 100, 60, 90, 70].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="w-1 bg-[#da373c] rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={handleCancel}
        title="Cancelar grabación"
        className="p-1 text-[#949ba4] hover:text-[#da373c] rounded transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Send Button */}
      <button
        type="button"
        onClick={handleSend}
        title="Enviar nota de voz"
        className="p-1.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg transition shadow"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
